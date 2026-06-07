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

/**
 * 首页 - 带底部导航栏的主页面
 * 包含 Todo（待办）、Plog/随手记、Setting（设置）三个Tab
 */
@Entry
@Component
struct HomePage {
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
  @State isManageMode: boolean = false;
  @State selectedMomentIds: Set<number> = new Set();
  @State showCollectionDialog: boolean = false;
  @State collectionName: string = '';

  // ---- Plog 状态 ----
  @State plogs: PlogCanvas[] = [];
  @State plogsLoading: boolean = false;

  aboutToAppear(): void {
    this.loadTodos();
    this.loadMonthCalendar();
  }

  onPageShow(): void {
    if (this.currentTabIndex === 1) {
      this.loadMoments();
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
      this.moments = result.sort((a, b) => a.timestamp - b.timestamp);
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

  // ---- 管理模式 ----
  toggleManageMode(): void {
    this.isManageMode = !this.isManageMode;
    this.selectedMomentIds.clear();
  }

  toggleMomentSelection(id: number): void {
    if (this.selectedMomentIds.has(id)) {
      this.selectedMomentIds.delete(id);
    } else {
      this.selectedMomentIds.add(id);
    }
  }

  async deleteSelectedMoments(): Promise<void> {
    if (this.selectedMomentIds.size === 0) return;
    try {
      for (const id of this.selectedMomentIds) {
        await DiaryViewModel.deletePost(id);
      }
      this.selectedMomentIds.clear();
      this.isManageMode = false;
      await this.loadMoments();
      promptAction.showToast({ message: '已删除' });
    } catch (error) {
      console.error('删除失败:', error);
    }
  }

  // ---- 合集相关 ----
  showCreateCollectionDialog(): void {
    if (this.selectedMomentIds.size === 0) {
      promptAction.showToast({ message: '请先选择要整理的记录' });
      return;
    }
    this.collectionName = '';
    this.showCollectionDialog = true;
  }

  async createCollection(): Promise<void> {
    if (!this.collectionName.trim()) {
      return;
    }
    try {
      // 将选中的随手记归类到一个合集（通过 category 字段存储合集名）
      for (const id of this.selectedMomentIds) {
        await DiaryViewModel.updatePostCategory(id, this.collectionName.trim());
      }
      this.selectedMomentIds.clear();
      this.isManageMode = false;
      this.showCollectionDialog = false;
      await this.loadMoments();
      promptAction.showToast({ message: $r('app.string.moment_collection_created') });
    } catch (error) {
      console.error('创建合集失败:', error);
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

      // 检查是否已有今日手账
      const existingPlog = await PlogViewModel.getPlogByDate(today);

      if (existingPlog && existingPlog.id !== 0) {
        // 追加元素到现有手账
        const currentElements = existingPlog.elements || [];
        const startIndex = currentElements.length;
        imageUris.forEach((uri, idx) => {
          currentElements.push({
            type: 'image',
            x: 20 + ((startIndex + idx) % 3) * 120,
            y: 100 + Math.floor((startIndex + idx) / 3) * 150,
            width: 100,
            height: 100,
            rotation: 0,
            content: uri,
            zIndex: startIndex + idx
          });
        });
        existingPlog.elements = currentElements;
        await PlogViewModel.updatePlog(existingPlog);
      } else {
        // 创建新手账
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
          createdAt: Date.now(),
          thumbnail: imageUris.length > 0 ? imageUris[0] : ''
        };
        await PlogViewModel.createPlog(insertParams);
      }

      promptAction.showToast({ message: $r('app.string.plog_generate_success') });
    } catch (error) {
      console.error('生成手账失败:', error);
    }
  }

  navigateToPlogEditor(): void {
    router.pushUrl({ url: 'pages/PlogEditorPage' });
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
      .barHeight(56)
      .barBackgroundColor($r('app.color.card_background'))
      .animationDuration(200)
      .onChange((index: number) => {
        this.currentTabIndex = index;
      })
      .width('100%')
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
  }

  // ==================== TabBar 构建器 ====================

  @Builder
  TabBarBuilder(index: number) {
    Column() {
      SymbolGlyph(this.currentTabIndex === index ? this.tabIconsActive[index] : this.tabIcons[index])
        .fontSize(24)
        .fontColor([$r('app.color.primary_color'), $r('app.color.primary_color'), $r('app.color.primary_color')])
        .renderingStrategy(SymbolRenderingStrategy.MULTIPLE_OPACITY)
        .effectStrategy(SymbolEffectStrategy.HIERARCHICAL)

      Text(this.tabTitles[index])
        .fontSize(10)
        .fontColor(this.currentTabIndex === index ? $r('app.color.primary_color') : $r('app.color.text_hint'))
        .margin({ top: 2 })
    }
    .width('100%')
    .height('100%')
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
              .fontColor($r('app.color.text_primary'))
            Blank()
            Button({ type: ButtonType.Circle }) {
              SymbolGlyph($r('sys.symbol.chevron_down'))
                .fontSize(18)
                .fontColor([$r('app.color.text_secondary')])
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
            onDateSelected: (date: string) => this.onDateSelected(date)
          })
            .margin({ top: 8, left: 16, right: 16 })

          // 3. 月日历展开
          if (this.isCalendarExpanded) {
            MonthCalendarComponent({
              calendar: this.monthCalendar,
              selectedDate: this.selectedDate,
              eventDates: this.eventDates,
              onDateSelected: (date: string) => {
                this.onDateSelected(date);
                this.toggleCalendar();
              }
            })
              .margin({ top: 12, left: 16, right: 16 })
          }

          Divider()
            .color($r('app.color.divider_color'))
            .margin({ top: this.isCalendarExpanded ? 12 : 8, bottom: 8 })

          // 4. 标题栏：提醒（iOS 风格大标题）
          Row() {
            Text('提醒')
              .fontSize(32)
              .fontWeight(FontWeight.Bold)
              .fontColor('#FF9500')
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
                Text('今天还没有任务').fontSize($r('app.float.font_size_base')).fontColor($r('app.color.text_hint'))
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
            }
          }
        }
        .width('100%')
        .height('100%')
        .backgroundColor($r('app.color.background_color'))

        // 悬浮加号按钮（只在非编辑态显示，隶属于 Stack 右下角）
        if (this.editingTodoId === 0) {
          Button({ type: ButtonType.Circle }) {
            Text('+').fontSize(36).fontColor(Color.White)
          }
          .width(56)
          .height(56)
          .backgroundColor($r('app.color.primary_color'))
          .margin({ right: 24, bottom: 24 })
          .shadow({ radius: 8, color: '#30000000', offsetX: 0, offsetY: 4 })
          .zIndex(999)
          .onClick(() => { this.addBlankTodo(); })
        }

      } // 👈 Stack 闭合
      .width('100%')
      .layoutWeight(1) // 🚨 关键：强制占满剩余空间，当键盘弹出时，这个 Stack 会被压扁，从而腾出空间给下方的工具栏！

      // 💡 核心点 2：把你的 `EditingToolbar()` 彻底解放出来，放到 Stack 的正下方、大 Column 的最底部！
      if (this.editingTodoId > 0) {
        this.EditingToolbar()
      }

    } // 👈 最外层大 Column 闭合
    .width('100%')
    .height('100%')
    // 🚨 核心点 3：只挂在最外层容器上！指示整个页面在软键盘弹起时，底部边界跟随键盘顶起，实现完美吸附
    .expandSafeArea([SafeAreaType.KEYBOARD], [SafeAreaEdge.BOTTOM])
  }

  @Builder
  MomentContent() {
    Stack({ alignContent: Alignment.BottomEnd }){
      Column() {
        // 标题栏 + 管理按钮
        Row() {
          Text($r('app.string.moment_title'))
            .fontSize($r('app.float.font_size_xxl'))
            .fontWeight(FontWeight.Bold)
            .fontColor($r('app.color.text_primary'))

          Blank()

          // 管理模式取消
          if (this.isManageMode) {
            Button('取消')
              .fontSize($r('app.float.font_size_sm'))
              .backgroundColor(Color.Transparent)
              .fontColor($r('app.color.primary_color'))
              .onClick(() => this.toggleManageMode())
              .margin({ right: 8 })

            Button('删除')
              .fontSize($r('app.float.font_size_sm'))
              .backgroundColor('#FF4D4F')
              .fontColor(Color.White)
              .borderRadius($r('app.float.border_radius_md'))
              .onClick(() => this.deleteSelectedMoments())
          } else {
            Button() {
              SymbolGlyph($r('sys.symbol.ellipsis_circle'))
                .fontSize(22)
                .fontColor([$r('app.color.text_secondary')])
            }
            .width(36)
            .height(36)
            .backgroundColor(Color.Transparent)
            .onClick(() => this.toggleManageMode())
          }
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16, bottom: 4 })

        // 功能按钮栏
        Row({ space: 8 }) {
          // 整理合集
          Button() {
            Row({ space: 4 }) {
              SymbolGlyph($r('sys.symbol.folder'))
                .fontSize(16)
                .fontColor([$r('app.color.primary_color')])
              Text($r('app.string.moment_organize_collection'))
                .fontSize($r('app.float.font_size_xs'))
                .fontColor($r('app.color.primary_color'))
            }
          }
          .height(32)
          .backgroundColor('#FFF5F0')
          .borderRadius($r('app.float.border_radius_md'))
          .onClick(() => this.showCreateCollectionDialog())

          // 我的合集
          Button() {
            Row({ space: 4 }) {
              SymbolGlyph($r('app.media.icon'))
                .fontSize(16)
                .fontColor([$r('app.color.secondary_color')])
              Text($r('app.string.moment_view_collections'))
                .fontSize($r('app.float.font_size_xs'))
                .fontColor($r('app.color.secondary_color'))
            }
          }
          .height(32)
          .backgroundColor('#F0F5FF')
          .borderRadius($r('app.float.border_radius_md'))
          .onClick(() => this.navigateToCollections())

          Blank()

          // 生成手账
          Button() {
            Row({ space: 4 }) {
              SymbolGlyph($r('sys.symbol.wand_and_stars'))
                .fontSize(16)
                .fontColor([Color.White])
              Text($r('app.string.moment_to_plog'))
                .fontSize($r('app.float.font_size_xs'))
                .fontColor(Color.White)
            }
          }
          .height(32)
          .backgroundColor($r('app.color.primary_color'))
          .borderRadius($r('app.float.border_radius_md'))
          .onClick(() => this.generatePlogFromToday())

          // 手账本
          Button() {
            Row({ space: 4 }) {
              SymbolGlyph($r('app.media.icon'))
                .fontSize(16)
                .fontColor([$r('app.color.secondary_color')])
              Text($r('app.string.moment_view_plog'))
                .fontSize($r('app.float.font_size_xs'))
                .fontColor($r('app.color.secondary_color'))
            }
          }
          .height(32)
          .backgroundColor('#F0F5FF')
          .borderRadius($r('app.float.border_radius_md'))
          .onClick(() => this.navigateToPlogGallery())
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 4, bottom: 8 })

        Divider()
          .color($r('app.color.divider_color'))

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
              .fontColor($r('app.color.text_hint'))
            Text($r('app.string.moment_no_posts_hint'))
              .fontSize($r('app.float.font_size_sm'))
              .fontColor($r('app.color.text_hint'))
              .margin({ top: 4 })
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        } else {
          Scroll() {
            Column() {
              ForEach(this.moments, (moment: DiaryPost) => {
                this.MomentCard(moment)
              }, (moment: DiaryPost) => moment.id.toString())
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 16, bottom: 100 }) // 💡 顶部给个 16vp 间距，底部多留点空间防止被悬浮按钮挡住
            .justifyContent(FlexAlign.Start) // 💡 强制所有卡片从最顶部开始靠齐，绝不居中或者留空
          }
          .width('100%')
          .layoutWeight(1)
          .align(Alignment.Top) // 💡 确保 Scroll 容器自身对齐也是置顶的
          .scrollBar(BarState.Off)
          .edgeEffect(EdgeEffect.Spring)
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor($r('app.color.background_color'))
      // 悬浮发布按钮
      if (!this.isManageMode) {
        Button({ type: ButtonType.Circle }) {
          // 💡 放弃按钮默认对齐，改用 Flex 容器强行把文本压在正中心
          Flex({
            direction: FlexDirection.Row,
            justifyContent: FlexAlign.Center,
            alignItems: ItemAlign.Center
          }) {
            Text('+')
              .fontSize(40) // 稍微收敛一点字号，防止字体过大挤压变形
              .fontColor(Color.White)
              .fontWeight(FontWeight.Lighter) // 用细体或者常规体，视觉上更容易居中
              // 💡 核心：利用 offset 补偿字体的垂直偏斜！
              // 如果你觉得它还是稍微偏下偏右，就把这两个值调成负数（比如 x: -1, y: -2）
              .offset({ x: 1, y: -2 })
          }
          .width('100%')
          .height('100%')
        }
        .width(56)
        .height(56)
        .backgroundColor($r('app.color.primary_color'))
        .margin({ right: 24, bottom: 24 })
        .shadow({ radius: 8, color: '#30000000', offsetX: 0, offsetY: 4 })
        .zIndex(999)
        .hitTestBehavior(HitTestMode.Block)
        .onClick(() => { this.showPublishDialog = true; })
      }

      // 发布对话框
      if (this.showPublishDialog) {
        this.PublishDialog()
      }

      // 合集命名对话框
      if (this.showCollectionDialog) {
        this.CollectionDialog()
      }
    }
    .width('100%')
    .height('100%')
  }

  // ==================== 随手记卡片组件 ====================

  @Builder
  MomentCard(moment: DiaryPost) {
    Column() {
      // 头部：时间和位置
      Row() {
        Text(DateUtils.formatTime(moment.timestamp))
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.text_secondary'))

        if (moment.location) {
          Text(`📍 ${moment.location}`)
            .fontSize($r('app.float.font_size_sm'))
            .fontColor($r('app.color.text_hint'))
            .margin({ left: 12 })
        }

        Blank()

        // 选择框（管理模式）
        if (this.isManageMode) {
          SymbolGlyph(this.selectedMomentIds.has(moment.id) ?
            $r('sys.symbol.checkmark_circle_fill') : $r('sys.symbol.circle'))
            .fontSize(22)
            .fontColor(this.selectedMomentIds.has(moment.id) ?
              [$r('app.color.primary_color')] : [$r('app.color.text_hint')])
        }
      }
      .width('100%')
      .margin({ bottom: 8 })

      // 文字内容
      if (moment.content) {
        Text(moment.content)
          .fontSize($r('app.float.font_size_base'))
          .fontColor($r('app.color.text_primary'))
          .lineHeight(24)
          .width('100%')
          .margin({ bottom: moment.mediaUrls && moment.mediaUrls.length > 0 ? 12 : 0 })
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
    .backgroundColor($r('app.color.card_background'))
    .borderRadius($r('app.float.border_radius_lg'))
    .margin({ bottom: 12 })
    .shadow({ radius: 4, color: '#08000000', offsetX: 0, offsetY: 2 })
    .onClick(() => {
      if (this.isManageMode) {
        this.toggleMomentSelection(moment.id);
      }
    })
  }

  // ==================== 发布对话框 ====================

  @Builder
  PublishDialog() {
    Column() {
      Blank()

      Column() {
        // 对话框标题
        Row() {
          Text('发布随手记')
            .fontSize($r('app.float.font_size_lg'))
            .fontWeight(FontWeight.Medium)
            .fontColor($r('app.color.text_primary'))

          Blank()

          Button() {
            SymbolGlyph($r('sys.symbol.xmark'))
              .fontSize(18)
              .fontColor([$r('app.color.text_secondary')])
          }
          .width(32)
          .height(32)
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            this.showPublishDialog = false;
            this.newPostContent = '';
            this.newPostMediaUris = [];
            this.newPostLocation = '';
          })
        }
        .width('100%')
        .margin({ bottom: 16 })

        // 文字输入区
        TextArea({ placeholder: $r('app.string.moment_post_placeholder'), text: this.newPostContent })
          .width('100%')
          .height(120)
          .fontSize($r('app.float.font_size_base'))
          .backgroundColor($r('app.color.background_color'))
          .borderRadius($r('app.float.border_radius_md'))
          .padding(12)
          .onChange((value: string) => { this.newPostContent = value; })

        // 已选媒体预览
        if (this.newPostMediaUris.length > 0) {
          Row() {
            Scroll() {
              Row({ space: 8 }) {
                ForEach(this.newPostMediaUris, (uri: string, index: number) => {
                  Stack() {
                    Image(uri)
                      .width(72)
                      .height(72)
                      .objectFit(ImageFit.Cover)
                      .borderRadius($r('app.float.border_radius_sm'))

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
                    .offset({ x: -6, y: -6 })
                    .onClick(() => this.removeMedia(index))
                  }
                })
              }
            }
            .scrollable(ScrollDirection.Horizontal)
            .scrollBar(BarState.Off)
          }
          .width('100%')
          .margin({ top: 12 })
        }

        // 操作按钮行
        Row({ space: 16 }) {
          // 添加照片/视频
          Button() {
            Row({ space: 6 }) {
              SymbolGlyph($r('app.media.icon'))
                .fontSize(16)
                .fontColor([$r('app.color.text_secondary')])
              Text($r('app.string.moment_add_photo'))
                .fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary'))
            }
          }
          .backgroundColor($r('app.color.background_color'))
          .borderRadius($r('app.float.border_radius_md'))
          .onClick(() => this.pickMedia())

          // 添加位置
          Button() {
            Row({ space: 6 }) {
              SymbolGlyph($r('app.media.icon'))
                .fontSize(16)
                .fontColor(this.newPostLocation ? [$r('app.color.primary_color')] : [$r('app.color.text_secondary')])
              Text(this.newPostLocation ? `📍 ${this.newPostLocation}` : $r('app.string.moment_add_location'))
                .fontSize($r('app.float.font_size_sm'))
                .fontColor(this.newPostLocation ? $r('app.color.primary_color') : $r('app.color.text_secondary'))
            }
          }
          .backgroundColor($r('app.color.background_color'))
          .borderRadius($r('app.float.border_radius_md'))
          .onClick(() => {
            // 模拟定位，实际可接入定位服务
            this.newPostLocation = '此刻位置';
          })

          Blank()

          // 发布按钮
          Button($r('app.string.moment_publish'))
            .fontSize($r('app.float.font_size_base'))
            .fontColor(Color.White)
            .backgroundColor($r('app.color.primary_color'))
            .borderRadius($r('app.float.border_radius_lg'))
            .padding({ left: 20, right: 20 })
            .onClick(() => this.publishMoment())
        }
        .width('100%')
        .margin({ top: 16 })
      }
      .width('90%')
      .padding(20)
      .backgroundColor($r('app.color.card_background'))
      .borderRadius($r('app.float.border_radius_xl'))
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#80000000')
    .onClick(() => {
      this.showPublishDialog = false;
      this.newPostContent = '';
      this.newPostMediaUris = [];
      this.newPostLocation = '';
    })
  }

  // ==================== 合集命名对话框 ====================

  @Builder
  CollectionDialog() {
    Column() {
      Blank()

      Column() {
        Row() {
          Text($r('app.string.moment_create_collection'))
            .fontSize($r('app.float.font_size_lg'))
            .fontWeight(FontWeight.Medium)
            .fontColor($r('app.color.text_primary'))

          Blank()

          Button() {
            SymbolGlyph($r('sys.symbol.xmark'))
              .fontSize(18)
              .fontColor([$r('app.color.text_secondary')])
          }
          .width(32)
          .height(32)
          .backgroundColor(Color.Transparent)
          .onClick(() => { this.showCollectionDialog = false; })
        }
        .width('100%')
        .margin({ bottom: 16 })

        Text($r('app.string.moment_select_posts'))
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.text_hint'))
          .margin({ bottom: 8 })

        Text(`已选择 ${this.selectedMomentIds.size} 条记录`)
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.primary_color'))
          .margin({ bottom: 12 })

        TextInput({ placeholder: $r('app.string.moment_collection_name_placeholder'), text: this.collectionName })
          .width('100%')
          .fontSize($r('app.float.font_size_base'))
          .backgroundColor($r('app.color.background_color'))
          .borderRadius($r('app.float.border_radius_md'))
          .padding(12)
          .onChange((value: string) => { this.collectionName = value; })
          .onSubmit(() => { this.createCollection(); })

        Row() {
          Button($r('app.string.setting_cancel'))
            .layoutWeight(1)
            .backgroundColor($r('app.color.background_color'))
            .fontColor($r('app.color.text_primary'))
            .onClick(() => { this.showCollectionDialog = false; })

          Button($r('app.string.moment_create_collection'))
            .layoutWeight(1)
            .backgroundColor($r('app.color.primary_color'))
            .fontColor(Color.White)
            .margin({ left: 12 })
            .onClick(() => { this.createCollection(); })
        }
        .width('100%')
        .margin({ top: 16 })
      }
      .width('90%')
      .padding(20)
      .backgroundColor($r('app.color.card_background'))
      .borderRadius($r('app.float.border_radius_xl'))
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#80000000')
    .onClick(() => { this.showCollectionDialog = false; })
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
            .fontColor([this.showRemindPicker ? $r('app.color.primary_color') : $r('app.color.text_secondary')])
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
          Text('📍') // 换成 Emoji 文本
            .fontSize(22)
            // 🌟 核心修改：去掉了外层的中括号 []
            .fontColor(this.getEditingTodo()?.location ? $r('app.color.primary_color') : $r('app.color.text_secondary'))
        }
        .width(44)
        .height(44)
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          this.setTodoLocation('此刻位置');
        })

        // 标签图标 (#)
        Button() {
          Text('#') // 换成井号文本
            .fontSize(22)
            // 🌟 核心修改：去掉了外层的中括号 []
            .fontColor(this.getEditingTodo()?.tag ? $r('app.color.primary_color') : $r('app.color.text_secondary'))
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
            .fontColor([this.getEditingTodo()?.flagged ? $r('app.color.primary_color') : $r('app.color.text_secondary')])
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
            .fontColor([this.getEditingTodo()?.imageUris ? $r('app.color.primary_color') : $r('app.color.text_secondary')])
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
      .backgroundColor('#F2F2F7')
    }
    .width('100%')
    .backgroundColor('#F2F2F7')
  }

  /**
   * 标签输入框
   */
  @Builder
  TagInputView() {
    Row() {
      TextInput({ text: this.tagInputBuffer, placeholder: '输入标签...' })
        .fontSize(14)
        .fontColor($r('app.color.text_primary'))
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
          .fontColor([$r('app.color.primary_color')])
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
    .backgroundColor('#F2F2F7')
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
          .fontColor($r('app.color.text_primary'))
          .backgroundColor($r('app.color.background_color'))
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
        .fontColor($r('app.color.text_hint'))
        .backgroundColor($r('app.color.background_color'))
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
