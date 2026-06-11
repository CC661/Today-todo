import WeekCalendarComponent from '../components/calendar/WeekCalendar';
import MonthCalendarComponent from '../components/calendar/MonthCalendar';
import { TodoListComponent } from '../components/todo/TodoList';
import TodoViewModel from '../viewmodel/TodoViewModel';
import PlogViewModel from '../viewmodel/PlogViewModel';
import DiaryViewModel from '../viewmodel/DiaryViewModel';
import DateUtils from '../common/utils/DateUtils';
import type { TodoItem } from '../model/TodoItem';
import type { PlogCanvas, CanvasElement } from '../model/PlogCanvas';
import type { DiaryPost } from '../model/DiaryPost';
import type { DiaryPostInsertParams } from '../common/database/RDBStoreUtil';
import type { PlogInsertParams } from '../common/database/RDBStoreUtil';
import { SettingPage } from './SettingPage';
import { router } from '@kit.ArkUI';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { fileUri } from '@kit.CoreFileKit';
import { promptAction } from '@kit.ArkUI';
import PreferencesUtil from '../common/database/PreferencesUtil';
import type { ThemeColors } from '../common/theme/ThemeManager';
import type { TemplateType, AccountingData, DiningData, MovieData } from '../model/TemplateData';
import { templateTypeToCollection, TEMPLATE_COLLECTION_ACCOUNTING, TEMPLATE_COLLECTION_DINING, TEMPLATE_COLLECTION_MOVIE } from '../model/TemplateData';

/**
 * 首页 - 带底部导航栏的主页面
 * 包含 Todo（待办）、Plog/随手记、Setting（设置）三个Tab
 * 支持动态主题（通过 @StorageLink 读取 app_active_theme）
 */
@Entry
@Component
struct HomePage {
  @StorageLink('app_active_theme') currentColors: ThemeColors = {
    primary: '#ffac34',
    bgMain: '#fdfaf2',
    bgCard: '#ffffff',
    textMain: '#3e2723',
    textMuted: '#ffcd84',
    border: '#f6f0e2'
  };
  @State currentTabIndex: number = 0;
  private tabTitles: ResourceStr[] = [$r('app.string.tab_todo'), $r('app.string.tab_plog'), $r('app.string.tab_setting')];
  private tabIcons: Resource[] = [$r('app.media.icon'), $r('sys.symbol.book'), $r('sys.symbol.gearshape')];
  private tabIconsActive: Resource[] = [$r('app.media.icon'), $r('app.media.icon'), $r('sys.symbol.gearshape_fill')];

  // ---- Todo 状态 ----
  @State selectedDate: string = DateUtils.getToday();
  @State currentWeek: string[] = DateUtils.getCurrentWeek();
  @State isCalendarExpanded: boolean = false;
  @State todos: TodoItem[] = [];
  @State newTodoText: string = '';
  @State isLoading: boolean = false;
  @State monthCalendar: (string | null)[][] = [];
  @State eventDates: Set<string> = new Set();
  @State editingTodoId: number = 0;         // 正在编辑的 Todo ID（0 表示不在编辑）
  @State isAddingRemark: boolean = false;    // 展开备注输入框
  @State showRemindPicker: boolean = false; // 显示时间选择器
  @State showTagInput: boolean = false;     // 显示标签输入框
  @State tagInputBuffer: string = '';        // 标签输入缓冲

  // ---- 随手记 (Plog/Moment) 状态 ----
  @State moments: DiaryPost[] = [];
  @State momentsLoading: boolean = false;
  @State showPublishDialog: boolean = false;
  @State newPostContent: string = '';
  @State newPostMediaUris: string[] = [];
  @State newPostLocation: string = '';

  // 管理状态
  @State isMultiSelectMode: boolean = false;
  @State selectedMomentIds: Set<number> = new Set();
  @State showCollectionDialog: boolean = false;
  @State collectionName: string = '';

  // 新建合集弹窗
  @State showNewCollectionDialog: boolean = false;
  @State newCollectionName: string = '';

  // 合集列表
  @State collections: string[] = [];

  // 添加模式（全屏）
  @State isAddMode: boolean = false;

  // 更多下拉菜单
  @State showMoreDropdown: boolean = false;

  // 搜索
  @State showSearchBar: boolean = false;
  @State searchKeyword: string = '';

  // 删除确认弹窗
  @State showDeleteConfirmDialog: boolean = false;
  @State pendingDeleteCount: number = 0;

  // ---- 模板发布状态 ----
  @State showTemplateChoiceDialog: boolean = false;
  @State showTemplateListDropdown: boolean = false;
  @State showTemplateAccountingDialog: boolean = false;
  @State showTemplateDiningDialog: boolean = false;
  @State showTemplateMovieDialog: boolean = false;
  // 记账模板字段
  @State tplAccDate: string = '';
  @State tplAccLocation: string = '';
  @State tplAccAmount: string = '';
  @State tplAccItem: string = '';
  // 饮食模板字段
  @State tplDinDate: string = '';
  @State tplDinLocation: string = '';
  @State tplDinAmount: string = '';
  @State tplDinDish: string = '';
  @State tplDinRating: string = '';
  @State tplDinMediaUris: string[] = [];
  // 观影模板字段
  @State tplMovTitle: string = '';
  @State tplMovGenre: string = '';
  @State tplMovScore: string = '';
  @State tplMovExperience: string = '';
  @State tplMovMediaUris: string[] = [];

  // ---- Plog 状态 ----
  @State plogs: PlogCanvas[] = [];
  @State plogsLoading: boolean = false;

  aboutToAppear(): void {
    this.loadTodos();
    this.loadMonthCalendar();
  }

  async onPageShow(): Promise<void> {
    if (this.currentTabIndex === 1) {
      await this.loadMoments();
      await this.loadCollections();
    }
  }

  async loadCollections(): Promise<void> {
    try {
      // 从 Preferences 读取已保存的合集列表
      const savedCollections = await PreferencesUtil.getCollections();
      // 从 moments 中提取所有已使用的 category（非空）
      const categorySet = new Set<string>();
      for (const m of this.moments) {
        if (m.category && m.category.trim()) {
          categorySet.add(m.category.trim());
        }
      }
      // 合并去重并保存回 Preferences
      const merged: string[] = [];
      const seen = new Set<string>();
      for (const c of savedCollections) {
        if (!seen.has(c)) {
          seen.add(c);
          merged.push(c);
        }
      }
      categorySet.forEach((c: string) => {
        if (!seen.has(c)) {
          seen.add(c);
          merged.push(c);
        }
      });
      this.collections = merged;
      await PreferencesUtil.saveCollections(merged);
    } catch (error) {
      console.error('加载合集列表失败:', error);
    }
  }

  async createNewCollection(): Promise<void> {
    const name = this.newCollectionName.trim();
    if (!name || name.length > 10) {
      return;
    }
    if (this.collections.includes(name)) {
      promptAction.showToast({ message: '该合集已存在' });
      return;
    }
    this.collections.push(name);
    await PreferencesUtil.saveCollections(this.collections);
    this.newCollectionName = '';
    this.showNewCollectionDialog = false;
    
    // 自动将选中的随手记添加到新建的合集中
    if (this.selectedMomentIds.size > 0) {
      try {
        for (const id of this.selectedMomentIds) {
          await DiaryViewModel.updatePostCategory(id, name);
        }
        this.selectedMomentIds.clear();
        this.isMultiSelectMode = false;
        await this.loadMoments();
        promptAction.showToast({ message: '合集创建成功并已添加记录' });
      } catch (error) {
        console.error('添加到合集失败:', error);
        promptAction.showToast({ message: '合集创建成功但添加失败' });
      }
    } else {
      promptAction.showToast({ message: '合集创建成功' });
    }
  }

  // ==================== Todo 方法 ====================

  async loadTodos(): Promise<void> {
    this.isLoading = true;
    try {
      this.todos = await TodoViewModel.getTodosByDate(this.selectedDate);
    } catch (error) {
      console.error('加载待办失败:', error);
    } finally {
      this.isLoading = false;
    }
  }

  loadMonthCalendar(): void {
    const today = new Date();
    this.monthCalendar = DateUtils.getMonthCalendar(today.getFullYear(), today.getMonth());
  }

  onDateSelected(date: string): void {
    this.selectedDate = date;
    this.currentWeek = DateUtils.getWeekByDate(date);
    this.loadTodos();
  }

  async addTodo(): Promise<void> {
    if (!this.newTodoText.trim()) {
      return;
    }
    try {
      const newId = await TodoViewModel.addTodo(this.newTodoText.trim(), this.selectedDate);
      this.newTodoText = '';
      await this.loadTodos();
      // 自动进入编辑模式
      this.editingTodoId = newId;
    } catch (error) {
      console.error('添加待办失败:', error);
    }
  }

  /**
   * 创建空白 Todo 并自动进入编辑状态
   * 使用 setTimeout 延迟聚焦，确保 TextInput 已渲染完毕
   */
  async addBlankTodo(): Promise<void> {
    try {
      const newId = await TodoViewModel.addTodo('', this.selectedDate);
      await this.loadTodos();
      this.editingTodoId = newId;
      this.isAddingRemark = false;
      this.showRemindPicker = false;
      // 延迟一帧请求焦点，等待 TextInput 渲染完成
      setTimeout(() => {
        focusControl.requestFocus(`TodoInput_${newId}`);
      }, 100);
    } catch (error) {
      console.error('创建空白待办失败:', error);
    }
  }

  /**
   * 保存编辑中的 Todo 内容（包含备注）
   */
  async saveEditingTodo(id: number, content: string, remark?: string): Promise<void> {
    try {
      await TodoViewModel.updateTodoContent(id, content);
      if (remark !== undefined) {
        const todo = this.todos.find(t => t.id === id);
        const remindTime = todo?.remindTime ?? 0;
        await TodoViewModel.updateTodoRemindAndRemark(id, remindTime, remark);
      }
      const updatedList: TodoItem[] = await TodoViewModel.getTodosByDate(this.selectedDate);
      this.todos = [...updatedList];
    } catch (error) {
      console.error(`[HomePage] saveEditingTodo failed: ${JSON.stringify(error)}`);
    } finally {
      this.editingTodoId = 0;
      this.isAddingRemark = false;
      this.showRemindPicker = false;
    }
  }

  /**
   * 取消编辑
   */
  cancelEditing(): void {
    const editingTodo = this.todos.find(t => t.id === this.editingTodoId);
    if (editingTodo && !editingTodo.content.trim()) {
      this.deleteTodo(this.editingTodoId);
    }
    this.editingTodoId = 0;
    this.isAddingRemark = false;
    this.showRemindPicker = false;
  }

  /**
   * 拖拽排序回调
   */
  async onTodoReorder(fromIndex: number, toIndex: number): Promise<void> {
    const reordered = [...this.todos];
    const GeneratedDestructArray_1 = reordered.splice(fromIndex, 1);
    const moved = GeneratedDestructArray_1[0];
    reordered.splice(toIndex, 0, moved);
    try {
      await TodoViewModel.reorderTodos(reordered);
      await this.loadTodos();
    } catch (error) {
      console.error('排序失败:', error);
    }
  }

  /**
   * 设置提醒时间 - 直接修改 todos 数组中的对应项（响应式）
   */
  setRemindTime(hour: number, minute: number): void {
    const now = new Date();
    const remindDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    const timestamp = remindDate.getTime();
    const index = this.todos.findIndex(t => t.id === this.editingTodoId);
    if (index > -1) {
      // 1. 直接获取原对象的引用 (去除 {... } 展开操作)
      let currentItem = this.todos[index];

      // 2. 直接修改提醒时间
      currentItem.remindTime = timestamp;

      // 3. 用 splice 原地替换，这步操作专门用来通知 ArkUI 刷新列表
      this.todos.splice(index, 1, currentItem);

      // 4. 同步更新到底层 ViewModel / 数据库
      // (加个判断确保 id 不是 undefined 更安全)
      if (currentItem.id !== undefined) {
        TodoViewModel.updateTodoRemindAndRemark(currentItem.id, timestamp, currentItem.remark || '');
      }
    }
    this.showRemindPicker = false;
  }

  async toggleTodoStatus(id: number): Promise<void> {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;
    const newStatus = todo.status === 'pending' ? 'completed' : 'pending';
    try {
      await TodoViewModel.toggleTodoStatus(id, newStatus);
      await this.loadTodos();
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      await TodoViewModel.deleteTodo(id);
      if (this.editingTodoId === id) {
        this.editingTodoId = 0;
        this.isAddingRemark = false;
        this.showRemindPicker = false;
      }
      await this.loadTodos();
    } catch (error) {
      console.error('删除待办失败:', error);
    }
  }

  toggleCalendar(): void {
    this.isCalendarExpanded = !this.isCalendarExpanded;
  }

  /**
   * 获取当前正在编辑的 Todo
   */
  private getEditingTodo(): TodoItem | undefined {
    return this.todos.find(t => t.id === this.editingTodoId);
  }

  /**
   * 设置 Todo 位置
   */
  async setTodoLocation(location: string): Promise<void> {
    const todo = this.getEditingTodo();
    if (!todo || todo.id === undefined) return;
    const index = this.todos.findIndex(t => t.id === todo.id);
    if (index > -1) {
      let currentItem = this.todos[index];
      currentItem.location = location;
      this.todos.splice(index, 1, currentItem);
      await TodoViewModel.updateTodoExtras(todo.id, location, currentItem.tag || '', currentItem.flagged || false, currentItem.imageUris || '');
    }
  }

  /**
   * 切换 Todo 旗帜标记
   */
  async toggleTodoFlagged(): Promise<void> {
    const todo = this.getEditingTodo();
    if (!todo || todo.id === undefined) return;
    const index = this.todos.findIndex(t => t.id === todo.id);
    if (index > -1) {
      let currentItem = this.todos[index];
      currentItem.flagged = !currentItem.flagged;
      this.todos.splice(index, 1, currentItem);
      await TodoViewModel.updateTodoExtras(todo.id, currentItem.location || '', currentItem.tag || '', currentItem.flagged || false, currentItem.imageUris || '');
    }
  }

  /**
   * 设置 Todo 标签
   */
  async setTodoTag(tag: string): Promise<void> {
    const todo = this.getEditingTodo();
    if (!todo || todo.id === undefined) return;
    const index = this.todos.findIndex(t => t.id === todo.id);
    if (index > -1) {
      let currentItem = this.todos[index];
      currentItem.tag = tag;
      this.todos.splice(index, 1, currentItem);
      await TodoViewModel.updateTodoExtras(todo.id, currentItem.location || '', tag, currentItem.flagged || false, currentItem.imageUris || '');
    }
    this.showTagInput = false;
  }

  /**
   * 选择图片添加到 Todo
   */
  async pickTodoImage(): Promise<void> {
    const todo = this.getEditingTodo();
    if (!todo || todo.id === undefined) return;
    try {
      const photoPicker = photoAccessHelper.getPhotoAccessHelper(getContext(this));
      const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
      photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
      photoSelectOptions.maxSelectNumber = 1;

      const photoViewPicker = new photoAccessHelper.PhotoViewPicker();
      const result = await photoViewPicker.select(photoSelectOptions);
      if (result && result.photoUris && result.photoUris.length > 0) {
        const uri = result.photoUris[0];
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index > -1) {
          let currentItem = this.todos[index];
          currentItem.imageUris = uri;
          this.todos.splice(index, 1, currentItem);
          await TodoViewModel.updateTodoExtras(todo.id, currentItem.location || '', currentItem.tag || '', currentItem.flagged || false, uri);
        }
      }
    } catch (error) {
      console.error('选择图片失败:', error);
    }
  }

  // ==================== 随手记方法 ====================

  async loadMoments(): Promise<void> {
    this.momentsLoading = true;
    try {
      const result = await DiaryViewModel.getAllPosts();
      // 💡 核心改动：使用 sort() 按照时间戳升序排序（正序：最早发布的在最上面）
      this.moments = result.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('加载随手记失败:', error);
    } finally {
      this.momentsLoading = false;
    }
  }

  async publishMoment(): Promise<void> {
    if (!this.newPostContent.trim() && this.newPostMediaUris.length === 0) {
      return;
    }
    try {
      const post: DiaryPostInsertParams = {
        content: this.newPostContent.trim(),
        mediaUrls: this.newPostMediaUris,
        location: this.newPostLocation,
        weather: '',
        timestamp: Date.now(),
        date: DateUtils.getToday(),
        category: '',
        templateData: ''
      };
      await DiaryViewModel.createPost(post);
      this.newPostContent = '';
      this.newPostMediaUris = [];
      this.newPostLocation = '';
      this.showPublishDialog = false;
      this.isAddMode = false;
      await this.loadMoments();
    } catch (error) {
      console.error('发布随手记失败:', error);
    }
  }

  async pickMedia(): Promise<void> {
    try {
      const photoPicker = photoAccessHelper.getPhotoAccessHelper(getContext(this));
      const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
      photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_VIDEO_TYPE;
      photoSelectOptions.maxSelectNumber = 9 - this.newPostMediaUris.length;

      const uris: Array<string> = [];
      const photoViewPicker = new photoAccessHelper.PhotoViewPicker();
      const result = await photoViewPicker.select(photoSelectOptions);
      if (result && result.photoUris && result.photoUris.length > 0) {
        for (const uri of result.photoUris) {
          uris.push(uri);
        }
      }
      this.newPostMediaUris = this.newPostMediaUris.concat(uris);
    } catch (error) {
      console.error('选择媒体失败:', error);
    }
  }

  removeMedia(index: number): void {
    this.newPostMediaUris.splice(index, 1);
  }

  // ---- 模板发布相关方法 ----
  async ensureTemplateCollection(templateType: TemplateType): Promise<void> {
    const collectionName = templateTypeToCollection(templateType);
    if (!this.collections.includes(collectionName)) {
      this.collections.push(collectionName);
      await PreferencesUtil.saveCollections(this.collections);
    }
  }

  async publishAccountingTemplate(): Promise<void> {
    if (!this.tplAccDate || !this.tplAccAmount || !this.tplAccItem) {
      promptAction.showToast({ message: '请填写必填项' });
      return;
    }
    try {
      const templateData: AccountingData = {
        type: 'accounting',
        date: this.tplAccDate,
        location: this.tplAccLocation,
        amount: this.tplAccAmount,
        item: this.tplAccItem
      };
      const post: DiaryPostInsertParams = {
        content: `【记账】${this.tplAccItem} ￥${this.tplAccAmount}`,
        mediaUrls: [],
        location: this.tplAccLocation,
        weather: '',
        timestamp: Date.now(),
        date: DateUtils.getToday(),
        category: TEMPLATE_COLLECTION_ACCOUNTING,
        templateData: JSON.stringify(templateData)
      };
      await DiaryViewModel.createPost(post);
      await this.ensureTemplateCollection('accounting');
      this.resetAccountingFields();
      this.showTemplateAccountingDialog = false;
      await this.loadMoments();
      await this.loadCollections();
      promptAction.showToast({ message: '记账成功' });
    } catch (error) {
      console.error('发布记账失败:', error);
    }
  }

  async publishDiningTemplate(): Promise<void> {
    if (!this.tplDinDate || !this.tplDinDish) {
      promptAction.showToast({ message: '请填写必填项' });
      return;
    }
    try {
      const templateData: DiningData = {
        type: 'dining',
        date: this.tplDinDate,
        location: this.tplDinLocation,
        amount: this.tplDinAmount,
        dish: this.tplDinDish,
        rating: this.tplDinRating
      };
      const post: DiaryPostInsertParams = {
        content: `【饮食】${this.tplDinDish}`,
        mediaUrls: this.tplDinMediaUris,
        location: this.tplDinLocation,
        weather: '',
        timestamp: Date.now(),
        date: DateUtils.getToday(),
        category: TEMPLATE_COLLECTION_DINING,
        templateData: JSON.stringify(templateData)
      };
      await DiaryViewModel.createPost(post);
      await this.ensureTemplateCollection('dining');
      this.resetDiningFields();
      this.showTemplateDiningDialog = false;
      await this.loadMoments();
      await this.loadCollections();
      promptAction.showToast({ message: '记录成功' });
    } catch (error) {
      console.error('发布饮食失败:', error);
    }
  }

  async publishMovieTemplate(): Promise<void> {
    if (!this.tplMovTitle) {
      promptAction.showToast({ message: '请填写影片名称' });
      return;
    }
    try {
      const templateData: MovieData = {
        type: 'movie',
        title: this.tplMovTitle,
        genre: this.tplMovGenre,
        score: this.tplMovScore,
        experience: this.tplMovExperience
      };
      const post: DiaryPostInsertParams = {
        content: `【观影】${this.tplMovTitle}`,
        mediaUrls: this.tplMovMediaUris,
        location: '',
        weather: '',
        timestamp: Date.now(),
        date: DateUtils.getToday(),
        category: TEMPLATE_COLLECTION_MOVIE,
        templateData: JSON.stringify(templateData)
      };
      await DiaryViewModel.createPost(post);
      await this.ensureTemplateCollection('movie');
      this.resetMovieFields();
      this.showTemplateMovieDialog = false;
      await this.loadMoments();
      await this.loadCollections();
      promptAction.showToast({ message: '观影记录成功' });
    } catch (error) {
      console.error('发布观影失败:', error);
    }
  }

  resetAccountingFields(): void {
    this.tplAccDate = '';
    this.tplAccLocation = '';
    this.tplAccAmount = '';
    this.tplAccItem = '';
  }

  resetDiningFields(): void {
    this.tplDinDate = '';
    this.tplDinLocation = '';
    this.tplDinAmount = '';
    this.tplDinDish = '';
    this.tplDinRating = '';
    this.tplDinMediaUris = [];
  }

  resetMovieFields(): void {
    this.tplMovTitle = '';
    this.tplMovGenre = '';
    this.tplMovScore = '';
    this.tplMovExperience = '';
    this.tplMovMediaUris = [];
  }

  async pickDiningMedia(): Promise<void> {
    try {
      const photoPicker = photoAccessHelper.getPhotoAccessHelper(getContext(this));
      const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
      photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
      photoSelectOptions.maxSelectNumber = 9 - this.tplDinMediaUris.length;

      const photoViewPicker = new photoAccessHelper.PhotoViewPicker();
      const result = await photoViewPicker.select(photoSelectOptions);
      if (result && result.photoUris && result.photoUris.length > 0) {
        this.tplDinMediaUris = this.tplDinMediaUris.concat(result.photoUris);
      }
    } catch (error) {
      console.error('选择饮食图片失败:', error);
    }
  }

  removeDiningMedia(index: number): void {
    this.tplDinMediaUris.splice(index, 1);
  }

  async pickMovieMedia(): Promise<void> {
    try {
      const photoPicker = photoAccessHelper.getPhotoAccessHelper(getContext(this));
      const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
      photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
      photoSelectOptions.maxSelectNumber = 9 - this.tplMovMediaUris.length;

      const photoViewPicker = new photoAccessHelper.PhotoViewPicker();
      const result = await photoViewPicker.select(photoSelectOptions);
      if (result && result.photoUris && result.photoUris.length > 0) {
        this.tplMovMediaUris = this.tplMovMediaUris.concat(result.photoUris);
      }
    } catch (error) {
      console.error('选择观影图片失败:', error);
    }
  }

  removeMovieMedia(index: number): void {
    this.tplMovMediaUris.splice(index, 1);
  }

  // ---- 多选模式 ----
  enterMultiSelectMode(): void {
    this.isMultiSelectMode = true;
    this.selectedMomentIds.clear();
  }

  cancelMultiSelect(): void {
    this.isMultiSelectMode = false;
    this.selectedMomentIds.clear();
  }

  selectAllMoments(): void {
    if (this.selectedMomentIds.size === this.moments.length) {
      // 已全选则取消全选
      this.selectedMomentIds.clear();
    } else {
      // 全选
      this.selectedMomentIds.clear();
      for (const moment of this.moments) {
        this.selectedMomentIds.add(moment.id);
      }
    }
  }

  toggleMomentSelection(id: number): void {
    if (this.selectedMomentIds.has(id)) {
      this.selectedMomentIds.delete(id);
    } else {
      this.selectedMomentIds.add(id);
    }
  }

  async confirmDeleteSelectedMoments(): Promise<void> {
    if (this.selectedMomentIds.size === 0) return;
    try {
      for (const id of this.selectedMomentIds) {
        await DiaryViewModel.deletePost(id);
      }
      this.selectedMomentIds.clear();
      this.isMultiSelectMode = false;
      this.showDeleteConfirmDialog = false;
      await this.loadMoments();
      promptAction.showToast({ message: '已删除' });
    } catch (error) {
      console.error('删除失败:', error);
    }
  }

  showDeleteConfirm(): void {
    if (this.selectedMomentIds.size === 0) {
      promptAction.showToast({ message: '请先选择要删除的记录' });
      return;
    }
    this.pendingDeleteCount = this.selectedMomentIds.size;
    animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
      this.showDeleteConfirmDialog = true;
    });
  }

  // ---- 合集相关 ----
  showCreateCollectionDialog(): void {
    if (this.selectedMomentIds.size === 0) {
      promptAction.showToast({ message: '请先选择要整理的记录' });
      return;
    }
    this.collectionName = '';
    this.loadCollections();
    animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
      this.showCollectionDialog = true;
    });
  }

  async createCollection(): Promise<void> {
    if (!this.collectionName.trim()) {
      return;
    }
    animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
      this.showCollectionDialog = false;
    });
    try {
      // 将选中的随手记归类到一个合集（通过 category 字段存储合集名）
      for (const id of this.selectedMomentIds) {
        await DiaryViewModel.updatePostCategory(id, this.collectionName.trim());
      }
      this.selectedMomentIds.clear();
      this.isMultiSelectMode = false;
      await this.loadMoments();
      promptAction.showToast({ message: $r('app.string.moment_collection_created') });
    } catch (error) {
      console.error('创建合集失败:', error);
    }
  }

  async addSelectedToCollection(collectionName: string): Promise<void> {
    animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
      this.showCollectionDialog = false;
    });
    try {
      for (const id of this.selectedMomentIds) {
        await DiaryViewModel.updatePostCategory(id, collectionName);
      }
      this.selectedMomentIds.clear();
      this.isMultiSelectMode = false;
      await this.loadMoments();
      promptAction.showToast({ message: '已添加到合集' });
    } catch (error) {
      console.error('添加到合集失败:', error);
    }
  }

  navigateToCollections(): void {
    router.pushUrl({ url: 'pages/CategoryPage' });
  }

  // ---- 整理到手账 ----
  async generatePlogFromToday(): Promise<void> {
    try {
      const today = DateUtils.getToday();
      const todayPosts = await DiaryViewModel.getPostsByDate(today);

      if (todayPosts.length === 0) {
        promptAction.showToast({ message: '今天还没有随手记' });
        return;
      }

      // 收集今日媒体的照片
      const imageUris: string[] = [];
      for (const post of todayPosts) {
        if (post.mediaUrls && post.mediaUrls.length > 0) {
          imageUris.push(...post.mediaUrls);
        }
      }

      // 始终创建新手账，支持同一天生成多个手账
      const elements: CanvasElement[] = imageUris.map((uri, idx) => {
        const element: CanvasElement = {
          type: 'image',
          x: 20 + (idx % 3) * 120,
          y: 100 + Math.floor(idx / 3) * 150,
          width: 100,
          height: 100,
          rotation: 0,
          content: uri,
          zIndex: idx
        };
        return element;
      });

      const insertParams: PlogInsertParams = {
        date: today,
        backgroundImage: '',
        elements: elements,
        diaryIds: todayPosts.map((post: DiaryPost) => post.id),
        createdAt: Date.now(),
        thumbnail: imageUris.length > 0 ? imageUris[0] : ''
      };
      await PlogViewModel.createPlog(insertParams);

      promptAction.showToast({ message: $r('app.string.plog_generate_success') });
    } catch (error) {
      console.error('生成手账失败:', error);
    }
  }

  async generatePlogFromSelected(): Promise<void> {
    if (this.selectedMomentIds.size === 0) {
      promptAction.showToast({ message: '请先选择记录' });
      return;
    }
    try {
      const selectedPosts = this.moments.filter((m: DiaryPost) => this.selectedMomentIds.has(m.id));
      const imageUris: string[] = [];
      for (const post of selectedPosts) {
        if (post.mediaUrls && post.mediaUrls.length > 0) {
          imageUris.push(...post.mediaUrls);
        }
      }

      const elements: CanvasElement[] = imageUris.map((uri, idx) => {
        const element: CanvasElement = {
          type: 'image',
          x: 20 + (idx % 3) * 120,
          y: 100 + Math.floor(idx / 3) * 150,
          width: 100,
          height: 100,
          rotation: 0,
          content: uri,
          zIndex: idx
        };
        return element;
      });

      const today = DateUtils.getToday();
      const insertParams: PlogInsertParams = {
        date: today,
        backgroundImage: '',
        elements: elements,
        diaryIds: selectedPosts.map((post: DiaryPost) => post.id),
        createdAt: Date.now(),
        thumbnail: imageUris.length > 0 ? imageUris[0] : ''
      };
      await PlogViewModel.createPlog(insertParams);

      this.selectedMomentIds.clear();
      this.isMultiSelectMode = false;
      promptAction.showToast({ message: '制作成功' });
    } catch (error) {
      console.error('制作手账失败:', error);
    }
  }

  navigateToPlogGallery(): void {
    router.pushUrl({ url: 'pages/PlogGalleryPage' });
  }

  // ==================== 构建方法 ====================

  build() {
    Column() {
      Tabs({
        barPosition: BarPosition.End,
        index: this.currentTabIndex
      }) {
        // Tab 0: Todo 待办
        TabContent() {
          this.TodoContent()
        }
        .tabBar(this.TabBarBuilder(0))

        // Tab 1: 随手记
        TabContent() {
          this.MomentContent()
        }
        .tabBar(this.TabBarBuilder(1))
        .onAppear(() => {
          this.loadMoments();
        })

        // Tab 2: Setting 设置
        TabContent() {
          SettingPage()
        }
        .tabBar(this.TabBarBuilder(2))
      }
      .barHeight(this.isMultiSelectMode && this.currentTabIndex === 1 ? 0 : 56)
      .barBackgroundColor(this.currentColors.bgCard)
      .animationDuration(200)
      .onChange((index: number) => {
        this.currentTabIndex = index;
        // 切换 tab 时退出多选模式
        if (this.isMultiSelectMode) {
          this.cancelMultiSelect();
        }
      })
      .width('100%')
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
  }

  // ==================== TabBar 构建器 ====================

  @Builder
  @Builder
  TabBarBuilder(index: number) {
    Column() {
      // 1. 动态判断图标：根据索引选择系统内置的矢量符号
      if (index === 0) {
        // Tab 0: 待办（打勾文档图标）
        SymbolGlyph($r('sys.symbol.checkmark_square_fill'))
          .fontSize(22)
          // 关键：激活状态用你的主题 primary 彩色，未激活用 textMuted 弱灰色
          .fontColor([this.currentTabIndex === 0 ? this.currentColors.primary : this.currentColors.textMuted])
      } else if (index === 1) {
        // Tab 1: 手账 / 随手记（书本/画笔图标，这里用内置的经典书本符号）
        SymbolGlyph($r('sys.symbol.doc_plaintext'))
          .fontSize(22)
          .fontColor([this.currentTabIndex === 1 ? this.currentColors.primary : this.currentColors.textMuted])
      } else {
        // Tab 2: 设置（齿轮图标）
        SymbolGlyph($r('sys.symbol.gearshape'))
          .fontSize(22)
          .fontColor([this.currentTabIndex === 2 ? this.currentColors.primary : this.currentColors.textMuted])
      }

      // 2. 动态判断文字颜色
      Text(index === 0 ? '待办' : index === 1 ? '手账' : '设置')
        .fontSize(11)
        .fontWeight(this.currentTabIndex === index ? FontWeight.Medium : FontWeight.Normal)
        .fontColor(this.currentTabIndex === index ? this.currentColors.primary : this.currentColors.textMuted)
        .margin({ top: 4 })
    }
    .width('100%')
    .height(56)
    .justifyContent(FlexAlign.Center)
  }

  // ==================== Todo 内容区 ====================
  @Builder
  TodoContent() {
    // 💡 【大布局重构】：最外层保持一个大 Column 占满全屏
    Column() {

      // 💡 核心点 1：将日历、列表和悬浮加号包裹在这个独立的 Stack 中
      // 并且赋予它 .layoutWeight(1)，这意味着它是“弹性主体”
      Stack({ alignContent: Alignment.BottomEnd }) {

        // 主体内容滚动区
        Column() {
          // 1. 日历头部行
          Row() {
            Text(DateUtils.formatDisplayDate(this.selectedDate))
              .fontSize($r('app.float.font_size_xxl'))
              .fontWeight(FontWeight.Bold)
              .fontColor(this.currentColors.textMain)
            Blank()
            Button({ type: ButtonType.Circle }) {
              SymbolGlyph($r('sys.symbol.chevron_down'))
                .fontSize(18)
                .fontColor([this.currentColors.textMuted])
                .rotate({ angle: this.isCalendarExpanded ? 180 : 0 })
                .animation({ duration: 200 })
            }
            .width(36)
            .height(36)
            .backgroundColor(Color.Transparent)
            .onClick(() => this.toggleCalendar())
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 16, bottom: 8 })

          // 2. 周日历
          WeekCalendarComponent({
            currentWeek: this.currentWeek,
            selectedDate: this.selectedDate,
            colors: this.currentColors,
            onDateSelected: (date: string) => this.onDateSelected(date)
          })
            .margin({ top: 8, left: 16, right: 16 })

          // 3. 月日历展开
          if (this.isCalendarExpanded) {
            MonthCalendarComponent({
              calendar: this.monthCalendar,
              selectedDate: this.selectedDate,
              eventDates: this.eventDates,
              colors: this.currentColors,
              onDateSelected: (date: string) => {
                this.onDateSelected(date);
                this.toggleCalendar();
              }
            })
              .margin({ top: 12, left: 16, right: 16 })
          }

          Divider()
            .color(this.currentColors.border)
            .margin({ top: this.isCalendarExpanded ? 12 : 8, bottom: 8 })

          // 4. 标题栏：提醒（iOS 风格大标题）
          Row() {
            Text('提醒')
              .fontSize(32)
              .fontWeight(FontWeight.Bold)
              .fontColor(this.currentColors.primary)
            Blank()
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 8, bottom: 8 })

          // 5. 待办列表
          if (this.isLoading) {
            LoadingProgress().width(40).height(40).layoutWeight(1)
          } else {
            if (this.todos.length === 0 && this.editingTodoId === 0) {
              Column() {
                Text('📝').fontSize(48).margin({ bottom: 12 })
                Text('今天还没有任务').fontSize($r('app.float.font_size_base')).fontColor(this.currentColors.textMuted)
              }
              .width('100%')
              .layoutWeight(1)
              .justifyContent(FlexAlign.Center)
            } else {
              TodoListComponent({
                todos: this.todos,
                editingTodoId: this.editingTodoId,
                isAddingRemark: this.isAddingRemark,
                onToggleStatus: (id: number) => { this.toggleTodoStatus(id); },
                onDelete: (id: number) => { this.deleteTodo(id); },
                onReorder: (fromIndex: number, toIndex: number) => { this.onTodoReorder(fromIndex, toIndex); },
                onStartEdit: (id: number) => {
                  this.editingTodoId = id;
                  this.isAddingRemark = !!this.todos.find(t => t.id === id)?.remark;
                  this.showTagInput = false;
                },
                onContentChange: (id: number, content: string) => {
                  const idx = this.todos.findIndex(t => t.id === id);
                  if (idx >= 0) { this.todos[idx].content = content; }
                },
                onEditSubmit: async (id: number, content: string, remark?: string) => {
                  await this.saveEditingTodo(id, content, remark);
                },
                onAddRemarkClick: () => {
                  this.isAddingRemark = true;
                }
              })
                .borderRadius($r('app.float.border_radius_lg'))
                .backgroundColor(this.currentColors.bgCard)
                .shadow({
                  radius: 12,
                  color: '#0d000000',
                  offsetX: 0,
                  offsetY: 4
                })
            }
          }
        }
        .width('100%')
        .height('100%')
        .backgroundColor(this.currentColors.bgMain)

        // 悬浮加号按钮（只在非编辑态显示，隶属于 Stack 右下角）
        if (this.editingTodoId === 0) {
          Button({ type: ButtonType.Circle }) {
            Text('+').fontSize(36).fontColor(Color.White)
          }
          .width(56)
          .height(56)
          .backgroundColor(this.currentColors.primary)
          .margin({ right: 24, bottom: 24 })
          .shadow({ radius: 8, color: '#30000000', offsetX: 0, offsetY: 4 })
          .zIndex(999)
          .onClick(() => { this.addBlankTodo(); })
        }

      }
      .width('100%')
      .layoutWeight(1)

      if (this.editingTodoId > 0) {
        this.EditingToolbar()
      }

    }
    .width('100%')
    .height('100%')
    .expandSafeArea([SafeAreaType.KEYBOARD], [SafeAreaEdge.BOTTOM])
  }

  @Builder
  MomentContent() {
    Stack({ alignContent: Alignment.BottomEnd }) {
      Column() {
        // ---- 标题栏 ----
        if (this.isMultiSelectMode) {
          // 多选模式：全选 + 选择项目 + 取消
          Row() {
            Button($r('app.string.moment_select_all'))
              .fontSize($r('app.float.font_size_sm'))
              .backgroundColor(Color.Transparent)
              .fontColor(this.currentColors.primary)
              .height(32)
              .onClick(() => {
                animateTo({ duration: 150, curve: Curve.EaseOut }, () => {
                  this.selectAllMoments();
                });
              })

            Blank()

            Text(this.selectedMomentIds.size > 0 ?
              `已选 ${this.selectedMomentIds.size} 项` : '选择项目')
              .fontSize($r('app.float.font_size_base'))
              .fontWeight(FontWeight.Medium)
              .fontColor(this.currentColors.textMain)
              .animation({ duration: 150 })

            Blank()

            Button($r('app.string.moment_cancel'))
              .fontSize($r('app.float.font_size_sm'))
              .backgroundColor(Color.Transparent)
              .fontColor(this.currentColors.primary)
              .height(32)
              .onClick(() => {
                animateTo({ duration: 250, curve: Curve.EaseInOut }, () => {
                  this.cancelMultiSelect();
                });
              })
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 16, bottom: 4 })
          .transition(TransitionEffect.OPACITY
            .combine(TransitionEffect.translate({ x: 8 }))
            .animation({ duration: 250, curve: Curve.EaseInOut }))
        } else {
          // 普通模式：随手记 + 多选/添加/更多
          Row() {
            Text($r('app.string.moment_title'))
              .fontSize($r('app.float.font_size_xxl'))
              .fontWeight(FontWeight.Bold)
              .fontColor(this.currentColors.textMain)

            Blank()

            // 搜索按钮
            Button() {
              SymbolGlyph($r('sys.symbol.magnifyingglass'))
                .fontSize(20)
                .fontColor([this.currentColors.textMuted])
            }
            .width(40)
            .height(40)
            .backgroundColor(Color.Transparent)
            .border({ width: 1, color: this.currentColors.border, radius: 20 })
            .onClick(() => {
              animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
                this.showSearchBar = true;
              });
            })

            // 多选按钮
            Button() {
              SymbolGlyph($r('sys.symbol.checkmark'))
                .fontSize(20)
                .fontColor([this.currentColors.textMuted])
            }
            .width(40)
            .height(40)
            .backgroundColor(Color.Transparent)
            .border({ width: 1, color: this.currentColors.border, radius: 20 })
            .margin({ left: 10 })
            .onClick(() => {
              animateTo({ duration: 250, curve: Curve.EaseInOut }, () => {
                this.enterMultiSelectMode();
              });
            })

            // 添加按钮
            Button() {
              SymbolGlyph($r('sys.symbol.plus'))
                .fontSize(20)
                .fontColor([this.currentColors.textMuted])
            }
            .width(40)
            .height(40)
            .backgroundColor(Color.Transparent)
            .border({ width: 1, color: this.currentColors.border, radius: 20 })
            .margin({ left: 10 })
            .onClick(() => {
              animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
                this.showTemplateChoiceDialog = true;
              });
            })

            // 更多按钮
            Button() {
              Text('⋮')
                .fontSize(22)
                .fontColor(this.currentColors.textMuted)
            }
            .width(40)
            .height(40)
            .backgroundColor(Color.Transparent)
            .border({ width: 1, color: this.currentColors.border, radius: 20 })
            .margin({ left: 10 })
            .onClick(() => {
              animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
                this.showMoreDropdown = !this.showMoreDropdown;
              });
            })
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 16, bottom: 4 })
          .transition(TransitionEffect.OPACITY
            .combine(TransitionEffect.translate({ x: -8 }))
            .animation({ duration: 250, curve: Curve.EaseInOut }))
        }

        Divider()
          .color(this.currentColors.border)

        // 搜索框（从导航栏下方展开，非整体滑入）
        Column() {
          Row({ space: 8 }) {
            TextInput({
              placeholder: '搜索时间、内容、地点…',
              text: this.searchKeyword
            })
              .placeholderColor(this.currentColors.textMuted)
              .fontSize($r('app.float.font_size_sm'))
              .height(36)
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .layoutWeight(1)
              .enabled(this.showSearchBar)
              .onChange((value: string) => {
                this.searchKeyword = value;
              })

            Button() {
              SymbolGlyph($r('sys.symbol.xmark'))
                .fontSize(14)
                .fontColor([this.currentColors.textMuted])
            }
            .width(32)
            .height(32)
            .backgroundColor(Color.Transparent)
            .enabled(this.showSearchBar)
            .onClick(() => {
              animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                this.showSearchBar = false;
              });
              this.searchKeyword = '';
            })
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 8, bottom: 8 })
          .backgroundColor(this.currentColors.bgCard)
        }
        .width('100%')
        .clip(true)
        .height(this.showSearchBar ? 52 : 0)

        // 随手记列表
        if (this.momentsLoading) {
          LoadingProgress()
            .width(40)
            .height(40)
            .layoutWeight(1)
        } else if (this.moments.length === 0) {
          Column() {
            Text('📸')
              .fontSize(48)
              .margin({ bottom: 12 })
            Text($r('app.string.moment_no_posts'))
              .fontSize($r('app.float.font_size_base'))
              .fontColor(this.currentColors.textMuted)
            Text($r('app.string.moment_no_posts_hint'))
              .fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted)
              .margin({ top: 4 })
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        } else {
          Scroll() {
            Column() {
              ForEach(this.showSearchBar && this.searchKeyword.trim() ? this.moments.filter((m: DiaryPost) => {
                const kw = this.searchKeyword.trim().toLowerCase();
                return (m.content && m.content.toLowerCase().includes(kw)) ||
                       (m.location && m.location.toLowerCase().includes(kw)) ||
                       (m.date && m.date.includes(kw));
              }) : this.moments, (moment: DiaryPost) => {
                this.MomentCard(moment)
              }, (moment: DiaryPost) => moment.id.toString())
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 16, bottom: 100 })
            .justifyContent(FlexAlign.Start)
          }
          .width('100%')
          .layoutWeight(1)
          .align(Alignment.Top)
          .scrollBar(BarState.Off)
          .edgeEffect(EdgeEffect.Spring)
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor(this.currentColors.bgMain)

      // 更多下拉菜单 + 遮罩（全屏 Stack 定位在右上角）
      if (this.showMoreDropdown) {
        Stack({ alignContent: Alignment.TopEnd }) {
          // 全屏透明遮罩（点击关闭）
          Column()
            .width('100%')
            .height('100%')
            .onClick(() => {
              animateTo({ duration: 150, curve: Curve.EaseIn }, () => {
                this.showMoreDropdown = false;
              });
            })

          // 下拉菜单（更多按钮正下方）
          Column() {
            this.MoreDropdownMenu()
          }
          .margin({ top: 52, right: 16 })
        }
        .width('100%')
        .height('100%')
        .zIndex(102)
        .transition(TransitionEffect.OPACITY
          .combine(TransitionEffect.translate({ y: -6 }))
          .animation({ duration: 200, curve: Curve.EaseOut }))
      }

      // 多选模式底部操作栏（圆角方形组件）
      if (this.isMultiSelectMode) {
        Column() {
          this.MultiSelectBottomBar()
        }
        .transition(TransitionEffect.translate({ y: 72 })
          .animation({ duration: 250, curve: Curve.EaseOut }))
      }

      // 发布对话框
      if (this.showPublishDialog) {
        Column() {
          this.PublishDialog()
        }
        .transition(TransitionEffect.OPACITY
          .combine(this.isAddMode ? TransitionEffect.translate({ y: '100%' }) : TransitionEffect.scale({ x: 0.95, y: 0.95 }))
          .animation({ duration: 300, curve: Curve.EaseOut }))
      }

      // 合集命名对话框
      if (this.showCollectionDialog) {
        Column() {
          this.CollectionDialog()
        }
        .transition(TransitionEffect.translate({ y: '100%' })
          .animation({ duration: 250, curve: Curve.EaseOut }))
      }

      // 删除确认对话框
      if (this.showDeleteConfirmDialog) {
        Column() {
          this.DeleteConfirmDialog()
        }
        .transition(TransitionEffect.scale({ x: 0.9, y: 0.9 })
          .combine(TransitionEffect.opacity(0))
          .animation({ duration: 200, curve: Curve.EaseOut }))
      }

      // 新建合集对话框
      if (this.showNewCollectionDialog) {
        Column() {
          this.NewCollectionDialog()
        }
        .transition(TransitionEffect.translate({ y: '100%' })
          .animation({ duration: 250, curve: Curve.EaseOut }))
      }

      // 模板选择对话框
      if (this.showTemplateChoiceDialog) {
        Column() {
          this.TemplateChoiceDialog()
        }
        .transition(TransitionEffect.scale({ x: 0.95, y: 0.95 })
          .combine(TransitionEffect.opacity(0))
          .animation({ duration: 200, curve: Curve.EaseOut }))
      }

      // 模板列表下拉框
      if (this.showTemplateListDropdown) {
        Column() {
          this.TemplateListDropdown()
        }
        .transition(TransitionEffect.translate({ y: '100%' })
          .animation({ duration: 250, curve: Curve.EaseOut }))
      }

      // 记账模板对话框
      if (this.showTemplateAccountingDialog) {
        Column() {
          this.TemplateAccountingDialog()
        }
        .transition(TransitionEffect.translate({ y: '100%' })
          .animation({ duration: 300, curve: Curve.EaseOut }))
      }

      // 饮食模板对话框
      if (this.showTemplateDiningDialog) {
        Column() {
          this.TemplateDiningDialog()
        }
        .transition(TransitionEffect.translate({ y: '100%' })
          .animation({ duration: 300, curve: Curve.EaseOut }))
      }

      // 观影模板对话框
      if (this.showTemplateMovieDialog) {
        Column() {
          this.TemplateMovieDialog()
        }
        .transition(TransitionEffect.translate({ y: '100%' })
          .animation({ duration: 300, curve: Curve.EaseOut }))
      }
    }
    .width('100%')
    .height('100%')
  }

  // ==================== 模板数据渲染 ====================

  @Builder
  renderTemplateData(templateDataJson: string) {
    if (templateDataJson.includes('"type":"accounting"') ||
        templateDataJson.includes('"type": "accounting"')) {
      Column({ space: 8 }) {
        this.renderAccountingDataFromJson(templateDataJson)
      }
      .width('100%')
      .padding(12)
      .backgroundColor(this.currentColors.bgMain)
      .borderRadius($r('app.float.border_radius_md'))
      .margin({ top: 4, bottom: 8 })
    } else if (templateDataJson.includes('"type":"dining"') ||
               templateDataJson.includes('"type": "dining"')) {
      Column({ space: 8 }) {
        this.renderDiningDataFromJson(templateDataJson)
      }
      .width('100%')
      .padding(12)
      .backgroundColor(this.currentColors.bgMain)
      .borderRadius($r('app.float.border_radius_md'))
      .margin({ top: 4, bottom: 8 })
    } else if (templateDataJson.includes('"type":"movie"') ||
               templateDataJson.includes('"type": "movie"')) {
      Column({ space: 8 }) {
        this.renderMovieDataFromJson(templateDataJson)
      }
      .width('100%')
      .padding(12)
      .backgroundColor(this.currentColors.bgMain)
      .borderRadius($r('app.float.border_radius_md'))
      .margin({ top: 4, bottom: 8 })
    }
  }

  @Builder
  renderAccountingDataFromJson(json: string) {
    Column({ space: 6 }) {
      Row() {
        Text('日期：').fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMuted).width(60)
        Text(this.extractField(json, 'date')).fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMain)
      }.width('100%')
      
      if (this.extractField(json, 'location')) {
        Row() {
          Text('地点：').fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMuted).width(60)
          Text(this.extractField(json, 'location')).fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMain)
        }.width('100%')
      }
      
      Row() {
        Text('金额：').fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMuted).width(60)
        Text(`￥${this.extractField(json, 'amount')}`).fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.primary).fontWeight(FontWeight.Medium)
      }.width('100%')
      
      Row() {
        Text('物品：').fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMuted).width(60)
        Text(this.extractField(json, 'item')).fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMain)
      }.width('100%')
    }.width('100%')
  }

  @Builder
  renderDiningDataFromJson(json: string) {
    Column({ space: 6 }) {
      Row() {
        Text('日期：').fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMuted).width(60)
        Text(this.extractField(json, 'date')).fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMain)
      }.width('100%')
      
      if (this.extractField(json, 'location')) {
        Row() {
          Text('地点：').fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMuted).width(60)
          Text(this.extractField(json, 'location')).fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMain)
        }.width('100%')
      }
      
      if (this.extractField(json, 'amount')) {
        Row() {
          Text('金额：').fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMuted).width(60)
          Text(`￥${this.extractField(json, 'amount')}`).fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.primary).fontWeight(FontWeight.Medium)
        }.width('100%')
      }
      
      Row() {
        Text('菜品：').fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMuted).width(60)
        Text(this.extractField(json, 'dish')).fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMain)
      }.width('100%')
      
      if (this.extractField(json, 'rating')) {
        Row() {
          Text('评价：').fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMuted).width(60)
          Text(this.extractField(json, 'rating')).fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMain).layoutWeight(1)
        }.width('100%').alignItems(VerticalAlign.Top)
      }
    }.width('100%')
  }

  @Builder
  renderMovieDataFromJson(json: string) {
    Column({ space: 6 }) {
      Row() {
        Text('影片：').fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMuted).width(60)
        Text(this.extractField(json, 'title')).fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMain).fontWeight(FontWeight.Medium)
      }.width('100%')
      
      if (this.extractField(json, 'genre')) {
        Row() {
          Text('类型：').fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMuted).width(60)
          Text(this.extractField(json, 'genre')).fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMain)
        }.width('100%')
      }
      
      if (this.extractField(json, 'score')) {
        Row() {
          Text('评分：').fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMuted).width(60)
          Text(this.extractField(json, 'score')).fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.primary).fontWeight(FontWeight.Medium)
        }.width('100%')
      }
      
      if (this.extractField(json, 'experience')) {
        Row() {
          Text('体验：').fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMuted).width(60)
          Text(this.extractField(json, 'experience')).fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMain).layoutWeight(1)
        }.width('100%').alignItems(VerticalAlign.Top)
      }
    }.width('100%')
  }

  private extractField(json: string, fieldName: string): string {
    try {
      const match = json.match(new RegExp(`"${fieldName}"\\s*:\\s*"([^"]*)"`, 'i'));
      return match ? match[1] : '';
    } catch {
      return '';
    }
  }

  // ==================== 随手记卡片组件 ====================

  @Builder
  MomentCard(moment: DiaryPost) {
    Column() {
      // 头部：时间和位置
      Row() {
        // 多选圆圈（多选模式，在每条记录前显示）
        if (this.isMultiSelectMode) {
          Row() {
            Circle({ width: 22, height: 22 })
              .fill(this.selectedMomentIds.has(moment.id) ?
                this.currentColors.primary : Color.Transparent)
              .stroke(this.selectedMomentIds.has(moment.id) ?
                this.currentColors.primary : this.currentColors.textMuted)
              .strokeWidth(2)
          }
          .onClick(() => this.toggleMomentSelection(moment.id))
          .hitTestBehavior(HitTestMode.Block)
          .margin({ right: 10 })
        }

        Text(DateUtils.formatTime(moment.timestamp))
          .fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMuted)

        if (moment.location) {
          Text(`📍 ${moment.location}`)
            .fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMuted)
            .margin({ left: 12 })
        }

      }
      .width('100%')
      .margin({ bottom: 8 })

      // 文字内容
      if (moment.content) {
        Text(moment.content)
          .fontSize($r('app.float.font_size_base'))
          .fontColor(this.currentColors.textMain)
          .fontWeight(FontWeight.Medium)
          .lineHeight(24)
          .width('100%')
          .margin({ bottom: 8 })
      }

      // 模板数据展示
      if (moment.templateData) {
        this.renderTemplateData(moment.templateData)
      }

      // 媒体网格
      if (moment.mediaUrls && moment.mediaUrls.length > 0) {
        Grid() {
          ForEach(moment.mediaUrls.slice(0, 9), (url: string) => {
            GridItem() {
              Image(url)
                .width('100%')
                .height('100%')
                .objectFit(ImageFit.Cover)
                .borderRadius($r('app.float.border_radius_md'))
            }
          })
        }
        .columnsTemplate(moment.mediaUrls.length === 1 ? '1fr' :
          moment.mediaUrls.length <= 4 ? '1fr 1fr' : '1fr 1fr 1fr')
        .rowsTemplate(moment.mediaUrls.length <= 2 ? '1fr' :
          moment.mediaUrls.length <= 4 ? '1fr 1fr' : '1fr 1fr 1fr')
        .columnsGap(4)
        .rowsGap(4)
        .width('100%')
        .height(moment.mediaUrls.length === 1 ? 200 :
          moment.mediaUrls.length <= 4 ? 300 : 400)
      }
    }
    .width('100%')
    .padding(16)
    .backgroundColor(this.currentColors.bgCard)
    .borderRadius($r('app.float.border_radius_lg'))
    .margin({ bottom: 12 })
    .shadow({ radius: 12, color: '#0d000000', offsetX: 0, offsetY: 4 })
    .onClick(() => {
      if (this.isMultiSelectMode) {
        this.toggleMomentSelection(moment.id);
      }
    })
  }

  // ==================== 发布对话框 ====================

  @Builder
  PublishDialog() {
    Column() {
      // 对话框标题（左侧 X，中间标题，右侧发布）
      Row() {
        // 左侧关闭按钮
        Button() {
          SymbolGlyph($r('sys.symbol.xmark'))
            .fontSize(18)
            .fontColor([this.currentColors.textMuted])
        }
        .width(32)
        .height(32)
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          animateTo({ duration: 250, curve: Curve.EaseIn }, () => {
            this.showPublishDialog = false;
            this.isAddMode = false;
          });
          this.newPostContent = '';
          this.newPostMediaUris = [];
          this.newPostLocation = '';
        })

        Blank()

        // 中间标题
        Text('发布随手记')
          .fontSize($r('app.float.font_size_lg'))
          .fontWeight(FontWeight.Medium)
          .fontColor(this.currentColors.textMain)

        Blank()

        // 右侧发布按钮
        Button('发布')
          .fontSize($r('app.float.font_size_sm'))
          .fontColor(Color.White)
          .backgroundColor(this.newPostContent || this.newPostMediaUris.length > 0 ?
            this.currentColors.primary : '#CCCCCC')
          .borderRadius(16)
          .width(56)
          .height(32)
          .onClick(() => this.publishMoment())
      }
      .width('100%')
      .margin({ bottom: 16 })

      // 文字输入区
      TextArea({ placeholder: $r('app.string.moment_post_placeholder'), text: this.newPostContent })
        .width('100%')
        .height(this.isAddMode ? 200 : 120)
        .fontSize($r('app.float.font_size_base'))
        .backgroundColor(this.currentColors.bgMain)
        .borderRadius($r('app.float.border_radius_md'))
        .padding(12)
        .onChange((value: string) => { this.newPostContent = value; })

      // 图片区域：已选图片 + 添加按钮
      Row() {
        Scroll() {
          Row({ space: 8 }) {
            // 已选图片预览
            ForEach(this.newPostMediaUris, (uri: string, index: number) => {
              Stack() {
                Image(uri)
                  .width(100)
                  .height(100)
                  .objectFit(ImageFit.Cover)
                  .borderRadius(6)

                Button() {
                  SymbolGlyph($r('sys.symbol.xmark'))
                    .fontSize(10)
                    .fontColor([Color.White])
                }
                .width(18)
                .height(18)
                .backgroundColor('#80000000')
                .borderRadius(9)
                .position({ x: 0, y: 0 })
                .offset({ x: -4, y: -4 })
                .onClick(() => this.removeMedia(index))
              }
            })

            // 添加图片的大加号按钮
            Row() {
              Text('＋')
                .fontSize(36)
                .fontColor(this.currentColors.textMuted)
            }
            .width(100)
            .height(100)
            .border({ width: 1, color: this.currentColors.border })
            .borderRadius(6)
            .justifyContent(FlexAlign.Center)
            .alignItems(VerticalAlign.Center)
            .onClick(() => this.pickMedia())
          }
        }
        .scrollable(ScrollDirection.Horizontal)
        .scrollBar(BarState.Off)
      }
      .width('100%')
      .margin({ top: 16 })

      Blank()

      // 添加位置（可输入的文字框）
      Row({ space: 8 }) {
        Text('📍')
          .fontSize($r('app.float.font_size_sm'))
        TextInput({ placeholder: '添加位置', text: this.newPostLocation })
          .layoutWeight(1)
          .fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMain)
          .placeholderColor(this.currentColors.textMuted)
          .backgroundColor(Color.Transparent)
          .padding(0)
          .borderRadius(0)
          .onChange((value: string) => { this.newPostLocation = value; })
        if (this.newPostLocation) {
          Button() {
            SymbolGlyph($r('sys.symbol.xmark'))
              .fontSize(12)
              .fontColor([this.currentColors.textMuted])
          }
          .width(24)
          .height(24)
          .backgroundColor(Color.Transparent)
          .onClick(() => { this.newPostLocation = ''; })
        }
      }
      .width('100%')
      .height(44)
      .padding({ left: 12, right: 8, top: 4, bottom: 4 })
      .backgroundColor(this.currentColors.bgMain)
      .borderRadius($r('app.float.border_radius_md'))
      .alignItems(VerticalAlign.Center)
    }
    .width('100%')
    .height('100%')
    .padding(this.isAddMode ? 16 : 20)
    .backgroundColor(this.currentColors.bgCard)
    .borderRadius(this.isAddMode ? 0 : $r('app.float.border_radius_xl'))
  }

  // ==================== 新建合集对话框 ====================

  @Builder
  NewCollectionDialog() {
    Column() {
      Blank()

      Column() {
        // 标题栏：返回  新建合集  创建
        Row() {
          Button() {
            SymbolGlyph($r('sys.symbol.chevron_left'))
              .fontSize(18)
              .fontColor([this.currentColors.textMuted])
          }
          .width(32)
          .height(32)
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
              this.showNewCollectionDialog = false;
            });
          })

          Blank()

          Text('新建合集')
            .fontSize($r('app.float.font_size_lg'))
            .fontWeight(FontWeight.Medium)
            .fontColor(this.currentColors.textMain)

          Blank()

          Text('创建')
            .fontSize($r('app.float.font_size_base'))
            .fontColor(this.newCollectionName.trim().length > 0 && this.newCollectionName.trim().length <= 10
              ? this.currentColors.primary : this.currentColors.textMuted)
            .onClick(() => this.createNewCollection())
        }
        .width('100%')
        .margin({ bottom: 20 })

        // 合集名称输入框
        TextInput({
          placeholder: '请输入合集名称（不多于 10 字）',
          text: this.newCollectionName
        })
          .width('100%')
          .height(48)
          .fontSize($r('app.float.font_size_base'))
          .backgroundColor(this.currentColors.bgMain)
          .borderRadius($r('app.float.border_radius_md'))
          .padding({ left: 12, right: 12 })
          .border({
            width: this.newCollectionName.length > 10 ? 1 : 0,
            color: this.newCollectionName.length > 10 ? '#FF4D4F' : Color.Transparent
          })
          .fontColor(this.newCollectionName.length > 10 ? '#FF4D4F' : this.currentColors.textMain)
          .onChange((value: string) => { this.newCollectionName = value; })
          .onSubmit(() => { this.createNewCollection(); })

        // 字数提示
        if (this.newCollectionName.length > 10) {
          Text('合集名称不能超过10个字')
            .fontSize($r('app.float.font_size_sm'))
            .fontColor('#FF4D4F')
            .width('100%')
            .margin({ top: 6 })
        }
      }
      .width('100%')
      .padding(20)
      .backgroundColor(this.currentColors.bgCard)
      .borderRadius({ topLeft: $r('app.float.border_radius_xl'), topRight: $r('app.float.border_radius_xl') })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#80000000')
    .justifyContent(FlexAlign.End)
    .onClick(() => {
      animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
        this.showNewCollectionDialog = false;
      });
    })
  }

  // ==================== 模板选择对话框 ====================

  @Builder
  TemplateChoiceDialog() {
    Column() {
      Blank()

      Column() {
        Text('发布新随手记')
          .fontSize($r('app.float.font_size_lg'))
          .fontWeight(FontWeight.Medium)
          .fontColor(this.currentColors.textMain)
          .margin({ bottom: 24 })

        Button() {
          Row() {
            SymbolGlyph($r('sys.symbol.doc_text'))
              .fontSize(20)
              .fontColor([this.currentColors.primary])
              .margin({ right: 8 })
            Text('我要自己写')
              .fontSize($r('app.float.font_size_base'))
              .fontColor(this.currentColors.textMain)
          }
        }
        .width('100%')
        .height(56)
        .backgroundColor(this.currentColors.bgMain)
        .borderRadius($r('app.float.border_radius_md'))
        .onClick(() => {
          this.showTemplateChoiceDialog = false;
          this.isAddMode = true;
          animateTo({ duration: 300, curve: Curve.EaseOut }, () => {
            this.showPublishDialog = true;
          });
        })

        Button() {
          Row() {
            SymbolGlyph($r('sys.symbol.square_grid_2x2'))
              .fontSize(20)
              .fontColor([this.currentColors.primary])
              .margin({ right: 8 })
            Text('我要用模板')
              .fontSize($r('app.float.font_size_base'))
              .fontColor(this.currentColors.textMain)
          }
        }
        .width('100%')
        .height(56)
        .backgroundColor(this.currentColors.bgMain)
        .borderRadius($r('app.float.border_radius_md'))
        .margin({ top: 12 })
        .onClick(() => {
          this.showTemplateChoiceDialog = false;
          animateTo({ duration: 250, curve: Curve.EaseOut }, () => {
            this.showTemplateListDropdown = true;
          });
        })

        Button('取消')
          .width('100%')
          .height(48)
          .fontSize($r('app.float.font_size_base'))
          .fontColor(this.currentColors.textMuted)
          .backgroundColor(Color.Transparent)
          .margin({ top: 16 })
          .onClick(() => {
            animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
              this.showTemplateChoiceDialog = false;
            });
          })
      }
      .width('85%')
      .padding(24)
      .backgroundColor(this.currentColors.bgCard)
      .borderRadius($r('app.float.border_radius_xl'))

      Blank()
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#80000000')
    .onClick(() => {
      animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
        this.showTemplateChoiceDialog = false;
      });
    })
  }

  // ==================== 模板列表下拉框 ====================

  @Builder
  TemplateListDropdown() {
    Column() {
      Blank()

      Column() {
        Row() {
          Button() {
            SymbolGlyph($r('sys.symbol.chevron_left'))
              .fontSize(18)
              .fontColor([this.currentColors.textMuted])
          }
          .width(32)
          .height(32)
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
              this.showTemplateListDropdown = false;
            });
            animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
              this.showTemplateChoiceDialog = true;
            });
          })

          Blank()

          Text('选择模板')
            .fontSize($r('app.float.font_size_lg'))
            .fontWeight(FontWeight.Medium)
            .fontColor(this.currentColors.textMain)

          Blank()

          Button() {
            SymbolGlyph($r('sys.symbol.xmark'))
              .fontSize(18)
              .fontColor([this.currentColors.textMuted])
          }
          .width(32)
          .height(32)
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
              this.showTemplateListDropdown = false;
            });
          })
        }
        .width('100%')
        .margin({ bottom: 20 })

        Row() {
          Text('💰').fontSize(22).margin({ right: 12 })
          Column() {
            Text('记账')
              .fontSize($r('app.float.font_size_base'))
              .fontColor(this.currentColors.textMain)
              .width('100%')
            Text('日期 · 地点 · 金额 · 物品')
              .fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted)
              .width('100%')
              .margin({ top: 2 })
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          SymbolGlyph($r('sys.symbol.chevron_right'))
            .fontSize(14)
            .fontColor([this.currentColors.textMuted])
        }
        .width('100%')
        .height(72)
        .padding({ left: 16, right: 16 })
        .backgroundColor(this.currentColors.bgMain)
        .borderRadius($r('app.float.border_radius_md'))
        .onClick(() => {
          this.showTemplateListDropdown = false;
          this.tplAccDate = DateUtils.getToday();
          animateTo({ duration: 300, curve: Curve.EaseOut }, () => {
            this.showTemplateAccountingDialog = true;
          });
        })

        Row() {
          Text('🍜').fontSize(22).margin({ right: 12 })
          Column() {
            Text('饮食')
              .fontSize($r('app.float.font_size_base'))
              .fontColor(this.currentColors.textMain)
              .width('100%')
            Text('日期 · 地点 · 金额 · 菜品 · 评价')
              .fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted)
              .width('100%')
              .margin({ top: 2 })
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          SymbolGlyph($r('sys.symbol.chevron_right'))
            .fontSize(14)
            .fontColor([this.currentColors.textMuted])
        }
        .width('100%')
        .height(72)
        .padding({ left: 16, right: 16 })
        .backgroundColor(this.currentColors.bgMain)
        .borderRadius($r('app.float.border_radius_md'))
        .margin({ top: 12 })
        .onClick(() => {
          this.showTemplateListDropdown = false;
          this.tplDinDate = DateUtils.getToday();
          animateTo({ duration: 300, curve: Curve.EaseOut }, () => {
            this.showTemplateDiningDialog = true;
          });
        })

        Row() {
          Text('🎬').fontSize(22).margin({ right: 12 })
          Column() {
            Text('观影')
              .fontSize($r('app.float.font_size_base'))
              .fontColor(this.currentColors.textMain)
              .width('100%')
            Text('影片名 · 影片类型 · 个人评分 · 观影体验')
              .fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted)
              .width('100%')
              .margin({ top: 2 })
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          SymbolGlyph($r('sys.symbol.chevron_right'))
            .fontSize(14)
            .fontColor([this.currentColors.textMuted])
        }
        .width('100%')
        .height(72)
        .padding({ left: 16, right: 16 })
        .backgroundColor(this.currentColors.bgMain)
        .borderRadius($r('app.float.border_radius_md'))
        .margin({ top: 12 })
        .onClick(() => {
          this.showTemplateListDropdown = false;
          animateTo({ duration: 300, curve: Curve.EaseOut }, () => {
            this.showTemplateMovieDialog = true;
          });
        })
      }
      .width('100%')
      .padding(20)
      .backgroundColor(this.currentColors.bgCard)
      .borderRadius({ topLeft: $r('app.float.border_radius_xl'), topRight: $r('app.float.border_radius_xl') })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#80000000')
    .justifyContent(FlexAlign.End)
    .onClick(() => {
      animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
        this.showTemplateListDropdown = false;
      });
    })
  }

  // ==================== 记账模板对话框 ====================

  @Builder
  TemplateAccountingDialog() {
    Column() {
      Row() {
        Button() {
          SymbolGlyph($r('sys.symbol.xmark'))
            .fontSize(18).fontColor([this.currentColors.textMuted])
        }
        .width(32).height(32).backgroundColor(Color.Transparent)
        .onClick(() => {
          animateTo({ duration: 250, curve: Curve.EaseIn }, () => {
            this.showTemplateAccountingDialog = false;
          });
          this.resetAccountingFields();
        })
        Blank()
        Text('💰 记账')
          .fontSize($r('app.float.font_size_lg'))
          .fontWeight(FontWeight.Medium)
          .fontColor(this.currentColors.textMain)
        Blank()
        Button('发布')
          .fontSize($r('app.float.font_size_sm')).fontColor(Color.White)
          .backgroundColor(this.tplAccDate && this.tplAccAmount && this.tplAccItem
            ? this.currentColors.primary : '#CCCCCC')
          .borderRadius(16).width(56).height(32)
          .onClick(() => { this.publishAccountingTemplate(); })
      }
      .width('100%').margin({ bottom: 4 })

      Scroll() {
        Column({ space: 16 }) {
          Column({ space: 6 }) {
            Text('日期 *').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextInput({ placeholder: 'YYYY-MM-DD', text: this.tplAccDate })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .onChange((v: string) => { this.tplAccDate = v; })
          }
          Column({ space: 6 }) {
            Text('地点').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextInput({ placeholder: '去哪shopping啦~', text: this.tplAccLocation })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .onChange((v: string) => { this.tplAccLocation = v; })
          }
          Column({ space: 6 }) {
            Text('金额 *').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextInput({ placeholder: '0.00', text: this.tplAccAmount })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .type(InputType.PhoneNumber)
              .onChange((v: string) => { this.tplAccAmount = v; })
          }
          Column({ space: 6 }) {
            Text('物品 *').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextInput({ placeholder: '让我看看买了什么！', text: this.tplAccItem })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .onChange((v: string) => { this.tplAccItem = v; })
          }
        }
        .width('100%')
      }
      .scrollBar(BarState.Off)
    }
    .width('100%').height('100%').padding(16)
    .backgroundColor(this.currentColors.bgCard)
  }

  // ==================== 饮食模板对话框 ====================

  @Builder
  TemplateDiningDialog() {
    Column() {
      Row() {
        Button() {
          SymbolGlyph($r('sys.symbol.xmark'))
            .fontSize(18).fontColor([this.currentColors.textMuted])
        }
        .width(32).height(32).backgroundColor(Color.Transparent)
        .onClick(() => {
          animateTo({ duration: 250, curve: Curve.EaseIn }, () => {
            this.showTemplateDiningDialog = false;
          });
          this.resetDiningFields();
        })
        Blank()
        Text('🍜 饮食')
          .fontSize($r('app.float.font_size_lg'))
          .fontWeight(FontWeight.Medium)
          .fontColor(this.currentColors.textMain)
        Blank()
        Button('发布')
          .fontSize($r('app.float.font_size_sm')).fontColor(Color.White)
          .backgroundColor(this.tplDinDate && this.tplDinDish
            ? this.currentColors.primary : '#CCCCCC')
          .borderRadius(16).width(56).height(32)
          .onClick(() => { this.publishDiningTemplate(); })
      }
      .width('100%').margin({ bottom: 8 })

      Scroll() {
        Column({ space: 16 }) {
          Column({ space: 6 }) {
            Text('日期 *').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextInput({ placeholder: 'YYYY-MM-DD', text: this.tplDinDate })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .onChange((v: string) => { this.tplDinDate = v; })
          }
          Column({ space: 6 }) {
            Text('地点').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextInput({ placeholder: '去哪里吃饭啦~', text: this.tplDinLocation })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .onChange((v: string) => { this.tplDinLocation = v; })
          }
          Column({ space: 6 }) {
            Text('金额').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextInput({ placeholder: '0.00', text: this.tplDinAmount })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .type(InputType.PhoneNumber)
              .onChange((v: string) => { this.tplDinAmount = v; })
          }
          Column({ space: 6 }) {
            Text('菜品 *').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextInput({ placeholder: '吃的啥！', text: this.tplDinDish })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .onChange((v: string) => { this.tplDinDish = v; })
          }
          Column({ space: 6 }) {
            Text('评价').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextArea({ placeholder: '好吃吗！', text: this.tplDinRating })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .height(88)
              .onChange((v: string) => { this.tplDinRating = v; })
          }

          Column({ space: 6 }) {
            Text('图片').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            Row() {
              Scroll() {
                Row({ space: 8 }) {
                  ForEach(this.tplDinMediaUris, (uri: string, index: number) => {
                    Stack() {
                      Image(uri).width(80).height(80).objectFit(ImageFit.Cover).borderRadius(6)
                      Button() {
                        SymbolGlyph($r('sys.symbol.xmark'))
                          .fontSize(10).fontColor([Color.White])
                      }
                      .width(18).height(18).backgroundColor('#80000000').borderRadius(9)
                      .position({ x: 0, y: 0 }).offset({ x: -4, y: -4 })
                      .onClick(() => this.removeDiningMedia(index))
                    }
                  })
                  if (this.tplDinMediaUris.length < 9) {
                    Row() {
                      Text('＋').fontSize(28).fontColor(this.currentColors.textMuted)
                    }
                    .width(80).height(80)
                    .border({ width: 1, color: this.currentColors.border })
                    .borderRadius(6).justifyContent(FlexAlign.Center)
                    .onClick(() => this.pickDiningMedia())
                  }
                }
              }
              .scrollable(ScrollDirection.Horizontal).scrollBar(BarState.Off)
            }
            .width('100%')
          }
        }
        .width('100%')
      }
      .layoutWeight(1).scrollBar(BarState.Off)
    }
    .width('100%').height('100%').padding(16)
    .backgroundColor(this.currentColors.bgCard)
  }

  // ==================== 观影模板对话框 ====================

  @Builder
  TemplateMovieDialog() {
    Column() {
      Row() {
        Button() {
          SymbolGlyph($r('sys.symbol.xmark'))
            .fontSize(18).fontColor([this.currentColors.textMuted])
        }
        .width(32).height(32).backgroundColor(Color.Transparent)
        .onClick(() => {
          animateTo({ duration: 250, curve: Curve.EaseIn }, () => {
            this.showTemplateMovieDialog = false;
          });
          this.resetMovieFields();
        })
        Blank()
        Text('🎬 观影')
          .fontSize($r('app.float.font_size_lg'))
          .fontWeight(FontWeight.Medium)
          .fontColor(this.currentColors.textMain)
        Blank()
        Button('发布')
          .fontSize($r('app.float.font_size_sm')).fontColor(Color.White)
          .backgroundColor(this.tplMovTitle
            ? this.currentColors.primary : '#CCCCCC')
          .borderRadius(16).width(56).height(32)
          .onClick(() => { this.publishMovieTemplate(); })
      }
      .width('100%').margin({ bottom: 8 })

      Scroll() {
        Column({ space: 16 }) {
          Column({ space: 6 }) {
            Text('影片名 *').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextInput({ placeholder: '电影/剧集名称', text: this.tplMovTitle })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .onChange((v: string) => { this.tplMovTitle = v; })
          }
          Column({ space: 6 }) {
            Text('影片类型').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextInput({ placeholder: '如：动作 / 科幻 / 爱情', text: this.tplMovGenre })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .onChange((v: string) => { this.tplMovGenre = v; })
          }
          Column({ space: 6 }) {
            Text('个人评分').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextInput({ placeholder: '如：8.5 / 10', text: this.tplMovScore })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .onChange((v: string) => { this.tplMovScore = v; })
          }
          Column({ space: 6 }) {
            Text('观影体验').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            TextArea({ placeholder: '好看不！', text: this.tplMovExperience })
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .height(120)
              .onChange((v: string) => { this.tplMovExperience = v; })
          }

          Column({ space: 6 }) {
            Text('图片').fontSize($r('app.float.font_size_sm'))
              .fontColor(this.currentColors.textMuted).width('100%')
            Row() {
              Scroll() {
                Row({ space: 8 }) {
                  ForEach(this.tplMovMediaUris, (uri: string, index: number) => {
                    Stack() {
                      Image(uri).width(80).height(80).objectFit(ImageFit.Cover).borderRadius(6)
                      Button() {
                        SymbolGlyph($r('sys.symbol.xmark'))
                          .fontSize(10).fontColor([Color.White])
                      }
                      .width(18).height(18).backgroundColor('#80000000').borderRadius(9)
                      .position({ x: 0, y: 0 }).offset({ x: -4, y: -4 })
                      .onClick(() => this.removeMovieMedia(index))
                    }
                  })
                  if (this.tplMovMediaUris.length < 9) {
                    Row() {
                      Text('＋').fontSize(28).fontColor(this.currentColors.textMuted)
                    }
                    .width(80).height(80)
                    .border({ width: 1, color: this.currentColors.border })
                    .borderRadius(6).justifyContent(FlexAlign.Center)
                    .onClick(() => this.pickMovieMedia())
                  }
                }
              }
              .scrollable(ScrollDirection.Horizontal).scrollBar(BarState.Off)
            }
            .width('100%')
          }
        }
        .width('100%')
      }
      .layoutWeight(1).scrollBar(BarState.Off)
    }
    .width('100%').height('100%').padding(16)
    .backgroundColor(this.currentColors.bgCard)
  }

  // ==================== 合集命名对话框 ====================

  @Builder
  CollectionDialog() {
    Column() {
      Blank()

      Column() {
        // 标题栏：已选定 n 条  添加到  [X]
        Row() {
          Text(`已选定 ${this.selectedMomentIds.size} 条  添加到`)
            .fontSize($r('app.float.font_size_lg'))
            .fontWeight(FontWeight.Medium)
            .fontColor(this.currentColors.textMain)

          Blank()

          Button() {
            SymbolGlyph($r('sys.symbol.xmark'))
              .fontSize(18)
              .fontColor([this.currentColors.textMuted])
          }
          .width(32)
          .height(32)
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
              this.showCollectionDialog = false;
            });
          })
        }
        .width('100%')
        .margin({ bottom: 20 })

        // 新建合集行（与合集列表样式一致，前面加 +）
        Row() {
          Text('＋新建合集')
            .fontSize($r('app.float.font_size_base'))
            .fontColor(this.currentColors.textMain)
        }
        .width('100%')
        .height(44)
        .padding({ left: 12, right: 12 })
        .backgroundColor(this.currentColors.bgMain)
        .borderRadius($r('app.float.border_radius_md'))
        .margin({ bottom: 8 })
        .onClick(() => {
          this.showCollectionDialog = false;
          this.newCollectionName = '';
          animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
            this.showNewCollectionDialog = true;
          });
        })

        // 已有合集列表
        if (this.collections.length > 0) {
          Column({ space: 4 }) {
            ForEach(this.collections, (collection: string) => {
              Row() {
                Text(collection)
                  .fontSize($r('app.float.font_size_base'))
                  .fontColor(this.currentColors.textMain)
                Blank()
                Text(`${this.moments.filter((m) => m.category === collection).length}条`)
                  .fontSize($r('app.float.font_size_sm'))
                  .fontColor(this.currentColors.textMuted)
              }
              .width('100%')
              .height(44)
              .padding({ left: 12, right: 12 })
              .backgroundColor(this.currentColors.bgMain)
              .borderRadius($r('app.float.border_radius_md'))
              .onClick(() => {
                this.addSelectedToCollection(collection);
              })
            })
          }
          .width('100%')
        } else {
          Text('暂无合集，点击上方按钮创建')
            .fontSize($r('app.float.font_size_sm'))
            .fontColor(this.currentColors.textMuted)
            .width('100%')
            .textAlign(TextAlign.Center)
            .margin({ top: 8 })
        }
      }
      .width('100%')
      .padding(20)
      .backgroundColor(this.currentColors.bgCard)
      .borderRadius({ topLeft: $r('app.float.border_radius_xl'), topRight: $r('app.float.border_radius_xl') })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#80000000')
    .justifyContent(FlexAlign.End)
    .onClick(() => {
      animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
        this.showCollectionDialog = false;
      });
    })
  }

  // ==================== 多选底部操作栏 ====================

  @Builder
  MultiSelectBottomBar() {
    Row() {
      Column() {
        // 添加到（合集）
        Button() {
          Column({ space: 2 }) {
            SymbolGlyph($r('sys.symbol.folder'))
              .fontSize(18)
              .fontColor([this.currentColors.primary])
            Text($r('app.string.moment_add_to_collection'))
              .fontSize($r('app.float.font_size_xs'))
              .fontColor(this.currentColors.primary)
          }
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        }
        .layoutWeight(1)
        .height('100%')
        .backgroundColor(Color.Transparent)
        .onClick(() => this.showCreateCollectionDialog())
      }
      .layoutWeight(1)
      .height('100%')
      .justifyContent(FlexAlign.Center)

      // 分隔线
      Divider()
        .vertical(true)
        .height(28)
        .color(this.currentColors.border)

      Column() {
        // 删除
        Button() {
          Column({ space: 2 }) {
            SymbolGlyph($r('sys.symbol.trash'))
              .fontSize(18)
              .fontColor(['#FF4D4F'])
            Text($r('app.string.moment_delete_selected'))
              .fontSize($r('app.float.font_size_xs'))
              .fontColor('#FF4D4F')
          }
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        }
        .layoutWeight(1)
        .height('100%')
        .backgroundColor(Color.Transparent)
        .onClick(() => this.showDeleteConfirm())
      }
      .layoutWeight(1)
      .height('100%')
      .justifyContent(FlexAlign.Center)

      // 分隔线
      Divider()
        .vertical(true)
        .height(28)
        .color(this.currentColors.border)

      Column() {
        // 制作手账
        Button() {
          Column({ space: 2 }) {
            SymbolGlyph($r('sys.symbol.wand_and_stars'))
              .fontSize(18)
              .fontColor([this.currentColors.primary])
            Text($r('app.string.moment_make_plog'))
              .fontSize($r('app.float.font_size_xs'))
              .fontColor(this.currentColors.primary)
          }
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        }
        .layoutWeight(1)
        .height('100%')
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          if (this.isMultiSelectMode && this.selectedMomentIds.size > 0) {
            this.generatePlogFromSelected();
          } else {
            this.generatePlogFromToday();
          }
        })
      }
      .layoutWeight(1)
      .height('100%')
      .justifyContent(FlexAlign.Center)
    }
    .width('100%')
    .height(56)
    .backgroundColor(this.currentColors.bgCard)
    .borderRadius({ topLeft: $r('app.float.border_radius_lg'), topRight: $r('app.float.border_radius_lg') })
    .shadow({ radius: 8, color: '#15000000', offsetX: 0, offsetY: -2 })
    .zIndex(100)
  }

  // ==================== 更多下拉菜单 ====================

  @Builder
  MoreDropdownMenu() {
    Column() {
      // 小三角箭头（指向更多按钮）
      Row() {
        Blank()
        Column()
          .width(8)
          .height(8)
          .backgroundColor(this.currentColors.bgCard)
          .rotate({ angle: 45 })
          .margin({ top: -4, right: 14 })
      }
      .width('100%')
      .height(0)

      // 合集选项
      Row({ space: 10 }) {
        SymbolGlyph($r('sys.symbol.folder'))
          .fontSize(15)
          .fontColor([this.currentColors.textMuted])
        Text($r('app.string.moment_more_collections'))
          .fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMain)
      }
      .width('100%')
      .height(40)
      .padding({ left: 14, right: 14 })
      .borderRadius({ topLeft: 12, topRight: 12 })
      .stateStyles({
        pressed: {
          .backgroundColor('#F0F0F0')
        },
        normal: {
          .backgroundColor(Color.Transparent)
        }
      })
      .onClick(() => {
        this.showMoreDropdown = false;
        this.navigateToCollections();
      })

      Divider()
        .strokeWidth(0.5)
        .color(this.currentColors.border)
        .margin({ left: 14, right: 14 })

      // 手账本选项
      Row({ space: 10 }) {
        SymbolGlyph($r('sys.symbol.book'))
          .fontSize(15)
          .fontColor([this.currentColors.textMuted])
        Text($r('app.string.moment_more_plog_book'))
          .fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMain)
      }
      .width('100%')
      .height(40)
      .padding({ left: 14, right: 14 })
      .borderRadius({ bottomLeft: 12, bottomRight: 12 })
      .stateStyles({
        pressed: {
          .backgroundColor('#F0F0F0')
        },
        normal: {
          .backgroundColor(Color.Transparent)
        }
      })
      .onClick(() => {
        this.showMoreDropdown = false;
        this.navigateToPlogGallery();
      })
    }
    .width(140)
    .backgroundColor(this.currentColors.bgCard)
    .borderRadius(12)
    .shadow({ radius: 12, color: '#15000000', offsetX: 0, offsetY: 6 })
  }

  // ==================== 删除确认对话框 ====================

  @Builder
  DeleteConfirmDialog() {
    Column() {
      Blank()

      Column() {
        // 标题
        Text($r('app.string.moment_delete_confirm_title'))
          .fontSize($r('app.float.font_size_lg'))
          .fontWeight(FontWeight.Medium)
          .fontColor('#FF4D4F')
          .margin({ bottom: 12 })

        // 确认内容
        Text(`确定要删除选中的 ${this.pendingDeleteCount} 条记录吗？此操作不可恢复。`)
          .fontSize($r('app.float.font_size_base'))
          .fontColor(this.currentColors.textMuted)
          .textAlign(TextAlign.Center)
          .lineHeight(22)
          .margin({ bottom: 20 })

        // 按钮行
        Row() {
          Button($r('app.string.setting_cancel'))
            .layoutWeight(1)
            .height(40)
            .backgroundColor(this.currentColors.bgMain)
            .fontColor(this.currentColors.textMain)
            .borderRadius($r('app.float.border_radius_md'))
            .onClick(() => {
              animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                this.showDeleteConfirmDialog = false;
              });
              this.pendingDeleteCount = 0;
            })

          Button($r('app.string.setting_confirm'))
            .layoutWeight(1)
            .height(40)
            .backgroundColor('#FF4D4F')
            .fontColor(Color.White)
            .borderRadius($r('app.float.border_radius_md'))
            .margin({ left: 12 })
            .onClick(() => {
              animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                this.showDeleteConfirmDialog = false;
              });
              this.confirmDeleteSelectedMoments();
            })
        }
        .width('100%')
      }
      .width('85%')
      .padding(24)
      .backgroundColor(this.currentColors.bgCard)
      .borderRadius($r('app.float.border_radius_xl'))

      Blank()
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#80000000')
    .onClick(() => {
      animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
        this.showDeleteConfirmDialog = false;
      });
      this.pendingDeleteCount = 0;
    })
  }

  // ==================== Todo 编辑工具栏（键盘上方） ====================

  @Builder
  EditingToolbar() {
    Column() {
      // 时间选择器（展开时）
      if (this.showRemindPicker) {
        this.RemindTimePicker()
      }

      // 标签输入框（展开时）
      if (this.showTagInput) {
        this.TagInputView()
      }

      // 工具栏图标行：日历 / 定位 / 标签 / 旗帜 / 相机
      Row() {
        // 日历图标（提醒时间）
        Button() {
          SymbolGlyph($r('sys.symbol.calendar'))
            .fontSize(22)
            .fontColor([this.showRemindPicker ? this.currentColors.primary : this.currentColors.textMuted])
        }
        .width(44)
        .height(44)
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          this.showRemindPicker = !this.showRemindPicker;
          this.showTagInput = false;
        })

        // 定位图标
        Button() {
          Text('📍')
            .fontSize(22)
            .fontColor(this.getEditingTodo()?.location ? this.currentColors.primary : this.currentColors.textMuted)
        }
        .width(44)
        .height(44)
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          this.setTodoLocation('此刻位置');
        })

        // 标签图标 (#)
        Button() {
          Text('#')
            .fontSize(22)
            .fontColor(this.getEditingTodo()?.tag ? this.currentColors.primary : this.currentColors.textMuted)
        }
        .width(44)
        .height(44)
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          this.showTagInput = !this.showTagInput;
          this.showRemindPicker = false;
          if (this.showTagInput) {
            this.tagInputBuffer = this.getEditingTodo()?.tag || '';
          }
        })

        // 旗帜图标
        Button() {
          SymbolGlyph($r('sys.symbol.flag'))
            .fontSize(22)
            .fontColor([this.getEditingTodo()?.flagged ? this.currentColors.primary : this.currentColors.textMuted])
        }
        .width(44)
        .height(44)
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          this.toggleTodoFlagged();
        })

        Blank()

        // 相机图标
        Button() {
          SymbolGlyph($r('sys.symbol.camera'))
            .fontSize(22)
            .fontColor([this.getEditingTodo()?.imageUris ? this.currentColors.primary : this.currentColors.textMuted])
        }
        .width(44)
        .height(44)
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          this.pickTodoImage();
        })
      }
      .width('100%')
      .padding({ left: 8, right: 8, top: 4, bottom: 4 })
      .backgroundColor(this.currentColors.bgMain)
    }
    .width('100%')
    .backgroundColor(this.currentColors.bgMain)
  }

  /**
   * 标签输入框
   */
  @Builder
  TagInputView() {
    Row() {
      TextInput({ text: this.tagInputBuffer, placeholder: '输入标签...' })
        .fontSize(14)
        .fontColor(this.currentColors.textMain)
        .backgroundColor(Color.Transparent)
        .padding(0)
        .layoutWeight(1)
        .height(36)
        .onChange((value: string) => {
          this.tagInputBuffer = value;
        })
        .onSubmit(() => {
          this.setTodoTag(this.tagInputBuffer.trim());
        })

      Button() {
        SymbolGlyph($r('sys.symbol.checkmark'))
          .fontSize(18)
          .fontColor([this.currentColors.primary])
      }
      .width(36)
      .height(36)
      .backgroundColor(Color.Transparent)
      .onClick(() => {
        this.setTodoTag(this.tagInputBuffer.trim());
      })
    }
    .width('100%')
    .padding({ left: 16, right: 8, top: 4, bottom: 4 })
    .backgroundColor(this.currentColors.bgMain)
  }

  /**
   * 提醒时间选择器
   */
  @Builder
  RemindTimePicker() {
    Row({ space: 8 }) {
      ForEach(['08:00', '09:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'], (time: string) => {
        Button(time)
          .fontSize($r('app.float.font_size_xs'))
          .fontColor(this.currentColors.textMain)
          .backgroundColor(this.currentColors.bgMain)
          .borderRadius($r('app.float.border_radius_md'))
          .height(32)
          .padding({ left: 8, right: 8 })
          .onClick(() => {
            const parts = time.split(':');
            this.setRemindTime(parseInt(parts[0]), parseInt(parts[1]));
          })
      })

      Button($r('app.string.todo_no_remind'))
        .fontSize($r('app.float.font_size_xs'))
        .fontColor(this.currentColors.textMuted)
        .backgroundColor(this.currentColors.bgMain)
        .borderRadius($r('app.float.border_radius_md'))
        .height(32)
        .padding({ left: 8, right: 8 })
        .onClick(() => {
          const index = this.todos.findIndex(t => t.id === this.editingTodoId);
          if (index > -1) {
            // 1. 直接获取原有的 todoitem 引用
            let currentItem = this.todos[index];

            // 2. 直接修改你需要的字段（无需管其他字段）
            currentItem.remindTime = 0;

            // 3. 用 splice 原地替换自己，这行代码的作用是专门用来“踹”一脚 ArkUI，让它刷新列表
            this.todos.splice(index, 1, currentItem);
          }
          this.showRemindPicker = false;
        })
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 4, bottom: 8 })
  }
}

export default HomePage;
