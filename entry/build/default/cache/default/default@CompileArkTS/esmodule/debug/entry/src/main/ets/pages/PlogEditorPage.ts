if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PlogEditorPage_Params {
    plog?: PlogCanvas | null;
    elements?: CanvasElement[];
    selectedElementIndex?: number;
    editingTextIndex?: number;
    editingTextValue?: string;
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
    resizeStartWidth?: number;
    resizeStartHeight?: number;
    dragStartX?: number;
    dragStartY?: number;
    textFontStyle?: TextStyle;
    textFontSize?: number;
    textShadowOpacity?: number;
    textColor?: string;
    textOpacity?: number;
    textColorHue?: number;
    textColorSaturation?: number;
    textAlign?: TextAlign;
    textVerticalAlign?: number;
    textDirection?: TextDirection;
    textLineSpacing?: number;
    textLetterSpacing?: number;
    textFontWeight?: number;
    textItalicAngle?: number;
    newTextContent?: string;
    fontStyleMap?: Record<string, string>;
}
import PlogViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/PlogViewModel&";
import DiaryViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/DiaryViewModel&";
import type { PlogCanvas, CanvasElement, BgType, PatternType, TextStyle, TextDirection } from '../model/PlogCanvas';
import type { DiaryPost } from '../model/DiaryPost';
import type { TodoItem } from '../model/TodoItem';
import type { PlogInsertParams } from '../common/database/RDBStoreUtil';
import DateUtils from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtils&";
import router from "@ohos:router";
import curves from "@native:ohos.curves";
import componentSnapshot from "@ohos:arkui.componentSnapshot";
import promptAction from "@ohos:promptAction";
import font from "@ohos:font";
import photoAccessHelper from "@ohos:file.photoAccessHelper";
import image from "@ohos:multimedia.image";
import fs from "@ohos:file.fs";
import type common from "@ohos:app.ability.common";
class PatternItem {
    type: PatternType = 'horizontal';
    label: string = '';
}
class FontStyleItem {
    style: TextStyle = 'normal';
    label: string = '';
}
class TextAlignItem {
    align: TextAlign = TextAlign.Center;
    label: string = '';
}
class VerticalAlignItem {
    va: number = 1;
    label: string = '';
}
class FontWeightItem {
    w: number = 400;
    label: string = '';
}
class DirectionItem {
    dir: TextDirection = 'horizontal';
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
        this.__editingTextIndex = new ObservedPropertySimplePU(-1, this, "editingTextIndex");
        this.__editingTextValue = new ObservedPropertySimplePU('', this, "editingTextValue");
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
        this.textSubTools = ['样式', '颜色', '排版', '粗斜体'];
        this.bgSubTools = ['纯色', '渐变', '花纹', '自定义'];
        this.resizeStartWidth = 0;
        this.resizeStartHeight = 0;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.__textFontStyle = new ObservedPropertySimplePU('normal', this, "textFontStyle");
        this.__textFontSize = new ObservedPropertySimplePU(16, this, "textFontSize");
        this.__textShadowOpacity = new ObservedPropertySimplePU(0, this, "textShadowOpacity");
        this.__textColor = new ObservedPropertySimplePU('#333333', this, "textColor");
        this.__textOpacity = new ObservedPropertySimplePU(100, this, "textOpacity");
        this.__textColorHue = new ObservedPropertySimplePU(0, this, "textColorHue");
        this.__textColorSaturation = new ObservedPropertySimplePU(0, this, "textColorSaturation");
        this.__textAlign = new ObservedPropertySimplePU(TextAlign.Center, this, "textAlign");
        this.__textVerticalAlign = new ObservedPropertySimplePU(1, this, "textVerticalAlign");
        this.__textDirection = new ObservedPropertySimplePU('horizontal', this, "textDirection");
        this.__textLineSpacing = new ObservedPropertySimplePU(1.2, this, "textLineSpacing");
        this.__textLetterSpacing = new ObservedPropertySimplePU(0, this, "textLetterSpacing");
        this.__textFontWeight = new ObservedPropertySimplePU(400, this, "textFontWeight");
        this.__textItalicAngle = new ObservedPropertySimplePU(0, this, "textItalicAngle");
        this.__newTextContent = new ObservedPropertySimplePU('', this, "newTextContent");
        this.fontStyleMap = {
            'normal': '',
            'handwrite': 'LXGWWenKaiLite',
            'serif': 'serif',
            'mono': 'monospace',
            'art': 'LXGWWenKai',
            'kuaile': 'ZCOOLKuaiLe',
            'brush': 'MaShanZheng',
            'xiaowei': 'ZCOOLXiaoWei',
            'caoshu': 'LiuJianMaoCao',
            'zhimangxing': 'ZhiMangXing',
            'longcang': 'LongCang',
            'pacifico': 'Pacifico',
            'dancing': 'DancingScript',
            'lobster': 'Lobster',
            'greatvibes': 'GreatVibes',
            'caveat': 'Caveat',
        };
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
        if (params.editingTextIndex !== undefined) {
            this.editingTextIndex = params.editingTextIndex;
        }
        if (params.editingTextValue !== undefined) {
            this.editingTextValue = params.editingTextValue;
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
        if (params.resizeStartWidth !== undefined) {
            this.resizeStartWidth = params.resizeStartWidth;
        }
        if (params.resizeStartHeight !== undefined) {
            this.resizeStartHeight = params.resizeStartHeight;
        }
        if (params.dragStartX !== undefined) {
            this.dragStartX = params.dragStartX;
        }
        if (params.dragStartY !== undefined) {
            this.dragStartY = params.dragStartY;
        }
        if (params.textFontStyle !== undefined) {
            this.textFontStyle = params.textFontStyle;
        }
        if (params.textFontSize !== undefined) {
            this.textFontSize = params.textFontSize;
        }
        if (params.textShadowOpacity !== undefined) {
            this.textShadowOpacity = params.textShadowOpacity;
        }
        if (params.textColor !== undefined) {
            this.textColor = params.textColor;
        }
        if (params.textOpacity !== undefined) {
            this.textOpacity = params.textOpacity;
        }
        if (params.textColorHue !== undefined) {
            this.textColorHue = params.textColorHue;
        }
        if (params.textColorSaturation !== undefined) {
            this.textColorSaturation = params.textColorSaturation;
        }
        if (params.textAlign !== undefined) {
            this.textAlign = params.textAlign;
        }
        if (params.textVerticalAlign !== undefined) {
            this.textVerticalAlign = params.textVerticalAlign;
        }
        if (params.textDirection !== undefined) {
            this.textDirection = params.textDirection;
        }
        if (params.textLineSpacing !== undefined) {
            this.textLineSpacing = params.textLineSpacing;
        }
        if (params.textLetterSpacing !== undefined) {
            this.textLetterSpacing = params.textLetterSpacing;
        }
        if (params.textFontWeight !== undefined) {
            this.textFontWeight = params.textFontWeight;
        }
        if (params.textItalicAngle !== undefined) {
            this.textItalicAngle = params.textItalicAngle;
        }
        if (params.newTextContent !== undefined) {
            this.newTextContent = params.newTextContent;
        }
        if (params.fontStyleMap !== undefined) {
            this.fontStyleMap = params.fontStyleMap;
        }
    }
    updateStateVars(params: PlogEditorPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__plog.purgeDependencyOnElmtId(rmElmtId);
        this.__elements.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedElementIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__editingTextIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__editingTextValue.purgeDependencyOnElmtId(rmElmtId);
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
        this.__textFontStyle.purgeDependencyOnElmtId(rmElmtId);
        this.__textFontSize.purgeDependencyOnElmtId(rmElmtId);
        this.__textShadowOpacity.purgeDependencyOnElmtId(rmElmtId);
        this.__textColor.purgeDependencyOnElmtId(rmElmtId);
        this.__textOpacity.purgeDependencyOnElmtId(rmElmtId);
        this.__textColorHue.purgeDependencyOnElmtId(rmElmtId);
        this.__textColorSaturation.purgeDependencyOnElmtId(rmElmtId);
        this.__textAlign.purgeDependencyOnElmtId(rmElmtId);
        this.__textVerticalAlign.purgeDependencyOnElmtId(rmElmtId);
        this.__textDirection.purgeDependencyOnElmtId(rmElmtId);
        this.__textLineSpacing.purgeDependencyOnElmtId(rmElmtId);
        this.__textLetterSpacing.purgeDependencyOnElmtId(rmElmtId);
        this.__textFontWeight.purgeDependencyOnElmtId(rmElmtId);
        this.__textItalicAngle.purgeDependencyOnElmtId(rmElmtId);
        this.__newTextContent.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__plog.aboutToBeDeleted();
        this.__elements.aboutToBeDeleted();
        this.__selectedElementIndex.aboutToBeDeleted();
        this.__editingTextIndex.aboutToBeDeleted();
        this.__editingTextValue.aboutToBeDeleted();
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
        this.__textFontStyle.aboutToBeDeleted();
        this.__textFontSize.aboutToBeDeleted();
        this.__textShadowOpacity.aboutToBeDeleted();
        this.__textColor.aboutToBeDeleted();
        this.__textOpacity.aboutToBeDeleted();
        this.__textColorHue.aboutToBeDeleted();
        this.__textColorSaturation.aboutToBeDeleted();
        this.__textAlign.aboutToBeDeleted();
        this.__textVerticalAlign.aboutToBeDeleted();
        this.__textDirection.aboutToBeDeleted();
        this.__textLineSpacing.aboutToBeDeleted();
        this.__textLetterSpacing.aboutToBeDeleted();
        this.__textFontWeight.aboutToBeDeleted();
        this.__textItalicAngle.aboutToBeDeleted();
        this.__newTextContent.aboutToBeDeleted();
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
    private __editingTextIndex: ObservedPropertySimplePU<number>;
    get editingTextIndex() {
        return this.__editingTextIndex.get();
    }
    set editingTextIndex(newValue: number) {
        this.__editingTextIndex.set(newValue);
    }
    private __editingTextValue: ObservedPropertySimplePU<string>;
    get editingTextValue() {
        return this.__editingTextValue.get();
    }
    set editingTextValue(newValue: string) {
        this.__editingTextValue.set(newValue);
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
    private eyedropperTarget: number; // 0=背景色, 1=花纹色, 2=文字色
    private eyedropperPixelMap: image.PixelMap | null;
    private settings: RenderingContextSettings;
    private eyedropperCanvasContext: CanvasRenderingContext2D;
    private patternCanvasContext: CanvasRenderingContext2D;
    private plogIdFromParams: number;
    private diaryIdsFromParams: number[];
    private textSubTools: string[];
    private bgSubTools: string[];
    private resizeStartWidth: number;
    private resizeStartHeight: number;
    private dragStartX: number;
    private dragStartY: number;
    // ---- 文字工具状态 ----
    private __textFontStyle: ObservedPropertySimplePU<TextStyle>;
    get textFontStyle() {
        return this.__textFontStyle.get();
    }
    set textFontStyle(newValue: TextStyle) {
        this.__textFontStyle.set(newValue);
    }
    private __textFontSize: ObservedPropertySimplePU<number>;
    get textFontSize() {
        return this.__textFontSize.get();
    }
    set textFontSize(newValue: number) {
        this.__textFontSize.set(newValue);
    }
    private __textShadowOpacity: ObservedPropertySimplePU<number>;
    get textShadowOpacity() {
        return this.__textShadowOpacity.get();
    }
    set textShadowOpacity(newValue: number) {
        this.__textShadowOpacity.set(newValue);
    }
    private __textColor: ObservedPropertySimplePU<string>;
    get textColor() {
        return this.__textColor.get();
    }
    set textColor(newValue: string) {
        this.__textColor.set(newValue);
    }
    private __textOpacity: ObservedPropertySimplePU<number>;
    get textOpacity() {
        return this.__textOpacity.get();
    }
    set textOpacity(newValue: number) {
        this.__textOpacity.set(newValue);
    }
    private __textColorHue: ObservedPropertySimplePU<number>;
    get textColorHue() {
        return this.__textColorHue.get();
    }
    set textColorHue(newValue: number) {
        this.__textColorHue.set(newValue);
    }
    private __textColorSaturation: ObservedPropertySimplePU<number>;
    get textColorSaturation() {
        return this.__textColorSaturation.get();
    }
    set textColorSaturation(newValue: number) {
        this.__textColorSaturation.set(newValue);
    }
    private __textAlign: ObservedPropertySimplePU<TextAlign>;
    get textAlign() {
        return this.__textAlign.get();
    }
    set textAlign(newValue: TextAlign) {
        this.__textAlign.set(newValue);
    }
    private __textVerticalAlign: ObservedPropertySimplePU<number>; // 0=Top 1=Center 2=Bottom
    get textVerticalAlign() {
        return this.__textVerticalAlign.get();
    }
    set textVerticalAlign(newValue: number) {
        this.__textVerticalAlign.set(newValue);
    }
    private __textDirection: ObservedPropertySimplePU<TextDirection>;
    get textDirection() {
        return this.__textDirection.get();
    }
    set textDirection(newValue: TextDirection) {
        this.__textDirection.set(newValue);
    }
    private __textLineSpacing: ObservedPropertySimplePU<number>;
    get textLineSpacing() {
        return this.__textLineSpacing.get();
    }
    set textLineSpacing(newValue: number) {
        this.__textLineSpacing.set(newValue);
    }
    private __textLetterSpacing: ObservedPropertySimplePU<number>;
    get textLetterSpacing() {
        return this.__textLetterSpacing.get();
    }
    set textLetterSpacing(newValue: number) {
        this.__textLetterSpacing.set(newValue);
    }
    private __textFontWeight: ObservedPropertySimplePU<number>;
    get textFontWeight() {
        return this.__textFontWeight.get();
    }
    set textFontWeight(newValue: number) {
        this.__textFontWeight.set(newValue);
    }
    private __textItalicAngle: ObservedPropertySimplePU<number>;
    get textItalicAngle() {
        return this.__textItalicAngle.get();
    }
    set textItalicAngle(newValue: number) {
        this.__textItalicAngle.set(newValue);
    }
    private __newTextContent: ObservedPropertySimplePU<string>;
    get newTextContent() {
        return this.__newTextContent.get();
    }
    set newTextContent(newValue: string) {
        this.__newTextContent.set(newValue);
    }
    // 字体风格预设映射: styleKey -> fontFamily名
    private fontStyleMap: Record<string, string>;
    aboutToAppear(): void {
        // 注册自定义字体（必须使用 $rawfile() 函数格式）
        font.registerFont({ familyName: 'LXGWWenKai', familySrc: { "id": 0, "type": 30000, params: ['LXGWWenKai-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        font.registerFont({ familyName: 'LXGWWenKaiLite', familySrc: { "id": 0, "type": 30000, params: ['LXGWWenKaiLite-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        font.registerFont({ familyName: 'ZCOOLKuaiLe', familySrc: { "id": 0, "type": 30000, params: ['ZCOOLKuaiLe-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        font.registerFont({ familyName: 'MaShanZheng', familySrc: { "id": 0, "type": 30000, params: ['MaShanZheng-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        font.registerFont({ familyName: 'ZCOOLXiaoWei', familySrc: { "id": 0, "type": 30000, params: ['ZCOOLXiaoWei-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        font.registerFont({ familyName: 'LiuJianMaoCao', familySrc: { "id": 0, "type": 30000, params: ['LiuJianMaoCao-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        font.registerFont({ familyName: 'ZhiMangXing', familySrc: { "id": 0, "type": 30000, params: ['ZhiMangXing-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        font.registerFont({ familyName: 'LongCang', familySrc: { "id": 0, "type": 30000, params: ['LongCang-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        font.registerFont({ familyName: 'Pacifico', familySrc: { "id": 0, "type": 30000, params: ['Pacifico-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        font.registerFont({ familyName: 'DancingScript', familySrc: { "id": 0, "type": 30000, params: ['DancingScript-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        font.registerFont({ familyName: 'Lobster', familySrc: { "id": 0, "type": 30000, params: ['Lobster-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        font.registerFont({ familyName: 'GreatVibes', familySrc: { "id": 0, "type": 30000, params: ['GreatVibes-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        font.registerFont({ familyName: 'Caveat', familySrc: { "id": 0, "type": 30000, params: ['Caveat-Regular.ttf'], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
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
        // 仅在背景工具下同步更新底色类型
        if (this.activeToolTab === 1) {
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
            else if (this.eyedropperTarget === 1) {
                this.patternColor = pickedColor;
            }
            else if (this.eyedropperTarget === 2) {
                this.textColor = pickedColor;
                this.applyTextPropsToSelected();
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
                color: '#333333',
                textOpacity: 100,
                fontStyle: 'normal',
                fontFamily: '',
                shadowOpacity: 0,
                textAlign: TextAlign.Start,
                verticalAlign: 1,
                textDirection: 'horizontal',
                lineSpacing: 1.2,
                letterSpacing: 0,
                fontWeight: 400,
                italicAngle: 0,
                _version: 0,
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
    addTextElement(content?: string): void {
        const element: CanvasElement = {
            type: 'text',
            x: 50,
            y: 50 + this.elements.length * 30,
            width: 200,
            height: 40,
            rotation: 0,
            content: content || '双击编辑文字',
            zIndex: this.elements.length,
            fontSize: 16,
            color: '#333333',
            textOpacity: 100,
            fontStyle: 'normal',
            fontFamily: '',
            shadowOpacity: 0,
            textAlign: TextAlign.Center,
            verticalAlign: 1,
            textDirection: 'horizontal',
            lineSpacing: 1.2,
            letterSpacing: 0,
            fontWeight: 400,
            italicAngle: 0,
            _version: 0,
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
    /** 将文字属性面板的值应用到选中的文字元素 */
    applyTextPropsToSelected(): void {
        const idx = this.selectedElementIndex;
        if (idx < 0 || idx >= this.elements.length)
            return;
        const el = this.elements[idx];
        if (el.type !== 'text')
            return;
        // 创建新对象以触发 @State 响应式更新
        const newEl: CanvasElement = {
            type: el.type,
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            rotation: el.rotation,
            content: el.content,
            zIndex: el.zIndex,
            fontSize: this.textFontSize,
            color: this.textColor,
            textOpacity: this.textOpacity,
            fontStyle: this.textFontStyle,
            fontFamily: this.fontStyleMap[this.textFontStyle] || '',
            shadowOpacity: this.textShadowOpacity,
            textAlign: this.textAlign,
            verticalAlign: this.textVerticalAlign,
            textDirection: this.textDirection,
            lineSpacing: this.textLineSpacing,
            letterSpacing: this.textLetterSpacing,
            fontWeight: this.textFontWeight,
            italicAngle: this.textItalicAngle,
            _version: (el._version ?? 0) + 1,
        };
        this.elements[idx] = newEl;
        this.elements = [...this.elements];
    }
    /** 从选中的文字元素加载属性到面板 */
    loadTextPropsFromSelected(): void {
        const idx = this.selectedElementIndex;
        if (idx < 0 || idx >= this.elements.length)
            return;
        const el = this.elements[idx];
        if (el.type !== 'text')
            return;
        this.textFontSize = el.fontSize ?? 16;
        this.textColor = el.color ?? '#333333';
        this.textOpacity = el.textOpacity ?? 100;
        this.textFontStyle = el.fontStyle ?? 'normal';
        this.textShadowOpacity = el.shadowOpacity ?? 0;
        this.textAlign = el.textAlign ?? TextAlign.Center;
        this.textVerticalAlign = el.verticalAlign ?? 1;
        this.textDirection = el.textDirection ?? 'horizontal';
        this.textLineSpacing = el.lineSpacing ?? 1.2;
        this.textLetterSpacing = el.letterSpacing ?? 0;
        this.textFontWeight = el.fontWeight ?? 400;
        this.textItalicAngle = el.italicAngle ?? 0;
    }
    /** 删除指定元素 */
    deleteElement(index: number): void {
        this.elements.splice(index, 1);
        if (this.selectedElementIndex === index) {
            this.selectedElementIndex = -1;
        }
        else if (this.selectedElementIndex > index) {
            this.selectedElementIndex--;
        }
    }
    /** 复制指定元素 */
    duplicateElement(index: number): void {
        const el = this.elements[index];
        const clone: CanvasElement = {
            type: el.type,
            x: el.x + 20,
            y: el.y + 20,
            width: el.width,
            height: el.height,
            rotation: el.rotation,
            content: el.content,
            zIndex: this.elements.length,
            fontSize: el.fontSize,
            color: el.color,
            textOpacity: el.textOpacity,
            fontStyle: el.fontStyle,
            fontFamily: el.fontFamily,
            shadowOpacity: el.shadowOpacity,
            textAlign: el.textAlign,
            verticalAlign: el.verticalAlign,
            textDirection: el.textDirection,
            lineSpacing: el.lineSpacing,
            letterSpacing: el.letterSpacing,
            fontWeight: el.fontWeight,
            italicAngle: el.italicAngle,
            _version: 0,
        };
        this.elements.push(clone);
        this.selectedElementIndex = this.elements.length - 1;
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
            // 生成缩略图
            await this.generateThumbnail();
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
     * 生成缩略图：截图画布 → 缩放 → 保存到缓存目录
     */
    async generateThumbnail(): Promise<void> {
        try {
            const pixelMap: image.PixelMap = await componentSnapshot.get('plogCanvas');
            // 缩放到缩略图尺寸
            const scale = 200 / Math.max(pixelMap.getImageInfoSync().size.width, 1);
            pixelMap.scaleSync(scale, scale);
            // 编码为 PNG
            const imagePackerApi = image.createImagePacker();
            const packOpts: image.PackingOption = { format: 'image/png', quality: 80 };
            const data: ArrayBuffer = await imagePackerApi.packing(pixelMap, packOpts);
            imagePackerApi.release();
            pixelMap.release();
            // 保存到应用缓存目录
            const context = getContext(this) as common.UIAbilityContext;
            const thumbnailDir = context.cacheDir + '/thumbnails';
            if (!fs.accessSync(thumbnailDir)) {
                fs.mkdirSync(thumbnailDir);
            }
            const thumbnailPath = thumbnailDir + `/plog_${this.plog!.id}_${Date.now()}.png`;
            const file: fs.File = fs.openSync(thumbnailPath, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE);
            fs.writeSync(file.fd, data);
            fs.closeSync(file);
            this.plog!.thumbnail = thumbnailPath;
        }
        catch (error) {
            console.error('生成缩略图失败:', error);
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
                    color: '#333333',
                    textOpacity: 100,
                    fontStyle: 'normal',
                    fontFamily: '',
                    shadowOpacity: 0,
                    textAlign: TextAlign.Start,
                    verticalAlign: 1,
                    textDirection: 'horizontal',
                    lineSpacing: 1.2,
                    letterSpacing: 0,
                    fontWeight: 400,
                    italicAngle: 0,
                    _version: 0,
                };
                this.elements.push(textElement);
            }
            // 保存
            if (this.plog) {
                this.plog.elements = this.elements;
                this.applyBgToPlog();
                // 生成缩略图
                await this.generateThumbnail();
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
            Column.layoutWeight(1);
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
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
            Text.textAlign(TextAlign.Center);
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
                        Scroll.create();
                        // 文字详细设置（根据子工具切换）
                        Scroll.width('100%');
                        // 文字详细设置（根据子工具切换）
                        Scroll.constraintSize({ minHeight: 120, maxHeight: 300 });
                        // 文字详细设置（根据子工具切换）
                        Scroll.scrollBar(BarState.Off);
                        // 文字详细设置（根据子工具切换）
                        Scroll.transition(TransitionEffect.OPACITY.animation({ duration: 180, curve: Curve.EaseOut }));
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 顶部：添加新文字
                        Row.create({ space: 10 });
                        // 顶部：添加新文字
                        Row.width('100%');
                        // 顶部：添加新文字
                        Row.alignItems(VerticalAlign.Center);
                        // 顶部：添加新文字
                        Row.margin({ bottom: 16 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '输入文字内容', text: this.newTextContent });
                        TextInput.fontSize(14);
                        TextInput.layoutWeight(1);
                        TextInput.height(40);
                        TextInput.backgroundColor('#F5F5F5');
                        TextInput.borderRadius(8);
                        TextInput.padding({ left: 12, right: 12 });
                        TextInput.onChange((value: string) => {
                            this.newTextContent = value;
                        });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('+');
                        Text.fontSize(24);
                        Text.fontColor(Color.White);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(40);
                        Text.height(40);
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.borderRadius(20);
                        Text.onClick(() => {
                            if (this.newTextContent.trim()) {
                                this.addTextElement(this.newTextContent.trim());
                                this.newTextContent = '';
                            }
                        });
                    }, Text);
                    Text.pop();
                    // 顶部：添加新文字
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.activeSubTool === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // ===== 样式 =====
                                    // 风格选择（标签与选项同一行，横向滚动）
                                    Row.create({ space: 8 });
                                    // ===== 样式 =====
                                    // 风格选择（标签与选项同一行，横向滚动）
                                    Row.width('100%');
                                    // ===== 样式 =====
                                    // 风格选择（标签与选项同一行，横向滚动）
                                    Row.justifyContent(FlexAlign.Center);
                                    // ===== 样式 =====
                                    // 风格选择（标签与选项同一行，横向滚动）
                                    Row.alignItems(VerticalAlign.Center);
                                    // ===== 样式 =====
                                    // 风格选择（标签与选项同一行，横向滚动）
                                    Row.margin({ bottom: 12 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('风格');
                                    Text.fontSize(13);
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Scroll.create();
                                    Scroll.layoutWeight(1);
                                    Scroll.scrollBar(BarState.Off);
                                    Scroll.scrollable(ScrollDirection.Horizontal);
                                }, Scroll);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 8 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const item = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.width(item.style === 'greatvibes' ? 72 : 52);
                                            Column.height(36);
                                            Column.justifyContent(FlexAlign.Center);
                                            Column.backgroundColor(this.textFontStyle === item.style ? '#FFF0E8' : '#F5F5F5');
                                            Column.borderRadius(18);
                                            Column.border({
                                                width: this.textFontStyle === item.style ? 1.5 : 0,
                                                color: { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
                                            });
                                            Column.onClick(() => {
                                                this.textFontStyle = item.style;
                                                this.applyTextPropsToSelected();
                                            });
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(item.label);
                                            Text.fontSize(item.style === 'pacifico' || item.style === 'dancing' || item.style === 'lobster' || item.style === 'greatvibes' || item.style === 'caveat' ? 9 : 12);
                                            Text.fontColor(this.textFontStyle === item.style
                                                ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                            Text.fontWeight(this.textFontStyle === item.style ? FontWeight.Medium : FontWeight.Normal);
                                            Text.fontFamily(this.fontStyleMap[item.style] || undefined);
                                        }, Text);
                                        Text.pop();
                                        Column.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, [
                                        { style: 'normal' as TextStyle, label: '常规' },
                                        { style: 'handwrite' as TextStyle, label: '文楷' },
                                        { style: 'serif' as TextStyle, label: '衬线' },
                                        { style: 'mono' as TextStyle, label: '等宽' },
                                        { style: 'kuaile' as TextStyle, label: '快乐' },
                                        { style: 'brush' as TextStyle, label: '毛笔' },
                                        { style: 'xiaowei' as TextStyle, label: '小薇' },
                                        { style: 'caoshu' as TextStyle, label: '草书' },
                                        { style: 'zhimangxing' as TextStyle, label: '志芒' },
                                        { style: 'longcang' as TextStyle, label: '龙藏' },
                                        { style: 'pacifico' as TextStyle, label: 'Pacifico' },
                                        { style: 'dancing' as TextStyle, label: 'Dancing' },
                                        { style: 'lobster' as TextStyle, label: 'Lobster' },
                                        { style: 'greatvibes' as TextStyle, label: 'GreatVibes' },
                                        { style: 'caveat' as TextStyle, label: 'Caveat' },
                                    ], forEachItemGenFunction, (item: FontStyleItem) => item.style, false, false);
                                }, ForEach);
                                ForEach.pop();
                                Row.pop();
                                Scroll.pop();
                                // ===== 样式 =====
                                // 风格选择（标签与选项同一行，横向滚动）
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 大小
                                    Row.create();
                                    // 大小
                                    Row.width('100%');
                                    // 大小
                                    Row.margin({ bottom: 12 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('大小');
                                    Text.fontSize(13);
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.textFontSize, min: 8, max: 72, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.onChange((value: number) => {
                                        this.textFontSize = value;
                                        this.applyTextPropsToSelected();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.textFontSize)}`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(28);
                                }, Text);
                                Text.pop();
                                // 大小
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 阴影透明度
                                    Row.create();
                                    // 阴影透明度
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('阴影');
                                    Text.fontSize(13);
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.textShadowOpacity, min: 0, max: 100, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.onChange((value: number) => {
                                        this.textShadowOpacity = value;
                                        this.applyTextPropsToSelected();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.textShadowOpacity)}%`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                // 阴影透明度
                                Row.pop();
                            });
                        }
                        else if (this.activeSubTool === 1) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // ===== 颜色 =====（参照背景纯色设置）
                                    Scroll.create();
                                    // ===== 颜色 =====（参照背景纯色设置）
                                    Scroll.width('100%');
                                    // ===== 颜色 =====（参照背景纯色设置）
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
                                    Row.justifyContent(FlexAlign.Center);
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
                                    Column.onClick(() => this.startEyedropper(2));
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
                                            Column.width(32);
                                            Column.height(32);
                                            Column.backgroundColor(color);
                                            Column.borderRadius(16);
                                            Column.border({
                                                width: this.textColor === color ? 2 : 0.5,
                                                color: this.textColor === color ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : '#CCCCCC'
                                            });
                                            Column.onClick(() => {
                                                this.textColor = color;
                                                this.applyTextPropsToSelected();
                                            });
                                        }, Column);
                                        Column.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, ['#333333', '#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1',
                                        '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF8A65', '#64B5F6', '#81C784'], forEachItemGenFunction, (color: string) => color, false, false);
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
                                    Slider.create({ value: this.textColorHue, min: 0, max: 360, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.selectedColor(this.hslToHex(this.textColorHue, this.textColorSaturation));
                                    Slider.onChange((value: number) => {
                                        this.textColorHue = value;
                                        this.textColor = this.hslToHex(this.textColorHue, this.textColorSaturation);
                                        this.applyTextPropsToSelected();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.textColorHue)}°`);
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
                                    Slider.create({ value: this.textColorSaturation, min: 0, max: 100, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.selectedColor(this.hslToHex(this.textColorHue, this.textColorSaturation));
                                    Slider.onChange((value: number) => {
                                        this.textColorSaturation = value;
                                        this.textColor = this.hslToHex(this.textColorHue, this.textColorSaturation);
                                        this.applyTextPropsToSelected();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.textColorSaturation)}%`);
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
                                    Slider.create({ value: this.textOpacity, min: 0, max: 100, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.onChange((value: number) => {
                                        this.textOpacity = value;
                                        this.applyTextPropsToSelected();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.textOpacity)}%`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                Column.pop();
                                // ===== 颜色 =====（参照背景纯色设置）
                                Scroll.pop();
                            });
                        }
                        else if (this.activeSubTool === 2) {
                            this.ifElseBranchUpdateFunction(2, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // ===== 排版 =====
                                    Row.create({ space: 12 });
                                    // ===== 排版 =====
                                    Row.width('100%');
                                    // ===== 排版 =====
                                    Row.alignItems(VerticalAlign.Center);
                                    // ===== 排版 =====
                                    Row.padding(16);
                                    // ===== 排版 =====
                                    Row.backgroundColor(Color.White);
                                    // ===== 排版 =====
                                    Row.borderRadius(12);
                                    // ===== 排版 =====
                                    Row.margin({ bottom: 12 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 横竖切换
                                    Row.create({ space: 0 });
                                    // 横竖切换
                                    Row.width(72);
                                    // 横竖切换
                                    Row.height(32);
                                    // 横竖切换
                                    Row.backgroundColor('#F0F0F0');
                                    // 横竖切换
                                    Row.borderRadius(16);
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width(36);
                                    Column.height(28);
                                    Column.justifyContent(FlexAlign.Center);
                                    Column.backgroundColor(this.textDirection === 'horizontal' ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : 'transparent');
                                    Column.borderRadius(14);
                                    Column.onClick(() => {
                                        this.textDirection = 'horizontal';
                                        this.applyTextPropsToSelected();
                                    });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('横');
                                    Text.fontSize(13);
                                    Text.fontColor(this.textDirection === 'horizontal' ? Color.White : '#666666');
                                    Text.fontWeight(FontWeight.Medium);
                                }, Text);
                                Text.pop();
                                Column.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width(36);
                                    Column.height(28);
                                    Column.justifyContent(FlexAlign.Center);
                                    Column.backgroundColor(this.textDirection === 'vertical' ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : 'transparent');
                                    Column.borderRadius(14);
                                    Column.onClick(() => {
                                        this.textDirection = 'vertical';
                                        this.applyTextPropsToSelected();
                                    });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('竖');
                                    Text.fontSize(13);
                                    Text.fontColor(this.textDirection === 'vertical' ? Color.White : '#666666');
                                    Text.fontWeight(FontWeight.Medium);
                                }, Text);
                                Text.pop();
                                Column.pop();
                                // 横竖切换
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    // 对齐方式
                                    if (this.textDirection === 'horizontal') {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create({ space: 6 });
                                                Row.layoutWeight(1);
                                                Row.height(32);
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                ForEach.create();
                                                const forEachItemGenFunction = _item => {
                                                    const item = _item;
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Column.create();
                                                        Column.layoutWeight(1);
                                                        Column.height(32);
                                                        Column.justifyContent(FlexAlign.Center);
                                                        Column.backgroundColor(this.textAlign === item.align ? '#FFF0E8' : '#F5F5F5');
                                                        Column.borderRadius(16);
                                                        Column.border({
                                                            width: this.textAlign === item.align ? 1.5 : 0,
                                                            color: { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
                                                        });
                                                        Column.onClick(() => {
                                                            this.textAlign = item.align;
                                                            this.applyTextPropsToSelected();
                                                        });
                                                    }, Column);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create(item.label);
                                                        Text.fontSize(12);
                                                        Text.fontColor(this.textAlign === item.align
                                                            ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                    }, Text);
                                                    Text.pop();
                                                    Column.pop();
                                                };
                                                this.forEachUpdateFunction(elmtId, [
                                                    { align: TextAlign.Start, label: '左对齐' },
                                                    { align: TextAlign.Center, label: '居中' },
                                                    { align: TextAlign.End, label: '右对齐' },
                                                ], forEachItemGenFunction, (item: TextAlignItem) => item.label, false, false);
                                            }, ForEach);
                                            ForEach.pop();
                                            Row.pop();
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create({ space: 6 });
                                                Row.layoutWeight(1);
                                                Row.height(32);
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                ForEach.create();
                                                const forEachItemGenFunction = _item => {
                                                    const item = _item;
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Column.create();
                                                        Column.layoutWeight(1);
                                                        Column.height(32);
                                                        Column.justifyContent(FlexAlign.Center);
                                                        Column.backgroundColor(this.textVerticalAlign === item.va ? '#FFF0E8' : '#F5F5F5');
                                                        Column.borderRadius(16);
                                                        Column.border({
                                                            width: this.textVerticalAlign === item.va ? 1.5 : 0,
                                                            color: { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
                                                        });
                                                        Column.onClick(() => {
                                                            this.textVerticalAlign = item.va;
                                                            this.applyTextPropsToSelected();
                                                        });
                                                    }, Column);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create(item.label);
                                                        Text.fontSize(12);
                                                        Text.fontColor(this.textVerticalAlign === item.va
                                                            ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                    }, Text);
                                                    Text.pop();
                                                    Column.pop();
                                                };
                                                this.forEachUpdateFunction(elmtId, [
                                                    { va: 0, label: '上对齐' },
                                                    { va: 1, label: '居中' },
                                                    { va: 2, label: '下对齐' },
                                                ], forEachItemGenFunction, (item: VerticalAlignItem) => item.label, false, false);
                                            }, ForEach);
                                            ForEach.pop();
                                            Row.pop();
                                        });
                                    }
                                }, If);
                                If.pop();
                                // ===== 排版 =====
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 间距设置
                                    Column.create({ space: 12 });
                                    // 间距设置
                                    Column.width('100%');
                                    // 间距设置
                                    Column.padding(16);
                                    // 间距设置
                                    Column.backgroundColor(Color.White);
                                    // 间距设置
                                    Column.borderRadius(12);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.textDirection === 'vertical' ? '字距' : '行距');
                                    Text.fontSize(13);
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.textLineSpacing, min: 1, max: 3, step: 0.1 });
                                    Slider.layoutWeight(1);
                                    Slider.onChange((value: number) => {
                                        this.textLineSpacing = value;
                                        this.applyTextPropsToSelected();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${this.textLineSpacing.toFixed(1)}`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(32);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.textDirection === 'vertical' ? '行距' : '字距');
                                    Text.fontSize(13);
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.textLetterSpacing, min: 0, max: 20, step: 0.5 });
                                    Slider.layoutWeight(1);
                                    Slider.onChange((value: number) => {
                                        this.textLetterSpacing = value;
                                        this.applyTextPropsToSelected();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${this.textLetterSpacing.toFixed(1)}`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(32);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                // 间距设置
                                Column.pop();
                            });
                        }
                        else if (this.activeSubTool === 3) {
                            this.ifElseBranchUpdateFunction(3, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // ===== 粗斜体 =====
                                    // 粗体（标签居左，选项居中）
                                    Row.create();
                                    // ===== 粗斜体 =====
                                    // 粗体（标签居左，选项居中）
                                    Row.width('100%');
                                    // ===== 粗斜体 =====
                                    // 粗体（标签居左，选项居中）
                                    Row.justifyContent(FlexAlign.Start);
                                    // ===== 粗斜体 =====
                                    // 粗体（标签居左，选项居中）
                                    Row.alignItems(VerticalAlign.Center);
                                    // ===== 粗斜体 =====
                                    // 粗体（标签居左，选项居中）
                                    Row.margin({ bottom: 12 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('粗体');
                                    Text.fontSize(13);
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create({ space: 8 });
                                    Row.layoutWeight(1);
                                    Row.justifyContent(FlexAlign.Center);
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const item = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.padding({ left: 14, right: 14, top: 6, bottom: 6 });
                                            Column.backgroundColor(this.textFontWeight === item.w ? '#FFF0E8' : '#F5F5F5');
                                            Column.borderRadius(16);
                                            Column.border({
                                                width: this.textFontWeight === item.w ? 1.5 : 0,
                                                color: { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
                                            });
                                            Column.onClick(() => {
                                                this.textFontWeight = item.w;
                                                this.applyTextPropsToSelected();
                                            });
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(item.label);
                                            Text.fontSize(13);
                                            Text.fontWeight(item.w);
                                            Text.fontColor(this.textFontWeight === item.w
                                                ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                        }, Text);
                                        Text.pop();
                                        Column.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, [
                                        { w: 100, label: '细体' },
                                        { w: 400, label: '常规' },
                                        { w: 700, label: '粗体' },
                                        { w: 900, label: '特粗' },
                                    ], forEachItemGenFunction, (item: FontWeightItem) => item.w.toString(), false, false);
                                }, ForEach);
                                ForEach.pop();
                                Row.pop();
                                // ===== 粗斜体 =====
                                // 粗体（标签居左，选项居中）
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 字体粗细微调
                                    Row.create();
                                    // 字体粗细微调
                                    Row.width('100%');
                                    // 字体粗细微调
                                    Row.margin({ bottom: 12 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('粗细');
                                    Text.fontSize(13);
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.textFontWeight, min: 100, max: 900, step: 100 });
                                    Slider.layoutWeight(1);
                                    Slider.onChange((value: number) => {
                                        this.textFontWeight = value;
                                        this.applyTextPropsToSelected();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.textFontWeight)}`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(32);
                                }, Text);
                                Text.pop();
                                // 字体粗细微调
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 斜体角度（斜体+角度 合并为一行）
                                    Row.create();
                                    // 斜体角度（斜体+角度 合并为一行）
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('斜体角度');
                                    Text.fontSize(13);
                                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(56);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.textItalicAngle, min: -30, max: 30, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.onChange((value: number) => {
                                        this.textItalicAngle = value;
                                        this.applyTextPropsToSelected();
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.textItalicAngle)}°`);
                                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                // 斜体角度（斜体+角度 合并为一行）
                                Row.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(4, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                    // 文字详细设置（根据子工具切换）
                    Scroll.pop();
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
                                Stack.create();
                                Stack.position({ x: this.elements[index].x, y: this.elements[index].y });
                                Stack.width(this.elements[index].width);
                                Stack.height(this.elements[index].height);
                                Stack.zIndex(element.zIndex);
                                Stack.rotate({ angle: element.rotation });
                            }, Stack);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (this.editingTextIndex === index) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            // 编辑模式
                                            Column.create();
                                            // 编辑模式
                                            Column.width('100%');
                                            // 编辑模式
                                            Column.height('100%');
                                            // 编辑模式
                                            Column.justifyContent(element.textDirection === 'vertical'
                                                ? (element.verticalAlign === 0 ? FlexAlign.Start : element.verticalAlign === 2 ? FlexAlign.End : FlexAlign.Center)
                                                : FlexAlign.Center);
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            TextInput.create({ text: this.editingTextValue });
                                            TextInput.fontSize(element.fontSize || 14);
                                            TextInput.fontColor(element.color || '#333333');
                                            TextInput.fontWeight(element.fontWeight ?? 400);
                                            TextInput.fontFamily(element.fontFamily || undefined);
                                            TextInput.opacity((element.textOpacity ?? 100) / 100);
                                            TextInput.backgroundColor(Color.Transparent);
                                            TextInput.width('100%');
                                            TextInput.padding({ left: 12, right: 12, top: 8, bottom: 8 });
                                            TextInput.textAlign(element.textAlign ?? TextAlign.Center);
                                            TextInput.onChange((value: string) => {
                                                this.editingTextValue = value;
                                            });
                                            TextInput.onBlur(() => {
                                                const old = this.elements[index];
                                                this.elements[index] = {
                                                    type: old.type, x: old.x, y: old.y, width: old.width, height: old.height,
                                                    rotation: old.rotation, content: this.editingTextValue, zIndex: old.zIndex,
                                                    fontSize: old.fontSize, color: old.color, textOpacity: old.textOpacity,
                                                    fontStyle: old.fontStyle, shadowOpacity: old.shadowOpacity,
                                                    textAlign: old.textAlign, verticalAlign: old.verticalAlign,
                                                    textDirection: old.textDirection, lineSpacing: old.lineSpacing,
                                                    letterSpacing: old.letterSpacing, fontWeight: old.fontWeight,
                                                    italicAngle: old.italicAngle, fontFamily: old.fontFamily,
                                                    _version: (old._version ?? 0) + 1,
                                                };
                                                this.elements = [...this.elements];
                                                this.editingTextIndex = -1;
                                            });
                                        }, TextInput);
                                        // 编辑模式
                                        Column.pop();
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            // 普通模式
                                            Column.create();
                                            // 普通模式
                                            Column.width('100%');
                                            // 普通模式
                                            Column.height('100%');
                                            // 普通模式
                                            Column.justifyContent(element.textDirection === 'vertical'
                                                ? (element.verticalAlign === 0 ? FlexAlign.Start : element.verticalAlign === 2 ? FlexAlign.End : FlexAlign.Center)
                                                : FlexAlign.Center);
                                            globalThis.Gesture.create(GesturePriority.Low);
                                            GestureGroup.create(GestureMode.Exclusive);
                                            // 拖拽移动（移动超过5px触发）
                                            PanGesture.create({ fingers: 1, distance: 5 });
                                            // 拖拽移动（移动超过5px触发）
                                            PanGesture.onActionStart(() => {
                                                this.dragStartX = this.elements[index].x;
                                                this.dragStartY = this.elements[index].y;
                                                this.selectedElementIndex = index;
                                                this.loadTextPropsFromSelected();
                                            });
                                            // 拖拽移动（移动超过5px触发）
                                            PanGesture.onActionUpdate((event: GestureEvent) => {
                                                const old = this.elements[index];
                                                this.elements[index] = {
                                                    type: old.type, x: this.dragStartX + event.offsetX, y: this.dragStartY + event.offsetY,
                                                    width: old.width, height: old.height, rotation: old.rotation, content: old.content,
                                                    zIndex: old.zIndex, fontSize: old.fontSize, color: old.color, textOpacity: old.textOpacity,
                                                    fontStyle: old.fontStyle, shadowOpacity: old.shadowOpacity, textAlign: old.textAlign,
                                                    verticalAlign: old.verticalAlign, textDirection: old.textDirection, lineSpacing: old.lineSpacing,
                                                    letterSpacing: old.letterSpacing, fontWeight: old.fontWeight, italicAngle: old.italicAngle,
                                                    fontFamily: old.fontFamily,
                                                    _version: (old._version ?? 0) + 1,
                                                };
                                                this.elements = [...this.elements];
                                            });
                                            // 拖拽移动（移动超过5px触发）
                                            PanGesture.onActionEnd(() => {
                                                this.elements = [...this.elements];
                                            });
                                            // 拖拽移动（移动超过5px触发）
                                            PanGesture.pop();
                                            // 双击编辑
                                            TapGesture.create({ count: 2 });
                                            // 双击编辑
                                            TapGesture.onAction(() => {
                                                this.editingTextValue = element.content;
                                                this.editingTextIndex = index;
                                            });
                                            // 双击编辑
                                            TapGesture.pop();
                                            // 单击选中
                                            TapGesture.create({ count: 1 });
                                            // 单击选中
                                            TapGesture.onAction(() => {
                                                this.selectedElementIndex = index;
                                                this.loadTextPropsFromSelected();
                                            });
                                            // 单击选中
                                            TapGesture.pop();
                                            GestureGroup.pop();
                                            globalThis.Gesture.pop();
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
                                        // 普通模式
                                        Column.pop();
                                    });
                                }
                            }, If);
                            If.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                // 选中时的边框（白色虚线，不拦截触摸事件）
                                if (this.selectedElementIndex === index) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.width('100%');
                                            Column.height('100%');
                                            Column.border({
                                                width: 3,
                                                color: Color.White,
                                                style: BorderStyle.Dashed
                                            });
                                            Column.borderRadius(4);
                                            Column.hitTestBehavior(HitTestMode.None);
                                        }, Column);
                                        Column.pop();
                                    });
                                }
                                // 选中时的控制按钮（白底黑字）
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                // 选中时的控制按钮（白底黑字）
                                if (this.selectedElementIndex === index && this.editingTextIndex !== index) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            // 删除按钮（右上角）×
                                            Column.create();
                                            // 删除按钮（右上角）×
                                            Column.width(22);
                                            // 删除按钮（右上角）×
                                            Column.height(22);
                                            // 删除按钮（右上角）×
                                            Column.backgroundColor(Color.White);
                                            // 删除按钮（右上角）×
                                            Column.borderRadius(11);
                                            // 删除按钮（右上角）×
                                            Column.position({ x: this.elements[index].width - 11, y: -11 });
                                            // 删除按钮（右上角）×
                                            Column.justifyContent(FlexAlign.Center);
                                            // 删除按钮（右上角）×
                                            Column.zIndex(100);
                                            // 删除按钮（右上角）×
                                            Column.onClick(() => {
                                                this.deleteElement(index);
                                            });
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('×');
                                            Text.fontSize(14);
                                            Text.fontColor('#333333');
                                            Text.fontWeight(FontWeight.Bold);
                                            Text.textAlign(TextAlign.Center);
                                        }, Text);
                                        Text.pop();
                                        // 删除按钮（右上角）×
                                        Column.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            // 复制按钮（左下角）+1
                                            Column.create();
                                            // 复制按钮（左下角）+1
                                            Column.width(22);
                                            // 复制按钮（左下角）+1
                                            Column.height(22);
                                            // 复制按钮（左下角）+1
                                            Column.backgroundColor(Color.White);
                                            // 复制按钮（左下角）+1
                                            Column.borderRadius(11);
                                            // 复制按钮（左下角）+1
                                            Column.position({ x: -11, y: this.elements[index].height - 11 });
                                            // 复制按钮（左下角）+1
                                            Column.justifyContent(FlexAlign.Center);
                                            // 复制按钮（左下角）+1
                                            Column.zIndex(100);
                                            // 复制按钮（左下角）+1
                                            Column.onClick(() => {
                                                this.duplicateElement(index);
                                            });
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('+1');
                                            Text.fontSize(9);
                                            Text.fontColor('#333333');
                                            Text.fontWeight(FontWeight.Bold);
                                            Text.textAlign(TextAlign.Center);
                                        }, Text);
                                        Text.pop();
                                        // 复制按钮（左下角）+1
                                        Column.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            // 缩放手柄（右下角）循环箭头
                                            Column.create();
                                            // 缩放手柄（右下角）循环箭头
                                            Column.width(22);
                                            // 缩放手柄（右下角）循环箭头
                                            Column.height(22);
                                            // 缩放手柄（右下角）循环箭头
                                            Column.backgroundColor(Color.White);
                                            // 缩放手柄（右下角）循环箭头
                                            Column.borderRadius(11);
                                            // 缩放手柄（右下角）循环箭头
                                            Column.position({ x: this.elements[index].width - 11, y: this.elements[index].height - 11 });
                                            // 缩放手柄（右下角）循环箭头
                                            Column.justifyContent(FlexAlign.Center);
                                            // 缩放手柄（右下角）循环箭头
                                            Column.zIndex(100);
                                            globalThis.Gesture.create(GesturePriority.Low);
                                            PanGesture.create();
                                            PanGesture.onActionStart(() => {
                                                this.resizeStartWidth = this.elements[index].width;
                                                this.resizeStartHeight = this.elements[index].height;
                                            });
                                            PanGesture.onActionUpdate((event: GestureEvent) => {
                                                const newWidth = Math.max(60, this.resizeStartWidth + event.offsetX);
                                                const newHeight = Math.max(30, this.resizeStartHeight + event.offsetY);
                                                const old = this.elements[index];
                                                this.elements[index] = {
                                                    type: old.type, x: old.x, y: old.y, width: newWidth, height: newHeight,
                                                    rotation: old.rotation, content: old.content, zIndex: old.zIndex,
                                                    fontSize: old.fontSize, color: old.color, textOpacity: old.textOpacity,
                                                    fontStyle: old.fontStyle, shadowOpacity: old.shadowOpacity, textAlign: old.textAlign,
                                                    verticalAlign: old.verticalAlign, textDirection: old.textDirection, lineSpacing: old.lineSpacing,
                                                    letterSpacing: old.letterSpacing, fontWeight: old.fontWeight, italicAngle: old.italicAngle,
                                                    fontFamily: old.fontFamily,
                                                    _version: (old._version ?? 0) + 1,
                                                };
                                                this.elements = [...this.elements];
                                            });
                                            PanGesture.onActionEnd(() => {
                                                this.elements = [...this.elements];
                                            });
                                            PanGesture.pop();
                                            globalThis.Gesture.pop();
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('↻');
                                            Text.fontSize(14);
                                            Text.fontColor('#333333');
                                            Text.fontWeight(FontWeight.Bold);
                                            Text.textAlign(TextAlign.Center);
                                        }, Text);
                                        Text.pop();
                                        // 缩放手柄（右下角）循环箭头
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
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(2, () => {
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(elmtId, this.elements, forEachItemGenFunction, (element: CanvasElement, index: number) => `${index}_${element._version ?? 0}`, true, true);
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
                                    Row.justifyContent(FlexAlign.SpaceEvenly);
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
