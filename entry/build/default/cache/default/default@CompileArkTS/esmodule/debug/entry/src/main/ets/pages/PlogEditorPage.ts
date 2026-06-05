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
    bgType?: BgType;
    bgColor?: string;
    bgHue?: number;
    bgSaturation?: number;
    bgOpacity?: number;
    gradientColors?: string[];
    gradientAngle?: number;
    patternType?: PatternType;
    hasPattern?: boolean;
    patternColor?: string;
    patternHue?: number;
    patternSaturation?: number;
    patternThickness?: number;
    patternSpacing?: number;
    customBgUri?: string;
    showEyedropper?: boolean;
    eyedropperTarget?: number;
    eyedropperPixelMap?: image.PixelMap | null;
    settings?: RenderingContextSettings;
    eyedropperCanvasContext?: CanvasRenderingContext2D;
    patternCanvasContext?: CanvasRenderingContext2D;
    plogIdFromParams?: number;
    diaryIdsFromParams?: number[];
    textSubTools?: string[];
    bgSubTools?: string[];
}
import PlogViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/PlogViewModel&";
import DiaryViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/DiaryViewModel&";
import type { PlogCanvas, CanvasElement, BgType, PatternType } from '../model/PlogCanvas';
import type { DiaryPost } from '../model/DiaryPost';
import type { TodoItem } from '../model/TodoItem';
import type { PlogInsertParams } from '../common/database/RDBStoreUtil';
import DateUtils from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtils&";
import router from "@ohos:router";
import curves from "@native:ohos.curves";
import componentSnapshot from "@ohos:arkui.componentSnapshot";
import promptAction from "@ohos:promptAction";
import photoAccessHelper from "@ohos:file.photoAccessHelper";
import type image from "@ohos:multimedia.image";
class PatternItem {
    type: PatternType = 'horizontal';
    label: string = '';
}
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
        this.__bgType = new ObservedPropertySimplePU('none', this, "bgType");
        this.__bgColor = new ObservedPropertySimplePU('#FFFFFF', this, "bgColor");
        this.__bgHue = new ObservedPropertySimplePU(0, this, "bgHue");
        this.__bgSaturation = new ObservedPropertySimplePU(0, this, "bgSaturation");
        this.__bgOpacity = new ObservedPropertySimplePU(100, this, "bgOpacity");
        this.__gradientColors = new ObservedPropertyObjectPU(['#FF6B6B', '#4ECDC4'], this, "gradientColors");
        this.__gradientAngle = new ObservedPropertySimplePU(135, this, "gradientAngle");
        this.__patternType = new ObservedPropertySimplePU('horizontal', this, "patternType");
        this.__hasPattern = new ObservedPropertySimplePU(false, this, "hasPattern");
        this.__patternColor = new ObservedPropertySimplePU('#E0E0E0', this, "patternColor");
        this.__patternHue = new ObservedPropertySimplePU(0, this, "patternHue");
        this.__patternSaturation = new ObservedPropertySimplePU(0, this, "patternSaturation");
        this.__patternThickness = new ObservedPropertySimplePU(3, this, "patternThickness");
        this.__patternSpacing = new ObservedPropertySimplePU(20, this, "patternSpacing");
        this.__customBgUri = new ObservedPropertySimplePU('', this, "customBgUri");
        this.__showEyedropper = new ObservedPropertySimplePU(false, this, "showEyedropper");
        this.eyedropperTarget = 0;
        this.eyedropperPixelMap = null;
        this.settings = new RenderingContextSettings(true);
        this.eyedropperCanvasContext = new CanvasRenderingContext2D(this.settings);
        this.patternCanvasContext = new CanvasRenderingContext2D(this.settings);
        this.plogIdFromParams = 0;
        this.diaryIdsFromParams = [];
        this.textSubTools = ['样式', '颜色', '排版', '粗斜体', '弯曲'];
        this.bgSubTools = ['纯色', '渐变', '花纹', '自定义'];
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
        if (params.bgType !== undefined) {
            this.bgType = params.bgType;
        }
        if (params.bgColor !== undefined) {
            this.bgColor = params.bgColor;
        }
        if (params.bgHue !== undefined) {
            this.bgHue = params.bgHue;
        }
        if (params.bgSaturation !== undefined) {
            this.bgSaturation = params.bgSaturation;
        }
        if (params.bgOpacity !== undefined) {
            this.bgOpacity = params.bgOpacity;
        }
        if (params.gradientColors !== undefined) {
            this.gradientColors = params.gradientColors;
        }
        if (params.gradientAngle !== undefined) {
            this.gradientAngle = params.gradientAngle;
        }
        if (params.patternType !== undefined) {
            this.patternType = params.patternType;
        }
        if (params.hasPattern !== undefined) {
            this.hasPattern = params.hasPattern;
        }
        if (params.patternColor !== undefined) {
            this.patternColor = params.patternColor;
        }
        if (params.patternHue !== undefined) {
            this.patternHue = params.patternHue;
        }
        if (params.patternSaturation !== undefined) {
            this.patternSaturation = params.patternSaturation;
        }
        if (params.patternThickness !== undefined) {
            this.patternThickness = params.patternThickness;
        }
        if (params.patternSpacing !== undefined) {
            this.patternSpacing = params.patternSpacing;
        }
        if (params.customBgUri !== undefined) {
            this.customBgUri = params.customBgUri;
        }
        if (params.showEyedropper !== undefined) {
            this.showEyedropper = params.showEyedropper;
        }
        if (params.eyedropperTarget !== undefined) {
            this.eyedropperTarget = params.eyedropperTarget;
        }
        if (params.eyedropperPixelMap !== undefined) {
            this.eyedropperPixelMap = params.eyedropperPixelMap;
        }
        if (params.settings !== undefined) {
            this.settings = params.settings;
        }
        if (params.eyedropperCanvasContext !== undefined) {
            this.eyedropperCanvasContext = params.eyedropperCanvasContext;
        }
        if (params.patternCanvasContext !== undefined) {
            this.patternCanvasContext = params.patternCanvasContext;
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
        if (params.bgSubTools !== undefined) {
            this.bgSubTools = params.bgSubTools;
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
        this.__bgType.purgeDependencyOnElmtId(rmElmtId);
        this.__bgColor.purgeDependencyOnElmtId(rmElmtId);
        this.__bgHue.purgeDependencyOnElmtId(rmElmtId);
        this.__bgSaturation.purgeDependencyOnElmtId(rmElmtId);
        this.__bgOpacity.purgeDependencyOnElmtId(rmElmtId);
        this.__gradientColors.purgeDependencyOnElmtId(rmElmtId);
        this.__gradientAngle.purgeDependencyOnElmtId(rmElmtId);
        this.__patternType.purgeDependencyOnElmtId(rmElmtId);
        this.__hasPattern.purgeDependencyOnElmtId(rmElmtId);
        this.__patternColor.purgeDependencyOnElmtId(rmElmtId);
        this.__patternHue.purgeDependencyOnElmtId(rmElmtId);
        this.__patternSaturation.purgeDependencyOnElmtId(rmElmtId);
        this.__patternThickness.purgeDependencyOnElmtId(rmElmtId);
        this.__patternSpacing.purgeDependencyOnElmtId(rmElmtId);
        this.__customBgUri.purgeDependencyOnElmtId(rmElmtId);
        this.__showEyedropper.purgeDependencyOnElmtId(rmElmtId);
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
        this.__bgType.aboutToBeDeleted();
        this.__bgColor.aboutToBeDeleted();
        this.__bgHue.aboutToBeDeleted();
        this.__bgSaturation.aboutToBeDeleted();
        this.__bgOpacity.aboutToBeDeleted();
        this.__gradientColors.aboutToBeDeleted();
        this.__gradientAngle.aboutToBeDeleted();
        this.__patternType.aboutToBeDeleted();
        this.__hasPattern.aboutToBeDeleted();
        this.__patternColor.aboutToBeDeleted();
        this.__patternHue.aboutToBeDeleted();
        this.__patternSaturation.aboutToBeDeleted();
        this.__patternThickness.aboutToBeDeleted();
        this.__patternSpacing.aboutToBeDeleted();
        this.__customBgUri.aboutToBeDeleted();
        this.__showEyedropper.aboutToBeDeleted();
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
    // 当前激活的子工具（文字: 0=样式,1=颜色,2=排版,3=粗斜体,4=弯曲; 背景: 0=纯色,1=渐变,2=花纹,3=自定义）
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
    // ---- 背景状态 ----
    private __bgType: ObservedPropertySimplePU<BgType>;
    get bgType() {
        return this.__bgType.get();
    }
    set bgType(newValue: BgType) {
        this.__bgType.set(newValue);
    }
    private __bgColor: ObservedPropertySimplePU<string>; // 纯色色值
    get bgColor() {
        return this.__bgColor.get();
    }
    set bgColor(newValue: string) {
        this.__bgColor.set(newValue);
    }
    private __bgHue: ObservedPropertySimplePU<number>; // 色相 0-360
    get bgHue() {
        return this.__bgHue.get();
    }
    set bgHue(newValue: number) {
        this.__bgHue.set(newValue);
    }
    private __bgSaturation: ObservedPropertySimplePU<number>; // 饱和度 0-100
    get bgSaturation() {
        return this.__bgSaturation.get();
    }
    set bgSaturation(newValue: number) {
        this.__bgSaturation.set(newValue);
    }
    private __bgOpacity: ObservedPropertySimplePU<number>; // 透明度 0-100
    get bgOpacity() {
        return this.__bgOpacity.get();
    }
    set bgOpacity(newValue: number) {
        this.__bgOpacity.set(newValue);
    }
    private __gradientColors: ObservedPropertyObjectPU<string[]>; // 渐变色
    get gradientColors() {
        return this.__gradientColors.get();
    }
    set gradientColors(newValue: string[]) {
        this.__gradientColors.set(newValue);
    }
    private __gradientAngle: ObservedPropertySimplePU<number>; // 渐变角度
    get gradientAngle() {
        return this.__gradientAngle.get();
    }
    set gradientAngle(newValue: number) {
        this.__gradientAngle.set(newValue);
    }
    private __patternType: ObservedPropertySimplePU<PatternType>; // 花纹类型
    get patternType() {
        return this.__patternType.get();
    }
    set patternType(newValue: PatternType) {
        this.__patternType.set(newValue);
    }
    private __hasPattern: ObservedPropertySimplePU<boolean>; // 是否叠加花纹
    get hasPattern() {
        return this.__hasPattern.get();
    }
    set hasPattern(newValue: boolean) {
        this.__hasPattern.set(newValue);
    }
    private __patternColor: ObservedPropertySimplePU<string>; // 花纹颜色
    get patternColor() {
        return this.__patternColor.get();
    }
    set patternColor(newValue: string) {
        this.__patternColor.set(newValue);
    }
    private __patternHue: ObservedPropertySimplePU<number>; // 花纹色相 0-360
    get patternHue() {
        return this.__patternHue.get();
    }
    set patternHue(newValue: number) {
        this.__patternHue.set(newValue);
    }
    private __patternSaturation: ObservedPropertySimplePU<number>; // 花纹饱和度 0-100
    get patternSaturation() {
        return this.__patternSaturation.get();
    }
    set patternSaturation(newValue: number) {
        this.__patternSaturation.set(newValue);
    }
    private __patternThickness: ObservedPropertySimplePU<number>; // 花纹粗细 1-10
    get patternThickness() {
        return this.__patternThickness.get();
    }
    set patternThickness(newValue: number) {
        this.__patternThickness.set(newValue);
    }
    private __patternSpacing: ObservedPropertySimplePU<number>; // 花纹间隔 5-50
    get patternSpacing() {
        return this.__patternSpacing.get();
    }
    set patternSpacing(newValue: number) {
        this.__patternSpacing.set(newValue);
    }
    private __customBgUri: ObservedPropertySimplePU<string>; // 自定义背景图 URI
    get customBgUri() {
        return this.__customBgUri.get();
    }
    set customBgUri(newValue: string) {
        this.__customBgUri.set(newValue);
    }
    // 取色器状态
    private __showEyedropper: ObservedPropertySimplePU<boolean>;
    get showEyedropper() {
        return this.__showEyedropper.get();
    }
    set showEyedropper(newValue: boolean) {
        this.__showEyedropper.set(newValue);
    }
    private eyedropperTarget: number; // 0=背景色, 1=花纹色
    private eyedropperPixelMap: image.PixelMap | null;
    private settings: RenderingContextSettings;
    private eyedropperCanvasContext: CanvasRenderingContext2D;
    private patternCanvasContext: CanvasRenderingContext2D;
    private plogIdFromParams: number;
    private diaryIdsFromParams: number[];
    private textSubTools: string[];
    private bgSubTools: string[];
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
                this.restoreBgState(existingPlog);
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
            bgType: 'none',
            bgColor: '#FFFFFF',
            gradientColors: ['#FF6B6B', '#4ECDC4'],
            gradientAngle: 135,
            hasPattern: false,
            patternColor: '#E0E0E0',
            patternType: 'horizontal',
            patternThickness: 3,
            patternSpacing: 20,
            customBgUri: '',
            elements: [],
            diaryIds: this.diaryIdsFromParams.length > 0 ? [...this.diaryIdsFromParams] : undefined,
            createdAt: Date.now(),
            thumbnail: ''
        };
        this.elements = [];
    }
    /** 从已保存的手账恢复背景设置到 @State */
    restoreBgState(plog: PlogCanvas): void {
        this.bgType = plog.bgType ?? 'none';
        this.bgColor = plog.bgColor ?? '#FFFFFF';
        this.gradientColors = plog.gradientColors?.length ? [...plog.gradientColors] : ['#FF6B6B', '#4ECDC4'];
        this.gradientAngle = plog.gradientAngle ?? 135;
        this.hasPattern = plog.hasPattern ?? false;
        this.patternColor = plog.patternColor ?? '#E0E0E0';
        this.patternType = plog.patternType ?? 'horizontal';
        this.patternThickness = plog.patternThickness ?? 3;
        this.patternSpacing = plog.patternSpacing ?? 20;
        this.customBgUri = plog.customBgUri ?? '';
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
        // 切换标签时同步更新底色类型（花纹作为独立叠加层不受影响）
        if (subIndex === 0) {
            this.bgType = 'solid';
        }
        else if (subIndex === 1) {
            this.bgType = 'gradient';
        }
        else if (subIndex === 3) {
            // 自定义标签页，不自动切换 bgType，由 pickCustomBg 处理
        }
        this.applyBgToPlog();
    }
    /**
     * 展开/收起面板
     */
    togglePanel(): void {
        Context.animateTo({ duration: 280, curve: Curve.EaseInOut }, () => {
            this.panelExpanded = !this.panelExpanded;
        });
    }
    /** HSL → HEX (不含 alpha) */
    hslToHex(h: number, s: number): string {
        const l = 0.5; // 固定明度50%
        s /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        if (h < 60) {
            r = c;
            g = x;
        }
        else if (h < 120) {
            r = x;
            g = c;
        }
        else if (h < 180) {
            g = c;
            b = x;
        }
        else if (h < 240) {
            g = x;
            b = c;
        }
        else if (h < 300) {
            r = x;
            b = c;
        }
        else {
            r = c;
            b = x;
        }
        const toHex = (v: number) => {
            const hex = Math.round((v + m) * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }
    /** 获取当前纯色（含透明度） */
    /** 绘制花纹（透明底，叠加在背景之上） */
    drawPatternBg(): void {
        const ctx = this.patternCanvasContext;
        const w: number = ctx.width;
        const h: number = ctx.height;
        if (w === 0 || h === 0)
            return;
        const t = this.patternThickness;
        const s = this.patternSpacing;
        ctx.clearRect(0, 0, w, h);
        const pColor = this.patternColor || '#E0E0E0';
        ctx.strokeStyle = pColor;
        ctx.lineWidth = t;
        ctx.fillStyle = pColor;
        if (this.patternType === 'horizontal') {
            for (let y = 0; y < h; y += s) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        }
        else if (this.patternType === 'vertical') {
            for (let x = 0; x < w; x += s) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
        }
        else if (this.patternType === 'grid') {
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
        else if (this.patternType === 'dots') {
            const r = t * 2;
            for (let y = r; y < h; y += s) {
                for (let x = r; x < w; x += s) {
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        else if (this.patternType === 'waves') {
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
    /** 将背景设置同步到 plog 对象 */
    applyBgToPlog(): void {
        if (!this.plog)
            return;
        this.plog.bgType = this.bgType;
        this.plog.bgColor = this.bgColor;
        this.plog.gradientColors = [...this.gradientColors];
        this.plog.gradientAngle = this.gradientAngle;
        this.plog.hasPattern = this.hasPattern;
        this.plog.patternColor = this.patternColor;
        this.plog.patternType = this.patternType;
        this.plog.patternThickness = this.patternThickness;
        this.plog.patternSpacing = this.patternSpacing;
        this.plog.customBgUri = this.customBgUri;
        if (this.hasPattern && this.patternType !== 'none') {
            this.drawPatternBg();
        }
    }
    /** 从相册选择自定义背景 */
    async pickCustomBg(): Promise<void> {
        try {
            const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
            photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
            photoSelectOptions.maxSelectNumber = 1;
            const photoViewPicker = new photoAccessHelper.PhotoViewPicker();
            const result = await photoViewPicker.select(photoSelectOptions);
            if (result && result.photoUris && result.photoUris.length > 0) {
                this.customBgUri = result.photoUris[0];
                this.bgType = 'custom';
                this.applyBgToPlog();
            }
        }
        catch (error) {
            console.error('选择背景图失败:', error);
        }
    }
    /** 启动吸管取色：截取画布 */
    startEyedropper(target: number): void {
        this.eyedropperTarget = target;
        componentSnapshot.get('plogCanvas', (error: Error, pixelMap: image.PixelMap) => {
            if (error) {
                console.error('截取画布失败:', error);
                promptAction.showToast({ message: '取色启动失败，请重试' });
                return;
            }
            this.eyedropperPixelMap = pixelMap;
            this.showEyedropper = true;
        });
    }
    /** 在取色 Canvas 上绘制画布截图 */
    drawEyedropperImage(): void {
        const ctx = this.eyedropperCanvasContext;
        const w = ctx.width;
        const h = ctx.height;
        if (w === 0 || h === 0 || !this.eyedropperPixelMap)
            return;
        const img = new ImageBitmap(this.eyedropperPixelMap);
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
    }
    /** 从 Canvas 指定坐标吸取颜色 */
    pickColorFromCanvas(x: number, y: number): void {
        const ctx = this.eyedropperCanvasContext;
        const w = ctx.width;
        const h = ctx.height;
        if (w === 0 || h === 0)
            return;
        const clampX = Math.max(0, Math.min(Math.round(x), w - 1));
        const clampY = Math.max(0, Math.min(Math.round(y), h - 1));
        try {
            const imageData = ctx.getImageData(clampX, clampY, 1, 1);
            const data = imageData.data;
            const toHex = (v: number) => v.toString(16).padStart(2, '0');
            const pickedColor = `#${toHex(data[0])}${toHex(data[1])}${toHex(data[2])}`.toUpperCase();
            if (this.eyedropperTarget === 0) {
                this.bgColor = pickedColor;
                this.bgType = 'solid';
            }
            else {
                this.patternColor = pickedColor;
            }
            this.applyBgToPlog();
            this.showEyedropper = false;
            this.eyedropperPixelMap = null;
            promptAction.showToast({ message: `已吸取颜色` });
        }
        catch (e) {
            console.error('取色失败:', e);
            promptAction.showToast({ message: '取色失败，请重试' });
        }
    }
    /** 渐变角度 → GradientDirection 枚举值 */
    gradientAngleToGradientDirection(): number {
        const a = Math.round(this.gradientAngle / 45) * 45;
        // GradientDirection: 0=Bottom, 1=Top, 2=Left, 3=Right, 4=BottomRight, 5=BottomLeft, 6=TopRight, 7=TopLeft
        if (a === 0 || a === 360)
            return 0; // Bottom (↓)
        if (a === 45)
            return 4; // BottomRight (↘)
        if (a === 90)
            return 3; // Right (→)
        if (a === 135)
            return 6; // TopRight (↗)
        if (a === 180)
            return 1; // Top (↑)
        if (a === 225)
            return 7; // TopLeft (↖)
        if (a === 270)
            return 2; // Left (←)
        if (a === 315)
            return 5; // BottomLeft (↙)
        return 0;
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
            this.applyBgToPlog();
            // 确保diaryIds被保存
            if (this.diaryIdsFromParams.length > 0 && !this.plog.diaryIds) {
                this.plog.diaryIds = [...this.diaryIdsFromParams];
            }
            if (this.plog.id === 0) {
                const insertParams: PlogInsertParams = {
                    date: this.plog.date,
                    backgroundImage: this.plog.backgroundImage,
                    bgType: this.plog.bgType,
                    bgColor: this.plog.bgColor,
                    gradientColors: this.plog.gradientColors,
                    gradientAngle: this.plog.gradientAngle,
                    hasPattern: this.plog.hasPattern,
                    patternColor: this.plog.patternColor,
                    patternType: this.plog.patternType,
                    patternThickness: this.plog.patternThickness,
                    patternSpacing: this.plog.patternSpacing,
                    customBgUri: this.plog.customBgUri,
                    elements: this.plog.elements,
                    diaryIds: this.plog.diaryIds,
                    createdAt: this.plog.createdAt,
                    thumbnail: this.plog.thumbnail
                };
                const newId = await PlogViewModel.createPlog(insertParams);
                if (newId > 0 && this.plog) {
                    this.plog.id = newId;
                }
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
                this.applyBgToPlog();
                // 保存关联的随手记ID
                this.plog.diaryIds = materials.posts.map((post: DiaryPost) => post.id);
                if (this.plog.id === 0) {
                    const insertParams: PlogInsertParams = {
                        date: this.plog.date,
                        backgroundImage: this.plog.backgroundImage,
                        bgType: this.plog.bgType,
                        bgColor: this.plog.bgColor,
                        gradientColors: this.plog.gradientColors,
                        gradientAngle: this.plog.gradientAngle,
                        hasPattern: this.plog.hasPattern,
                        patternColor: this.plog.patternColor,
                        patternType: this.plog.patternType,
                        patternThickness: this.plog.patternThickness,
                        patternSpacing: this.plog.patternSpacing,
                        customBgUri: this.plog.customBgUri,
                        elements: this.plog.elements,
                        diaryIds: this.plog.diaryIds,
                        createdAt: this.plog.createdAt,
                        thumbnail: this.plog.thumbnail
                    };
                    const genId = await PlogViewModel.createPlog(insertParams);
                    if (genId > 0 && this.plog) {
                        this.plog.id = genId;
                    }
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
                        Column.transition(TransitionEffect.OPACITY.animation({ duration: 180, curve: Curve.EaseOut }));
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.activeSubTool === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // ===== 纯色 =====
                                    Scroll.create();
                                    // ===== 纯色 =====
                                    Scroll.width('100%');
                                    // ===== 纯色 =====
                                    Scroll.height(200);
                                    // ===== 纯色 =====
                                    Scroll.scrollBar(BarState.Off);
                                }, Scroll);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create({ space: 12 });
                                    Column.width('100%');
                                    Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 10 });
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 吸色笔
                                    Column.create();
                                    // 吸色笔
                                    Column.width(36);
                                    // 吸色笔
                                    Column.height(36);
                                    // 吸色笔
                                    Column.borderRadius(18);
                                    // 吸色笔
                                    Column.justifyContent(FlexAlign.Center);
                                    // 吸色笔
                                    Column.backgroundColor('#FFF0E8');
                                    // 吸色笔
                                    Column.border({ width: 1.5, color: { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
                                    // 吸色笔
                                    Column.onClick(() => this.startEyedropper(0));
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('吸');
                                    Text.fontSize(14);
                                    Text.fontColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontWeight(FontWeight.Medium);
                                }, Text);
                                Text.pop();
                                // 吸色笔
                                Column.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const color = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.width(36);
                                            Column.height(36);
                                            Column.backgroundColor(color);
                                            Column.borderRadius(18);
                                            Column.border({ width: this.bgColor === color ? 2 : 0.5, color: this.bgColor === color ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : '#CCCCCC' });
                                            Column.onClick(() => {
                                                this.bgColor = color;
                                                this.bgType = 'solid';
                                                this.applyBgToPlog();
                                            });
                                        }, Column);
                                        Column.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, ['#FFFFFF', '#F5F5F5', '#FFF8E1', '#E8F5E9', '#E3F2FD', '#FCE4EC',
                                        '#F3E5F5', '#E0F7FA', '#FFF3E0', '#EFEBE9', '#333333', '#000000'], forEachItemGenFunction, (color: string) => color, false, false);
                                }, ForEach);
                                ForEach.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('色相');
                                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.bgHue, min: 0, max: 360, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.selectedColor(this.hslToHex(this.bgHue, this.bgSaturation));
                                    Slider.onChange((value: number) => {
                                        this.bgHue = value;
                                        this.bgColor = this.hslToHex(this.bgHue, this.bgSaturation);
                                        this.bgType = 'solid';
                                        this.applyBgToPlog();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.bgHue)}°`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('饱和度');
                                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.bgSaturation, min: 0, max: 100, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.selectedColor(this.hslToHex(this.bgHue, this.bgSaturation));
                                    Slider.onChange((value: number) => {
                                        this.bgSaturation = value;
                                        this.bgColor = this.hslToHex(this.bgHue, this.bgSaturation);
                                        this.bgType = 'solid';
                                        this.applyBgToPlog();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.bgSaturation)}%`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('透明度');
                                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.bgOpacity, min: 0, max: 100, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.onChange((value: number) => {
                                        this.bgOpacity = value;
                                        this.bgType = 'solid';
                                        this.applyBgToPlog();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.bgOpacity)}%`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                Column.pop();
                                // ===== 纯色 =====
                                Scroll.pop();
                            });
                        }
                        else if (this.activeSubTool === 1) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // ===== 渐变 =====
                                    Column.create({ space: 12 });
                                    // ===== 渐变 =====
                                    Column.width('100%');
                                    // ===== 渐变 =====
                                    Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Scroll.create();
                                    Scroll.width('100%');
                                    Scroll.scrollBar(BarState.Off);
                                    Scroll.scrollable(ScrollDirection.Horizontal);
                                }, Scroll);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 10 });
                                    Row.height(60);
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const colors = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.width(64);
                                            Column.height(48);
                                            Column.borderRadius(8);
                                            Column.linearGradient({
                                                direction: this.gradientAngleToGradientDirection(),
                                                colors: [[colors[0], 0.0], [colors[1], 1.0]]
                                            });
                                            Column.border({
                                                width: this.gradientColors[0] === colors[0] && this.gradientColors[1] === colors[1] ? 2 : 0,
                                                color: { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
                                            });
                                            Column.onClick(() => {
                                                this.gradientColors = [colors[0], colors[1]];
                                                this.bgType = 'gradient';
                                                this.applyBgToPlog();
                                            });
                                        }, Column);
                                        Column.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, [
                                        ['#A8E6CF', '#DCEDC1'],
                                        ['#FFD3B6', '#FFAAA5'],
                                        ['#FF8B94', '#FFAAA5'],
                                        ['#B5EAD7', '#C7CEEA'],
                                        ['#E2F0CB', '#FFDAC1'],
                                        ['#C7CEEA', '#E2F0CB'],
                                        ['#FFB7B2', '#FFDAC1'],
                                        ['#B5EAD7', '#E2F0CB'],
                                        ['#FF9AA2', '#FFB7B2'],
                                        ['#C7CEEA', '#B5EAD7'],
                                        ['#FFDAC1', '#FFB7B2'],
                                        ['#E2F0CB', '#B5EAD7'],
                                    ], forEachItemGenFunction, (colors: string[]) => colors[0], false, false);
                                }, ForEach);
                                ForEach.pop();
                                Row.pop();
                                Scroll.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('方向');
                                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.gradientAngle, min: 0, max: 360, step: 15 });
                                    Slider.layoutWeight(1);
                                    Slider.onChange((value: number) => {
                                        this.gradientAngle = value;
                                        this.bgType = 'gradient';
                                        this.applyBgToPlog();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.gradientAngle)}°`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                // ===== 渐变 =====
                                Column.pop();
                            });
                        }
                        else if (this.activeSubTool === 2) {
                            this.ifElseBranchUpdateFunction(2, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // ===== 花纹 =====
                                    Scroll.create();
                                    // ===== 花纹 =====
                                    Scroll.width('100%');
                                    // ===== 花纹 =====
                                    Scroll.height(320);
                                    // ===== 花纹 =====
                                    Scroll.scrollBar(BarState.Off);
                                }, Scroll);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create({ space: 12 });
                                    Column.width('100%');
                                    Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Scroll.create();
                                    Scroll.width('100%');
                                    Scroll.scrollBar(BarState.Off);
                                    Scroll.scrollable(ScrollDirection.Horizontal);
                                }, Scroll);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 10 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const item = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(item.label);
                                            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                            Text.fontColor(this.patternType === item.type
                                                ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                            Text.padding({ left: 12, right: 12, top: 8, bottom: 8 });
                                            Text.borderRadius(16);
                                            Text.backgroundColor(this.patternType === item.type ? '#FFF0E8' : '#F5F5F5');
                                            Text.border({
                                                width: this.patternType === item.type ? 1.5 : 0,
                                                color: { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
                                            });
                                            Text.onClick(() => {
                                                this.patternType = item.type;
                                                if (item.type === 'none') {
                                                    this.hasPattern = false;
                                                }
                                                else {
                                                    this.hasPattern = true;
                                                }
                                                this.applyBgToPlog();
                                            });
                                        }, Text);
                                        Text.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, [
                                        { type: 'none' as PatternType, label: '无花纹' },
                                        { type: 'horizontal' as PatternType, label: '横条纹' },
                                        { type: 'vertical' as PatternType, label: '竖条纹' },
                                        { type: 'grid' as PatternType, label: '网格' },
                                        { type: 'dots' as PatternType, label: '波点' },
                                        { type: 'waves' as PatternType, label: '波浪' },
                                    ], forEachItemGenFunction, (item: PatternItem) => item.type, false, false);
                                }, ForEach);
                                ForEach.pop();
                                Row.pop();
                                Scroll.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('粗细');
                                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.patternThickness, min: 1, max: 10, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.onChange((value: number) => {
                                        this.patternThickness = value;
                                        this.hasPattern = true;
                                        this.applyBgToPlog();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.patternThickness)}`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('间隔');
                                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.patternSpacing, min: 5, max: 50, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.onChange((value: number) => {
                                        this.patternSpacing = value;
                                        this.hasPattern = true;
                                        this.applyBgToPlog();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.patternSpacing)}`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // --- 花纹颜色 ---
                                    Divider.create();
                                    // --- 花纹颜色 ---
                                    Divider.color('#EEEEEE');
                                }, Divider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('花纹颜色');
                                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width('100%');
                                    Text.margin({ top: 4 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 10 });
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 吸色笔
                                    Column.create();
                                    // 吸色笔
                                    Column.width(36);
                                    // 吸色笔
                                    Column.height(36);
                                    // 吸色笔
                                    Column.borderRadius(18);
                                    // 吸色笔
                                    Column.justifyContent(FlexAlign.Center);
                                    // 吸色笔
                                    Column.backgroundColor('#FFF0E8');
                                    // 吸色笔
                                    Column.border({ width: 1.5, color: { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
                                    // 吸色笔
                                    Column.onClick(() => this.startEyedropper(1));
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('吸');
                                    Text.fontSize(14);
                                    Text.fontColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontWeight(FontWeight.Medium);
                                }, Text);
                                Text.pop();
                                // 吸色笔
                                Column.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const color = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.width(36);
                                            Column.height(36);
                                            Column.backgroundColor(color);
                                            Column.borderRadius(18);
                                            Column.border({ width: this.patternColor === color ? 2 : 0.5, color: this.patternColor === color ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : '#CCCCCC' });
                                            Column.onClick(() => {
                                                this.patternColor = color;
                                                this.applyBgToPlog();
                                            });
                                        }, Column);
                                        Column.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, ['#E0E0E0', '#FFFFFF', '#000000', '#FFB6C1', '#FFD700', '#87CEEB',
                                        '#98FB98', '#DDA0DD', '#F0E68C', '#FFA07A', '#B0C4DE', '#FF6B6B'], forEachItemGenFunction, (color: string) => color, false, false);
                                }, ForEach);
                                ForEach.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('色相');
                                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.patternHue, min: 0, max: 360, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.selectedColor(this.hslToHex(this.patternHue, this.patternSaturation));
                                    Slider.onChange((value: number) => {
                                        this.patternHue = value;
                                        this.patternColor = this.hslToHex(this.patternHue, this.patternSaturation);
                                        this.applyBgToPlog();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.patternHue)}°`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('饱和度');
                                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.patternSaturation, min: 0, max: 100, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.selectedColor(this.hslToHex(this.patternHue, this.patternSaturation));
                                    Slider.onChange((value: number) => {
                                        this.patternSaturation = value;
                                        this.patternColor = this.hslToHex(this.patternHue, this.patternSaturation);
                                        this.applyBgToPlog();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.patternSaturation)}%`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                Column.pop();
                                // ===== 花纹 =====
                                Scroll.pop();
                            });
                        }
                        else if (this.activeSubTool === 3) {
                            this.ifElseBranchUpdateFunction(3, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // ===== 自定义 =====
                                    Column.create({ space: 12 });
                                    // ===== 自定义 =====
                                    Column.width('100%');
                                    // ===== 自定义 =====
                                    Column.height(160);
                                    // ===== 自定义 =====
                                    Column.justifyContent(FlexAlign.Center);
                                    // ===== 自定义 =====
                                    Column.padding({ left: 16, right: 16 });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                    Row.height(48);
                                    Row.justifyContent(FlexAlign.Center);
                                    Row.borderRadius(10);
                                    Row.border({ width: 1, color: { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
                                    Row.onClick(() => this.pickCustomBg());
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('从相册选择背景图');
                                    Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                }, Text);
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.customBgUri) {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Image.create(this.customBgUri);
                                                Image.width(80);
                                                Image.height(80);
                                                Image.borderRadius(8);
                                                Image.objectFit(ImageFit.Cover);
                                                Image.margin({ top: 8 });
                                            }, Image);
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                                // ===== 自定义 =====
                                Column.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(4, () => {
                            });
                        }
                    }, If);
                    If.pop();
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
            Button.createWithLabel('保存');
            Button.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.fontColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.backgroundColor(Color.Transparent);
            Button.padding({ left: 16, right: 16, top: 8, bottom: 8 });
            Button.onClick(() => this.savePlog());
        }, Button);
        Button.pop();
        // 顶部栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 画布区域
            Stack.create();
            // 画布区域
            Stack.width('100%');
            // 画布区域
            Stack.layoutWeight(1);
            // 画布区域
            Stack.padding(16);
            // 画布区域
            Stack.id('plogCanvas');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 画布底色
            if (this.bgType === 'custom' && this.customBgUri) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.customBgUri);
                        Image.width('100%');
                        Image.height('100%');
                        Image.objectFit(ImageFit.Cover);
                    }, Image);
                });
            }
            else if (this.bgType === 'gradient' && this.gradientColors.length >= 2) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.linearGradient({
                            direction: this.gradientAngleToGradientDirection(),
                            colors: this.gradientColors.map((c: string, i: number) => [c, i / (this.gradientColors.length - 1)] as [
                                ResourceColor,
                                number
                            ])
                        });
                    }, Column);
                    Column.pop();
                });
            }
            else if (this.bgType === 'solid') {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor(this.bgColor || '#FFFFFF');
                        Column.opacity(this.bgOpacity / 100);
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
            if (this.hasPattern && this.patternType !== 'none') {
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
            // 画布元素
            else {
                this.ifElseBranchUpdateFunction(1, () => {
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
                        // 子工具栏（文字/背景工具有）
                        if (this.activeToolTab === 2 || this.activeToolTab === 1) {
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
                                    this.forEachUpdateFunction(elmtId, this.activeToolTab === 1 ? this.bgSubTools : this.textSubTools, forEachItemGenFunction, (tool: string, idx: number) => idx.toString(), true, true);
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 取色器覆盖层
            if (this.showEyedropper) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#000000');
                        Column.zIndex(999);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.height(56);
                        Row.padding({ left: 16, right: 16 });
                        Row.backgroundColor('rgba(0,0,0,0.75)');
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击图片取色');
                        Text.fontSize(16);
                        Text.fontColor('#FFFFFF');
                        Text.layoutWeight(1);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.fontSize(14);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor('rgba(255,255,255,0.2)');
                        Button.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                        Button.onClick(() => { this.showEyedropper = false; this.eyedropperPixelMap = null; });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Canvas.create(this.eyedropperCanvasContext);
                        Canvas.width('100%');
                        Canvas.layoutWeight(1);
                        Canvas.onReady(() => this.drawEyedropperImage());
                        Canvas.onTouch((event: TouchEvent) => {
                            if (event.type === TouchType.Down && event.touches.length > 0) {
                                const touch = event.touches[0];
                                this.pickColorFromCanvas(touch.x, touch.y);
                            }
                        });
                    }, Canvas);
                    Canvas.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.height(44);
                        Row.justifyContent(FlexAlign.Center);
                        Row.backgroundColor('rgba(0,0,0,0.6)');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击任意位置吸取颜色');
                        Text.fontSize(13);
                        Text.fontColor('#FFFFFF');
                    }, Text);
                    Text.pop();
                    Row.pop();
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
