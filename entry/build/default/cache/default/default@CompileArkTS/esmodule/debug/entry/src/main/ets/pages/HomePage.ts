if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    currentTabIndex?: number;
    tabTitles?: ResourceStr[];
    tabIcons?: Resource[];
    tabIconsActive?: Resource[];
    selectedDate?: string;
    currentWeek?: string[];
    isCalendarExpanded?: boolean;
    todos?: TodoItem[];
    newTodoText?: string;
    isLoading?: boolean;
    monthCalendar?: (string | null)[][];
    eventDates?: Set<string>;
    moments?: DiaryPost[];
    momentsLoading?: boolean;
    showPublishDialog?: boolean;
    newPostContent?: string;
    newPostMediaUris?: string[];
    newPostLocation?: string;
    isMultiSelectMode?: boolean;
    selectedMomentIds?: Set<number>;
    showCollectionDialog?: boolean;
    collectionName?: string;
    showNewCollectionDialog?: boolean;
    newCollectionName?: string;
    collections?: string[];
    isAddMode?: boolean;
    showMoreDropdown?: boolean;
    showSearchBar?: boolean;
    searchKeyword?: string;
    showDeleteConfirmDialog?: boolean;
    pendingDeleteCount?: number;
    plogs?: PlogCanvas[];
    plogsLoading?: boolean;
}
import WeekCalendarComponent from "@normalized:N&&&entry/src/main/ets/components/calendar/WeekCalendar&";
import MonthCalendarComponent from "@normalized:N&&&entry/src/main/ets/components/calendar/MonthCalendar&";
import { TodoListComponent } from "@normalized:N&&&entry/src/main/ets/components/todo/TodoList&";
import TodoViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/TodoViewModel&";
import PlogViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/PlogViewModel&";
import DiaryViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/DiaryViewModel&";
import DateUtils from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtils&";
import type { TodoItem } from '../model/TodoItem';
import type { PlogCanvas, CanvasElement } from '../model/PlogCanvas';
import type { DiaryPost } from '../model/DiaryPost';
import type { DiaryPostInsertParams } from '../common/database/RDBStoreUtil';
import type { PlogInsertParams } from '../common/database/RDBStoreUtil';
import { SettingPage } from "@normalized:N&&&entry/src/main/ets/pages/SettingPage&";
import router from "@ohos:router";
import photoAccessHelper from "@ohos:file.photoAccessHelper";
import promptAction from "@ohos:promptAction";
import PreferencesUtil from "@normalized:N&&&entry/src/main/ets/common/database/PreferencesUtil&";
class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentTabIndex = new ObservedPropertySimplePU(0, this, "currentTabIndex");
        this.tabTitles = [{ "id": 16777288, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, { "id": 16777286, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, { "id": 16777287, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }];
        this.tabIcons = [{ "id": 16777217, "type": 20000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, { "id": 125831935, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, { "id": 125831493, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }];
        this.tabIconsActive = [{ "id": 16777217, "type": 20000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, { "id": 16777217, "type": 20000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, { "id": 125831494, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }];
        this.__selectedDate = new ObservedPropertySimplePU(DateUtils.getToday(), this, "selectedDate");
        this.__currentWeek = new ObservedPropertyObjectPU(DateUtils.getCurrentWeek(), this, "currentWeek");
        this.__isCalendarExpanded = new ObservedPropertySimplePU(false, this, "isCalendarExpanded");
        this.__todos = new ObservedPropertyObjectPU([], this, "todos");
        this.__newTodoText = new ObservedPropertySimplePU('', this, "newTodoText");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__monthCalendar = new ObservedPropertyObjectPU([], this, "monthCalendar");
        this.__eventDates = new ObservedPropertyObjectPU(new Set(), this, "eventDates");
        this.__moments = new ObservedPropertyObjectPU([], this, "moments");
        this.__momentsLoading = new ObservedPropertySimplePU(false, this, "momentsLoading");
        this.__showPublishDialog = new ObservedPropertySimplePU(false, this, "showPublishDialog");
        this.__newPostContent = new ObservedPropertySimplePU('', this, "newPostContent");
        this.__newPostMediaUris = new ObservedPropertyObjectPU([], this, "newPostMediaUris");
        this.__newPostLocation = new ObservedPropertySimplePU('', this, "newPostLocation");
        this.__isMultiSelectMode = new ObservedPropertySimplePU(false, this, "isMultiSelectMode");
        this.__selectedMomentIds = new ObservedPropertyObjectPU(new Set(), this, "selectedMomentIds");
        this.__showCollectionDialog = new ObservedPropertySimplePU(false, this, "showCollectionDialog");
        this.__collectionName = new ObservedPropertySimplePU('', this, "collectionName");
        this.__showNewCollectionDialog = new ObservedPropertySimplePU(false, this, "showNewCollectionDialog");
        this.__newCollectionName = new ObservedPropertySimplePU('', this, "newCollectionName");
        this.__collections = new ObservedPropertyObjectPU([], this, "collections");
        this.__isAddMode = new ObservedPropertySimplePU(false, this, "isAddMode");
        this.__showMoreDropdown = new ObservedPropertySimplePU(false, this, "showMoreDropdown");
        this.__showSearchBar = new ObservedPropertySimplePU(false, this, "showSearchBar");
        this.__searchKeyword = new ObservedPropertySimplePU('', this, "searchKeyword");
        this.__showDeleteConfirmDialog = new ObservedPropertySimplePU(false, this, "showDeleteConfirmDialog");
        this.__pendingDeleteCount = new ObservedPropertySimplePU(0, this, "pendingDeleteCount");
        this.__plogs = new ObservedPropertyObjectPU([], this, "plogs");
        this.__plogsLoading = new ObservedPropertySimplePU(false, this, "plogsLoading");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomePage_Params) {
        if (params.currentTabIndex !== undefined) {
            this.currentTabIndex = params.currentTabIndex;
        }
        if (params.tabTitles !== undefined) {
            this.tabTitles = params.tabTitles;
        }
        if (params.tabIcons !== undefined) {
            this.tabIcons = params.tabIcons;
        }
        if (params.tabIconsActive !== undefined) {
            this.tabIconsActive = params.tabIconsActive;
        }
        if (params.selectedDate !== undefined) {
            this.selectedDate = params.selectedDate;
        }
        if (params.currentWeek !== undefined) {
            this.currentWeek = params.currentWeek;
        }
        if (params.isCalendarExpanded !== undefined) {
            this.isCalendarExpanded = params.isCalendarExpanded;
        }
        if (params.todos !== undefined) {
            this.todos = params.todos;
        }
        if (params.newTodoText !== undefined) {
            this.newTodoText = params.newTodoText;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.monthCalendar !== undefined) {
            this.monthCalendar = params.monthCalendar;
        }
        if (params.eventDates !== undefined) {
            this.eventDates = params.eventDates;
        }
        if (params.moments !== undefined) {
            this.moments = params.moments;
        }
        if (params.momentsLoading !== undefined) {
            this.momentsLoading = params.momentsLoading;
        }
        if (params.showPublishDialog !== undefined) {
            this.showPublishDialog = params.showPublishDialog;
        }
        if (params.newPostContent !== undefined) {
            this.newPostContent = params.newPostContent;
        }
        if (params.newPostMediaUris !== undefined) {
            this.newPostMediaUris = params.newPostMediaUris;
        }
        if (params.newPostLocation !== undefined) {
            this.newPostLocation = params.newPostLocation;
        }
        if (params.isMultiSelectMode !== undefined) {
            this.isMultiSelectMode = params.isMultiSelectMode;
        }
        if (params.selectedMomentIds !== undefined) {
            this.selectedMomentIds = params.selectedMomentIds;
        }
        if (params.showCollectionDialog !== undefined) {
            this.showCollectionDialog = params.showCollectionDialog;
        }
        if (params.collectionName !== undefined) {
            this.collectionName = params.collectionName;
        }
        if (params.showNewCollectionDialog !== undefined) {
            this.showNewCollectionDialog = params.showNewCollectionDialog;
        }
        if (params.newCollectionName !== undefined) {
            this.newCollectionName = params.newCollectionName;
        }
        if (params.collections !== undefined) {
            this.collections = params.collections;
        }
        if (params.isAddMode !== undefined) {
            this.isAddMode = params.isAddMode;
        }
        if (params.showMoreDropdown !== undefined) {
            this.showMoreDropdown = params.showMoreDropdown;
        }
        if (params.showSearchBar !== undefined) {
            this.showSearchBar = params.showSearchBar;
        }
        if (params.searchKeyword !== undefined) {
            this.searchKeyword = params.searchKeyword;
        }
        if (params.showDeleteConfirmDialog !== undefined) {
            this.showDeleteConfirmDialog = params.showDeleteConfirmDialog;
        }
        if (params.pendingDeleteCount !== undefined) {
            this.pendingDeleteCount = params.pendingDeleteCount;
        }
        if (params.plogs !== undefined) {
            this.plogs = params.plogs;
        }
        if (params.plogsLoading !== undefined) {
            this.plogsLoading = params.plogsLoading;
        }
    }
    updateStateVars(params: HomePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentTabIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__currentWeek.purgeDependencyOnElmtId(rmElmtId);
        this.__isCalendarExpanded.purgeDependencyOnElmtId(rmElmtId);
        this.__todos.purgeDependencyOnElmtId(rmElmtId);
        this.__newTodoText.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__monthCalendar.purgeDependencyOnElmtId(rmElmtId);
        this.__eventDates.purgeDependencyOnElmtId(rmElmtId);
        this.__moments.purgeDependencyOnElmtId(rmElmtId);
        this.__momentsLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__showPublishDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__newPostContent.purgeDependencyOnElmtId(rmElmtId);
        this.__newPostMediaUris.purgeDependencyOnElmtId(rmElmtId);
        this.__newPostLocation.purgeDependencyOnElmtId(rmElmtId);
        this.__isMultiSelectMode.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedMomentIds.purgeDependencyOnElmtId(rmElmtId);
        this.__showCollectionDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__collectionName.purgeDependencyOnElmtId(rmElmtId);
        this.__showNewCollectionDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__newCollectionName.purgeDependencyOnElmtId(rmElmtId);
        this.__collections.purgeDependencyOnElmtId(rmElmtId);
        this.__isAddMode.purgeDependencyOnElmtId(rmElmtId);
        this.__showMoreDropdown.purgeDependencyOnElmtId(rmElmtId);
        this.__showSearchBar.purgeDependencyOnElmtId(rmElmtId);
        this.__searchKeyword.purgeDependencyOnElmtId(rmElmtId);
        this.__showDeleteConfirmDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__pendingDeleteCount.purgeDependencyOnElmtId(rmElmtId);
        this.__plogs.purgeDependencyOnElmtId(rmElmtId);
        this.__plogsLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentTabIndex.aboutToBeDeleted();
        this.__selectedDate.aboutToBeDeleted();
        this.__currentWeek.aboutToBeDeleted();
        this.__isCalendarExpanded.aboutToBeDeleted();
        this.__todos.aboutToBeDeleted();
        this.__newTodoText.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__monthCalendar.aboutToBeDeleted();
        this.__eventDates.aboutToBeDeleted();
        this.__moments.aboutToBeDeleted();
        this.__momentsLoading.aboutToBeDeleted();
        this.__showPublishDialog.aboutToBeDeleted();
        this.__newPostContent.aboutToBeDeleted();
        this.__newPostMediaUris.aboutToBeDeleted();
        this.__newPostLocation.aboutToBeDeleted();
        this.__isMultiSelectMode.aboutToBeDeleted();
        this.__selectedMomentIds.aboutToBeDeleted();
        this.__showCollectionDialog.aboutToBeDeleted();
        this.__collectionName.aboutToBeDeleted();
        this.__showNewCollectionDialog.aboutToBeDeleted();
        this.__newCollectionName.aboutToBeDeleted();
        this.__collections.aboutToBeDeleted();
        this.__isAddMode.aboutToBeDeleted();
        this.__showMoreDropdown.aboutToBeDeleted();
        this.__showSearchBar.aboutToBeDeleted();
        this.__searchKeyword.aboutToBeDeleted();
        this.__showDeleteConfirmDialog.aboutToBeDeleted();
        this.__pendingDeleteCount.aboutToBeDeleted();
        this.__plogs.aboutToBeDeleted();
        this.__plogsLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentTabIndex: ObservedPropertySimplePU<number>;
    get currentTabIndex() {
        return this.__currentTabIndex.get();
    }
    set currentTabIndex(newValue: number) {
        this.__currentTabIndex.set(newValue);
    }
    private tabTitles: ResourceStr[];
    private tabIcons: Resource[];
    private tabIconsActive: Resource[];
    // ---- Todo 状态 ----
    private __selectedDate: ObservedPropertySimplePU<string>;
    get selectedDate() {
        return this.__selectedDate.get();
    }
    set selectedDate(newValue: string) {
        this.__selectedDate.set(newValue);
    }
    private __currentWeek: ObservedPropertyObjectPU<string[]>;
    get currentWeek() {
        return this.__currentWeek.get();
    }
    set currentWeek(newValue: string[]) {
        this.__currentWeek.set(newValue);
    }
    private __isCalendarExpanded: ObservedPropertySimplePU<boolean>;
    get isCalendarExpanded() {
        return this.__isCalendarExpanded.get();
    }
    set isCalendarExpanded(newValue: boolean) {
        this.__isCalendarExpanded.set(newValue);
    }
    private __todos: ObservedPropertyObjectPU<TodoItem[]>;
    get todos() {
        return this.__todos.get();
    }
    set todos(newValue: TodoItem[]) {
        this.__todos.set(newValue);
    }
    private __newTodoText: ObservedPropertySimplePU<string>;
    get newTodoText() {
        return this.__newTodoText.get();
    }
    set newTodoText(newValue: string) {
        this.__newTodoText.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __monthCalendar: ObservedPropertyObjectPU<(string | null)[][]>;
    get monthCalendar() {
        return this.__monthCalendar.get();
    }
    set monthCalendar(newValue: (string | null)[][]) {
        this.__monthCalendar.set(newValue);
    }
    private __eventDates: ObservedPropertyObjectPU<Set<string>>;
    get eventDates() {
        return this.__eventDates.get();
    }
    set eventDates(newValue: Set<string>) {
        this.__eventDates.set(newValue);
    }
    // ---- 随手记 (Plog/Moment) 状态 ----
    private __moments: ObservedPropertyObjectPU<DiaryPost[]>;
    get moments() {
        return this.__moments.get();
    }
    set moments(newValue: DiaryPost[]) {
        this.__moments.set(newValue);
    }
    private __momentsLoading: ObservedPropertySimplePU<boolean>;
    get momentsLoading() {
        return this.__momentsLoading.get();
    }
    set momentsLoading(newValue: boolean) {
        this.__momentsLoading.set(newValue);
    }
    private __showPublishDialog: ObservedPropertySimplePU<boolean>;
    get showPublishDialog() {
        return this.__showPublishDialog.get();
    }
    set showPublishDialog(newValue: boolean) {
        this.__showPublishDialog.set(newValue);
    }
    private __newPostContent: ObservedPropertySimplePU<string>;
    get newPostContent() {
        return this.__newPostContent.get();
    }
    set newPostContent(newValue: string) {
        this.__newPostContent.set(newValue);
    }
    private __newPostMediaUris: ObservedPropertyObjectPU<string[]>;
    get newPostMediaUris() {
        return this.__newPostMediaUris.get();
    }
    set newPostMediaUris(newValue: string[]) {
        this.__newPostMediaUris.set(newValue);
    }
    private __newPostLocation: ObservedPropertySimplePU<string>;
    get newPostLocation() {
        return this.__newPostLocation.get();
    }
    set newPostLocation(newValue: string) {
        this.__newPostLocation.set(newValue);
    }
    // 管理状态
    private __isMultiSelectMode: ObservedPropertySimplePU<boolean>;
    get isMultiSelectMode() {
        return this.__isMultiSelectMode.get();
    }
    set isMultiSelectMode(newValue: boolean) {
        this.__isMultiSelectMode.set(newValue);
    }
    private __selectedMomentIds: ObservedPropertyObjectPU<Set<number>>;
    get selectedMomentIds() {
        return this.__selectedMomentIds.get();
    }
    set selectedMomentIds(newValue: Set<number>) {
        this.__selectedMomentIds.set(newValue);
    }
    private __showCollectionDialog: ObservedPropertySimplePU<boolean>;
    get showCollectionDialog() {
        return this.__showCollectionDialog.get();
    }
    set showCollectionDialog(newValue: boolean) {
        this.__showCollectionDialog.set(newValue);
    }
    private __collectionName: ObservedPropertySimplePU<string>;
    get collectionName() {
        return this.__collectionName.get();
    }
    set collectionName(newValue: string) {
        this.__collectionName.set(newValue);
    }
    // 新建合集弹窗
    private __showNewCollectionDialog: ObservedPropertySimplePU<boolean>;
    get showNewCollectionDialog() {
        return this.__showNewCollectionDialog.get();
    }
    set showNewCollectionDialog(newValue: boolean) {
        this.__showNewCollectionDialog.set(newValue);
    }
    private __newCollectionName: ObservedPropertySimplePU<string>;
    get newCollectionName() {
        return this.__newCollectionName.get();
    }
    set newCollectionName(newValue: string) {
        this.__newCollectionName.set(newValue);
    }
    // 合集列表
    private __collections: ObservedPropertyObjectPU<string[]>;
    get collections() {
        return this.__collections.get();
    }
    set collections(newValue: string[]) {
        this.__collections.set(newValue);
    }
    // 添加模式（全屏）
    private __isAddMode: ObservedPropertySimplePU<boolean>;
    get isAddMode() {
        return this.__isAddMode.get();
    }
    set isAddMode(newValue: boolean) {
        this.__isAddMode.set(newValue);
    }
    // 更多下拉菜单
    private __showMoreDropdown: ObservedPropertySimplePU<boolean>;
    get showMoreDropdown() {
        return this.__showMoreDropdown.get();
    }
    set showMoreDropdown(newValue: boolean) {
        this.__showMoreDropdown.set(newValue);
    }
    // 搜索
    private __showSearchBar: ObservedPropertySimplePU<boolean>;
    get showSearchBar() {
        return this.__showSearchBar.get();
    }
    set showSearchBar(newValue: boolean) {
        this.__showSearchBar.set(newValue);
    }
    private __searchKeyword: ObservedPropertySimplePU<string>;
    get searchKeyword() {
        return this.__searchKeyword.get();
    }
    set searchKeyword(newValue: string) {
        this.__searchKeyword.set(newValue);
    }
    // 删除确认弹窗
    private __showDeleteConfirmDialog: ObservedPropertySimplePU<boolean>;
    get showDeleteConfirmDialog() {
        return this.__showDeleteConfirmDialog.get();
    }
    set showDeleteConfirmDialog(newValue: boolean) {
        this.__showDeleteConfirmDialog.set(newValue);
    }
    private __pendingDeleteCount: ObservedPropertySimplePU<number>;
    get pendingDeleteCount() {
        return this.__pendingDeleteCount.get();
    }
    set pendingDeleteCount(newValue: number) {
        this.__pendingDeleteCount.set(newValue);
    }
    // ---- Plog 状态 ----
    private __plogs: ObservedPropertyObjectPU<PlogCanvas[]>;
    get plogs() {
        return this.__plogs.get();
    }
    set plogs(newValue: PlogCanvas[]) {
        this.__plogs.set(newValue);
    }
    private __plogsLoading: ObservedPropertySimplePU<boolean>;
    get plogsLoading() {
        return this.__plogsLoading.get();
    }
    set plogsLoading(newValue: boolean) {
        this.__plogsLoading.set(newValue);
    }
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
        }
        catch (error) {
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
        promptAction.showToast({ message: '合集创建成功' });
    }
    // ==================== Todo 方法 ====================
    async loadTodos(): Promise<void> {
        this.isLoading = true;
        try {
            this.todos = await TodoViewModel.getTodosByDate(this.selectedDate);
        }
        catch (error) {
            console.error('加载待办失败:', error);
        }
        finally {
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
        }
        catch (error) {
            console.error('添加待办失败:', error);
        }
    }
    async toggleTodoStatus(id: number): Promise<void> {
        const todo = this.todos.find(t => t.id === id);
        if (!todo)
            return;
        const newStatus = todo.status === 'pending' ? 'completed' : 'pending';
        try {
            await TodoViewModel.toggleTodoStatus(id, newStatus);
            await this.loadTodos();
        }
        catch (error) {
            console.error('更新状态失败:', error);
        }
    }
    async deleteTodo(id: number): Promise<void> {
        try {
            await TodoViewModel.deleteTodo(id);
            await this.loadTodos();
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('加载随手记失败:', error);
        }
        finally {
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
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        else {
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
        }
        else {
            this.selectedMomentIds.add(id);
        }
    }
    async confirmDeleteSelectedMoments(): Promise<void> {
        if (this.selectedMomentIds.size === 0)
            return;
        try {
            for (const id of this.selectedMomentIds) {
                await DiaryViewModel.deletePost(id);
            }
            this.selectedMomentIds.clear();
            this.isMultiSelectMode = false;
            this.showDeleteConfirmDialog = false;
            await this.loadMoments();
            promptAction.showToast({ message: '已删除' });
        }
        catch (error) {
            console.error('删除失败:', error);
        }
    }
    showDeleteConfirm(): void {
        if (this.selectedMomentIds.size === 0) {
            promptAction.showToast({ message: '请先选择要删除的记录' });
            return;
        }
        this.pendingDeleteCount = this.selectedMomentIds.size;
        Context.animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
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
        Context.animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
            this.showCollectionDialog = true;
        });
    }
    async createCollection(): Promise<void> {
        if (!this.collectionName.trim()) {
            return;
        }
        Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
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
            promptAction.showToast({ message: { "id": 16777229, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        }
        catch (error) {
            console.error('创建合集失败:', error);
        }
    }
    async addSelectedToCollection(collectionName: string): Promise<void> {
        Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
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
        }
        catch (error) {
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
            promptAction.showToast({ message: { "id": 16777255, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('制作手账失败:', error);
        }
    }
    navigateToPlogGallery(): void {
        router.pushUrl({ url: 'pages/PlogGalleryPage' });
    }
    // ==================== 构建方法 ====================
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Tabs.create({
                barPosition: BarPosition.End,
                index: this.currentTabIndex
            });
            Tabs.barHeight(this.isMultiSelectMode && this.currentTabIndex === 1 ? 0 : 56);
            Tabs.barBackgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Tabs.animationDuration(200);
            Tabs.onChange((index: number) => {
                this.currentTabIndex = index;
                // 切换 tab 时退出多选模式
                if (this.isMultiSelectMode) {
                    this.cancelMultiSelect();
                }
            });
            Tabs.width('100%');
            Tabs.layoutWeight(1);
        }, Tabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.TodoContent.bind(this)();
            });
            TabContent.tabBar({ builder: () => {
                    this.TabBarBuilder.call(this, 0);
                } });
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.MomentContent.bind(this)();
            });
            TabContent.tabBar({ builder: () => {
                    this.TabBarBuilder.call(this, 1);
                } });
            TabContent.onAppear(() => {
                this.loadMoments();
            });
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new SettingPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 511, col: 11 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {};
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "SettingPage" });
                }
            });
            TabContent.tabBar({ builder: () => {
                    this.TabBarBuilder.call(this, 2);
                } });
        }, TabContent);
        TabContent.pop();
        Tabs.pop();
        Column.pop();
    }
    // ==================== TabBar 构建器 ====================
    TabBarBuilder(index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create(this.currentTabIndex === index ? this.tabIconsActive[index] : this.tabIcons[index]);
            SymbolGlyph.fontSize(24);
            SymbolGlyph.fontColor([{ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
            SymbolGlyph.renderingStrategy(SymbolRenderingStrategy.MULTIPLE_OPACITY);
            SymbolGlyph.effectStrategy(SymbolEffectStrategy.HIERARCHICAL);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.tabTitles[index]);
            Text.fontSize(10);
            Text.fontColor(this.currentTabIndex === index ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    // ==================== Todo 内容区 ====================
    TodoContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 16, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(DateUtils.formatDisplayDate(this.selectedDate));
            Text.fontSize({ "id": 16777320, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild({ type: ButtonType.Circle });
            Button.width(36);
            Button.height(36);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => this.toggleCalendar());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832666, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            globalThis.Context.animation({ duration: 200 });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
            SymbolGlyph.rotate({ angle: this.isCalendarExpanded ? 180 : 0 });
            globalThis.Context.animation(null);
        }, SymbolGlyph);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.margin({ top: 8, left: 16, right: 16 });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new WeekCalendarComponent(this, {
                        currentWeek: this.currentWeek,
                        selectedDate: this.selectedDate,
                        onDateSelected: (date: string) => this.onDateSelected(date)
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 581, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            currentWeek: this.currentWeek,
                            selectedDate: this.selectedDate,
                            onDateSelected: (date: string) => this.onDateSelected(date)
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        currentWeek: this.currentWeek,
                        selectedDate: this.selectedDate
                    });
                }
            }, { name: "WeekCalendarComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isCalendarExpanded) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        __Common__.create();
                        __Common__.margin({ top: 12, left: 16, right: 16 });
                    }, __Common__);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new MonthCalendarComponent(this, {
                                    calendar: this.monthCalendar,
                                    selectedDate: this.selectedDate,
                                    eventDates: this.eventDates,
                                    onDateSelected: (date: string) => {
                                        this.onDateSelected(date);
                                        this.toggleCalendar();
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 589, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        calendar: this.monthCalendar,
                                        selectedDate: this.selectedDate,
                                        eventDates: this.eventDates,
                                        onDateSelected: (date: string) => {
                                            this.onDateSelected(date);
                                            this.toggleCalendar();
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    calendar: this.monthCalendar,
                                    selectedDate: this.selectedDate,
                                    eventDates: this.eventDates
                                });
                            }
                        }, { name: "MonthCalendarComponent" });
                    }
                    __Common__.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Divider.margin({ top: this.isCalendarExpanded ? 12 : 8, bottom: 8 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 16, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777289, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777315, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.todos.filter(t => t.status === 'pending').length} 未完成`);
            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(40);
                        LoadingProgress.height(40);
                        LoadingProgress.layoutWeight(1);
                    }, LoadingProgress);
                });
            }
            else if (this.todos.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📝');
                        Text.fontSize(48);
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('今天还没有任务');
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击下方按钮添加新任务');
                        Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new TodoListComponent(this, {
                                    todos: this.todos,
                                    onToggleStatus: (id: number) => { this.toggleTodoStatus(id); },
                                    onDelete: (id: number) => { this.deleteTodo(id); },
                                    onReorder: (fromIndex: number, toIndex: number) => { }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 642, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        todos: this.todos,
                                        onToggleStatus: (id: number) => { this.toggleTodoStatus(id); },
                                        onDelete: (id: number) => { this.deleteTodo(id); },
                                        onReorder: (fromIndex: number, toIndex: number) => { }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    todos: this.todos
                                });
                            }
                        }, { name: "TodoListComponent" });
                    }
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(16);
            Row.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Row.shadow({ radius: 8, color: '#15000000', offsetX: 0, offsetY: -2 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: { "id": 16777220, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, text: this.newTodoText });
            TextInput.layoutWeight(1);
            TextInput.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            TextInput.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            TextInput.borderRadius({ "id": 16777310, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            TextInput.padding({ left: 16, right: 16 });
            TextInput.onChange((value: string) => { this.newTodoText = value; });
            TextInput.onSubmit(() => { this.addTodo(); });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+');
            Button.width(48);
            Button.height(48);
            Button.fontSize(24);
            Button.backgroundColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.borderRadius(24);
            Button.margin({ left: 12 });
            Button.onClick(() => { this.addTodo(); });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    // ==================== 随手记内容区 ====================
    MomentContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.BottomEnd });
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // ---- 标题栏 ----
            if (this.isMultiSelectMode) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 多选模式：全选 + 选择项目 + 取消
                        Row.create();
                        // 多选模式：全选 + 选择项目 + 取消
                        Row.width('100%');
                        // 多选模式：全选 + 选择项目 + 取消
                        Row.padding({ left: 16, right: 16, top: 16, bottom: 4 });
                        // 多选模式：全选 + 选择项目 + 取消
                        Row.transition(TransitionEffect.OPACITY
                            .combine(TransitionEffect.translate({ x: 8 }))
                            .animation({ duration: 250, curve: Curve.EaseInOut }));
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel({ "id": 16777341, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.backgroundColor(Color.Transparent);
                        Button.fontColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.height(32);
                        Button.onClick(() => {
                            Context.animateTo({ duration: 150, curve: Curve.EaseOut }, () => {
                                this.selectAllMoments();
                            });
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedMomentIds.size > 0 ?
                            `已选 ${this.selectedMomentIds.size} 项` : '选择项目');
                        globalThis.Context.animation({ duration: 150 });
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        globalThis.Context.animation(null);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel({ "id": 16777332, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.backgroundColor(Color.Transparent);
                        Button.fontColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.height(32);
                        Button.onClick(() => {
                            Context.animateTo({ duration: 250, curve: Curve.EaseInOut }, () => {
                                this.cancelMultiSelect();
                            });
                        });
                    }, Button);
                    Button.pop();
                    // 多选模式：全选 + 选择项目 + 取消
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 普通模式：随手记 + 多选/添加/更多
                        Row.create();
                        // 普通模式：随手记 + 多选/添加/更多
                        Row.width('100%');
                        // 普通模式：随手记 + 多选/添加/更多
                        Row.padding({ left: 16, right: 16, top: 16, bottom: 4 });
                        // 普通模式：随手记 + 多选/添加/更多
                        Row.transition(TransitionEffect.OPACITY
                            .combine(TransitionEffect.translate({ x: -8 }))
                            .animation({ duration: 250, curve: Curve.EaseInOut }));
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777244, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontSize({ "id": 16777320, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 搜索按钮
                        Button.createWithChild();
                        // 搜索按钮
                        Button.width(40);
                        // 搜索按钮
                        Button.height(40);
                        // 搜索按钮
                        Button.backgroundColor(Color.Transparent);
                        // 搜索按钮
                        Button.border({ width: 1, color: { "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, radius: 20 });
                        // 搜索按钮
                        Button.onClick(() => {
                            Context.animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
                                this.showSearchBar = true;
                            });
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831500, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        SymbolGlyph.fontSize(20);
                        SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
                    }, SymbolGlyph);
                    // 搜索按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 多选按钮
                        Button.createWithChild();
                        // 多选按钮
                        Button.width(40);
                        // 多选按钮
                        Button.height(40);
                        // 多选按钮
                        Button.backgroundColor(Color.Transparent);
                        // 多选按钮
                        Button.border({ width: 1, color: { "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, radius: 20 });
                        // 多选按钮
                        Button.margin({ left: 10 });
                        // 多选按钮
                        Button.onClick(() => {
                            Context.animateTo({ duration: 250, curve: Curve.EaseInOut }, () => {
                                this.enterMultiSelectMode();
                            });
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831490, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        SymbolGlyph.fontSize(20);
                        SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
                    }, SymbolGlyph);
                    // 多选按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 添加按钮
                        Button.createWithChild();
                        // 添加按钮
                        Button.width(40);
                        // 添加按钮
                        Button.height(40);
                        // 添加按钮
                        Button.backgroundColor(Color.Transparent);
                        // 添加按钮
                        Button.border({ width: 1, color: { "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, radius: 20 });
                        // 添加按钮
                        Button.margin({ left: 10 });
                        // 添加按钮
                        Button.onClick(() => {
                            this.isAddMode = true;
                            Context.animateTo({ duration: 300, curve: Curve.EaseOut }, () => {
                                this.showPublishDialog = true;
                            });
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831481, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        SymbolGlyph.fontSize(20);
                        SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
                    }, SymbolGlyph);
                    // 添加按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 更多按钮
                        Button.createWithChild();
                        // 更多按钮
                        Button.width(40);
                        // 更多按钮
                        Button.height(40);
                        // 更多按钮
                        Button.backgroundColor(Color.Transparent);
                        // 更多按钮
                        Button.border({ width: 1, color: { "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, radius: 20 });
                        // 更多按钮
                        Button.margin({ left: 10 });
                        // 更多按钮
                        Button.onClick(() => {
                            Context.animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
                                this.showMoreDropdown = !this.showMoreDropdown;
                            });
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⋮');
                        Text.fontSize(22);
                        Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    // 更多按钮
                    Button.pop();
                    // 普通模式：随手记 + 多选/添加/更多
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索框（从导航栏下方展开，非整体滑入）
            Column.create();
            // 搜索框（从导航栏下方展开，非整体滑入）
            Column.width('100%');
            // 搜索框（从导航栏下方展开，非整体滑入）
            Column.clip(true);
            // 搜索框（从导航栏下方展开，非整体滑入）
            Column.height(this.showSearchBar ? 52 : 0);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
            Row.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({
                placeholder: '搜索时间、内容、地点…',
                text: this.searchKeyword
            });
            TextInput.placeholderColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            TextInput.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            TextInput.height(36);
            TextInput.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            TextInput.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            TextInput.layoutWeight(1);
            TextInput.enabled(this.showSearchBar);
            TextInput.onChange((value: string) => {
                this.searchKeyword = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(32);
            Button.height(32);
            Button.backgroundColor(Color.Transparent);
            Button.enabled(this.showSearchBar);
            Button.onClick(() => {
                Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                    this.showSearchBar = false;
                });
                this.searchKeyword = '';
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831487, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(14);
            SymbolGlyph.fontColor([{ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        Button.pop();
        Row.pop();
        // 搜索框（从导航栏下方展开，非整体滑入）
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 随手记列表
            if (this.momentsLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(40);
                        LoadingProgress.height(40);
                        LoadingProgress.layoutWeight(1);
                    }, LoadingProgress);
                });
            }
            else if (this.moments.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📸');
                        Text.fontSize(48);
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777237, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777238, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.width('100%');
                        Scroll.layoutWeight(1);
                        Scroll.align(Alignment.Top);
                        Scroll.scrollBar(BarState.Off);
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, top: 16, bottom: 100 });
                        Column.justifyContent(FlexAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const moment = _item;
                            this.MomentCard.bind(this)(moment);
                        };
                        this.forEachUpdateFunction(elmtId, this.showSearchBar && this.searchKeyword.trim() ? this.moments.filter((m: DiaryPost) => {
                            const kw = this.searchKeyword.trim().toLowerCase();
                            return (m.content && m.content.toLowerCase().includes(kw)) ||
                                (m.location && m.location.toLowerCase().includes(kw)) ||
                                (m.date && m.date.includes(kw));
                        }) : this.moments, forEachItemGenFunction, (moment: DiaryPost) => moment.id.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    Scroll.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 更多下拉菜单 + 遮罩（全屏 Stack 定位在右上角）
            if (this.showMoreDropdown) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create({ alignContent: Alignment.TopEnd });
                        Stack.width('100%');
                        Stack.height('100%');
                        Stack.zIndex(102);
                        Stack.transition(TransitionEffect.OPACITY
                            .combine(TransitionEffect.translate({ y: -6 }))
                            .animation({ duration: 200, curve: Curve.EaseOut }));
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 全屏透明遮罩（点击关闭）
                        Column.create();
                        // 全屏透明遮罩（点击关闭）
                        Column.width('100%');
                        // 全屏透明遮罩（点击关闭）
                        Column.height('100%');
                        // 全屏透明遮罩（点击关闭）
                        Column.onClick(() => {
                            Context.animateTo({ duration: 150, curve: Curve.EaseIn }, () => {
                                this.showMoreDropdown = false;
                            });
                        });
                    }, Column);
                    // 全屏透明遮罩（点击关闭）
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 下拉菜单（更多按钮正下方）
                        Column.create();
                        // 下拉菜单（更多按钮正下方）
                        Column.margin({ top: 52, right: 16 });
                    }, Column);
                    this.MoreDropdownMenu.bind(this)();
                    // 下拉菜单（更多按钮正下方）
                    Column.pop();
                    Stack.pop();
                });
            }
            // 多选模式底部操作栏（圆角方形组件）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 多选模式底部操作栏（圆角方形组件）
            if (this.isMultiSelectMode) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.transition(TransitionEffect.translate({ y: 72 })
                            .animation({ duration: 250, curve: Curve.EaseOut }));
                    }, Column);
                    this.MultiSelectBottomBar.bind(this)();
                    Column.pop();
                });
            }
            // 发布对话框
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 发布对话框
            if (this.showPublishDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.transition(TransitionEffect.OPACITY
                            .combine(this.isAddMode ? TransitionEffect.translate({ y: '100%' }) : TransitionEffect.scale({ x: 0.95, y: 0.95 }))
                            .animation({ duration: 300, curve: Curve.EaseOut }));
                    }, Column);
                    this.PublishDialog.bind(this)();
                    Column.pop();
                });
            }
            // 合集命名对话框
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 合集命名对话框
            if (this.showCollectionDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.transition(TransitionEffect.translate({ y: '100%' })
                            .animation({ duration: 250, curve: Curve.EaseOut }));
                    }, Column);
                    this.CollectionDialog.bind(this)();
                    Column.pop();
                });
            }
            // 删除确认对话框
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 删除确认对话框
            if (this.showDeleteConfirmDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.transition(TransitionEffect.scale({ x: 0.9, y: 0.9 })
                            .combine(TransitionEffect.opacity(0))
                            .animation({ duration: 200, curve: Curve.EaseOut }));
                    }, Column);
                    this.DeleteConfirmDialog.bind(this)();
                    Column.pop();
                });
            }
            // 新建合集对话框
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 新建合集对话框
            if (this.showNewCollectionDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.transition(TransitionEffect.translate({ y: '100%' })
                            .animation({ duration: 250, curve: Curve.EaseOut }));
                    }, Column);
                    this.NewCollectionDialog.bind(this)();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    // ==================== 随手记卡片组件 ====================
    MomentCard(moment: DiaryPost, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.borderRadius({ "id": 16777310, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.margin({ bottom: 12 });
            Column.shadow({ radius: 4, color: '#08000000', offsetX: 0, offsetY: 2 });
            Column.onClick(() => {
                if (this.isMultiSelectMode) {
                    this.toggleMomentSelection(moment.id);
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 头部：时间和位置
            Row.create();
            // 头部：时间和位置
            Row.width('100%');
            // 头部：时间和位置
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 多选圆圈（多选模式，在每条记录前显示）
            if (this.isMultiSelectMode) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.onClick(() => this.toggleMomentSelection(moment.id));
                        Row.hitTestBehavior(HitTestMode.Block);
                        Row.margin({ right: 10 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create({ width: 22, height: 22 });
                        Circle.fill(this.selectedMomentIds.has(moment.id) ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : Color.Transparent);
                        Circle.stroke(this.selectedMomentIds.has(moment.id) ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Circle.strokeWidth(2);
                    }, Circle);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(DateUtils.formatTime(moment.timestamp));
            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (moment.location) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`📍 ${moment.location}`);
                        Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.margin({ left: 12 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 头部：时间和位置
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 文字内容
            if (moment.content) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(moment.content);
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.lineHeight(24);
                        Text.width('100%');
                        Text.margin({ bottom: moment.mediaUrls && moment.mediaUrls.length > 0 ? 12 : 0 });
                    }, Text);
                    Text.pop();
                });
            }
            // 媒体网格
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 媒体网格
            if (moment.mediaUrls && moment.mediaUrls.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Grid.create();
                        Grid.columnsTemplate(moment.mediaUrls.length === 1 ? '1fr' :
                            moment.mediaUrls.length <= 4 ? '1fr 1fr' : '1fr 1fr 1fr');
                        Grid.rowsTemplate(moment.mediaUrls.length <= 2 ? '1fr' :
                            moment.mediaUrls.length <= 4 ? '1fr 1fr' : '1fr 1fr 1fr');
                        Grid.columnsGap(4);
                        Grid.rowsGap(4);
                        Grid.width('100%');
                        Grid.height(moment.mediaUrls.length === 1 ? 200 :
                            moment.mediaUrls.length <= 4 ? 300 : 400);
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const url = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Image.create(url);
                                        Image.width('100%');
                                        Image.height('100%');
                                        Image.objectFit(ImageFit.Cover);
                                        Image.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    }, Image);
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, moment.mediaUrls.slice(0, 9), forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Grid.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    // ==================== 发布对话框 ====================
    PublishDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.padding(this.isAddMode ? 16 : 20);
            Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.borderRadius(this.isAddMode ? 0 : { "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 对话框标题（左侧 X，中间标题，右侧发布）
            Row.create();
            // 对话框标题（左侧 X，中间标题，右侧发布）
            Row.width('100%');
            // 对话框标题（左侧 X，中间标题，右侧发布）
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 左侧关闭按钮
            Button.createWithChild();
            // 左侧关闭按钮
            Button.width(32);
            // 左侧关闭按钮
            Button.height(32);
            // 左侧关闭按钮
            Button.backgroundColor(Color.Transparent);
            // 左侧关闭按钮
            Button.onClick(() => {
                Context.animateTo({ duration: 250, curve: Curve.EaseIn }, () => {
                    this.showPublishDialog = false;
                    this.isAddMode = false;
                });
                this.newPostContent = '';
                this.newPostMediaUris = [];
                this.newPostLocation = '';
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831487, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        // 左侧关闭按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 中间标题
            Text.create('发布随手记');
            // 中间标题
            Text.fontSize({ "id": 16777315, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 中间标题
            Text.fontWeight(FontWeight.Medium);
            // 中间标题
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        // 中间标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 右侧发布按钮
            Button.createWithLabel('发布');
            // 右侧发布按钮
            Button.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 右侧发布按钮
            Button.fontColor(Color.White);
            // 右侧发布按钮
            Button.backgroundColor(this.newPostContent || this.newPostMediaUris.length > 0 ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : '#CCCCCC');
            // 右侧发布按钮
            Button.borderRadius(16);
            // 右侧发布按钮
            Button.width(56);
            // 右侧发布按钮
            Button.height(32);
            // 右侧发布按钮
            Button.onClick(() => this.publishMoment());
        }, Button);
        // 右侧发布按钮
        Button.pop();
        // 对话框标题（左侧 X，中间标题，右侧发布）
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 文字输入区
            TextArea.create({ placeholder: { "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, text: this.newPostContent });
            // 文字输入区
            TextArea.width('100%');
            // 文字输入区
            TextArea.height(this.isAddMode ? 200 : 120);
            // 文字输入区
            TextArea.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 文字输入区
            TextArea.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 文字输入区
            TextArea.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 文字输入区
            TextArea.padding(12);
            // 文字输入区
            TextArea.onChange((value: string) => { this.newPostContent = value; });
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图片区域：已选图片 + 添加按钮
            Row.create();
            // 图片区域：已选图片 + 添加按钮
            Row.width('100%');
            // 图片区域：已选图片 + 添加按钮
            Row.margin({ top: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollable(ScrollDirection.Horizontal);
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 已选图片预览
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const uri = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(uri);
                    Image.width(100);
                    Image.height(100);
                    Image.objectFit(ImageFit.Cover);
                    Image.borderRadius(6);
                }, Image);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithChild();
                    Button.width(18);
                    Button.height(18);
                    Button.backgroundColor('#80000000');
                    Button.borderRadius(9);
                    Button.position({ x: 0, y: 0 });
                    Button.offset({ x: -4, y: -4 });
                    Button.onClick(() => this.removeMedia(index));
                }, Button);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    SymbolGlyph.create({ "id": 125831487, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    SymbolGlyph.fontSize(10);
                    SymbolGlyph.fontColor([Color.White]);
                }, SymbolGlyph);
                Button.pop();
                Stack.pop();
            };
            this.forEachUpdateFunction(elmtId, this.newPostMediaUris, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        // 已选图片预览
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加图片的大加号按钮
            Row.create();
            // 添加图片的大加号按钮
            Row.width(100);
            // 添加图片的大加号按钮
            Row.height(100);
            // 添加图片的大加号按钮
            Row.border({ width: 1, color: { "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
            // 添加图片的大加号按钮
            Row.borderRadius(6);
            // 添加图片的大加号按钮
            Row.justifyContent(FlexAlign.Center);
            // 添加图片的大加号按钮
            Row.alignItems(VerticalAlign.Center);
            // 添加图片的大加号按钮
            Row.onClick(() => this.pickMedia());
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('＋');
            Text.fontSize(36);
            Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        // 添加图片的大加号按钮
        Row.pop();
        Row.pop();
        Scroll.pop();
        // 图片区域：已选图片 + 添加按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加位置（底部灰色框打底）
            Row.create();
            // 添加位置（底部灰色框打底）
            Row.width('100%');
            // 添加位置（底部灰色框打底）
            Row.padding({ left: 12, right: 12, top: 12, bottom: 12 });
            // 添加位置（底部灰色框打底）
            Row.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 添加位置（底部灰色框打底）
            Row.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 添加位置（底部灰色框打底）
            Row.onClick(() => {
                this.newPostLocation = '此刻位置';
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.newPostLocation ? `📍 ${this.newPostLocation}` : '添加位置');
            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.newPostLocation ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        // 添加位置（底部灰色框打底）
        Row.pop();
        Column.pop();
    }
    // ==================== 新建合集对话框 ====================
    NewCollectionDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#80000000');
            Column.justifyContent(FlexAlign.End);
            Column.onClick(() => {
                Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                    this.showNewCollectionDialog = false;
                });
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(20);
            Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.borderRadius({ topLeft: { "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, topRight: { "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏：返回  新建合集  创建
            Row.create();
            // 标题栏：返回  新建合集  创建
            Row.width('100%');
            // 标题栏：返回  新建合集  创建
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(32);
            Button.height(32);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                    this.showNewCollectionDialog = false;
                });
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832663, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('新建合集');
            Text.fontSize({ "id": 16777315, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('创建');
            Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.newCollectionName.trim().length > 0 && this.newCollectionName.trim().length <= 10
                ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.onClick(() => this.createNewCollection());
        }, Text);
        Text.pop();
        // 标题栏：返回  新建合集  创建
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 合集名称输入框
            TextInput.create({
                placeholder: '请输入合集名称（不多于 10 字）',
                text: this.newCollectionName
            });
            // 合集名称输入框
            TextInput.width('100%');
            // 合集名称输入框
            TextInput.height(48);
            // 合集名称输入框
            TextInput.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 合集名称输入框
            TextInput.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 合集名称输入框
            TextInput.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 合集名称输入框
            TextInput.padding({ left: 12, right: 12 });
            // 合集名称输入框
            TextInput.border({
                width: this.newCollectionName.length > 10 ? 1 : 0,
                color: this.newCollectionName.length > 10 ? '#FF4D4F' : Color.Transparent
            });
            // 合集名称输入框
            TextInput.fontColor(this.newCollectionName.length > 10 ? '#FF4D4F' : { "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 合集名称输入框
            TextInput.onChange((value: string) => { this.newCollectionName = value; });
            // 合集名称输入框
            TextInput.onSubmit(() => { this.createNewCollection(); });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 字数提示
            if (this.newCollectionName.length > 10) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('合集名称不能超过10个字');
                        Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor('#FF4D4F');
                        Text.width('100%');
                        Text.margin({ top: 6 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Column.pop();
    }
    // ==================== 合集命名对话框 ====================
    CollectionDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#80000000');
            Column.justifyContent(FlexAlign.End);
            Column.onClick(() => {
                Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                    this.showCollectionDialog = false;
                });
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(20);
            Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.borderRadius({ topLeft: { "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, topRight: { "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏：已选定 n 条  添加到  [X]
            Row.create();
            // 标题栏：已选定 n 条  添加到  [X]
            Row.width('100%');
            // 标题栏：已选定 n 条  添加到  [X]
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`已选定 ${this.selectedMomentIds.size} 条  添加到`);
            Text.fontSize({ "id": 16777315, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(32);
            Button.height(32);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                    this.showCollectionDialog = false;
                });
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831487, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        Button.pop();
        // 标题栏：已选定 n 条  添加到  [X]
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 新建合集行（与合集列表样式一致，前面加 +）
            Row.create();
            // 新建合集行（与合集列表样式一致，前面加 +）
            Row.width('100%');
            // 新建合集行（与合集列表样式一致，前面加 +）
            Row.height(44);
            // 新建合集行（与合集列表样式一致，前面加 +）
            Row.padding({ left: 12, right: 12 });
            // 新建合集行（与合集列表样式一致，前面加 +）
            Row.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 新建合集行（与合集列表样式一致，前面加 +）
            Row.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 新建合集行（与合集列表样式一致，前面加 +）
            Row.margin({ bottom: 8 });
            // 新建合集行（与合集列表样式一致，前面加 +）
            Row.onClick(() => {
                this.showCollectionDialog = false;
                this.newCollectionName = '';
                Context.animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
                    this.showNewCollectionDialog = true;
                });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('＋新建合集');
            Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        // 新建合集行（与合集列表样式一致，前面加 +）
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 已有合集列表
            if (this.collections.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 4 });
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const collection = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.height(44);
                                Row.padding({ left: 12, right: 12 });
                                Row.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                Row.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                Row.onClick(() => {
                                    this.addSelectedToCollection(collection);
                                });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(collection);
                                Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Blank.create();
                            }, Blank);
                            Blank.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${this.moments.filter((m) => m.category === collection).length}条`);
                                Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.collections, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无合集，点击上方按钮创建');
                        Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.width('100%');
                        Text.textAlign(TextAlign.Center);
                        Text.margin({ top: 8 });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Column.pop();
    }
    // ==================== 多选底部操作栏 ====================
    MultiSelectBottomBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Row.borderRadius({ topLeft: { "id": 16777310, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, topRight: { "id": 16777310, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
            Row.shadow({ radius: 8, color: '#15000000', offsetX: 0, offsetY: -2 });
            Row.zIndex(100);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加到（合集）
            Button.createWithChild();
            // 添加到（合集）
            Button.layoutWeight(1);
            // 添加到（合集）
            Button.height('100%');
            // 添加到（合集）
            Button.backgroundColor(Color.Transparent);
            // 添加到（合集）
            Button.onClick(() => this.showCreateCollectionDialog());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831897, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([{ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777331, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        // 添加到（合集）
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分隔线
            Divider.create();
            // 分隔线
            Divider.vertical(true);
            // 分隔线
            Divider.height(28);
            // 分隔线
            Divider.color({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 删除
            Button.createWithChild();
            // 删除
            Button.layoutWeight(1);
            // 删除
            Button.height('100%');
            // 删除
            Button.backgroundColor(Color.Transparent);
            // 删除
            Button.onClick(() => this.showDeleteConfirm());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831542, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([{ "id": 16777299, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777335, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777299, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        // 删除
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分隔线
            Divider.create();
            // 分隔线
            Divider.vertical(true);
            // 分隔线
            Divider.height(28);
            // 分隔线
            Divider.color({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 制作手账
            Button.createWithChild();
            // 制作手账
            Button.layoutWeight(1);
            // 制作手账
            Button.height('100%');
            // 制作手账
            Button.backgroundColor(Color.Transparent);
            // 制作手账
            Button.onClick(() => {
                if (this.isMultiSelectMode && this.selectedMomentIds.size > 0) {
                    this.generatePlogFromSelected();
                }
                else {
                    this.generatePlogFromToday();
                }
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831700, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([{ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777336, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        // 制作手账
        Button.pop();
        Column.pop();
        Row.pop();
    }
    // ==================== 更多下拉菜单 ====================
    MoreDropdownMenu(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(140);
            Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.borderRadius(12);
            Column.shadow({ radius: 12, color: '#15000000', offsetX: 0, offsetY: 6 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 小三角箭头（指向更多按钮）
            Row.create();
            // 小三角箭头（指向更多按钮）
            Row.width('100%');
            // 小三角箭头（指向更多按钮）
            Row.height(0);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(8);
            Column.height(8);
            Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.rotate({ angle: 45 });
            Column.margin({ top: -4, right: 14 });
        }, Column);
        Column.pop();
        // 小三角箭头（指向更多按钮）
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 合集选项
            Row.create({ space: 10 });
            // 合集选项
            Row.width('100%');
            // 合集选项
            Row.height(40);
            // 合集选项
            Row.padding({ left: 14, right: 14 });
            // 合集选项
            Row.borderRadius({ topLeft: 12, topRight: 12 });
            ViewStackProcessor.visualState("pressed");
            // 合集选项
            Row.backgroundColor('#F0F0F0');
            ViewStackProcessor.visualState("normal");
            // 合集选项
            Row.backgroundColor(Color.Transparent);
            ViewStackProcessor.visualState();
            // 合集选项
            Row.onClick(() => {
                this.showMoreDropdown = false;
                this.navigateToCollections();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831897, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(15);
            SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777338, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        // 合集选项
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.strokeWidth(0.5);
            Divider.color({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Divider.margin({ left: 14, right: 14 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手账本选项
            Row.create({ space: 10 });
            // 手账本选项
            Row.width('100%');
            // 手账本选项
            Row.height(40);
            // 手账本选项
            Row.padding({ left: 14, right: 14 });
            // 手账本选项
            Row.borderRadius({ bottomLeft: 12, bottomRight: 12 });
            ViewStackProcessor.visualState("pressed");
            // 手账本选项
            Row.backgroundColor('#F0F0F0');
            ViewStackProcessor.visualState("normal");
            // 手账本选项
            Row.backgroundColor(Color.Transparent);
            ViewStackProcessor.visualState();
            // 手账本选项
            Row.onClick(() => {
                this.showMoreDropdown = false;
                this.navigateToPlogGallery();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831935, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(15);
            SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777339, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        // 手账本选项
        Row.pop();
        Column.pop();
    }
    // ==================== 删除确认对话框 ====================
    DeleteConfirmDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#80000000');
            Column.onClick(() => {
                Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                    this.showDeleteConfirmDialog = false;
                });
                this.pendingDeleteCount = 0;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('85%');
            Column.padding(24);
            Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.borderRadius({ "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create({ "id": 16777334, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 标题
            Text.fontSize({ "id": 16777315, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 标题
            Text.fontWeight(FontWeight.Medium);
            // 标题
            Text.fontColor({ "id": 16777299, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 标题
            Text.margin({ bottom: 12 });
        }, Text);
        // 标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 确认内容
            Text.create(`确定要删除选中的 ${this.pendingDeleteCount} 条记录吗？此操作不可恢复。`);
            // 确认内容
            Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 确认内容
            Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 确认内容
            Text.textAlign(TextAlign.Center);
            // 确认内容
            Text.lineHeight(22);
            // 确认内容
            Text.margin({ bottom: 20 });
        }, Text);
        // 确认内容
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 按钮行
            Row.create();
            // 按钮行
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777265, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.layoutWeight(1);
            Button.height(40);
            Button.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.onClick(() => {
                Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                    this.showDeleteConfirmDialog = false;
                });
                this.pendingDeleteCount = 0;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777271, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.layoutWeight(1);
            Button.height(40);
            Button.backgroundColor({ "id": 16777299, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.fontColor(Color.White);
            Button.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.margin({ left: 12 });
            Button.onClick(() => {
                Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                    this.showDeleteConfirmDialog = false;
                });
                this.confirmDeleteSelectedMoments();
            });
        }, Button);
        Button.pop();
        // 按钮行
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "HomePage";
    }
}
export default HomePage;
registerNamedRoute(() => new HomePage(undefined, {}), "", { bundleName: "com.example.lifetracker", moduleName: "entry", pagePath: "pages/HomePage", pageFullPath: "entry/src/main/ets/pages/HomePage", integratedHsp: "false", moduleType: "followWithHap" });
