if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PlogPreviewPage_Params {
    plog?: PlogCanvas | null;
    isLoading?: boolean;
    plogId?: number;
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
        this.__plog = new ObservedPropertyObjectPU(null, this, "plog");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.plogId = 0;
        this.settings = new RenderingContextSettings(true);
        this.patternCanvasContext = new CanvasRenderingContext2D(this.settings);
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PlogPreviewPage_Params) {
        if (params.plog !== undefined) {
            this.plog = params.plog;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.plogId !== undefined) {
            this.plogId = params.plogId;
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
        this.__plog.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__plog.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
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
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private plogId: number;
    private settings: RenderingContextSettings;
    private patternCanvasContext: CanvasRenderingContext2D;
    aboutToAppear(): void {
        const params = router.getParams() as Record<string, Object> | null;
        if (params && params['plogId']) {
            this.plogId = params['plogId'] as number;
        }
        this.loadPlog();
    }
    async loadPlog(): Promise<void> {
        if (this.plogId > 0) {
            try {
                this.plog = await PlogViewModel.getPlogById(this.plogId);
            }
            catch (error) {
                console.error('加载手账失败:', error);
            }
        }
        this.isLoading = false;
    }
    navigateBack(): void {
        router.back();
    }
    navigateToEdit(): void {
        router.pushUrl({
            url: 'pages/PlogEditorPage',
            params: { plogId: this.plogId }
        });
    }
    /** 渐变角度 → GradientDirection 枚举值 */
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
    /** 绘制花纹（透明底，叠加在背景之上） */
    drawPatternBg(): void {
        if (!this.plog)
            return;
        const ctx = this.patternCanvasContext;
        const w: number = ctx.width;
        const h: number = ctx.height;
        if (w === 0 || h === 0)
            return;
        const t = this.plog.patternThickness;
        const s = this.plog.patternSpacing;
        ctx.clearRect(0, 0, w, h);
        const pColor = this.plog.patternColor || '#E0E0E0';
        ctx.strokeStyle = pColor;
        ctx.lineWidth = t;
        ctx.fillStyle = pColor;
        const pType = this.plog.patternType;
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
            // 顶部栏：返回 + 日期标题 + 编辑
            Row.create();
            // 顶部栏：返回 + 日期标题 + 编辑
            Row.width('100%');
            // 顶部栏：返回 + 日期标题 + 编辑
            Row.height(48);
            // 顶部栏：返回 + 日期标题 + 编辑
            Row.padding({ left: 12, right: 16 });
            // 顶部栏：返回 + 日期标题 + 编辑
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
            Text.create(this.plog?.date ?? '');
            Text.fontSize({ "id": 16777315, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        // 顶部栏：返回 + 日期标题 + 编辑
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 画布区域
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
            else if (!this.plog) {
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
                        Text.create('手账加载失败');
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    if (!If.canRetake('previewCanvas')) {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Stack.create();
                            Stack.width('100%');
                            Stack.layoutWeight(1);
                            Stack.padding(16);
                            Stack.id('previewCanvas');
                        }, Stack);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            // 画布底色
                            if (this.plog.bgType === 'custom' && this.plog.customBgUri) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Image.create(this.plog.customBgUri);
                                        Image.width('100%');
                                        Image.height('100%');
                                        Image.objectFit(ImageFit.Cover);
                                    }, Image);
                                });
                            }
                            else if (this.plog.bgType === 'gradient' && this.plog.gradientColors.length >= 2) {
                                this.ifElseBranchUpdateFunction(1, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.width('100%');
                                        Column.height('100%');
                                        Column.linearGradient({
                                            direction: this.gradientAngleToGradientDirection(this.plog.gradientAngle),
                                            colors: this.plog.gradientColors.map((c: string, i: number) => [c, i / (this.plog!.gradientColors.length - 1)] as [
                                                ResourceColor,
                                                number
                                            ])
                                        });
                                    }, Column);
                                    Column.pop();
                                });
                            }
                            else if (this.plog.bgType === 'solid') {
                                this.ifElseBranchUpdateFunction(2, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.width('100%');
                                        Column.height('100%');
                                        Column.backgroundColor(this.plog.bgColor || '#FFFFFF');
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
                            // 花纹叠加层
                            if (this.plog.hasPattern && this.plog.patternType !== 'none') {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Canvas.create(this.patternCanvasContext);
                                        Canvas.width('100%');
                                        Canvas.height('100%');
                                        Canvas.onReady(() => {
                                            this.drawPatternBg();
                                        });
                                    }, Canvas);
                                    Canvas.pop();
                                });
                            }
                            // 画布元素（只读渲染，无交互）
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // 画布元素（只读渲染，无交互）
                            ForEach.create();
                            const forEachItemGenFunction = _item => {
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
                                            }, Image);
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
                            this.forEachUpdateFunction(elmtId, this.plog.elements, forEachItemGenFunction, (element: CanvasElement, index: number) => `${index}_${element._version ?? 0}`, false, true);
                        }, ForEach);
                        // 画布元素（只读渲染，无交互）
                        ForEach.pop();
                        Stack.pop();
                    }
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
