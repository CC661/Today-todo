if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    currentColors?: ThemeColors;
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
    editingTodoId?: number;
    isAddingRemark?: boolean;
    showRemindPicker?: boolean;
    showTagInput?: boolean;
    tagInputBuffer?: string;
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
import type { ThemeColors } from '../common/theme/ThemeManager';
class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentColors = this.createStorageLink('app_active_theme', {
            primary: '#ffac34',
            bgMain: '#fdfaf2',
            bgCard: '#ffffff',
            textMain: '#3e2723',
            textMuted: '#ffcd84',
            border: '#f6f0e2'
        }, "currentColors");
        this.__currentTabIndex = new ObservedPropertySimplePU(0, this, "currentTabIndex");
        this.tabTitles = [{ "id": 16777301, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, { "id": 16777299, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, { "id": 16777300, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }];
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
        this.__editingTodoId = new ObservedPropertySimplePU(0, this, "editingTodoId");
        this.__isAddingRemark = new ObservedPropertySimplePU(false, this, "isAddingRemark");
        this.__showRemindPicker = new ObservedPropertySimplePU(false, this, "showRemindPicker");
        this.__showTagInput = new ObservedPropertySimplePU(false, this, "showTagInput");
        this.__tagInputBuffer = new ObservedPropertySimplePU('', this, "tagInputBuffer");
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
        if (params.editingTodoId !== undefined) {
            this.editingTodoId = params.editingTodoId;
        }
        if (params.isAddingRemark !== undefined) {
            this.isAddingRemark = params.isAddingRemark;
        }
        if (params.showRemindPicker !== undefined) {
            this.showRemindPicker = params.showRemindPicker;
        }
        if (params.showTagInput !== undefined) {
            this.showTagInput = params.showTagInput;
        }
        if (params.tagInputBuffer !== undefined) {
            this.tagInputBuffer = params.tagInputBuffer;
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
        this.__currentColors.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTabIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__currentWeek.purgeDependencyOnElmtId(rmElmtId);
        this.__isCalendarExpanded.purgeDependencyOnElmtId(rmElmtId);
        this.__todos.purgeDependencyOnElmtId(rmElmtId);
        this.__newTodoText.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__monthCalendar.purgeDependencyOnElmtId(rmElmtId);
        this.__eventDates.purgeDependencyOnElmtId(rmElmtId);
        this.__editingTodoId.purgeDependencyOnElmtId(rmElmtId);
        this.__isAddingRemark.purgeDependencyOnElmtId(rmElmtId);
        this.__showRemindPicker.purgeDependencyOnElmtId(rmElmtId);
        this.__showTagInput.purgeDependencyOnElmtId(rmElmtId);
        this.__tagInputBuffer.purgeDependencyOnElmtId(rmElmtId);
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
        this.__currentColors.aboutToBeDeleted();
        this.__currentTabIndex.aboutToBeDeleted();
        this.__selectedDate.aboutToBeDeleted();
        this.__currentWeek.aboutToBeDeleted();
        this.__isCalendarExpanded.aboutToBeDeleted();
        this.__todos.aboutToBeDeleted();
        this.__newTodoText.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__monthCalendar.aboutToBeDeleted();
        this.__eventDates.aboutToBeDeleted();
        this.__editingTodoId.aboutToBeDeleted();
        this.__isAddingRemark.aboutToBeDeleted();
        this.__showRemindPicker.aboutToBeDeleted();
        this.__showTagInput.aboutToBeDeleted();
        this.__tagInputBuffer.aboutToBeDeleted();
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
    private __currentColors: ObservedPropertyAbstractPU<ThemeColors>;
    get currentColors() {
        return this.__currentColors.get();
    }
    set currentColors(newValue: ThemeColors) {
        this.__currentColors.set(newValue);
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
    private __editingTodoId: ObservedPropertySimplePU<number>; // 正在编辑的 Todo ID（0 表示不在编辑）
    get editingTodoId() {
        return this.__editingTodoId.get();
    }
    set editingTodoId(newValue: number) {
        this.__editingTodoId.set(newValue);
    }
    private __isAddingRemark: ObservedPropertySimplePU<boolean>; // 展开备注输入框
    get isAddingRemark() {
        return this.__isAddingRemark.get();
    }
    set isAddingRemark(newValue: boolean) {
        this.__isAddingRemark.set(newValue);
    }
    private __showRemindPicker: ObservedPropertySimplePU<boolean>; // 显示时间选择器
    get showRemindPicker() {
        return this.__showRemindPicker.get();
    }
    set showRemindPicker(newValue: boolean) {
        this.__showRemindPicker.set(newValue);
    }
    private __showTagInput: ObservedPropertySimplePU<boolean>; // 显示标签输入框
    get showTagInput() {
        return this.__showTagInput.get();
    }
    set showTagInput(newValue: boolean) {
        this.__showTagInput.set(newValue);
    }
    private __tagInputBuffer: ObservedPropertySimplePU<string>; // 标签输入缓冲
    get tagInputBuffer() {
        return this.__tagInputBuffer.get();
    }
    set tagInputBuffer(newValue: string) {
        this.__tagInputBuffer.set(newValue);
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
            }
            catch (error) {
                console.error('添加到合集失败:', error);
                promptAction.showToast({ message: '合集创建成功但添加失败' });
            }
        }
        else {
            promptAction.showToast({ message: '合集创建成功' });
        }
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
            const newId = await TodoViewModel.addTodo(this.newTodoText.trim(), this.selectedDate);
            this.newTodoText = '';
            await this.loadTodos();
            // 自动进入编辑模式
            this.editingTodoId = newId;
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
            console.error(`[HomePage] saveEditingTodo failed: ${JSON.stringify(error)}`);
        }
        finally {
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
        }
        catch (error) {
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
            if (this.editingTodoId === id) {
                this.editingTodoId = 0;
                this.isAddingRemark = false;
                this.showRemindPicker = false;
            }
            await this.loadTodos();
        }
        catch (error) {
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
        if (!todo || todo.id === undefined)
            return;
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
        if (!todo || todo.id === undefined)
            return;
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
        if (!todo || todo.id === undefined)
            return;
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
        if (!todo || todo.id === undefined)
            return;
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
        }
        catch (error) {
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
            promptAction.showToast({ message: { "id": 16777232, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
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
            promptAction.showToast({ message: { "id": 16777268, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
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
            Tabs.barBackgroundColor(this.currentColors.bgCard);
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
                            let componentCall = new SettingPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 730, col: 11 });
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
            Column.height(56);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 1. 动态判断图标：根据索引选择系统内置的矢量符号
            if (index === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Tab 0: 待办（打勾文档图标）
                        SymbolGlyph.create({ "id": 125831261, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        // Tab 0: 待办（打勾文档图标）
                        SymbolGlyph.fontSize(22);
                        // Tab 0: 待办（打勾文档图标）
                        SymbolGlyph.fontColor([this.currentTabIndex === 0 ? this.currentColors.primary : this.currentColors.textMuted]);
                    }, SymbolGlyph);
                });
            }
            else if (index === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Tab 1: 手账 / 随手记（书本/画笔图标，这里用内置的经典书本符号）
                        SymbolGlyph.create({ "id": 125831913, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        // Tab 1: 手账 / 随手记（书本/画笔图标，这里用内置的经典书本符号）
                        SymbolGlyph.fontSize(22);
                        // Tab 1: 手账 / 随手记（书本/画笔图标，这里用内置的经典书本符号）
                        SymbolGlyph.fontColor([this.currentTabIndex === 1 ? this.currentColors.primary : this.currentColors.textMuted]);
                    }, SymbolGlyph);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Tab 2: 设置（齿轮图标）
                        SymbolGlyph.create({ "id": 125831493, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        // Tab 2: 设置（齿轮图标）
                        SymbolGlyph.fontSize(22);
                        // Tab 2: 设置（齿轮图标）
                        SymbolGlyph.fontColor([this.currentTabIndex === 2 ? this.currentColors.primary : this.currentColors.textMuted]);
                    }, SymbolGlyph);
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 2. 动态判断文字颜色
            Text.create(index === 0 ? '待办' : index === 1 ? '手账' : '设置');
            // 2. 动态判断文字颜色
            Text.fontSize(11);
            // 2. 动态判断文字颜色
            Text.fontWeight(this.currentTabIndex === index ? FontWeight.Medium : FontWeight.Normal);
            // 2. 动态判断文字颜色
            Text.fontColor(this.currentTabIndex === index ? this.currentColors.primary : this.currentColors.textMuted);
            // 2. 动态判断文字颜色
            Text.margin({ top: 4 });
        }, Text);
        // 2. 动态判断文字颜色
        Text.pop();
        Column.pop();
    }
    // ==================== Todo 内容区 ====================
    TodoContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 💡 【大布局重构】：最外层保持一个大 Column 占满全屏
            Column.create();
            // 💡 【大布局重构】：最外层保持一个大 Column 占满全屏
            Column.width('100%');
            // 💡 【大布局重构】：最外层保持一个大 Column 占满全屏
            Column.height('100%');
            // 💡 【大布局重构】：最外层保持一个大 Column 占满全屏
            Column.expandSafeArea([SafeAreaType.KEYBOARD], [SafeAreaEdge.BOTTOM]);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 💡 核心点 1：将日历、列表和悬浮加号包裹在这个独立的 Stack 中
            // 并且赋予它 .layoutWeight(1)，这意味着它是“弹性主体”
            Stack.create({ alignContent: Alignment.BottomEnd });
            // 💡 核心点 1：将日历、列表和悬浮加号包裹在这个独立的 Stack 中
            // 并且赋予它 .layoutWeight(1)，这意味着它是“弹性主体”
            Stack.width('100%');
            // 💡 核心点 1：将日历、列表和悬浮加号包裹在这个独立的 Stack 中
            // 并且赋予它 .layoutWeight(1)，这意味着它是“弹性主体”
            Stack.layoutWeight(1);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主体内容滚动区
            Column.create();
            // 主体内容滚动区
            Column.width('100%');
            // 主体内容滚动区
            Column.height('100%');
            // 主体内容滚动区
            Column.backgroundColor(this.currentColors.bgMain);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 1. 日历头部行
            Row.create();
            // 1. 日历头部行
            Row.width('100%');
            // 1. 日历头部行
            Row.padding({ left: 16, right: 16, top: 16, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(DateUtils.formatDisplayDate(this.selectedDate));
            Text.fontSize({ "id": 16777337, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.currentColors.textMain);
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
            SymbolGlyph.fontColor([this.currentColors.textMuted]);
            SymbolGlyph.rotate({ angle: this.isCalendarExpanded ? 180 : 0 });
            globalThis.Context.animation(null);
        }, SymbolGlyph);
        Button.pop();
        // 1. 日历头部行
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.margin({ top: 8, left: 16, right: 16 });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 2. 周日历
                    WeekCalendarComponent(this, {
                        currentWeek: this.currentWeek,
                        selectedDate: this.selectedDate,
                        colors: this.currentColors,
                        onDateSelected: (date: string) => this.onDateSelected(date)
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 823, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            currentWeek: this.currentWeek,
                            selectedDate: this.selectedDate,
                            colors: this.currentColors,
                            onDateSelected: (date: string) => this.onDateSelected(date)
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        currentWeek: this.currentWeek,
                        selectedDate: this.selectedDate,
                        colors: this.currentColors
                    });
                }
            }, { name: "WeekCalendarComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 3. 月日历展开
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
                                    colors: this.currentColors,
                                    onDateSelected: (date: string) => {
                                        this.onDateSelected(date);
                                        this.toggleCalendar();
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 833, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        calendar: this.monthCalendar,
                                        selectedDate: this.selectedDate,
                                        eventDates: this.eventDates,
                                        colors: this.currentColors,
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
                                    eventDates: this.eventDates,
                                    colors: this.currentColors
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
            Divider.color(this.currentColors.border);
            Divider.margin({ top: this.isCalendarExpanded ? 12 : 8, bottom: 8 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 4. 标题栏：提醒（iOS 风格大标题）
            Row.create();
            // 4. 标题栏：提醒（iOS 风格大标题）
            Row.width('100%');
            // 4. 标题栏：提醒（iOS 风格大标题）
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('提醒');
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.currentColors.primary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        // 4. 标题栏：提醒（iOS 风格大标题）
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 5. 待办列表
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
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.todos.length === 0 && this.editingTodoId === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
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
                                    Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor(this.currentColors.textMuted);
                                }, Text);
                                Text.pop();
                                Column.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    __Common__.create();
                                    __Common__.borderRadius({ "id": 16777327, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    __Common__.backgroundColor(this.currentColors.bgCard);
                                    __Common__.shadow({
                                        radius: 12,
                                        color: '#0d000000',
                                        offsetX: 0,
                                        offsetY: 4
                                    });
                                }, __Common__);
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new TodoListComponent(this, {
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
                                                    if (idx >= 0) {
                                                        this.todos[idx].content = content;
                                                    }
                                                },
                                                onEditSubmit: async (id: number, content: string, remark?: string) => {
                                                    await this.saveEditingTodo(id, content, remark);
                                                },
                                                onAddRemarkClick: () => {
                                                    this.isAddingRemark = true;
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 874, col: 15 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
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
                                                        if (idx >= 0) {
                                                            this.todos[idx].content = content;
                                                        }
                                                    },
                                                    onEditSubmit: async (id: number, content: string, remark?: string) => {
                                                        await this.saveEditingTodo(id, content, remark);
                                                    },
                                                    onAddRemarkClick: () => {
                                                        this.isAddingRemark = true;
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                todos: this.todos,
                                                editingTodoId: this.editingTodoId,
                                                isAddingRemark: this.isAddingRemark
                                            });
                                        }
                                    }, { name: "TodoListComponent" });
                                }
                                __Common__.pop();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
        }, If);
        If.pop();
        // 主体内容滚动区
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 悬浮加号按钮（只在非编辑态显示，隶属于 Stack 右下角）
            if (this.editingTodoId === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle });
                        Button.width(56);
                        Button.height(56);
                        Button.backgroundColor(this.currentColors.primary);
                        Button.margin({ right: 24, bottom: 24 });
                        Button.shadow({ radius: 8, color: '#30000000', offsetX: 0, offsetY: 4 });
                        Button.zIndex(999);
                        Button.onClick(() => { this.addBlankTodo(); });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('+');
                        Text.fontSize(36);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 💡 核心点 1：将日历、列表和悬浮加号包裹在这个独立的 Stack 中
        // 并且赋予它 .layoutWeight(1)，这意味着它是“弹性主体”
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 💡 核心点 2：把你的 `EditingToolbar()` 彻底解放出来，放到 Stack 的正下方、大 Column 的最底部！
            if (this.editingTodoId > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.EditingToolbar.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 💡 【大布局重构】：最外层保持一个大 Column 占满全屏
        Column.pop();
    }
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
            Column.backgroundColor(this.currentColors.bgMain);
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
                        Button.createWithLabel({ "id": 16777254, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.backgroundColor(Color.Transparent);
                        Button.fontColor(this.currentColors.primary);
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
                        Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(this.currentColors.textMain);
                        globalThis.Context.animation(null);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel({ "id": 16777231, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.backgroundColor(Color.Transparent);
                        Button.fontColor(this.currentColors.primary);
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
                        Text.create({ "id": 16777257, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontSize({ "id": 16777337, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(this.currentColors.textMain);
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
                        Button.border({ width: 1, color: this.currentColors.border, radius: 20 });
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
                        SymbolGlyph.fontColor([this.currentColors.textMuted]);
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
                        Button.border({ width: 1, color: this.currentColors.border, radius: 20 });
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
                        SymbolGlyph.fontColor([this.currentColors.textMuted]);
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
                        Button.border({ width: 1, color: this.currentColors.border, radius: 20 });
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
                        SymbolGlyph.fontColor([this.currentColors.textMuted]);
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
                        Button.border({ width: 1, color: this.currentColors.border, radius: 20 });
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
                        Text.fontColor(this.currentColors.textMuted);
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
            Divider.color(this.currentColors.border);
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
            Row.backgroundColor(this.currentColors.bgCard);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({
                placeholder: '搜索时间、内容、地点…',
                text: this.searchKeyword
            });
            TextInput.placeholderColor(this.currentColors.textMuted);
            TextInput.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            TextInput.height(36);
            TextInput.backgroundColor(this.currentColors.bgMain);
            TextInput.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
            SymbolGlyph.fontColor([this.currentColors.textMuted]);
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
                        Text.create({ "id": 16777248, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor(this.currentColors.textMuted);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777249, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor(this.currentColors.textMuted);
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
            Column.backgroundColor(this.currentColors.bgCard);
            Column.borderRadius({ "id": 16777327, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.margin({ bottom: 12 });
            Column.shadow({ radius: 12, color: '#0d000000', offsetX: 0, offsetY: 4 });
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
                        Circle.fill(this.selectedMomentIds.has(moment.id) ?
                            this.currentColors.primary : Color.Transparent);
                        Circle.stroke(this.selectedMomentIds.has(moment.id) ?
                            this.currentColors.primary : this.currentColors.textMuted);
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
            Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.currentColors.textMuted);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (moment.location) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`📍 ${moment.location}`);
                        Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor(this.currentColors.textMuted);
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
                        Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor(this.currentColors.textMain);
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
                                        Image.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
            Column.backgroundColor(this.currentColors.bgCard);
            Column.borderRadius(this.isAddMode ? 0 : { "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
            SymbolGlyph.fontColor([this.currentColors.textMuted]);
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
            Text.fontSize({ "id": 16777332, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 中间标题
            Text.fontWeight(FontWeight.Medium);
            // 中间标题
            Text.fontColor(this.currentColors.textMain);
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
            Button.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 右侧发布按钮
            Button.fontColor(Color.White);
            // 右侧发布按钮
            Button.backgroundColor(this.newPostContent || this.newPostMediaUris.length > 0 ?
                this.currentColors.primary : '#CCCCCC');
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
            TextArea.create({ placeholder: { "id": 16777251, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, text: this.newPostContent });
            // 文字输入区
            TextArea.width('100%');
            // 文字输入区
            TextArea.height(this.isAddMode ? 200 : 120);
            // 文字输入区
            TextArea.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 文字输入区
            TextArea.backgroundColor(this.currentColors.bgMain);
            // 文字输入区
            TextArea.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
            Row.border({ width: 1, color: this.currentColors.border });
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
            Text.fontColor(this.currentColors.textMuted);
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
            // 添加位置（可输入的文字框）
            Row.create({ space: 8 });
            // 添加位置（可输入的文字框）
            Row.width('100%');
            // 添加位置（可输入的文字框）
            Row.height(44);
            // 添加位置（可输入的文字框）
            Row.padding({ left: 12, right: 8, top: 4, bottom: 4 });
            // 添加位置（可输入的文字框）
            Row.backgroundColor(this.currentColors.bgMain);
            // 添加位置（可输入的文字框）
            Row.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 添加位置（可输入的文字框）
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📍');
            Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '添加位置', text: this.newPostLocation });
            TextInput.layoutWeight(1);
            TextInput.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            TextInput.fontColor(this.currentColors.textMain);
            TextInput.placeholderColor(this.currentColors.textMuted);
            TextInput.backgroundColor(Color.Transparent);
            TextInput.padding(0);
            TextInput.borderRadius(0);
            TextInput.onChange((value: string) => { this.newPostLocation = value; });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.newPostLocation) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(24);
                        Button.height(24);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => { this.newPostLocation = ''; });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831487, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        SymbolGlyph.fontSize(12);
                        SymbolGlyph.fontColor([this.currentColors.textMuted]);
                    }, SymbolGlyph);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 添加位置（可输入的文字框）
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
            Column.backgroundColor(this.currentColors.bgCard);
            Column.borderRadius({ topLeft: { "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, topRight: { "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
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
            SymbolGlyph.fontColor([this.currentColors.textMuted]);
        }, SymbolGlyph);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('新建合集');
            Text.fontSize({ "id": 16777332, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.currentColors.textMain);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('创建');
            Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.newCollectionName.trim().length > 0 && this.newCollectionName.trim().length <= 10
                ? this.currentColors.primary : this.currentColors.textMuted);
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
            TextInput.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 合集名称输入框
            TextInput.backgroundColor(this.currentColors.bgMain);
            // 合集名称输入框
            TextInput.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 合集名称输入框
            TextInput.padding({ left: 12, right: 12 });
            // 合集名称输入框
            TextInput.border({
                width: this.newCollectionName.length > 10 ? 1 : 0,
                color: this.newCollectionName.length > 10 ? '#FF4D4F' : Color.Transparent
            });
            // 合集名称输入框
            TextInput.fontColor(this.newCollectionName.length > 10 ? '#FF4D4F' : this.currentColors.textMain);
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
                        Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
            Column.backgroundColor(this.currentColors.bgCard);
            Column.borderRadius({ topLeft: { "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, topRight: { "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
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
            Text.fontSize({ "id": 16777332, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.currentColors.textMain);
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
            SymbolGlyph.fontColor([this.currentColors.textMuted]);
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
            Row.backgroundColor(this.currentColors.bgMain);
            // 新建合集行（与合集列表样式一致，前面加 +）
            Row.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
            Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.currentColors.textMain);
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
                                Row.backgroundColor(this.currentColors.bgMain);
                                Row.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                Row.onClick(() => {
                                    this.addSelectedToCollection(collection);
                                });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(collection);
                                Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                Text.fontColor(this.currentColors.textMain);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Blank.create();
                            }, Blank);
                            Blank.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${this.moments.filter((m) => m.category === collection).length}条`);
                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                Text.fontColor(this.currentColors.textMuted);
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
                        Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor(this.currentColors.textMuted);
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
            Row.backgroundColor(this.currentColors.bgCard);
            Row.borderRadius({ topLeft: { "id": 16777327, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, topRight: { "id": 16777327, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
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
            SymbolGlyph.fontColor([this.currentColors.primary]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777230, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.currentColors.primary);
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
            Divider.color(this.currentColors.border);
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
            SymbolGlyph.fontColor(['#FF4D4F']);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor('#FF4D4F');
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
            Divider.color(this.currentColors.border);
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
            SymbolGlyph.fontColor([this.currentColors.primary]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777241, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.currentColors.primary);
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
            Column.backgroundColor(this.currentColors.bgCard);
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
            Column.backgroundColor(this.currentColors.bgCard);
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
            SymbolGlyph.fontColor([this.currentColors.textMuted]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777245, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.currentColors.textMain);
        }, Text);
        Text.pop();
        // 合集选项
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.strokeWidth(0.5);
            Divider.color(this.currentColors.border);
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
            SymbolGlyph.fontColor([this.currentColors.textMuted]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777246, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.currentColors.textMain);
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
            Column.backgroundColor(this.currentColors.bgCard);
            Column.borderRadius({ "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create({ "id": 16777239, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 标题
            Text.fontSize({ "id": 16777332, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 标题
            Text.fontWeight(FontWeight.Medium);
            // 标题
            Text.fontColor('#FF4D4F');
            // 标题
            Text.margin({ bottom: 12 });
        }, Text);
        // 标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 确认内容
            Text.create(`确定要删除选中的 ${this.pendingDeleteCount} 条记录吗？此操作不可恢复。`);
            // 确认内容
            Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 确认内容
            Text.fontColor(this.currentColors.textMuted);
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
            Button.createWithLabel({ "id": 16777278, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.layoutWeight(1);
            Button.height(40);
            Button.backgroundColor(this.currentColors.bgMain);
            Button.fontColor(this.currentColors.textMain);
            Button.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.onClick(() => {
                Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                    this.showDeleteConfirmDialog = false;
                });
                this.pendingDeleteCount = 0;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777284, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.layoutWeight(1);
            Button.height(40);
            Button.backgroundColor('#FF4D4F');
            Button.fontColor(Color.White);
            Button.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
    // ==================== Todo 编辑工具栏（键盘上方） ====================
    EditingToolbar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor(this.currentColors.bgMain);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 时间选择器（展开时）
            if (this.showRemindPicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.RemindTimePicker.bind(this)();
                });
            }
            // 标签输入框（展开时）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 标签输入框（展开时）
            if (this.showTagInput) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.TagInputView.bind(this)();
                });
            }
            // 工具栏图标行：日历 / 定位 / 标签 / 旗帜 / 相机
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 工具栏图标行：日历 / 定位 / 标签 / 旗帜 / 相机
            Row.create();
            // 工具栏图标行：日历 / 定位 / 标签 / 旗帜 / 相机
            Row.width('100%');
            // 工具栏图标行：日历 / 定位 / 标签 / 旗帜 / 相机
            Row.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            // 工具栏图标行：日历 / 定位 / 标签 / 旗帜 / 相机
            Row.backgroundColor(this.currentColors.bgMain);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日历图标（提醒时间）
            Button.createWithChild();
            // 日历图标（提醒时间）
            Button.width(44);
            // 日历图标（提醒时间）
            Button.height(44);
            // 日历图标（提醒时间）
            Button.backgroundColor(Color.Transparent);
            // 日历图标（提醒时间）
            Button.onClick(() => {
                this.showRemindPicker = !this.showRemindPicker;
                this.showTagInput = false;
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832312, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(22);
            SymbolGlyph.fontColor([this.showRemindPicker ? this.currentColors.primary : this.currentColors.textMuted]);
        }, SymbolGlyph);
        // 日历图标（提醒时间）
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 定位图标
            Button.createWithChild();
            // 定位图标
            Button.width(44);
            // 定位图标
            Button.height(44);
            // 定位图标
            Button.backgroundColor(Color.Transparent);
            // 定位图标
            Button.onClick(() => {
                this.setTodoLocation('此刻位置');
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📍');
            Text.fontSize(22);
            Text.fontColor(this.getEditingTodo()?.location ? this.currentColors.primary : this.currentColors.textMuted);
        }, Text);
        Text.pop();
        // 定位图标
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标签图标 (#)
            Button.createWithChild();
            // 标签图标 (#)
            Button.width(44);
            // 标签图标 (#)
            Button.height(44);
            // 标签图标 (#)
            Button.backgroundColor(Color.Transparent);
            // 标签图标 (#)
            Button.onClick(() => {
                this.showTagInput = !this.showTagInput;
                this.showRemindPicker = false;
                if (this.showTagInput) {
                    this.tagInputBuffer = this.getEditingTodo()?.tag || '';
                }
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('#');
            Text.fontSize(22);
            Text.fontColor(this.getEditingTodo()?.tag ? this.currentColors.primary : this.currentColors.textMuted);
        }, Text);
        Text.pop();
        // 标签图标 (#)
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 旗帜图标
            Button.createWithChild();
            // 旗帜图标
            Button.width(44);
            // 旗帜图标
            Button.height(44);
            // 旗帜图标
            Button.backgroundColor(Color.Transparent);
            // 旗帜图标
            Button.onClick(() => {
                this.toggleTodoFlagged();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831594, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(22);
            SymbolGlyph.fontColor([this.getEditingTodo()?.flagged ? this.currentColors.primary : this.currentColors.textMuted]);
        }, SymbolGlyph);
        // 旗帜图标
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 相机图标
            Button.createWithChild();
            // 相机图标
            Button.width(44);
            // 相机图标
            Button.height(44);
            // 相机图标
            Button.backgroundColor(Color.Transparent);
            // 相机图标
            Button.onClick(() => {
                this.pickTodoImage();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832421, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(22);
            SymbolGlyph.fontColor([this.getEditingTodo()?.imageUris ? this.currentColors.primary : this.currentColors.textMuted]);
        }, SymbolGlyph);
        // 相机图标
        Button.pop();
        // 工具栏图标行：日历 / 定位 / 标签 / 旗帜 / 相机
        Row.pop();
        Column.pop();
    }
    /**
     * 标签输入框
     */
    TagInputView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 8, top: 4, bottom: 4 });
            Row.backgroundColor(this.currentColors.bgMain);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.tagInputBuffer, placeholder: '输入标签...' });
            TextInput.fontSize(14);
            TextInput.fontColor(this.currentColors.textMain);
            TextInput.backgroundColor(Color.Transparent);
            TextInput.padding(0);
            TextInput.layoutWeight(1);
            TextInput.height(36);
            TextInput.onChange((value: string) => {
                this.tagInputBuffer = value;
            });
            TextInput.onSubmit(() => {
                this.setTodoTag(this.tagInputBuffer.trim());
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(36);
            Button.height(36);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                this.setTodoTag(this.tagInputBuffer.trim());
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831490, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([this.currentColors.primary]);
        }, SymbolGlyph);
        Button.pop();
        Row.pop();
    }
    /**
     * 提醒时间选择器
     */
    RemindTimePicker(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 4, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const time = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(time);
                    Button.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Button.fontColor(this.currentColors.textMain);
                    Button.backgroundColor(this.currentColors.bgMain);
                    Button.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Button.height(32);
                    Button.padding({ left: 8, right: 8 });
                    Button.onClick(() => {
                        const parts = time.split(':');
                        this.setRemindTime(parseInt(parts[0]), parseInt(parts[1]));
                    });
                }, Button);
                Button.pop();
            };
            this.forEachUpdateFunction(elmtId, ['08:00', '09:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777305, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.fontColor(this.currentColors.textMuted);
            Button.backgroundColor(this.currentColors.bgMain);
            Button.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.height(32);
            Button.padding({ left: 8, right: 8 });
            Button.onClick(() => {
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
            });
        }, Button);
        Button.pop();
        Row.pop();
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
