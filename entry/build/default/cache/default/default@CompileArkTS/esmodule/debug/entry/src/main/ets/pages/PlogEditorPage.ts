if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PlogEditorPage_Params {
    plog?: PlogCanvas | null;
    elements?: CanvasElement[];
    selectedElementIndex?: number;
    showMaterialPanel?: boolean;
    todayDiaryPosts?: DiaryPost[];
    showDiaryPanel?: boolean;
    selectedDiaryIds?: Set<number>;
    activeToolTab?: number;
    activeSubTool?: number;
    panelExpanded?: boolean;
    plogIdFromParams?: number;
    diaryIdsFromParams?: number[];
    textSubTools?: string[];
}
import PlogViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/PlogViewModel&";
import DiaryViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/DiaryViewModel&";
import type { PlogCanvas, CanvasElement } from '../model/PlogCanvas';
import type { DiaryPost } from '../model/DiaryPost';
import type { TodoItem } from '../model/TodoItem';
import type { PlogInsertParams } from '../common/database/RDBStoreUtil';
import DateUtils from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtils&";
import router from "@ohos:router";
import curves from "@native:ohos.curves";
import promptAction from "@ohos:promptAction";
class PlogEditorPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__plog = new ObservedPropertyObjectPU(null, this, "plog");
        this.__elements = new ObservedPropertyObjectPU([], this, "elements");
        this.__selectedElementIndex = new ObservedPropertySimplePU(-1, this, "selectedElementIndex");
        this.__showMaterialPanel = new ObservedPropertySimplePU(false, this, "showMaterialPanel");
        this.__todayDiaryPosts = new ObservedPropertyObjectPU([], this, "todayDiaryPosts");
        this.__showDiaryPanel = new ObservedPropertySimplePU(false, this, "showDiaryPanel");
        this.__selectedDiaryIds = new ObservedPropertyObjectPU(new Set(), this, "selectedDiaryIds");
        this.__activeToolTab = new ObservedPropertySimplePU(-1, this, "activeToolTab");
        this.__activeSubTool = new ObservedPropertySimplePU(0, this, "activeSubTool");
        this.__panelExpanded = new ObservedPropertySimplePU(false, this, "panelExpanded");
        this.plogIdFromParams = 0;
        this.diaryIdsFromParams = [];
        this.textSubTools = ['样式', '颜色', '排版', '粗斜体', '弯曲'];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PlogEditorPage_Params) {
        if (params.plog !== undefined) {
            this.plog = params.plog;
        }
        if (params.elements !== undefined) {
            this.elements = params.elements;
        }
        if (params.selectedElementIndex !== undefined) {
            this.selectedElementIndex = params.selectedElementIndex;
        }
        if (params.showMaterialPanel !== undefined) {
            this.showMaterialPanel = params.showMaterialPanel;
        }
        if (params.todayDiaryPosts !== undefined) {
            this.todayDiaryPosts = params.todayDiaryPosts;
        }
        if (params.showDiaryPanel !== undefined) {
            this.showDiaryPanel = params.showDiaryPanel;
        }
        if (params.selectedDiaryIds !== undefined) {
            this.selectedDiaryIds = params.selectedDiaryIds;
        }
        if (params.activeToolTab !== undefined) {
            this.activeToolTab = params.activeToolTab;
        }
        if (params.activeSubTool !== undefined) {
            this.activeSubTool = params.activeSubTool;
        }
        if (params.panelExpanded !== undefined) {
            this.panelExpanded = params.panelExpanded;
        }
        if (params.plogIdFromParams !== undefined) {
            this.plogIdFromParams = params.plogIdFromParams;
        }
        if (params.diaryIdsFromParams !== undefined) {
            this.diaryIdsFromParams = params.diaryIdsFromParams;
        }
        if (params.textSubTools !== undefined) {
            this.textSubTools = params.textSubTools;
        }
    }
    updateStateVars(params: PlogEditorPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__plog.purgeDependencyOnElmtId(rmElmtId);
        this.__elements.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedElementIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__showMaterialPanel.purgeDependencyOnElmtId(rmElmtId);
        this.__todayDiaryPosts.purgeDependencyOnElmtId(rmElmtId);
        this.__showDiaryPanel.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDiaryIds.purgeDependencyOnElmtId(rmElmtId);
        this.__activeToolTab.purgeDependencyOnElmtId(rmElmtId);
        this.__activeSubTool.purgeDependencyOnElmtId(rmElmtId);
        this.__panelExpanded.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__plog.aboutToBeDeleted();
        this.__elements.aboutToBeDeleted();
        this.__selectedElementIndex.aboutToBeDeleted();
        this.__showMaterialPanel.aboutToBeDeleted();
        this.__todayDiaryPosts.aboutToBeDeleted();
        this.__showDiaryPanel.aboutToBeDeleted();
        this.__selectedDiaryIds.aboutToBeDeleted();
        this.__activeToolTab.aboutToBeDeleted();
        this.__activeSubTool.aboutToBeDeleted();
        this.__panelExpanded.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __plog: ObservedPropertyObjectPU<PlogCanvas | null>;
    get plog() {
        return this.__plog.get();
    }
    set plog(newValue: PlogCanvas | null) {
        this.__plog.set(newValue);
    }
    private __elements: ObservedPropertyObjectPU<CanvasElement[]>;
    get elements() {
        return this.__elements.get();
    }
    set elements(newValue: CanvasElement[]) {
        this.__elements.set(newValue);
    }
    private __selectedElementIndex: ObservedPropertySimplePU<number>;
    get selectedElementIndex() {
        return this.__selectedElementIndex.get();
    }
    set selectedElementIndex(newValue: number) {
        this.__selectedElementIndex.set(newValue);
    }
    private __showMaterialPanel: ObservedPropertySimplePU<boolean>;
    get showMaterialPanel() {
        return this.__showMaterialPanel.get();
    }
    set showMaterialPanel(newValue: boolean) {
        this.__showMaterialPanel.set(newValue);
    }
    // 随手记相关
    private __todayDiaryPosts: ObservedPropertyObjectPU<DiaryPost[]>;
    get todayDiaryPosts() {
        return this.__todayDiaryPosts.get();
    }
    set todayDiaryPosts(newValue: DiaryPost[]) {
        this.__todayDiaryPosts.set(newValue);
    }
    private __showDiaryPanel: ObservedPropertySimplePU<boolean>;
    get showDiaryPanel() {
        return this.__showDiaryPanel.get();
    }
    set showDiaryPanel(newValue: boolean) {
        this.__showDiaryPanel.set(newValue);
    }
    private __selectedDiaryIds: ObservedPropertyObjectPU<Set<number>>;
    get selectedDiaryIds() {
        return this.__selectedDiaryIds.get();
    }
    set selectedDiaryIds(newValue: Set<number>) {
        this.__selectedDiaryIds.set(newValue);
    }
    // 当前激活的主工具: 0=随手记, 1=背景, 2=文字, 3=贴纸, 4=画笔
    private __activeToolTab: ObservedPropertySimplePU<number>;
    get activeToolTab() {
        return this.__activeToolTab.get();
    }
    set activeToolTab(newValue: number) {
        this.__activeToolTab.set(newValue);
    }
    // 当前激活的子工具（文字: 0=样式,1=颜色,2=排版,3=粗斜体,4=弯曲）
    private __activeSubTool: ObservedPropertySimplePU<number>;
    get activeSubTool() {
        return this.__activeSubTool.get();
    }
    set activeSubTool(newValue: number) {
        this.__activeSubTool.set(newValue);
    }
    // 面板展开状态（子工具栏+详细设置是否显示）
    private __panelExpanded: ObservedPropertySimplePU<boolean>;
    get panelExpanded() {
        return this.__panelExpanded.get();
    }
    set panelExpanded(newValue: boolean) {
        this.__panelExpanded.set(newValue);
    }
    private plogIdFromParams: number;
    private diaryIdsFromParams: number[];
    private textSubTools: string[];
    aboutToAppear(): void {
        const params = router.getParams() as Record<string, Object> | null;
        if (params) {
            if (params['plogId']) {
                this.plogIdFromParams = params['plogId'] as number;
            }
            if (params['diaryIdsStr']) {
                const str = params['diaryIdsStr'] as string;
                if (str && str.length > 0) {
                    this.diaryIdsFromParams = str.split(',').map((s: string) => parseInt(s, 10));
                }
            }
        }
        this.initPlogAndLoadDiary();
    }
    async initPlogAndLoadDiary(): Promise<void> {
        await this.initPlog();
        await this.loadTodayDiaryPosts();
    }
    async initPlog(): Promise<void> {
        if (this.plogIdFromParams > 0) {
            const existingPlog = await PlogViewModel.getPlogById(this.plogIdFromParams);
            if (existingPlog) {
                this.plog = existingPlog;
                this.elements = existingPlog.elements;
                // 从已保存的手账中恢复diaryIds
                if (existingPlog.diaryIds && existingPlog.diaryIds.length > 0) {
                    this.diaryIdsFromParams = existingPlog.diaryIds;
                }
                return;
            }
        }
        // 始终创建新手账，支持同一天创建多个手账
        const today = DateUtils.getToday();
        this.plog = {
            id: 0,
            date: today,
            backgroundImage: '',
            elements: [],
            diaryIds: this.diaryIdsFromParams.length > 0 ? [...this.diaryIdsFromParams] : undefined,
            createdAt: Date.now(),
            thumbnail: ''
        };
        this.elements = [];
    }
    async loadTodayDiaryPosts(): Promise<void> {
        try {
            const allPosts = await DiaryViewModel.getPostsByDate(DateUtils.getToday());
            // 优先使用路由传入的diaryIds，其次使用已保存plog中的diaryIds
            const diaryIds = this.diaryIdsFromParams.length > 0
                ? this.diaryIdsFromParams
                : (this.plog?.diaryIds ?? []);
            if (diaryIds.length > 0) {
                const idSet = new Set<number>(diaryIds);
                this.todayDiaryPosts = allPosts.filter((post: DiaryPost) => idSet.has(post.id));
            }
            else {
                this.todayDiaryPosts = allPosts;
            }
        }
        catch (error) {
            console.error('加载随手记失败:', error);
        }
    }
    navigateBack(): void {
        router.back();
    }
    /**
     * 切换主工具标签
     */
    switchToolTab(tab: number): void {
        Context.animateTo({ duration: 400, curve: curves.springMotion() }, () => {
            if (this.activeToolTab === tab) {
                this.activeToolTab = -1;
                this.panelExpanded = false;
            }
            else {
                this.activeToolTab = tab;
                this.activeSubTool = 0;
                this.panelExpanded = true;
            }
        });
    }
    /**
     * 切换子工具
     */
    switchSubTool(subIndex: number): void {
        Context.animateTo({ duration: 180, curve: Curve.EaseOut }, () => {
            this.activeSubTool = subIndex;
        });
    }
    /**
     * 展开/收起面板
     */
    togglePanel(): void {
        Context.animateTo({ duration: 280, curve: Curve.EaseInOut }, () => {
            this.panelExpanded = !this.panelExpanded;
        });
    }
    /**
     * 添加随手记到手账
     */
    addDiaryToCanvas(post: DiaryPost): void {
        const baseIndex = this.elements.length;
        // 添加文字内容
        if (post.content && post.content.trim()) {
            const textElement: CanvasElement = {
                type: 'text',
                x: 20,
                y: 20 + baseIndex * 60,
                width: 200,
                height: 60,
                rotation: 0,
                content: post.content,
                zIndex: baseIndex,
                fontSize: 14,
                color: '#333333'
            };
            this.elements.push(textElement);
        }
        // 添加图片
        if (post.mediaUrls && post.mediaUrls.length > 0) {
            post.mediaUrls.forEach((url, idx) => {
                const imgElement: CanvasElement = {
                    type: 'image',
                    x: 20 + ((baseIndex + idx) % 3) * 120,
                    y: 100 + Math.floor((baseIndex + idx) / 3) * 120,
                    width: 100,
                    height: 100,
                    rotation: 0,
                    content: url,
                    zIndex: baseIndex + idx + 1
                };
                this.elements.push(imgElement);
            });
        }
        promptAction.showToast({ message: '已添加随手记' });
    }
    /**
     * 添加文字元素
     */
    addTextElement(): void {
        const element: CanvasElement = {
            type: 'text',
            x: 50,
            y: 50 + this.elements.length * 30,
            width: 200,
            height: 40,
            rotation: 0,
            content: '双击编辑文字',
            zIndex: this.elements.length,
            fontSize: 16,
            color: '#333333'
        };
        this.elements.push(element);
        this.activeToolTab = -1;
    }
    /**
     * 添加贴纸元素
     */
    addSticker(stickerUrl: string): void {
        const element: CanvasElement = {
            type: 'sticker',
            x: 80 + (this.elements.length % 3) * 80,
            y: 100 + Math.floor(this.elements.length / 3) * 80,
            width: 60,
            height: 60,
            rotation: 0,
            content: stickerUrl,
            zIndex: this.elements.length
        };
        this.elements.push(element);
    }
    /**
     * 保存手账
     */
    async savePlog(): Promise<void> {
        if (!this.plog)
            return;
        try {
            this.plog.elements = this.elements;
            // 确保diaryIds被保存
            if (this.diaryIdsFromParams.length > 0 && !this.plog.diaryIds) {
                this.plog.diaryIds = [...this.diaryIdsFromParams];
            }
            if (this.plog.id === 0) {
                const insertParams: PlogInsertParams = {
                    date: this.plog.date,
                    backgroundImage: this.plog.backgroundImage,
                    elements: this.plog.elements,
                    diaryIds: this.plog.diaryIds,
                    createdAt: this.plog.createdAt,
                    thumbnail: this.plog.thumbnail
                };
                await PlogViewModel.createPlog(insertParams);
            }
            else {
                await PlogViewModel.updatePlog(this.plog);
            }
            promptAction.showToast({ message: '保存成功' });
        }
        catch (error) {
            console.error('保存手账失败:', error);
            promptAction.showToast({ message: '保存失败' });
        }
    }
    /**
     * 一键生成手账素材
     */
    async oneClickGenerate(): Promise<void> {
        try {
            const materials = await PlogViewModel.generatePlogMaterials(DateUtils.getToday());
            // 将动态照片添加到画布
            materials.posts.forEach((post, index) => {
                if (post.mediaUrls && post.mediaUrls.length > 0) {
                    const element: CanvasElement = {
                        type: 'image',
                        x: 20 + (index % 3) * 120,
                        y: 100 + Math.floor(index / 3) * 150,
                        width: 100,
                        height: 100,
                        rotation: 0,
                        content: post.mediaUrls[0],
                        zIndex: index
                    };
                    this.elements.push(element);
                }
            });
            // 将待办清单作为文本添加到画布
            if (materials.todos.length > 0) {
                const todoText = materials.todos.map((t: TodoItem) => `${t.status === 'completed' ? '✓' : '○'} ${t.content}`).join('\n');
                const textElement: CanvasElement = {
                    type: 'text',
                    x: 20,
                    y: 20,
                    width: 200,
                    height: 60,
                    rotation: 0,
                    content: `今日任务:\n${todoText}`,
                    zIndex: materials.posts.length,
                    fontSize: 14,
                    color: '#333333'
                };
                this.elements.push(textElement);
            }
            // 保存
            if (this.plog) {
                this.plog.elements = this.elements;
                // 保存关联的随手记ID
                this.plog.diaryIds = materials.posts.map((post: DiaryPost) => post.id);
                if (this.plog.id === 0) {
                    const insertParams: PlogInsertParams = {
                        date: this.plog.date,
                        backgroundImage: this.plog.backgroundImage,
                        elements: this.plog.elements,
                        diaryIds: this.plog.diaryIds,
                        createdAt: this.plog.createdAt,
                        thumbnail: this.plog.thumbnail
                    };
                    await PlogViewModel.createPlog(insertParams);
                }
                else {
                    await PlogViewModel.updatePlog(this.plog);
                }
            }
        }
        catch (error) {
            console.error('生成素材失败:', error);
        }
    }
    MainToolButton(label: string, tabIndex: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.height(36);
            Column.justifyContent(FlexAlign.Center);
            Column.backgroundColor(this.activeToolTab === tabIndex ? '#FFF0E8' : Color.Transparent);
            Column.borderRadius(18);
            Column.onClick(() => {
                if (tabIndex === 2) {
                    this.switchToolTab(tabIndex);
                }
                else if (tabIndex === 4) {
                    promptAction.showToast({ message: '画笔功能开发中' });
                }
                else {
                    this.switchToolTab(tabIndex);
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.activeToolTab === tabIndex
                ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
            Text.maxLines(2);
            Text.fontWeight(this.activeToolTab === tabIndex ? FontWeight.Medium : FontWeight.Normal);
        }, Text);
        Text.pop();
        Column.pop();
    }
    SubToolButton(label: string, subIndex: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height('100%');
            Column.padding({ left: 16, right: 16 });
            Column.justifyContent(FlexAlign.Center);
            Column.border({
                width: { bottom: this.activeSubTool === subIndex ? 2 : 0 },
                color: { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
            });
            Column.onClick(() => this.switchSubTool(subIndex));
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.activeSubTool === subIndex
                ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(this.activeSubTool === subIndex ? FontWeight.Medium : FontWeight.Normal);
        }, Text);
        Text.pop();
        Column.pop();
    }
    DetailContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.activeToolTab === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 随手记详细设置
                        if (this.todayDiaryPosts.length === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width('100%');
                                    Column.height(160);
                                    Column.justifyContent(FlexAlign.Center);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('今天还没有随手记');
                                    Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                }, Text);
                                Text.pop();
                                Column.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Scroll.create();
                                    Scroll.width('100%');
                                    Scroll.height(200);
                                    Scroll.scrollBar(BarState.Off);
                                }, Scroll);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width('100%');
                                    Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const post = _item;
                                        this.DiaryPostItem.bind(this)(post);
                                    };
                                    this.forEachUpdateFunction(elmtId, this.todayDiaryPosts, forEachItemGenFunction, (post: DiaryPost) => post.id.toString(), false, false);
                                }, ForEach);
                                ForEach.pop();
                                Column.pop();
                                Scroll.pop();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else if (this.activeToolTab === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 背景详细设置
                        Column.create();
                        // 背景详细设置
                        Column.width('100%');
                        // 背景详细设置
                        Column.height(160);
                        // 背景详细设置
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('背景设置');
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.margin({ top: 20, bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择纯色或图片作为背景');
                        Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    // 背景详细设置
                    Column.pop();
                });
            }
            else if (this.activeToolTab === 2) {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 文字详细设置（根据子工具切换）
                        Column.create();
                        // 文字详细设置（根据子工具切换）
                        Column.width('100%');
                        // 文字详细设置（根据子工具切换）
                        Column.height(160);
                        // 文字详细设置（根据子工具切换）
                        Column.justifyContent(FlexAlign.Center);
                        // 文字详细设置（根据子工具切换）
                        Column.padding({ left: 16, right: 16 });
                        // 文字详细设置（根据子工具切换）
                        Column.transition(TransitionEffect.OPACITY.animation({ duration: 180, curve: Curve.EaseOut }));
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.activeSubTool === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('选择文字样式');
                                    Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.margin({ bottom: 12 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 12 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('常规');
                                    Text.padding(8);
                                    Text.backgroundColor('#F5F5F5');
                                    Text.borderRadius(6);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('手写');
                                    Text.padding(8);
                                    Text.backgroundColor('#F5F5F5');
                                    Text.borderRadius(6);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('艺术');
                                    Text.padding(8);
                                    Text.backgroundColor('#F5F5F5');
                                    Text.borderRadius(6);
                                }, Text);
                                Text.pop();
                                Row.pop();
                            });
                        }
                        else if (this.activeSubTool === 1) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('选择文字颜色');
                                    Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.margin({ bottom: 12 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 10 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const color = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.width(32);
                                            Column.height(32);
                                            Column.backgroundColor(color);
                                            Column.borderRadius(16);
                                        }, Column);
                                        Column.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, ['#333333', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#000000'], forEachItemGenFunction, (color: string) => color, false, false);
                                }, ForEach);
                                ForEach.pop();
                                Row.pop();
                            });
                        }
                        else if (this.activeSubTool === 2) {
                            this.ifElseBranchUpdateFunction(2, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('文字排版');
                                    Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.margin({ bottom: 12 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 16 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('左对齐');
                                    Text.padding(8);
                                    Text.backgroundColor('#F5F5F5');
                                    Text.borderRadius(6);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('居中');
                                    Text.padding(8);
                                    Text.backgroundColor('#F5F5F5');
                                    Text.borderRadius(6);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('右对齐');
                                    Text.padding(8);
                                    Text.backgroundColor('#F5F5F5');
                                    Text.borderRadius(6);
                                }, Text);
                                Text.pop();
                                Row.pop();
                            });
                        }
                        else if (this.activeSubTool === 3) {
                            this.ifElseBranchUpdateFunction(3, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('粗斜体设置');
                                    Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.margin({ bottom: 12 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 16 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('B');
                                    Text.fontWeight(FontWeight.Bold);
                                    Text.fontSize(20);
                                    Text.padding(8);
                                    Text.backgroundColor('#F5F5F5');
                                    Text.borderRadius(6);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('I');
                                    Text.fontStyle(FontStyle.Italic);
                                    Text.fontSize(20);
                                    Text.padding(8);
                                    Text.backgroundColor('#F5F5F5');
                                    Text.borderRadius(6);
                                }, Text);
                                Text.pop();
                                Row.pop();
                            });
                        }
                        else if (this.activeSubTool === 4) {
                            this.ifElseBranchUpdateFunction(4, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('文字弯曲效果');
                                    Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.margin({ bottom: 12 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('弯曲效果开发中');
                                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(5, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    // 文字详细设置（根据子工具切换）
                    Column.pop();
                });
            }
            else if (this.activeToolTab === 3) {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 贴纸详细设置
                        Grid.create();
                        // 贴纸详细设置
                        Grid.columnsTemplate('1fr 1fr 1fr 1fr');
                        // 贴纸详细设置
                        Grid.rowsGap(8);
                        // 贴纸详细设置
                        Grid.columnsGap(8);
                        // 贴纸详细设置
                        Grid.width('100%');
                        // 贴纸详细设置
                        Grid.height(160);
                        // 贴纸详细设置
                        Grid.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const sticker = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                    GridItem.width(52);
                                    GridItem.height(52);
                                    GridItem.backgroundColor('#F5F5F5');
                                    GridItem.borderRadius(8);
                                    GridItem.onClick(() => {
                                        this.addSticker(sticker);
                                        promptAction.showToast({ message: '已添加贴纸' });
                                    });
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.width('100%');
                                        Column.height('100%');
                                        Column.justifyContent(FlexAlign.Center);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(sticker);
                                        Text.fontSize(28);
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, ['⭐', '❤️', '🌸', '🎀', '✨', '🌈', '🌟', '💎', '🍀', '🦋', '🌙', '🎈'], forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    // 贴纸详细设置
                    Grid.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(4, () => {
                });
            }
        }, If);
        If.pop();
    }
    DiaryPostItem(post: DiaryPost, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(12);
            Row.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Row.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 图片缩略图
            if (post.mediaUrls && post.mediaUrls.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(post.mediaUrls[0]);
                        Image.width(50);
                        Image.height(50);
                        Image.borderRadius(6);
                        Image.objectFit(ImageFit.Cover);
                        Image.margin({ right: 10 });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width(50);
                        Column.height(50);
                        Column.borderRadius(6);
                        Column.backgroundColor('#F0F0F0');
                        Column.margin({ right: 10 });
                    }, Column);
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(post.content || '');
            Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(DateUtils.formatTime(post.timestamp));
            Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加按钮
            Button.createWithLabel('添加');
            // 添加按钮
            Button.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 添加按钮
            Button.height(32);
            // 添加按钮
            Button.backgroundColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 添加按钮
            Button.onClick(() => this.addDiaryToCanvas(post));
        }, Button);
        // 添加按钮
        Button.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
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
            // 顶部栏
            Row.create();
            // 顶部栏
            Row.width('100%');
            // 顶部栏
            Row.height(48);
            // 顶部栏
            Row.padding({ left: 12, right: 16 });
            // 顶部栏
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(40);
            Button.height(40);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => this.navigateBack());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832663, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(20);
            SymbolGlyph.fontColor([{ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('保存');
            Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.onClick(() => this.savePlog());
        }, Text);
        Text.pop();
        // 顶部栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 白色画布区域
            Stack.create();
            // 白色画布区域
            Stack.width('100%');
            // 白色画布区域
            Stack.layoutWeight(1);
            // 白色画布区域
            Stack.padding(16);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 白色画布背景
            Column.create();
            // 白色画布背景
            Column.width('100%');
            // 白色画布背景
            Column.height('100%');
            // 白色画布背景
            Column.backgroundColor(Color.White);
        }, Column);
        // 白色画布背景
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 画布元素
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const element = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (element.type === 'image' || element.type === 'sticker') {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Image.create(element.content);
                                Image.width(element.width);
                                Image.height(element.height);
                                Image.position({ x: element.x, y: element.y });
                                Image.rotate({ angle: element.rotation });
                                Image.zIndex(element.zIndex);
                                Image.border({
                                    width: this.selectedElementIndex === index ? 2 : 0,
                                    color: { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
                                });
                                Image.onClick(() => {
                                    this.selectedElementIndex = index;
                                });
                            }, Image);
                        });
                    }
                    else if (element.type === 'text') {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(element.content);
                                Text.fontSize(element.fontSize || 14);
                                Text.fontColor(element.color || '#333333');
                                Text.position({ x: element.x, y: element.y });
                                Text.width(element.width);
                                Text.zIndex(element.zIndex);
                                Text.border({
                                    width: this.selectedElementIndex === index ? 2 : 0,
                                    color: { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
                                });
                                Text.onClick(() => {
                                    this.selectedElementIndex = index;
                                });
                            }, Text);
                            Text.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(2, () => {
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(elmtId, this.elements, forEachItemGenFunction, (element: CanvasElement, index: number) => index.toString(), true, true);
        }, ForEach);
        // 画布元素
        ForEach.pop();
        // 白色画布区域
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部综合面板（主工具栏 + 子工具栏 + 详细设置）
            Column.create();
            // 底部综合面板（主工具栏 + 子工具栏 + 详细设置）
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 展开区域：详细设置 + 子工具栏
            if (this.panelExpanded && this.activeToolTab >= 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Column.borderRadius({ topLeft: 16, topRight: 16 });
                        Column.shadow({ radius: 8, color: '#15000000', offsetX: 0, offsetY: -2 });
                        Column.transition(TransitionEffect.asymmetric(TransitionEffect.OPACITY.combine(TransitionEffect.translate({ y: 20 })), TransitionEffect.OPACITY.combine(TransitionEffect.translate({ y: 20 }))).animation({ duration: 280, curve: Curve.EaseInOut }));
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 下拉指示横线（点击收起/展开）
                        Row.create();
                        // 下拉指示横线（点击收起/展开）
                        Row.width('100%');
                        // 下拉指示横线（点击收起/展开）
                        Row.height(20);
                        // 下拉指示横线（点击收起/展开）
                        Row.justifyContent(FlexAlign.Center);
                        // 下拉指示横线（点击收起/展开）
                        Row.onClick(() => this.togglePanel());
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width(36);
                        Column.height(4);
                        Column.borderRadius(2);
                        Column.backgroundColor('#CCCCCC');
                    }, Column);
                    Column.pop();
                    // 下拉指示横线（点击收起/展开）
                    Row.pop();
                    // 详细设置内容区
                    this.DetailContent.bind(this)();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 子工具栏（仅文字工具有）
                        if (this.activeToolTab === 2) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                    Row.height(40);
                                    Row.justifyContent(FlexAlign.Center);
                                    Row.border({
                                        width: { top: 0.5 },
                                        color: { "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
                                    });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = (_item, idx: number) => {
                                        const tool = _item;
                                        this.SubToolButton.bind(this)(tool, idx);
                                    };
                                    this.forEachUpdateFunction(elmtId, this.textSubTools, forEachItemGenFunction, (tool: string, idx: number) => idx.toString(), true, true);
                                }, ForEach);
                                ForEach.pop();
                                Row.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                });
            }
            // 主工具栏（始终显示）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主工具栏（始终显示）
            Row.create();
            // 主工具栏（始终显示）
            Row.width('100%');
            // 主工具栏（始终显示）
            Row.height(56);
            // 主工具栏（始终显示）
            Row.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 主工具栏（始终显示）
            Row.border({
                width: { top: this.panelExpanded && this.activeToolTab >= 0 ? 0 : 0.5 },
                color: { "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
            });
        }, Row);
        this.MainToolButton.bind(this)('随手记', 0);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.width(0.5);
            Divider.height(36);
            Divider.color({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Divider);
        this.MainToolButton.bind(this)('背景', 1);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.width(0.5);
            Divider.height(36);
            Divider.color({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Divider);
        this.MainToolButton.bind(this)('文字', 2);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.width(0.5);
            Divider.height(36);
            Divider.color({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Divider);
        this.MainToolButton.bind(this)('贴纸', 3);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.width(0.5);
            Divider.height(36);
            Divider.color({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Divider);
        this.MainToolButton.bind(this)('画笔', 4);
        // 主工具栏（始终显示）
        Row.pop();
        // 底部综合面板（主工具栏 + 子工具栏 + 详细设置）
        Column.pop();
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PlogEditorPage";
    }
}
export default PlogEditorPage;
registerNamedRoute(() => new PlogEditorPage(undefined, {}), "", { bundleName: "com.example.lifetracker", moduleName: "entry", pagePath: "pages/PlogEditorPage", pageFullPath: "entry/src/main/ets/pages/PlogEditorPage", integratedHsp: "false", moduleType: "followWithHap" });
