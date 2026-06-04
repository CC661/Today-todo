if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PlogGalleryPage_Params {
    plogs?: PlogCanvas[];
    isLoading?: boolean;
    showMoreDropdown?: boolean;
    showDeleteDialog?: boolean;
    pendingDeletePlogId?: number;
    dropdownX?: number;
    dropdownY?: number;
    morePlogId?: number;
    moreBtnPositions?: Map<number, BtnPosition>;
    rootGlobalX?: number;
    rootGlobalY?: number;
}
import PlogViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/PlogViewModel&";
import type { PlogCanvas } from '../model/PlogCanvas';
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
class BtnPosition {
    x: number = 0;
    y: number = 0;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
class PlogGalleryPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__plogs = new ObservedPropertyObjectPU([], this, "plogs");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__showMoreDropdown = new ObservedPropertySimplePU(false, this, "showMoreDropdown");
        this.__showDeleteDialog = new ObservedPropertySimplePU(false, this, "showDeleteDialog");
        this.__pendingDeletePlogId = new ObservedPropertySimplePU(-1, this, "pendingDeletePlogId");
        this.__dropdownX = new ObservedPropertySimplePU(0, this, "dropdownX");
        this.__dropdownY = new ObservedPropertySimplePU(0, this, "dropdownY");
        this.morePlogId = -1;
        this.moreBtnPositions = new Map();
        this.rootGlobalX = 0;
        this.rootGlobalY = 0;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PlogGalleryPage_Params) {
        if (params.plogs !== undefined) {
            this.plogs = params.plogs;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.showMoreDropdown !== undefined) {
            this.showMoreDropdown = params.showMoreDropdown;
        }
        if (params.showDeleteDialog !== undefined) {
            this.showDeleteDialog = params.showDeleteDialog;
        }
        if (params.pendingDeletePlogId !== undefined) {
            this.pendingDeletePlogId = params.pendingDeletePlogId;
        }
        if (params.dropdownX !== undefined) {
            this.dropdownX = params.dropdownX;
        }
        if (params.dropdownY !== undefined) {
            this.dropdownY = params.dropdownY;
        }
        if (params.morePlogId !== undefined) {
            this.morePlogId = params.morePlogId;
        }
        if (params.moreBtnPositions !== undefined) {
            this.moreBtnPositions = params.moreBtnPositions;
        }
        if (params.rootGlobalX !== undefined) {
            this.rootGlobalX = params.rootGlobalX;
        }
        if (params.rootGlobalY !== undefined) {
            this.rootGlobalY = params.rootGlobalY;
        }
    }
    updateStateVars(params: PlogGalleryPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__plogs.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__showMoreDropdown.purgeDependencyOnElmtId(rmElmtId);
        this.__showDeleteDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__pendingDeletePlogId.purgeDependencyOnElmtId(rmElmtId);
        this.__dropdownX.purgeDependencyOnElmtId(rmElmtId);
        this.__dropdownY.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__plogs.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__showMoreDropdown.aboutToBeDeleted();
        this.__showDeleteDialog.aboutToBeDeleted();
        this.__pendingDeletePlogId.aboutToBeDeleted();
        this.__dropdownX.aboutToBeDeleted();
        this.__dropdownY.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __plogs: ObservedPropertyObjectPU<PlogCanvas[]>;
    get plogs() {
        return this.__plogs.get();
    }
    set plogs(newValue: PlogCanvas[]) {
        this.__plogs.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __showMoreDropdown: ObservedPropertySimplePU<boolean>;
    get showMoreDropdown() {
        return this.__showMoreDropdown.get();
    }
    set showMoreDropdown(newValue: boolean) {
        this.__showMoreDropdown.set(newValue);
    }
    private __showDeleteDialog: ObservedPropertySimplePU<boolean>;
    get showDeleteDialog() {
        return this.__showDeleteDialog.get();
    }
    set showDeleteDialog(newValue: boolean) {
        this.__showDeleteDialog.set(newValue);
    }
    private __pendingDeletePlogId: ObservedPropertySimplePU<number>;
    get pendingDeletePlogId() {
        return this.__pendingDeletePlogId.get();
    }
    set pendingDeletePlogId(newValue: number) {
        this.__pendingDeletePlogId.set(newValue);
    }
    private __dropdownX: ObservedPropertySimplePU<number>;
    get dropdownX() {
        return this.__dropdownX.get();
    }
    set dropdownX(newValue: number) {
        this.__dropdownX.set(newValue);
    }
    private __dropdownY: ObservedPropertySimplePU<number>;
    get dropdownY() {
        return this.__dropdownY.get();
    }
    set dropdownY(newValue: number) {
        this.__dropdownY.set(newValue);
    }
    private morePlogId: number;
    private moreBtnPositions: Map<number, BtnPosition>;
    private rootGlobalX: number;
    private rootGlobalY: number;
    aboutToAppear(): void {
        this.loadPlogs();
    }
    async loadPlogs(): Promise<void> {
        this.isLoading = true;
        try {
            this.plogs = await PlogViewModel.getAllPlogs();
        }
        catch (error) {
            console.error('加载手账列表失败:', error);
        }
        finally {
            this.isLoading = false;
        }
    }
    navigateBack(): void {
        router.back();
    }
    navigateToEditor(plogId: number): void {
        router.pushUrl({
            url: 'pages/PlogEditorPage',
            params: { plogId: plogId }
        });
    }
    showMoreMenu(plogId: number): void {
        this.morePlogId = plogId;
        const pos = this.moreBtnPositions.get(plogId);
        if (pos) {
            this.dropdownX = pos.x - this.rootGlobalX;
            this.dropdownY = pos.y - this.rootGlobalY;
        }
        Context.animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
            this.showMoreDropdown = true;
        });
    }
    hideMoreMenu(): void {
        this.morePlogId = -1;
        this.showMoreDropdown = false;
    }
    showDeleteConfirm(plogId: number): void {
        this.pendingDeletePlogId = plogId;
        this.showMoreDropdown = false;
        this.morePlogId = -1;
        Context.animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
            this.showDeleteDialog = true;
        });
    }
    async confirmDelete(): Promise<void> {
        if (this.pendingDeletePlogId < 0)
            return;
        try {
            await PlogViewModel.deletePlog(this.pendingDeletePlogId);
            this.pendingDeletePlogId = -1;
            this.showDeleteDialog = false;
            promptAction.showToast({ message: '已删除' });
            await this.loadPlogs();
        }
        catch (error) {
            console.error('删除手账失败:', error);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
            Stack.id('plog_gallery_root');
            Stack.onAreaChange((oldValue: Area, newValue: Area) => {
                this.rootGlobalX = newValue.globalPosition.x as number;
                this.rootGlobalY = newValue.globalPosition.y as number;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.padding({ left: 12, right: 16, top: 16, bottom: 8 });
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
            Text.create('手账');
            Text.fontSize({ "id": 16777320, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 手账网格
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
            else if (this.plogs.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📔');
                        Text.fontSize(48);
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('还没有手账作品');
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('去创建你的第一本手账吧');
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
                        Grid.create();
                        Grid.columnsTemplate('1fr 1fr');
                        Grid.rowsGap(12);
                        Grid.columnsGap(12);
                        Grid.width('100%');
                        Grid.padding(16);
                        Grid.layoutWeight(1);
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const plog = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    this.PlogCard.bind(this)(plog);
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.plogs, forEachItemGenFunction, (plog: PlogCanvas) => plog.id.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    Grid.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 更多下拉菜单 + 全屏遮罩
            if (this.showMoreDropdown) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.width('100%');
                        Stack.height('100%');
                        Stack.zIndex(100);
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
                        Column.onClick(() => this.hideMoreMenu());
                    }, Column);
                    // 全屏透明遮罩（点击关闭）
                    Column.pop();
                    // 下拉菜单
                    this.MoreDropdownOverlay.bind(this)();
                    Stack.pop();
                });
            }
            // 删除确认弹窗
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 删除确认弹窗
            if (this.showDeleteDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#80000000');
                        Column.zIndex(200);
                        Column.onClick(() => {
                            Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                                this.showDeleteDialog = false;
                            });
                            this.pendingDeletePlogId = -1;
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
                        Text.create('确定删除？');
                        Text.fontSize({ "id": 16777315, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor({ "id": 16777299, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('此操作不可恢复，是否继续删除该手账？');
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.textAlign(TextAlign.Center);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.onClick(() => {
                            Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                                this.showDeleteDialog = false;
                            });
                            this.pendingDeletePlogId = -1;
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确定');
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.backgroundColor({ "id": 16777299, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.fontColor(Color.White);
                        Button.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.margin({ left: 12 });
                        Button.onClick(() => this.confirmDelete());
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
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
    PlogCard(plog: PlogCanvas, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height(180);
            Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.borderRadius({ "id": 16777310, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.onClick(() => this.navigateToEditor(plog.id));
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期标题栏 + 更多按钮
            Row.create();
            // 日期标题栏 + 更多按钮
            Row.width('100%');
            // 日期标题栏 + 更多按钮
            Row.padding({ left: 10, right: 6, top: 8, bottom: 6 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(plog.date);
            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(28);
            Button.height(28);
            Button.backgroundColor(Color.Transparent);
            Button.onAreaChange((oldValue: Area, newValue: Area) => {
                this.moreBtnPositions.set(plog.id, new BtnPosition(newValue.globalPosition.x as number, newValue.globalPosition.y as number));
            });
            Button.onClick(() => this.showMoreMenu(plog.id));
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('⋮');
            Text.fontSize(18);
            Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Button.pop();
        // 日期标题栏 + 更多按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手账内容预览
            Stack.create();
            // 手账内容预览
            Stack.width('100%');
            // 手账内容预览
            Stack.layoutWeight(1);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (plog.thumbnail) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(plog.thumbnail);
                        Image.width('100%');
                        Image.height('100%');
                        Image.objectFit(ImageFit.Cover);
                    }, Image);
                });
            }
            else if (plog.backgroundImage) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(plog.backgroundImage);
                        Image.width('100%');
                        Image.height('100%');
                        Image.objectFit(ImageFit.Cover);
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#FFF9F0');
                    }, Column);
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 手账内容预览
        Stack.pop();
        Column.pop();
    }
    // 更多下拉菜单（全屏遮罩 + 绝对定位）
    MoreDropdownOverlay(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(140);
            Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.borderRadius(12);
            Column.shadow({ radius: 12, color: '#15000000', offsetX: 0, offsetY: 6 });
            Column.position({
                x: Math.max(0, this.dropdownX + 28 - 140),
                y: this.dropdownY + 28
            });
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
            Column.margin({ top: -4 });
        }, Column);
        Column.pop();
        // 小三角箭头（指向更多按钮）
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 编辑选项
            Row.create({ space: 10 });
            // 编辑选项
            Row.width('100%');
            // 编辑选项
            Row.height(40);
            // 编辑选项
            Row.padding({ left: 14, right: 14 });
            // 编辑选项
            Row.borderRadius({ topLeft: 12, topRight: 12 });
            ViewStackProcessor.visualState("pressed");
            // 编辑选项
            Row.backgroundColor('#F0F0F0');
            ViewStackProcessor.visualState("normal");
            // 编辑选项
            Row.backgroundColor(Color.Transparent);
            ViewStackProcessor.visualState();
            // 编辑选项
            Row.onClick(() => {
                this.hideMoreMenu();
                const plogId = this.morePlogId;
                this.morePlogId = -1;
                this.navigateToEditor(plogId);
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831624, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(15);
            SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('编辑');
            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        // 编辑选项
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.strokeWidth(0.5);
            Divider.color({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Divider.margin({ left: 14, right: 14 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 删除选项
            Row.create({ space: 10 });
            // 删除选项
            Row.width('100%');
            // 删除选项
            Row.height(40);
            // 删除选项
            Row.padding({ left: 14, right: 14 });
            // 删除选项
            Row.borderRadius({ bottomLeft: 12, bottomRight: 12 });
            ViewStackProcessor.visualState("pressed");
            // 删除选项
            Row.backgroundColor('#F0F0F0');
            ViewStackProcessor.visualState("normal");
            // 删除选项
            Row.backgroundColor(Color.Transparent);
            ViewStackProcessor.visualState();
            // 删除选项
            Row.onClick(() => {
                const plogId = this.morePlogId;
                this.hideMoreMenu();
                this.showDeleteConfirm(plogId);
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831542, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(15);
            SymbolGlyph.fontColor([{ "id": 16777299, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('删除');
            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777299, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        // 删除选项
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PlogGalleryPage";
    }
}
export default PlogGalleryPage;
registerNamedRoute(() => new PlogGalleryPage(undefined, {}), "", { bundleName: "com.example.lifetracker", moduleName: "entry", pagePath: "pages/PlogGalleryPage", pageFullPath: "entry/src/main/ets/pages/PlogGalleryPage", integratedHsp: "false", moduleType: "followWithHap" });
