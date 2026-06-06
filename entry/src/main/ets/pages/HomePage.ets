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
      await TodoViewModel.addTodo(this.newTodoText.trim(), this.selectedDate);
      this.newTodoText = '';
      await this.loadTodos();
    } catch (error) {
      console.error('添加待办失败:', error);
    }
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
      await this.loadTodos();
    } catch (error) {
      console.error('删除待办失败:', error);
    }
  }

  toggleCalendar(): void {
    this.isCalendarExpanded = !this.isCalendarExpanded;
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
      .barBackgroundColor($r('app.color.card_background'))
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
    Column() {
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

      WeekCalendarComponent({
        currentWeek: this.currentWeek,
        selectedDate: this.selectedDate,
        onDateSelected: (date: string) => this.onDateSelected(date)
      })
      .margin({ top: 8, left: 16, right: 16 })

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

      Row() {
        Text($r('app.string.today_tasks'))
          .fontSize($r('app.float.font_size_lg'))
          .fontWeight(FontWeight.Medium)
          .fontColor($r('app.color.text_primary'))

        Blank()

        Text(`${this.todos.filter(t => t.status === 'pending').length} 未完成`)
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.text_hint'))
      }
      .width('100%')
      .padding({ left: 16, right: 16, bottom: 8 })

      if (this.isLoading) {
        LoadingProgress()
          .width(40)
          .height(40)
          .layoutWeight(1)
      } else if (this.todos.length === 0) {
        Column() {
          Text('📝')
            .fontSize(48)
            .margin({ bottom: 12 })
          Text('今天还没有任务')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_hint'))
          Text('点击下方按钮添加新任务')
            .fontSize($r('app.float.font_size_sm'))
            .fontColor($r('app.color.text_hint'))
            .margin({ top: 4 })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        TodoListComponent({
          todos: this.todos,
          onToggleStatus: (id: number) => { this.toggleTodoStatus(id); },
          onDelete: (id: number) => { this.deleteTodo(id); },
          onReorder: (fromIndex: number, toIndex: number) => { }
        })
      }

      Row() {
        TextInput({ placeholder: $r('app.string.add_todo_placeholder'), text: this.newTodoText })
          .layoutWeight(1)
          .fontSize($r('app.float.font_size_base'))
          .backgroundColor($r('app.color.background_color'))
          .borderRadius($r('app.float.border_radius_lg'))
          .padding({ left: 16, right: 16 })
          .onChange((value: string) => { this.newTodoText = value; })
          .onSubmit(() => { this.addTodo(); })

        Button('+')
          .width(48)
          .height(48)
          .fontSize(24)
          .backgroundColor($r('app.color.primary_color'))
          .borderRadius(24)
          .margin({ left: 12 })
          .onClick(() => { this.addTodo(); })
      }
      .width('100%')
      .padding(16)
      .backgroundColor($r('app.color.card_background'))
      .shadow({ radius: 8, color: '#15000000', offsetX: 0, offsetY: -2 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.background_color'))
  }

  // ==================== 随手记内容区 ====================

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
              .fontColor($r('app.color.primary_color'))
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
              .fontColor($r('app.color.text_primary'))
              .animation({ duration: 150 })

            Blank()

            Button($r('app.string.moment_cancel'))
              .fontSize($r('app.float.font_size_sm'))
              .backgroundColor(Color.Transparent)
              .fontColor($r('app.color.primary_color'))
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
              .fontColor($r('app.color.text_primary'))

            Blank()

            // 搜索按钮
            Button() {
              SymbolGlyph($r('sys.symbol.magnifyingglass'))
                .fontSize(20)
                .fontColor([$r('app.color.text_secondary')])
            }
            .width(40)
            .height(40)
            .backgroundColor(Color.Transparent)
            .border({ width: 1, color: $r('app.color.divider_color'), radius: 20 })
            .onClick(() => {
              animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
                this.showSearchBar = true;
              });
            })

            // 多选按钮
            Button() {
              SymbolGlyph($r('sys.symbol.checkmark'))
                .fontSize(20)
                .fontColor([$r('app.color.text_secondary')])
            }
            .width(40)
            .height(40)
            .backgroundColor(Color.Transparent)
            .border({ width: 1, color: $r('app.color.divider_color'), radius: 20 })
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
                .fontColor([$r('app.color.text_secondary')])
            }
            .width(40)
            .height(40)
            .backgroundColor(Color.Transparent)
            .border({ width: 1, color: $r('app.color.divider_color'), radius: 20 })
            .margin({ left: 10 })
            .onClick(() => {
              this.isAddMode = true;
              animateTo({ duration: 300, curve: Curve.EaseOut }, () => {
                this.showPublishDialog = true;
              });
            })

            // 更多按钮
            Button() {
              Text('⋮')
                .fontSize(22)
                .fontColor($r('app.color.text_secondary'))
            }
            .width(40)
            .height(40)
            .backgroundColor(Color.Transparent)
            .border({ width: 1, color: $r('app.color.divider_color'), radius: 20 })
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
          .color($r('app.color.divider_color'))

        // 搜索框（从导航栏下方展开，非整体滑入）
        Column() {
          Row({ space: 8 }) {
            TextInput({
              placeholder: '搜索时间、内容、地点…',
              text: this.searchKeyword
            })
              .placeholderColor($r('app.color.text_hint'))
              .fontSize($r('app.float.font_size_sm'))
              .height(36)
              .backgroundColor($r('app.color.background_color'))
              .borderRadius($r('app.float.border_radius_md'))
              .layoutWeight(1)
              .enabled(this.showSearchBar)
              .onChange((value: string) => {
                this.searchKeyword = value;
              })

            Button() {
              SymbolGlyph($r('sys.symbol.xmark'))
                .fontSize(14)
                .fontColor([$r('app.color.text_hint')])
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
          .backgroundColor($r('app.color.card_background'))
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
      .backgroundColor($r('app.color.background_color'))

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
        // 多选圆圈（多选模式，在每条记录前显示）
        if (this.isMultiSelectMode) {
          Row() {
            Circle({ width: 22, height: 22 })
              .fill(this.selectedMomentIds.has(moment.id) ?
                $r('app.color.primary_color') : Color.Transparent)
              .stroke(this.selectedMomentIds.has(moment.id) ?
                $r('app.color.primary_color') : $r('app.color.text_hint'))
              .strokeWidth(2)
          }
          .onClick(() => this.toggleMomentSelection(moment.id))
          .hitTestBehavior(HitTestMode.Block)
          .margin({ right: 10 })
        }

        Text(DateUtils.formatTime(moment.timestamp))
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.text_secondary'))

        if (moment.location) {
          Text(`📍 ${moment.location}`)
            .fontSize($r('app.float.font_size_sm'))
            .fontColor($r('app.color.text_hint'))
            .margin({ left: 12 })
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
            .fontColor([$r('app.color.text_secondary')])
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
          .fontColor($r('app.color.text_primary'))

        Blank()

        // 右侧发布按钮
        Button('发布')
          .fontSize($r('app.float.font_size_sm'))
          .fontColor(Color.White)
          .backgroundColor(this.newPostContent || this.newPostMediaUris.length > 0 ?
            $r('app.color.primary_color') : '#CCCCCC')
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
        .backgroundColor($r('app.color.background_color'))
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
                .fontColor($r('app.color.text_hint'))
            }
            .width(100)
            .height(100)
            .border({ width: 1, color: $r('app.color.divider_color') })
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
          .fontColor($r('app.color.text_primary'))
          .placeholderColor($r('app.color.text_hint'))
          .backgroundColor(Color.Transparent)
          .padding(0)
          .borderRadius(0)
          .onChange((value: string) => { this.newPostLocation = value; })
        if (this.newPostLocation) {
          Button() {
            SymbolGlyph($r('sys.symbol.xmark'))
              .fontSize(12)
              .fontColor([$r('app.color.text_hint')])
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
      .backgroundColor($r('app.color.background_color'))
      .borderRadius($r('app.float.border_radius_md'))
      .alignItems(VerticalAlign.Center)
    }
    .width('100%')
    .height('100%')
    .padding(this.isAddMode ? 16 : 20)
    .backgroundColor($r('app.color.card_background'))
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
              .fontColor([$r('app.color.text_secondary')])
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
            .fontColor($r('app.color.text_primary'))

          Blank()

          Text('创建')
            .fontSize($r('app.float.font_size_base'))
            .fontColor(this.newCollectionName.trim().length > 0 && this.newCollectionName.trim().length <= 10
              ? $r('app.color.primary_color') : $r('app.color.text_hint'))
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
          .backgroundColor($r('app.color.background_color'))
          .borderRadius($r('app.float.border_radius_md'))
          .padding({ left: 12, right: 12 })
          .border({
            width: this.newCollectionName.length > 10 ? 1 : 0,
            color: this.newCollectionName.length > 10 ? '#FF4D4F' : Color.Transparent
          })
          .fontColor(this.newCollectionName.length > 10 ? '#FF4D4F' : $r('app.color.text_primary'))
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
      .backgroundColor($r('app.color.card_background'))
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
            .fontColor($r('app.color.text_primary'))
        }
        .width('100%')
        .height(44)
        .padding({ left: 12, right: 12 })
        .backgroundColor($r('app.color.background_color'))
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
                  .fontColor($r('app.color.text_primary'))
                Blank()
                Text(`${this.moments.filter((m) => m.category === collection).length}条`)
                  .fontSize($r('app.float.font_size_sm'))
                  .fontColor($r('app.color.text_hint'))
              }
              .width('100%')
              .height(44)
              .padding({ left: 12, right: 12 })
              .backgroundColor($r('app.color.background_color'))
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
            .fontColor($r('app.color.text_hint'))
            .width('100%')
            .textAlign(TextAlign.Center)
            .margin({ top: 8 })
        }
      }
      .width('100%')
      .padding(20)
      .backgroundColor($r('app.color.card_background'))
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
              .fontColor([$r('app.color.primary_color')])
            Text($r('app.string.moment_add_to_collection'))
              .fontSize($r('app.float.font_size_xs'))
              .fontColor($r('app.color.primary_color'))
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
        .color($r('app.color.divider_color'))

      Column() {
        // 删除
        Button() {
          Column({ space: 2 }) {
            SymbolGlyph($r('sys.symbol.trash'))
              .fontSize(18)
              .fontColor([$r('app.color.error_color')])
            Text($r('app.string.moment_delete_selected'))
              .fontSize($r('app.float.font_size_xs'))
              .fontColor($r('app.color.error_color'))
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
        .color($r('app.color.divider_color'))

      Column() {
        // 制作手账
        Button() {
          Column({ space: 2 }) {
            SymbolGlyph($r('sys.symbol.wand_and_stars'))
              .fontSize(18)
              .fontColor([$r('app.color.primary_color')])
            Text($r('app.string.moment_make_plog'))
              .fontSize($r('app.float.font_size_xs'))
              .fontColor($r('app.color.primary_color'))
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
    .backgroundColor($r('app.color.card_background'))
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
          .backgroundColor($r('app.color.card_background'))
          .rotate({ angle: 45 })
          .margin({ top: -4, right: 14 })
      }
      .width('100%')
      .height(0)

      // 合集选项
      Row({ space: 10 }) {
        SymbolGlyph($r('sys.symbol.folder'))
          .fontSize(15)
          .fontColor([$r('app.color.text_secondary')])
        Text($r('app.string.moment_more_collections'))
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.text_primary'))
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
        .color($r('app.color.divider_color'))
        .margin({ left: 14, right: 14 })

      // 手账本选项
      Row({ space: 10 }) {
        SymbolGlyph($r('sys.symbol.book'))
          .fontSize(15)
          .fontColor([$r('app.color.text_secondary')])
        Text($r('app.string.moment_more_plog_book'))
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.text_primary'))
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
    .backgroundColor($r('app.color.card_background'))
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
          .fontColor($r('app.color.error_color'))
          .margin({ bottom: 12 })

        // 确认内容
        Text(`确定要删除选中的 ${this.pendingDeleteCount} 条记录吗？此操作不可恢复。`)
          .fontSize($r('app.float.font_size_base'))
          .fontColor($r('app.color.text_secondary'))
          .textAlign(TextAlign.Center)
          .lineHeight(22)
          .margin({ bottom: 20 })

        // 按钮行
        Row() {
          Button($r('app.string.setting_cancel'))
            .layoutWeight(1)
            .height(40)
            .backgroundColor($r('app.color.background_color'))
            .fontColor($r('app.color.text_primary'))
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
            .backgroundColor($r('app.color.error_color'))
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
      .backgroundColor($r('app.color.card_background'))
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
}

export default HomePage;
