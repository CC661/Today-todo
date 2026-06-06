if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PlogPreviewPage_Params {
    plogs?: PlogCanvas[];
    currentIndex?: number;
    isLoading?: boolean;
    initialPlogId?: number;
    settings?: RenderingContextSettings;
    patternCanvasContext?: CanvasRenderingContext2D;
}
import PlogViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/PlogViewModel&";
import type { PlogCanvas, CanvasElement } from '../model/PlogCanvas';
import router from "@ohos:router";
class PlogPreviewPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__plogs = new ObservedPropertyObjectPU([], this, "plogs");
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.initialPlogId = 0;
        this.settings = new RenderingContextSettings(true);
        this.patternCanvasContext = new CanvasRenderingContext2D(this.settings);
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PlogPreviewPage_Params) {
        if (params.plogs !== undefined) {
            this.plogs = params.plogs;
        }
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.initialPlogId !== undefined) {
            this.initialPlogId = params.initialPlogId;
        }
        if (params.settings !== undefined) {
            this.settings = params.settings;
        }
        if (params.patternCanvasContext !== undefined) {
            this.patternCanvasContext = params.patternCanvasContext;
        }
    }
    updateStateVars(params: PlogPreviewPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__plogs.purgeDependencyOnElmtId(rmElmtId);
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__plogs.aboutToBeDeleted();
        this.__currentIndex.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
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
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private initialPlogId: number;
    private settings: RenderingContextSettings;
    private patternCanvasContext: CanvasRenderingContext2D;
    aboutToAppear(): void {
        const params = router.getParams() as Record<string, Object> | null;
        if (params && params['plogId']) {
            this.initialPlogId = params['plogId'] as number;
        }
        this.loadAllPlogs();
    }
    async loadAllPlogs(): Promise<void> {
        this.isLoading = true;
        try {
            this.plogs = await PlogViewModel.getAllPlogs();
            if (this.initialPlogId > 0) {
                const idx = this.plogs.findIndex(p => p.id === this.initialPlogId);
                if (idx >= 0) {
                    this.currentIndex = idx;
                }
            }
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
    navigateToEdit(plogId: number): void {
        router.pushUrl({
            url: 'pages/PlogEditorPage',
            params: { plogId: plogId }
        });
    }
    gradientAngleToGradientDirection(angle: number): number {
        const a = Math.round(angle / 45) * 45;
        if (a === 0 || a === 360)
            return 0;
        if (a === 45)
            return 4;
        if (a === 90)
            return 3;
        if (a === 135)
            return 6;
        if (a === 180)
            return 1;
        if (a === 225)
            return 7;
        if (a === 270)
            return 2;
        if (a === 315)
            return 5;
        return 0;
    }
    drawPatternBg(plog: PlogCanvas, ctx: CanvasRenderingContext2D): void {
        const w: number = ctx.width;
        const h: number = ctx.height;
        if (w === 0 || h === 0)
            return;
        const t = plog.patternThickness;
        const s = plog.patternSpacing;
        ctx.clearRect(0, 0, w, h);
        const pColor = plog.patternColor || '#E0E0E0';
        ctx.strokeStyle = pColor;
        ctx.lineWidth = t;
        ctx.fillStyle = pColor;
        const pType = plog.patternType;
        if (pType === 'horizontal') {
            for (let y = 0; y < h; y += s) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        }
        else if (pType === 'vertical') {
            for (let x = 0; x < w; x += s) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
        }
        else if (pType === 'grid') {
            for (let x = 0; x < w; x += s) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += s) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        }
        else if (pType === 'dots') {
            const r = t * 2;
            for (let y = r; y < h; y += s) {
                for (let x = r; x < w; x += s) {
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        else if (pType === 'waves') {
            const amp = t * 3;
            for (let y = amp; y < h; y += s) {
                ctx.beginPath();
                for (let x = 0; x <= w; x += 2) {
                    const wy = y + Math.sin((x / s) * Math.PI * 2) * amp;
                    if (x === 0) {
                        ctx.moveTo(x, wy);
                    }
                    else {
                        ctx.lineTo(x, wy);
                    }
                }
                ctx.stroke();
            }
        }
    }
    PlogPage(plog: PlogCanvas, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (plog.bgType === 'custom' && plog.customBgUri) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(plog.customBgUri);
                        Image.width('100%');
                        Image.height('100%');
                        Image.objectFit(ImageFit.Cover);
                    }, Image);
                });
            }
            else if (plog.bgType === 'gradient' && plog.gradientColors.length >= 2) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.linearGradient({
                            direction: this.gradientAngleToGradientDirection(plog.gradientAngle),
                            colors: plog.gradientColors.map((c: string, i: number) => [c, i / (plog.gradientColors.length - 1)] as [
                                ResourceColor,
                                number
                            ])
                        });
                    }, Column);
                    Column.pop();
                });
            }
            else if (plog.bgType === 'solid') {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor(plog.bgColor || '#FFFFFF');
                    }, Column);
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor(Color.White);
                    }, Column);
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (plog.hasPattern && plog.patternType !== 'none') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Canvas.create(this.patternCanvasContext);
                        Canvas.width('100%');
                        Canvas.height('100%');
                        Canvas.onReady(() => { this.drawPatternBg(plog, this.patternCanvasContext); });
                    }, Canvas);
                    Canvas.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const element = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (element.type === 'image' || element.type === 'sticker') {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Stack.create();
                                Stack.width(element.width);
                                Stack.height(element.height);
                                Stack.position({ x: element.x, y: element.y });
                                Stack.rotate({ angle: element.rotation });
                                Stack.zIndex(element.zIndex);
                            }, Stack);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (element.content.startsWith('file://') || element.content.startsWith('content://') ||
                                    element.content.startsWith('http') || element.content.startsWith('/')) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Image.create(element.content);
                                            Image.width('100%');
                                            Image.height('100%');
                                            Image.objectFit(ImageFit.Contain);
                                        }, Image);
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(element.content);
                                            Text.fontSize(Math.min(element.width, element.height) * 0.7);
                                            Text.width('100%');
                                            Text.height('100%');
                                            Text.textAlign(TextAlign.Center);
                                        }, Text);
                                        Text.pop();
                                    });
                                }
                            }, If);
                            If.pop();
                            Stack.pop();
                        });
                    }
                    else if (element.type === 'text') {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.width(element.width);
                                Column.height(element.height);
                                Column.position({ x: element.x, y: element.y });
                                Column.rotate({ angle: element.rotation });
                                Column.zIndex(element.zIndex);
                                Column.justifyContent(element.textDirection === 'vertical'
                                    ? (element.verticalAlign === 0 ? FlexAlign.Start : element.verticalAlign === 2 ? FlexAlign.End : FlexAlign.Center)
                                    : FlexAlign.Center);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(element.textDirection === 'vertical' ? element.content.split('').join('\n') : element.content);
                                Text.fontSize(element.fontSize || 14);
                                Text.fontColor(element.color || '#333333');
                                Text.fontWeight(element.fontWeight ?? 400);
                                Text.fontFamily(element.fontFamily || undefined);
                                Text.textAlign(element.textAlign ?? TextAlign.Center);
                                Text.maxLines(50);
                                Text.textOverflow({ overflow: TextOverflow.Clip });
                                Text.letterSpacing(element.letterSpacing ?? 0);
                                Text.lineHeight(element.textDirection === 'vertical'
                                    ? (element.fontSize ?? 14) + (element.letterSpacing ?? 0)
                                    : (element.fontSize ?? 14) * (element.lineSpacing ?? 1.2));
                                Text.textShadow({
                                    radius: (element.shadowOpacity ?? 0) > 0 ? 2 : 0,
                                    color: (element.shadowOpacity ?? 0) > 0
                                        ? `rgba(0,0,0,${Math.max(0.15, (element.shadowOpacity ?? 0) / 100)})`
                                        : 'rgba(0,0,0,0)',
                                    offsetX: (element.shadowOpacity ?? 0) > 0 ? 0.5 : 0,
                                    offsetY: (element.shadowOpacity ?? 0) > 0 ? 0.5 : 0
                                });
                                Text.opacity((element.textOpacity ?? 100) / 100);
                                Text.width('100%');
                                Text.padding({ left: 12, right: 12, top: 8, bottom: 8 });
                                Text.rotate({ angle: element.italicAngle ?? 0 });
                            }, Text);
                            Text.pop();
                            Column.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(2, () => {
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(elmtId, plog.elements, forEachItemGenFunction, (element: CanvasElement, index: number) => `${plog.id}_${index}_${element._version ?? 0}`, false, true);
        }, ForEach);
        ForEach.pop();
        Stack.pop();
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
            Row.create();
            Row.width('100%');
            Row.height(48);
            Row.padding({ left: 12, right: 12 });
            Row.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
            Text.create(this.plogs.length > 0 && this.currentIndex < this.plogs.length
                ? `${this.plogs[this.currentIndex].date}  ${this.currentIndex + 1}/${this.plogs.length}`
                : '');
            Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(40);
            Button.height(40);
            Button.backgroundColor(Color.Transparent);
            Button.enabled(this.plogs.length > 0 && this.currentIndex < this.plogs.length);
            Button.onClick(() => {
                if (this.plogs.length > 0 && this.currentIndex < this.plogs.length) {
                    this.navigateToEdit(this.plogs[this.currentIndex].id);
                }
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831624, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(20);
            SymbolGlyph.fontColor([{ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        Button.pop();
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
                        Text.create('还没有手账');
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Swiper.create();
                        Swiper.index(this.currentIndex);
                        Swiper.indicator(false);
                        Swiper.loop(false);
                        Swiper.duration(300);
                        Swiper.curve(Curve.EaseInOut);
                        Swiper.onChange((index: number) => {
                            this.currentIndex = index;
                        });
                        Swiper.width('100%');
                        Swiper.layoutWeight(1);
                    }, Swiper);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const plog = _item;
                            this.PlogPage.bind(this)(plog);
                        };
                        this.forEachUpdateFunction(elmtId, this.plogs, forEachItemGenFunction, (plog: PlogCanvas) => plog.id.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    Swiper.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PlogPreviewPage";
    }
}
export default PlogPreviewPage;
registerNamedRoute(() => new PlogPreviewPage(undefined, {}), "", { bundleName: "com.example.lifetracker", moduleName: "entry", pagePath: "pages/PlogPreviewPage", pageFullPath: "entry/src/main/ets/pages/PlogPreviewPage", integratedHsp: "false", moduleType: "followWithHap" });
