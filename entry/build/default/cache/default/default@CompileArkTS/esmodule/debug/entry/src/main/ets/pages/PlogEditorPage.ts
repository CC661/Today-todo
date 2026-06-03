if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PlogEditorPage_Params {
    plog?: PlogCanvas | null;
    elements?: CanvasElement[];
    selectedElementIndex?: number;
    showMaterialPanel?: boolean;
}
import PlogViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/PlogViewModel&";
import type { PlogCanvas, CanvasElement } from '../model/PlogCanvas';
import type { TodoItem } from '../model/TodoItem';
import type { PlogInsertParams } from '../common/database/RDBStoreUtil';
import DateUtils from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtils&";
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
    }
    updateStateVars(params: PlogEditorPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__plog.purgeDependencyOnElmtId(rmElmtId);
        this.__elements.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedElementIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__showMaterialPanel.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__plog.aboutToBeDeleted();
        this.__elements.aboutToBeDeleted();
        this.__selectedElementIndex.aboutToBeDeleted();
        this.__showMaterialPanel.aboutToBeDeleted();
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
    aboutToAppear(): void {
        this.initPlog();
    }
    async initPlog(): Promise<void> {
        const today = DateUtils.getToday();
        const existingPlog = await PlogViewModel.getPlogByDate(today);
        if (existingPlog) {
            this.plog = existingPlog;
            this.elements = existingPlog.elements;
        }
        else {
            this.plog = {
                id: 0,
                date: today,
                backgroundImage: '',
                elements: [],
                createdAt: Date.now(),
                thumbnail: ''
            };
            this.elements = [];
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
                if (this.plog.id === 0) {
                    const insertParams: PlogInsertParams = {
                        date: this.plog.date,
                        backgroundImage: this.plog.backgroundImage,
                        elements: this.plog.elements,
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
    /**
     * 添加贴纸元素
     */
    addSticker(stickerUrl: string): void {
        const element: CanvasElement = {
            type: 'sticker',
            x: 100,
            y: 200,
            width: 80,
            height: 80,
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
            if (this.plog.id === 0) {
                const insertParams: PlogInsertParams = {
                    date: this.plog.date,
                    backgroundImage: this.plog.backgroundImage,
                    elements: this.plog.elements,
                    createdAt: this.plog.createdAt,
                    thumbnail: this.plog.thumbnail
                };
                await PlogViewModel.createPlog(insertParams);
            }
            else {
                await PlogViewModel.updatePlog(this.plog);
            }
            console.info('手账保存成功');
        }
        catch (error) {
            console.error('保存手账失败:', error);
        }
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
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.padding({ left: 16, right: 16, top: 16, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777318, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('保存');
            Button.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.backgroundColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.onClick(() => {
                this.savePlog();
            });
        }, Button);
        Button.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 画布区域
            Stack.create();
            // 画布区域
            Stack.layoutWeight(1);
            // 画布区域
            Stack.width('100%');
            // 画布区域
            Stack.backgroundColor('#F5F5F5');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 背景
            if (this.plog && this.plog.backgroundImage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.plog.backgroundImage);
                        Image.width('100%');
                        Image.height('100%');
                        Image.objectFit(ImageFit.Cover);
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
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
        // 画布区域
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部工具栏
            Row.create();
            // 底部工具栏
            Row.width('100%');
            // 底部工具栏
            Row.padding(12);
            // 底部工具栏
            Row.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('一键做手账');
            Button.layoutWeight(1);
            Button.backgroundColor({ "id": 16777301, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.onClick(() => {
                this.oneClickGenerate();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('贴纸');
            Button.layoutWeight(1);
            Button.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.margin({ left: 8 });
            Button.onClick(() => {
                this.showMaterialPanel = true;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('文字');
            Button.layoutWeight(1);
            Button.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.margin({ left: 8 });
            Button.onClick(() => {
                // TODO: 添加文字
            });
        }, Button);
        Button.pop();
        // 底部工具栏
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 贴纸面板
            if (this.showMaterialPanel) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#80000000');
                        Column.onClick(() => {
                            this.showMaterialPanel = false;
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('90%');
                        Column.padding(20);
                        Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Column.borderRadius({ "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择贴纸');
                        Text.fontSize({ "id": 16777315, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Medium);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Grid.create();
                        Grid.columnsTemplate('1fr 1fr 1fr');
                        Grid.rowsGap(12);
                        Grid.columnsGap(12);
                        Grid.width('100%');
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const sticker = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                    GridItem.width(60);
                                    GridItem.height(60);
                                    GridItem.onClick(() => {
                                        // TODO: 实际应该使用图片URL
                                        this.addSticker('');
                                        this.showMaterialPanel = false;
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
                                        Text.fontSize(32);
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, ['⭐', '❤️', '🌸', '🎀', '✨', '🌈'], forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Grid.pop();
                    Column.pop();
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
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PlogEditorPage";
    }
}
export default PlogEditorPage;
registerNamedRoute(() => new PlogEditorPage(undefined, {}), "", { bundleName: "com.example.lifetracker", moduleName: "entry", pagePath: "pages/PlogEditorPage", pageFullPath: "entry/src/main/ets/pages/PlogEditorPage", integratedHsp: "false", moduleType: "followWithHap" });
