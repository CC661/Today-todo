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
    brushType?: number;
    brushColor?: string;
    brushColorHue?: number;
    brushColorSaturation?: number;
    brushThickness?: number;
    brushOpacity?: number;
    isDrawing?: boolean;
    drawLastX?: number;
    drawLastY?: number;
    drawingCanvasContext?: CanvasRenderingContext2D;
    drawStrokes?: DrawStroke[];
    currentStroke?: DrawStroke | null;
    canvasReady?: boolean;
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
    historyStack?: CanvasElement[][];
    historyIndex?: number;
    maxHistorySize?: number;
    canvasScale?: number;
    canvasOffsetX?: number;
    canvasOffsetY?: number;
    panStartOffsetX?: number;
    panStartOffsetY?: number;
    fontStyleMap?: Record<string, string>;
}
import PlogViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/PlogViewModel&";
import DiaryViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/DiaryViewModel&";
import type { PlogCanvas, CanvasElement, BgType, PatternType, TextStyle, TextDirection, DrawStroke } from '../model/PlogCanvas';
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
        this.__brushType = new ObservedPropertySimplePU(1, this, "brushType");
        this.__brushColor = new ObservedPropertySimplePU('#333333', this, "brushColor");
        this.__brushColorHue = new ObservedPropertySimplePU(0, this, "brushColorHue");
        this.__brushColorSaturation = new ObservedPropertySimplePU(0, this, "brushColorSaturation");
        this.__brushThickness = new ObservedPropertySimplePU(4, this, "brushThickness");
        this.__brushOpacity = new ObservedPropertySimplePU(100, this, "brushOpacity");
        this.__isDrawing = new ObservedPropertySimplePU(false, this, "isDrawing");
        this.drawLastX = 0;
        this.drawLastY = 0;
        this.drawingCanvasContext = new CanvasRenderingContext2D(this.settings);
        this.__drawStrokes = new ObservedPropertyObjectPU([], this, "drawStrokes");
        this.currentStroke = null;
        this.canvasReady = false;
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
        this.__historyStack = new ObservedPropertyObjectPU([], this, "historyStack");
        this.__historyIndex = new ObservedPropertySimplePU(-1, this, "historyIndex");
        this.maxHistorySize = 50;
        this.__canvasScale = new ObservedPropertySimplePU(1.0, this, "canvasScale");
        this.__canvasOffsetX = new ObservedPropertySimplePU(0, this, "canvasOffsetX");
        this.__canvasOffsetY = new ObservedPropertySimplePU(0, this, "canvasOffsetY");
        this.panStartOffsetX = 0;
        this.panStartOffsetY = 0;
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
        if (params.brushType !== undefined) {
            this.brushType = params.brushType;
        }
        if (params.brushColor !== undefined) {
            this.brushColor = params.brushColor;
        }
        if (params.brushColorHue !== undefined) {
            this.brushColorHue = params.brushColorHue;
        }
        if (params.brushColorSaturation !== undefined) {
            this.brushColorSaturation = params.brushColorSaturation;
        }
        if (params.brushThickness !== undefined) {
            this.brushThickness = params.brushThickness;
        }
        if (params.brushOpacity !== undefined) {
            this.brushOpacity = params.brushOpacity;
        }
        if (params.isDrawing !== undefined) {
            this.isDrawing = params.isDrawing;
        }
        if (params.drawLastX !== undefined) {
            this.drawLastX = params.drawLastX;
        }
        if (params.drawLastY !== undefined) {
            this.drawLastY = params.drawLastY;
        }
        if (params.drawingCanvasContext !== undefined) {
            this.drawingCanvasContext = params.drawingCanvasContext;
        }
        if (params.drawStrokes !== undefined) {
            this.drawStrokes = params.drawStrokes;
        }
        if (params.currentStroke !== undefined) {
            this.currentStroke = params.currentStroke;
        }
        if (params.canvasReady !== undefined) {
            this.canvasReady = params.canvasReady;
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
        if (params.historyStack !== undefined) {
            this.historyStack = params.historyStack;
        }
        if (params.historyIndex !== undefined) {
            this.historyIndex = params.historyIndex;
        }
        if (params.maxHistorySize !== undefined) {
            this.maxHistorySize = params.maxHistorySize;
        }
        if (params.canvasScale !== undefined) {
            this.canvasScale = params.canvasScale;
        }
        if (params.canvasOffsetX !== undefined) {
            this.canvasOffsetX = params.canvasOffsetX;
        }
        if (params.canvasOffsetY !== undefined) {
            this.canvasOffsetY = params.canvasOffsetY;
        }
        if (params.panStartOffsetX !== undefined) {
            this.panStartOffsetX = params.panStartOffsetX;
        }
        if (params.panStartOffsetY !== undefined) {
            this.panStartOffsetY = params.panStartOffsetY;
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
        this.__brushType.purgeDependencyOnElmtId(rmElmtId);
        this.__brushColor.purgeDependencyOnElmtId(rmElmtId);
        this.__brushColorHue.purgeDependencyOnElmtId(rmElmtId);
        this.__brushColorSaturation.purgeDependencyOnElmtId(rmElmtId);
        this.__brushThickness.purgeDependencyOnElmtId(rmElmtId);
        this.__brushOpacity.purgeDependencyOnElmtId(rmElmtId);
        this.__isDrawing.purgeDependencyOnElmtId(rmElmtId);
        this.__drawStrokes.purgeDependencyOnElmtId(rmElmtId);
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
        this.__historyStack.purgeDependencyOnElmtId(rmElmtId);
        this.__historyIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__canvasScale.purgeDependencyOnElmtId(rmElmtId);
        this.__canvasOffsetX.purgeDependencyOnElmtId(rmElmtId);
        this.__canvasOffsetY.purgeDependencyOnElmtId(rmElmtId);
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
        this.__brushType.aboutToBeDeleted();
        this.__brushColor.aboutToBeDeleted();
        this.__brushColorHue.aboutToBeDeleted();
        this.__brushColorSaturation.aboutToBeDeleted();
        this.__brushThickness.aboutToBeDeleted();
        this.__brushOpacity.aboutToBeDeleted();
        this.__isDrawing.aboutToBeDeleted();
        this.__drawStrokes.aboutToBeDeleted();
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
        this.__historyStack.aboutToBeDeleted();
        this.__historyIndex.aboutToBeDeleted();
        this.__canvasScale.aboutToBeDeleted();
        this.__canvasOffsetX.aboutToBeDeleted();
        this.__canvasOffsetY.aboutToBeDeleted();
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
    private eyedropperTarget: number; // 0=背景色, 1=花纹色, 2=文字色, 3=画笔色
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
    // ---- 画笔状态 ----
    private __brushType: ObservedPropertySimplePU<number>; // 0=橡皮, 1=基础画笔, 2=毛笔, 3=马克笔, 4=荧光笔, 5=铅笔, 6=蜡笔, 7=水彩笔
    get brushType() {
        return this.__brushType.get();
    }
    set brushType(newValue: number) {
        this.__brushType.set(newValue);
    }
    private __brushColor: ObservedPropertySimplePU<string>;
    get brushColor() {
        return this.__brushColor.get();
    }
    set brushColor(newValue: string) {
        this.__brushColor.set(newValue);
    }
    private __brushColorHue: ObservedPropertySimplePU<number>;
    get brushColorHue() {
        return this.__brushColorHue.get();
    }
    set brushColorHue(newValue: number) {
        this.__brushColorHue.set(newValue);
    }
    private __brushColorSaturation: ObservedPropertySimplePU<number>;
    get brushColorSaturation() {
        return this.__brushColorSaturation.get();
    }
    set brushColorSaturation(newValue: number) {
        this.__brushColorSaturation.set(newValue);
    }
    private __brushThickness: ObservedPropertySimplePU<number>; // 1-50
    get brushThickness() {
        return this.__brushThickness.get();
    }
    set brushThickness(newValue: number) {
        this.__brushThickness.set(newValue);
    }
    private __brushOpacity: ObservedPropertySimplePU<number>; // 0-100
    get brushOpacity() {
        return this.__brushOpacity.get();
    }
    set brushOpacity(newValue: number) {
        this.__brushOpacity.set(newValue);
    }
    private __isDrawing: ObservedPropertySimplePU<boolean>;
    get isDrawing() {
        return this.__isDrawing.get();
    }
    set isDrawing(newValue: boolean) {
        this.__isDrawing.set(newValue);
    }
    private drawLastX: number;
    private drawLastY: number;
    private drawingCanvasContext: CanvasRenderingContext2D;
    private __drawStrokes: ObservedPropertyObjectPU<DrawStroke[]>; // 所有笔画数据
    get drawStrokes() {
        return this.__drawStrokes.get();
    }
    set drawStrokes(newValue: DrawStroke[]) {
        this.__drawStrokes.set(newValue);
    }
    private currentStroke: DrawStroke | null; // 当前正在绘制的笔画
    private canvasReady: boolean; // Canvas 是否已准备好
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
    // ---- 撤销/重做状态 ----
    private __historyStack: ObservedPropertyObjectPU<CanvasElement[][]>;
    get historyStack() {
        return this.__historyStack.get();
    }
    set historyStack(newValue: CanvasElement[][]) {
        this.__historyStack.set(newValue);
    }
    private __historyIndex: ObservedPropertySimplePU<number>;
    get historyIndex() {
        return this.__historyIndex.get();
    }
    set historyIndex(newValue: number) {
        this.__historyIndex.set(newValue);
    }
    private maxHistorySize: number;
    // ---- 画布缩放状态 ----
    private __canvasScale: ObservedPropertySimplePU<number>;
    get canvasScale() {
        return this.__canvasScale.get();
    }
    set canvasScale(newValue: number) {
        this.__canvasScale.set(newValue);
    }
    private __canvasOffsetX: ObservedPropertySimplePU<number>;
    get canvasOffsetX() {
        return this.__canvasOffsetX.get();
    }
    set canvasOffsetX(newValue: number) {
        this.__canvasOffsetX.set(newValue);
    }
    private __canvasOffsetY: ObservedPropertySimplePU<number>;
    get canvasOffsetY() {
        return this.__canvasOffsetY.get();
    }
    set canvasOffsetY(newValue: number) {
        this.__canvasOffsetY.set(newValue);
    }
    private panStartOffsetX: number;
    private panStartOffsetY: number;
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
                this.drawStrokes = existingPlog.drawStrokes || [];
                this.restoreBgState(existingPlog);
                if (existingPlog.diaryIds && existingPlog.diaryIds.length > 0) {
                    this.diaryIdsFromParams = existingPlog.diaryIds;
                }
                return;
            }
        }
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
            drawStrokes: [],
            diaryIds: this.diaryIdsFromParams.length > 0 ? [...this.diaryIdsFromParams] : undefined,
            createdAt: Date.now(),
            thumbnail: ''
        };
        this.elements = [];
        this.drawStrokes = [];
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
            const date = this.plog?.date ?? DateUtils.getToday();
            const allPostsByDate = await DiaryViewModel.getPostsByDate(date);
            // 优先使用路由传入的diaryIds，其次使用已保存plog中的diaryIds
            const diaryIds = this.diaryIdsFromParams.length > 0
                ? this.diaryIdsFromParams
                : (this.plog?.diaryIds ?? []);
            if (diaryIds.length > 0) {
                const idSet = new Set<number>(diaryIds);
                const matched = allPostsByDate.filter((post: DiaryPost) => idSet.has(post.id));
                // 补充：不在当前日期查询结果中、但属于手账关联的条目（来自其他日期）
                const matchedIdSet = new Set<number>(matched.map((p: DiaryPost) => p.id));
                const missingIds = diaryIds.filter((id: number) => !matchedIdSet.has(id));
                if (missingIds.length > 0) {
                    const allPosts = await DiaryViewModel.getAllPosts();
                    const extraPosts = allPosts.filter((post: DiaryPost) => {
                        const idSet2 = new Set<number>(missingIds);
                        return idSet2.has(post.id);
                    });
                    this.todayDiaryPosts = [...matched, ...extraPosts];
                }
                else {
                    this.todayDiaryPosts = matched;
                }
            }
            else {
                this.todayDiaryPosts = allPostsByDate;
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
        ctx.clearRect(0, 0, w, h);
        // CanvasRenderingContext2D.drawImage 支持直接传入 PixelMap
        ctx.drawImage(this.eyedropperPixelMap, 0, 0, w, h);
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
            else if (this.eyedropperTarget === 3) {
                this.brushColor = pickedColor;
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
    /** 保存当前状态到历史记录 */
    saveHistory(): void {
        if (this.historyIndex < this.historyStack.length - 1) {
            this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
        }
        const snapshot: CanvasElement[] = this.elements.map(el => {
            const copy: CanvasElement = {
                type: el.type, x: el.x, y: el.y, width: el.width, height: el.height,
                rotation: el.rotation, content: el.content, zIndex: el.zIndex,
                fontSize: el.fontSize, color: el.color, textOpacity: el.textOpacity,
                fontStyle: el.fontStyle, fontFamily: el.fontFamily, shadowOpacity: el.shadowOpacity,
                textAlign: el.textAlign, verticalAlign: el.verticalAlign, textDirection: el.textDirection,
                lineSpacing: el.lineSpacing, letterSpacing: el.letterSpacing, fontWeight: el.fontWeight,
                italicAngle: el.italicAngle, _version: el._version,
            };
            return copy;
        });
        this.historyStack.push(snapshot);
        if (this.historyStack.length > this.maxHistorySize) {
            this.historyStack.shift();
        }
        else {
            this.historyIndex++;
        }
    }
    /** 撤销 */
    undo(): void {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.elements = this.historyStack[this.historyIndex].map(el => {
                const copy: CanvasElement = {
                    type: el.type, x: el.x, y: el.y, width: el.width, height: el.height,
                    rotation: el.rotation, content: el.content, zIndex: el.zIndex,
                    fontSize: el.fontSize, color: el.color, textOpacity: el.textOpacity,
                    fontStyle: el.fontStyle, fontFamily: el.fontFamily, shadowOpacity: el.shadowOpacity,
                    textAlign: el.textAlign, verticalAlign: el.verticalAlign, textDirection: el.textDirection,
                    lineSpacing: el.lineSpacing, letterSpacing: el.letterSpacing, fontWeight: el.fontWeight,
                    italicAngle: el.italicAngle, _version: el._version,
                };
                return copy;
            });
            this.selectedElementIndex = -1;
        }
    }
    /** 重做 */
    redo(): void {
        if (this.historyIndex < this.historyStack.length - 1) {
            this.historyIndex++;
            this.elements = this.historyStack[this.historyIndex].map(el => {
                const copy: CanvasElement = {
                    type: el.type, x: el.x, y: el.y, width: el.width, height: el.height,
                    rotation: el.rotation, content: el.content, zIndex: el.zIndex,
                    fontSize: el.fontSize, color: el.color, textOpacity: el.textOpacity,
                    fontStyle: el.fontStyle, fontFamily: el.fontFamily, shadowOpacity: el.shadowOpacity,
                    textAlign: el.textAlign, verticalAlign: el.verticalAlign, textDirection: el.textDirection,
                    lineSpacing: el.lineSpacing, letterSpacing: el.letterSpacing, fontWeight: el.fontWeight,
                    italicAngle: el.italicAngle, _version: el._version,
                };
                return copy;
            });
            this.selectedElementIndex = -1;
        }
    }
    /** 放大画布 */
    zoomIn(): void {
        this.canvasScale = Math.min(this.canvasScale + 0.2, 3.0);
    }
    /** 缩小画布 */
    zoomOut(): void {
        this.canvasScale = Math.max(this.canvasScale - 0.2, 0.5);
    }
    /** 重置缩放 */
    resetZoom(): void {
        this.canvasScale = 1.0;
        this.canvasOffsetX = 0;
        this.canvasOffsetY = 0;
    }
    private extractField(json: string, fieldName: string): string {
        try {
            const match = json.match(new RegExp(`"${fieldName}"\\s*:\\s*"([^"]*)"`, 'i'));
            return match ? match[1] : '';
        }
        catch {
            return '';
        }
    }
    private buildTemplateText(post: DiaryPost): string {
        if (!post.templateData)
            return post.content;
        const d = post.templateData;
        const lines: string[] = [];
        if (d.includes('"type":"accounting"') || d.includes('"type": "accounting"')) {
            lines.push(`💰 记账`);
            lines.push(`日期：${this.extractField(d, 'date')}`);
            const loc = this.extractField(d, 'location');
            if (loc)
                lines.push(`地点：${loc}`);
            lines.push(`金额：￥${this.extractField(d, 'amount')}`);
            lines.push(`物品：${this.extractField(d, 'item')}`);
        }
        else if (d.includes('"type":"dining"') || d.includes('"type": "dining"')) {
            lines.push(`🍜 饮食`);
            lines.push(`日期：${this.extractField(d, 'date')}`);
            const loc = this.extractField(d, 'location');
            if (loc)
                lines.push(`地点：${loc}`);
            const amt = this.extractField(d, 'amount');
            if (amt)
                lines.push(`金额：￥${amt}`);
            lines.push(`菜品：${this.extractField(d, 'dish')}`);
            const rating = this.extractField(d, 'rating');
            if (rating)
                lines.push(`评价：${rating}`);
        }
        else if (d.includes('"type":"movie"') || d.includes('"type": "movie"')) {
            lines.push(`🎬 观影`);
            lines.push(`影片：${this.extractField(d, 'title')}`);
            const genre = this.extractField(d, 'genre');
            if (genre)
                lines.push(`类型：${genre}`);
            const score = this.extractField(d, 'score');
            if (score)
                lines.push(`评分：${score}`);
            const exp = this.extractField(d, 'experience');
            if (exp)
                lines.push(`体验：${exp}`);
        }
        return lines.length > 0 ? lines.join('\n') : post.content;
    }
    /**
     * 添加随手记到手账
     */
    addDiaryToCanvas(post: DiaryPost): void {
        const baseIndex = this.elements.length;
        const textContent = this.buildTemplateText(post);
        if (textContent && textContent.trim()) {
            const lineCount = textContent.split('\n').length;
            const textElement: CanvasElement = {
                type: 'text',
                x: 20,
                y: 20 + baseIndex * 20,
                width: 220,
                height: Math.max(60, lineCount * 22 + 16),
                rotation: 0,
                content: textContent,
                zIndex: baseIndex,
                fontSize: 13,
                color: '#333333',
                textOpacity: 100,
                fontStyle: 'normal',
                fontFamily: '',
                shadowOpacity: 0,
                textAlign: TextAlign.Start,
                verticalAlign: 0,
                textDirection: 'horizontal',
                lineSpacing: 1.4,
                letterSpacing: 0,
                fontWeight: 400,
                italicAngle: 0,
                _version: 0,
            };
            this.elements.push(textElement);
        }
        if (post.mediaUrls && post.mediaUrls.length > 0) {
            post.mediaUrls.forEach((url, idx) => {
                const imgElement: CanvasElement = {
                    type: 'image',
                    x: 20 + ((baseIndex + idx) % 3) * 120,
                    y: 120 + Math.floor((baseIndex + idx) / 3) * 120,
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
        this.saveHistory();
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
        this.saveHistory();
    }
    /**
     * 添加贴纸元素
     */
    addSticker(stickerUrl: string): void {
        const element: CanvasElement = {
            type: 'sticker',
            x: 80 + (this.elements.length % 3) * 40,
            y: 100 + Math.floor(this.elements.length / 3) * 40,
            width: 100,
            height: 100,
            rotation: 0,
            content: stickerUrl,
            zIndex: this.elements.length
        };
        this.elements.push(element);
        this.selectedElementIndex = this.elements.length - 1;
        this.saveHistory();
    }
    /** 从相册选择图片作为贴纸 */
    async pickStickerFromAlbum(): Promise<void> {
        try {
            const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
            photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
            photoSelectOptions.maxSelectNumber = 1;
            const photoViewPicker = new photoAccessHelper.PhotoViewPicker();
            const result = await photoViewPicker.select(photoSelectOptions);
            if (result && result.photoUris && result.photoUris.length > 0) {
                this.addSticker(result.photoUris[0]);
                promptAction.showToast({ message: '已添加图片贴纸' });
            }
        }
        catch (error) {
            console.error('选择图片贴纸失败:', error);
        }
    }
    /** 重绘所有已保存的笔画（Canvas onReady 或工具切换后调用） */
    redrawAllStrokes(): void {
        const ctx = this.drawingCanvasContext;
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        for (const stroke of this.drawStrokes) {
            if (!stroke.points || stroke.points.length === 0)
                continue;
            const savedBrushType = this.brushType;
            const savedBrushColor = this.brushColor;
            const savedBrushThickness = this.brushThickness;
            const savedBrushOpacity = this.brushOpacity;
            this.brushType = stroke.brushType;
            this.brushColor = stroke.brushColor;
            this.brushThickness = stroke.brushThickness;
            this.brushOpacity = stroke.brushOpacity;
            if (stroke.points.length === 1) {
                this.drawStrokePoint(stroke.points[0].x, stroke.points[0].y);
            }
            else {
                this.drawStrokePoint(stroke.points[0].x, stroke.points[0].y);
                for (let i = 1; i < stroke.points.length; i++) {
                    this.drawStroke(stroke.points[i - 1].x, stroke.points[i - 1].y, stroke.points[i].x, stroke.points[i].y);
                }
            }
            this.brushType = savedBrushType;
            this.brushColor = savedBrushColor;
            this.brushThickness = savedBrushThickness;
            this.brushOpacity = savedBrushOpacity;
        }
    }
    /** 画笔在 TouchDown 时画一个起始点（修复线条不连续问题） */
    drawStrokePoint(x: number, y: number): void {
        const ctx = this.drawingCanvasContext;
        if (this.brushType === 0) {
            // 橡皮：画一个擦除圆点
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.beginPath();
            ctx.arc(x, y, this.brushThickness * 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
        }
        else {
            ctx.globalCompositeOperation = 'source-over';
            const alpha = this.brushOpacity / 100;
            ctx.fillStyle = this.brushColor;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(x, y, this.brushThickness / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
    }
    /** 画笔绘制一段笔画 */
    drawStroke(fromX: number, fromY: number, toX: number, toY: number): void {
        const ctx = this.drawingCanvasContext;
        if (this.brushType === 0) {
            // 橡皮擦：用 destination-out 模式擦除
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.lineWidth = this.brushThickness * 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
        }
        else {
            ctx.globalCompositeOperation = 'source-over';
            // 设置透明度
            const alpha = this.brushOpacity / 100;
            // 根据画笔类型设置线条样式
            if (this.brushType === 1) {
                // 基础画笔：均匀线条
                ctx.strokeStyle = this.brushColor;
                ctx.lineWidth = this.brushThickness;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
            }
            else if (this.brushType === 2) {
                // 毛笔：根据速度变化粗细
                const dist = Math.sqrt((toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY));
                const speed = Math.min(dist, 20);
                const width = Math.max(2, this.brushThickness * 2 - speed * 0.3);
                ctx.strokeStyle = this.brushColor;
                ctx.lineWidth = width;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
            }
            else if (this.brushType === 3) {
                // 马克笔：扁宽笔触
                ctx.strokeStyle = this.brushColor;
                ctx.lineWidth = this.brushThickness * 2;
                ctx.lineCap = 'butt';
                ctx.lineJoin = 'bevel';
                ctx.globalAlpha = alpha * 0.7;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
            }
            else if (this.brushType === 4) {
                // 荧光笔：宽且半透明
                ctx.strokeStyle = this.brushColor;
                ctx.lineWidth = this.brushThickness * 3;
                ctx.lineCap = 'square';
                ctx.lineJoin = 'miter';
                ctx.globalAlpha = alpha * 0.35;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
            }
            else if (this.brushType === 5) {
                // 铅笔：细线带纹理感
                ctx.strokeStyle = this.brushColor;
                ctx.lineWidth = Math.max(1, this.brushThickness * 0.5);
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.globalAlpha = alpha * 0.8;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
                // 添加纹理颗粒
                for (let i = 0; i < 2; i++) {
                    const ox = (Math.random() - 0.5) * this.brushThickness;
                    const oy = (Math.random() - 0.5) * this.brushThickness;
                    ctx.globalAlpha = alpha * 0.3;
                    ctx.beginPath();
                    ctx.arc(toX + ox, toY + oy, 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            else if (this.brushType === 6) {
                // 蜡笔：粗糙厚实线条
                ctx.strokeStyle = this.brushColor;
                ctx.lineWidth = this.brushThickness * 1.5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.globalAlpha = alpha * 0.85;
                ctx.beginPath();
                ctx.moveTo(fromX + (Math.random() - 0.5) * 1.5, fromY + (Math.random() - 0.5) * 1.5);
                ctx.lineTo(toX + (Math.random() - 0.5) * 1.5, toY + (Math.random() - 0.5) * 1.5);
                ctx.stroke();
            }
            else if (this.brushType === 7) {
                // 水彩笔：柔和扩散效果
                ctx.strokeStyle = this.brushColor;
                ctx.lineWidth = this.brushThickness * 2;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.globalAlpha = alpha * 0.25;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
                // 外层扩散
                ctx.lineWidth = this.brushThickness * 3;
                ctx.globalAlpha = alpha * 0.1;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
            }
            else if (this.brushType === 8) {
                // 喷枪：随机散布粒子
                ctx.fillStyle = this.brushColor;
                ctx.globalAlpha = alpha * 0.3;
                const density = Math.max(10, this.brushThickness * 2);
                const radius = this.brushThickness * 2;
                for (let i = 0; i < density; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const r = Math.random() * radius;
                    const px = toX + Math.cos(angle) * r;
                    const py = toY + Math.sin(angle) * r;
                    ctx.beginPath();
                    ctx.arc(px, py, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            else if (this.brushType === 9) {
                // 钢笔：细线带压感变化
                const dist = Math.sqrt((toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY));
                const pressureWidth = Math.max(1, this.brushThickness * 0.6 + (1 - Math.min(dist / 30, 1)) * this.brushThickness * 0.4);
                ctx.strokeStyle = this.brushColor;
                ctx.lineWidth = pressureWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
            }
            else if (this.brushType === 10) {
                // 炭笔：粗糙浓黑、带颗粒
                ctx.strokeStyle = this.brushColor;
                ctx.lineWidth = this.brushThickness * 1.8;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.globalAlpha = alpha * 0.9;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
                // 炭笔颗粒
                ctx.fillStyle = this.brushColor;
                for (let i = 0; i < 5; i++) {
                    const ox = (Math.random() - 0.5) * this.brushThickness * 2;
                    const oy = (Math.random() - 0.5) * this.brushThickness * 2;
                    ctx.globalAlpha = alpha * (0.1 + Math.random() * 0.2);
                    ctx.beginPath();
                    ctx.arc(toX + ox, toY + oy, Math.random() * 1.2 + 0.3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            else if (this.brushType === 11) {
                // 霓虹笔：发光效果
                // 外发光
                ctx.strokeStyle = this.brushColor;
                ctx.lineWidth = this.brushThickness * 4;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.globalAlpha = alpha * 0.08;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
                // 中层光晕
                ctx.lineWidth = this.brushThickness * 2;
                ctx.globalAlpha = alpha * 0.2;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
                // 核心亮线
                ctx.lineWidth = this.brushThickness * 0.8;
                ctx.globalAlpha = alpha * 0.9;
                ctx.strokeStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
            }
            else if (this.brushType === 12) {
                // 点彩笔：排列圆点
                ctx.fillStyle = this.brushColor;
                ctx.globalAlpha = alpha * 0.8;
                const dist = Math.sqrt((toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY));
                const dotSpacing = Math.max(3, this.brushThickness * 0.8);
                const steps = Math.max(1, Math.floor(dist / dotSpacing));
                for (let i = 0; i <= steps; i++) {
                    const t = steps > 0 ? i / steps : 0;
                    const px = fromX + (toX - fromX) * t;
                    const py = fromY + (toY - fromY) * t;
                    const dotSize = this.brushThickness * 0.4 + Math.random() * this.brushThickness * 0.3;
                    ctx.beginPath();
                    ctx.arc(px + (Math.random() - 0.5) * 2, py + (Math.random() - 0.5) * 2, dotSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            else if (this.brushType === 13) {
                // 虚线笔
                ctx.strokeStyle = this.brushColor;
                ctx.lineWidth = this.brushThickness;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.globalAlpha = alpha;
                ctx.setLineDash([this.brushThickness * 2, this.brushThickness * 1.5]);
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
                ctx.setLineDash([]);
            }
            ctx.globalAlpha = 1.0;
        }
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
        this.saveHistory();
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
        this.saveHistory();
    }
    /**
     * 保存手账
     */
    async savePlog(): Promise<void> {
        if (!this.plog)
            return;
        try {
            this.plog.elements = this.elements;
            this.plog.drawStrokes = this.drawStrokes;
            this.applyBgToPlog();
            if (this.diaryIdsFromParams.length > 0 && !this.plog.diaryIds) {
                this.plog.diaryIds = [...this.diaryIdsFromParams];
            }
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
                    drawStrokes: this.plog.drawStrokes,
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
            const savedSelectionIndex = this.selectedElementIndex;
            this.selectedElementIndex = -1;
            await new Promise<void>(resolve => setTimeout(resolve, 50));
            const pixelMap: image.PixelMap = await componentSnapshot.get('plogCanvas');
            const scale = 200 / Math.max(pixelMap.getImageInfoSync().size.width, 1);
            pixelMap.scaleSync(scale, scale);
            const imagePackerApi = image.createImagePacker();
            const packOpts: image.PackingOption = { format: 'image/png', quality: 80 };
            const data: ArrayBuffer = await imagePackerApi.packing(pixelMap, packOpts);
            imagePackerApi.release();
            pixelMap.release();
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
            this.selectedElementIndex = savedSelectionIndex;
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
                this.plog.drawStrokes = this.drawStrokes;
                this.applyBgToPlog();
                await this.generateThumbnail();
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
                        drawStrokes: this.plog.drawStrokes,
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
                this.switchToolTab(tabIndex);
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.activeToolTab === tabIndex
                ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
            });
            Column.onClick(() => this.switchSubTool(subIndex));
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.activeSubTool === subIndex
                ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Column.border({ width: 1.5, color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
                                    // 吸色笔
                                    Column.onClick(() => this.startEyedropper(0));
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('吸');
                                    Text.fontSize(14);
                                    Text.fontColor({ "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                            Column.border({ width: this.bgColor === color ? 2 : 0.5, color: this.bgColor === color ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : '#CCCCCC' });
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
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                                color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
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
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                            Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                            Text.fontColor(this.patternType === item.type
                                                ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                            Text.padding({ left: 12, right: 12, top: 8, bottom: 8 });
                                            Text.borderRadius(16);
                                            Text.backgroundColor(this.patternType === item.type ? '#FFF0E8' : '#F5F5F5');
                                            Text.border({
                                                width: this.patternType === item.type ? 1.5 : 0,
                                                color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
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
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Column.border({ width: 1.5, color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
                                    // 吸色笔
                                    Column.onClick(() => this.startEyedropper(1));
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('吸');
                                    Text.fontSize(14);
                                    Text.fontColor({ "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                            Column.border({ width: this.patternColor === color ? 2 : 0.5, color: this.patternColor === color ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : '#CCCCCC' });
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
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Row.border({ width: 1, color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
                                    Row.onClick(() => this.pickCustomBg());
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('从相册选择背景图');
                                    Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                        Text.backgroundColor({ "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                                color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
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
                                                ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Column.border({ width: 1.5, color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
                                    // 吸色笔
                                    Column.onClick(() => this.startEyedropper(2));
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('吸');
                                    Text.fontSize(14);
                                    Text.fontColor({ "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                                color: this.textColor === color ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : '#CCCCCC'
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
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Column.backgroundColor(this.textDirection === 'horizontal' ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : 'transparent');
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
                                    Column.backgroundColor(this.textDirection === 'vertical' ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : 'transparent');
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
                                                            color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
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
                                                            ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                                            color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
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
                                                            ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                                color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
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
                                                ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                        Grid.height(220);
                        // 贴纸详细设置
                        Grid.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                    }, Grid);
                    {
                        const itemCreation2 = (elmtId, isInitialRender) => {
                            GridItem.create(() => { }, false);
                            // + 号按钮：从相册添加图片贴纸
                            GridItem.width(52);
                            // + 号按钮：从相册添加图片贴纸
                            GridItem.height(52);
                        };
                        const observedDeepRender = () => {
                            this.observeComponentCreation2(itemCreation2, GridItem);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.width('100%');
                                Column.height('100%');
                                Column.justifyContent(FlexAlign.Center);
                                Column.borderWidth(2);
                                Column.borderStyle(BorderStyle.Dashed);
                                Column.borderColor('#CCCCCC');
                                Column.borderRadius(8);
                                Column.onClick(() => {
                                    this.pickStickerFromAlbum();
                                });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('+');
                                Text.fontSize(28);
                                Text.fontColor('#999999');
                                Text.fontWeight(FontWeight.Bold);
                            }, Text);
                            Text.pop();
                            Column.pop();
                            // + 号按钮：从相册添加图片贴纸
                            GridItem.pop();
                        };
                        observedDeepRender();
                    }
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
                        this.forEachUpdateFunction(elmtId, ['⭐', '❤️', '🌸', '🎀', '✨', '🌈', '🌟', '💎', '🍀', '🦋', '🌙', '🎈',
                            '🌻', '🎶', '🦊', '🐱', '🐶', '🐻', '🍬', '🎨', '📖', '💡', '🔥', '☕',
                            '🎀', '💝', '🏡', '🌴', '🍄', '🐰', '🧸', '🍰', '🪄', '🎊', '💖', '⛅'], forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    // 贴纸详细设置
                    Grid.pop();
                });
            }
            else if (this.activeToolTab === 4) {
                this.ifElseBranchUpdateFunction(4, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 画笔详细设置
                        Scroll.create();
                        // 画笔详细设置
                        Scroll.width('100%');
                        // 画笔详细设置
                        Scroll.scrollBar(BarState.Off);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 12 });
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 横向滚动画笔选择
                        Scroll.create();
                        // 横向滚动画笔选择
                        Scroll.scrollable(ScrollDirection.Horizontal);
                        // 横向滚动画笔选择
                        Scroll.scrollBar(BarState.Off);
                        // 横向滚动画笔选择
                        Scroll.width('100%');
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.padding({ left: 4, right: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(item.label as string);
                                Text.fontSize(13);
                                Text.fontColor(this.brushType === (item.type as number)
                                    ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                Text.fontWeight(this.brushType === (item.type as number) ? FontWeight.Medium : FontWeight.Normal);
                                Text.padding({ left: 10, right: 10, top: 8, bottom: 8 });
                                Text.backgroundColor(this.brushType === (item.type as number) ? '#FFF0E8' : '#F5F5F5');
                                Text.borderRadius(16);
                                Text.border({
                                    width: this.brushType === (item.type as number) ? 1.5 : 0,
                                    color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
                                });
                                Text.onClick(() => {
                                    this.brushType = item.type as number;
                                });
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, [
                            { type: 0, label: '橡皮' },
                            { type: 1, label: '画笔' },
                            { type: 2, label: '毛笔' },
                            { type: 3, label: '马克笔' },
                            { type: 4, label: '荧光笔' },
                            { type: 5, label: '铅笔' },
                            { type: 6, label: '蜡笔' },
                            { type: 7, label: '水彩笔' },
                            { type: 8, label: '喷枪' },
                            { type: 9, label: '钢笔' },
                            { type: 10, label: '炭笔' },
                            { type: 11, label: '霓虹笔' },
                            { type: 12, label: '点彩笔' },
                            { type: 13, label: '虚线笔' }
                        ], forEachItemGenFunction, (item: Record<string, Object>) => (item.type as number).toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                    // 横向滚动画笔选择
                    Scroll.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 分割线
                        Divider.create();
                        // 分割线
                        Divider.color('#EEEEEE');
                    }, Divider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 颜色选择（橡皮不显示）
                        if (this.brushType !== 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
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
                                    Column.border({ width: 1.5, color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
                                    // 吸色笔
                                    Column.onClick(() => this.startEyedropper(3));
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('吸');
                                    Text.fontSize(14);
                                    Text.fontColor({ "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                                width: this.brushColor === color ? 2 : 0.5,
                                                color: this.brushColor === color ? { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : '#CCCCCC'
                                            });
                                            Column.onClick(() => {
                                                this.brushColor = color;
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
                                    // 色相滑块
                                    Row.create();
                                    // 色相滑块
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('色相');
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.brushColorHue, min: 0, max: 360, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.selectedColor(this.hslToHex(this.brushColorHue, this.brushColorSaturation));
                                    Slider.onChange((value: number) => {
                                        this.brushColorHue = value;
                                        this.brushColor = this.hslToHex(this.brushColorHue, this.brushColorSaturation);
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.brushColorHue)}°`);
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                // 色相滑块
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 饱和度滑块
                                    Row.create();
                                    // 饱和度滑块
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('饱和度');
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.brushColorSaturation, min: 0, max: 100, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.selectedColor(this.hslToHex(this.brushColorHue, this.brushColorSaturation));
                                    Slider.onChange((value: number) => {
                                        this.brushColorSaturation = value;
                                        this.brushColor = this.hslToHex(this.brushColorHue, this.brushColorSaturation);
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.brushColorSaturation)}%`);
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
                                // 饱和度滑块
                                Row.pop();
                            });
                        }
                        // 粗细滑块
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 粗细滑块
                        Row.create();
                        // 粗细滑块
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('粗细');
                        Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.width(40);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Slider.create({ value: this.brushThickness, min: 1, max: 50, step: 1 });
                        Slider.layoutWeight(1);
                        Slider.selectedColor({ "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Slider.onChange((value: number) => {
                            this.brushThickness = value;
                        });
                    }, Slider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${Math.round(this.brushThickness)}`);
                        Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.width(36);
                    }, Text);
                    Text.pop();
                    // 粗细滑块
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 透明度滑块（橡皮不显示）
                        if (this.brushType !== 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('透明度');
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(40);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Slider.create({ value: this.brushOpacity, min: 0, max: 100, step: 1 });
                                    Slider.layoutWeight(1);
                                    Slider.onChange((value: number) => {
                                        this.brushOpacity = value;
                                    });
                                }, Slider);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${Math.round(this.brushOpacity)}%`);
                                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(36);
                                }, Text);
                                Text.pop();
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
                    // 画笔详细设置
                    Scroll.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(5, () => {
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
            Row.backgroundColor({ "id": 16777314, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Row.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
            Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(DateUtils.formatTime(post.timestamp));
            Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(32);
            Column.height(32);
            Column.justifyContent(FlexAlign.Center);
            Column.border({
                width: 1.5,
                color: { "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" },
                style: BorderStyle.Dashed
            });
            Column.borderRadius(4);
            Column.onClick(() => this.addDiaryToCanvas(post));
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('＋');
            Text.fontSize(18);
            Text.fontColor({ "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Bottom });
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777311, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
            SymbolGlyph.fontColor([{ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 撤销/重做按钮组
            Row.create({ space: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(36);
            Button.height(36);
            Button.backgroundColor(Color.Transparent);
            Button.enabled(this.historyIndex > 0);
            Button.onClick(() => this.undo());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832702, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([this.historyIndex > 0
                    ? { "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(36);
            Button.height(36);
            Button.backgroundColor(Color.Transparent);
            Button.enabled(this.historyIndex < this.historyStack.length - 1);
            Button.onClick(() => this.redo());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831551, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([this.historyIndex < this.historyStack.length - 1
                    ? { "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        Button.pop();
        // 撤销/重做按钮组
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('保存');
            Button.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.fontColor({ "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Button.backgroundColor(Color.Transparent);
            Button.padding({ left: 16, right: 16, top: 8, bottom: 8 });
            Button.onClick(() => this.savePlog());
        }, Button);
        Button.pop();
        // 顶部栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 画布区域（铺满剩余空间）
            Stack.create();
            // 画布区域（铺满剩余空间）
            Stack.width('100%');
            // 画布区域（铺满剩余空间）
            Stack.layoutWeight(1);
            // 画布区域（铺满剩余空间）
            Stack.padding(16);
            // 画布区域（铺满剩余空间）
            Stack.clip(true);
            // 画布区域（铺满剩余空间）
            Stack.id('plogCanvas');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 画布内容层（可缩放和平移）
            Stack.create();
            // 画布内容层（可缩放和平移）
            Stack.width('100%');
            // 画布内容层（可缩放和平移）
            Stack.height('100%');
            // 画布内容层（可缩放和平移）
            Stack.scale({ x: this.canvasScale, y: this.canvasScale });
            // 画布内容层（可缩放和平移）
            Stack.translate({ x: this.canvasOffsetX, y: this.canvasOffsetY });
            globalThis.Gesture.create(GesturePriority.Low);
            PanGesture.create();
            PanGesture.onActionStart(() => {
                this.panStartOffsetX = this.canvasOffsetX;
                this.panStartOffsetY = this.canvasOffsetY;
            });
            PanGesture.onActionUpdate((event: GestureEvent) => {
                if (this.activeToolTab !== 4) {
                    this.canvasOffsetX = this.panStartOffsetX + event.offsetX;
                    this.canvasOffsetY = this.panStartOffsetY + event.offsetY;
                }
            });
            PanGesture.pop();
            globalThis.Gesture.pop();
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
                                Stack.create();
                                Stack.position({ x: this.elements[index].x, y: this.elements[index].y });
                                Stack.width(this.elements[index].width);
                                Stack.height(this.elements[index].height);
                                Stack.zIndex(element.zIndex);
                                Stack.rotate({ angle: element.rotation });
                                globalThis.Gesture.create(GesturePriority.Low);
                                GestureGroup.create(GestureMode.Exclusive);
                                PanGesture.create({ fingers: 1, distance: 5 });
                                PanGesture.onActionStart(() => {
                                    this.dragStartX = this.elements[index].x;
                                    this.dragStartY = this.elements[index].y;
                                    this.selectedElementIndex = index;
                                });
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
                                PanGesture.onActionEnd(() => {
                                    this.elements = [...this.elements];
                                });
                                PanGesture.pop();
                                TapGesture.create({ count: 1 });
                                TapGesture.onAction(() => {
                                    this.selectedElementIndex = index;
                                });
                                TapGesture.pop();
                                GestureGroup.pop();
                                globalThis.Gesture.pop();
                            }, Stack);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                // 区分：图片路径用 Image，emoji 贴纸用 Text
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
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                // 选中时的边框（白色虚线）
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
                                // 选中时的控制按钮
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                // 选中时的控制按钮
                                if (this.selectedElementIndex === index) {
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
                                            // 缩放手柄（右下角）↻
                                            Column.create();
                                            // 缩放手柄（右下角）↻
                                            Column.width(22);
                                            // 缩放手柄（右下角）↻
                                            Column.height(22);
                                            // 缩放手柄（右下角）↻
                                            Column.backgroundColor(Color.White);
                                            // 缩放手柄（右下角）↻
                                            Column.borderRadius(11);
                                            // 缩放手柄（右下角）↻
                                            Column.position({ x: this.elements[index].width - 11, y: this.elements[index].height - 11 });
                                            // 缩放手柄（右下角）↻
                                            Column.justifyContent(FlexAlign.Center);
                                            // 缩放手柄（右下角）↻
                                            Column.zIndex(100);
                                            globalThis.Gesture.create(GesturePriority.Low);
                                            PanGesture.create();
                                            PanGesture.onActionStart(() => {
                                                this.resizeStartWidth = this.elements[index].width;
                                                this.resizeStartHeight = this.elements[index].height;
                                            });
                                            PanGesture.onActionUpdate((event: GestureEvent) => {
                                                const newWidth = Math.max(40, this.resizeStartWidth + event.offsetX);
                                                const newHeight = Math.max(40, this.resizeStartHeight + event.offsetY);
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
                                        // 缩放手柄（右下角）↻
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 画笔绘图层（始终渲染以保留绘画内容，仅在画笔工具激活时可交互）
            Canvas.create(this.drawingCanvasContext);
            // 画笔绘图层（始终渲染以保留绘画内容，仅在画笔工具激活时可交互）
            Canvas.width('100%');
            // 画笔绘图层（始终渲染以保留绘画内容，仅在画笔工具激活时可交互）
            Canvas.height('100%');
            // 画笔绘图层（始终渲染以保留绘画内容，仅在画笔工具激活时可交互）
            Canvas.id('drawingCanvas');
            // 画笔绘图层（始终渲染以保留绘画内容，仅在画笔工具激活时可交互）
            Canvas.hitTestBehavior(this.activeToolTab === 4 ? HitTestMode.Default : HitTestMode.None);
            // 画笔绘图层（始终渲染以保留绘画内容，仅在画笔工具激活时可交互）
            Canvas.onReady(() => {
                this.canvasReady = true;
                this.redrawAllStrokes();
            });
            // 画笔绘图层（始终渲染以保留绘画内容，仅在画笔工具激活时可交互）
            Canvas.onTouch((event: TouchEvent) => {
                if (this.activeToolTab !== 4)
                    return;
                if (event.type === TouchType.Down && event.touches.length > 0) {
                    const x = event.touches[0].x;
                    const y = event.touches[0].y;
                    this.drawLastX = x;
                    this.drawLastY = y;
                    this.isDrawing = true;
                    // 开始新笔画
                    this.currentStroke = {
                        brushType: this.brushType,
                        brushColor: this.brushColor,
                        brushThickness: this.brushThickness,
                        brushOpacity: this.brushOpacity,
                        points: [{ x, y }]
                    };
                    // 在 TouchDown 时画一个起始点（修复不连续问题）
                    this.drawStrokePoint(x, y);
                }
                else if (event.type === TouchType.Move && event.touches.length > 0 && this.isDrawing) {
                    const x = event.touches[0].x;
                    const y = event.touches[0].y;
                    this.drawStroke(this.drawLastX, this.drawLastY, x, y);
                    // 记录点到当前笔画
                    if (this.currentStroke) {
                        this.currentStroke.points.push({ x, y });
                    }
                    this.drawLastX = x;
                    this.drawLastY = y;
                }
                else if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.isDrawing = false;
                    // 保存当前笔画
                    if (this.currentStroke && this.currentStroke.points.length > 0) {
                        this.drawStrokes = [...this.drawStrokes, this.currentStroke];
                        this.currentStroke = null;
                    }
                }
            });
        }, Canvas);
        // 画笔绘图层（始终渲染以保留绘画内容，仅在画笔工具激活时可交互）
        Canvas.pop();
        // 画布内容层（可缩放和平移）
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 右上角缩放控制条：放大镜-  100%  放大镜+
            Row.create({ space: 8 });
            // 右上角缩放控制条：放大镜-  100%  放大镜+
            Row.padding({ left: 8, right: 8, top: 6, bottom: 6 });
            // 右上角缩放控制条：放大镜-  100%  放大镜+
            Row.backgroundColor({ "id": 16777314, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 右上角缩放控制条：放大镜-  100%  放大镜+
            Row.borderRadius(20);
            // 右上角缩放控制条：放大镜-  100%  放大镜+
            Row.shadow({ radius: 8, color: '#15000000', offsetX: 0, offsetY: 2 });
            // 右上角缩放控制条：放大镜-  100%  放大镜+
            Row.position({ x: '50%', y: 16 });
            // 右上角缩放控制条：放大镜-  100%  放大镜+
            Row.translate({ x: '-50%', y: 0 });
            // 右上角缩放控制条：放大镜-  100%  放大镜+
            Row.zIndex(200);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 缩小按钮
            Button.createWithChild();
            // 缩小按钮
            Button.width(52);
            // 缩小按钮
            Button.height(36);
            // 缩小按钮
            Button.backgroundColor({ "id": 16777314, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 缩小按钮
            Button.borderRadius(18);
            // 缩小按钮
            Button.enabled(this.canvasScale > 0.5);
            // 缩小按钮
            Button.onClick(() => this.zoomOut());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 2 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831500, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(16);
            SymbolGlyph.fontColor([this.canvasScale > 0.5
                    ? { "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('−');
            Text.fontSize(18);
            Text.fontColor(this.canvasScale > 0.5
                ? { "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        Row.pop();
        // 缩小按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 百分比显示
            Text.create(`${Math.round(this.canvasScale * 100)}%`);
            // 百分比显示
            Text.fontSize(14);
            // 百分比显示
            Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 百分比显示
            Text.fontWeight(FontWeight.Medium);
            // 百分比显示
            Text.width(50);
            // 百分比显示
            Text.textAlign(TextAlign.Center);
        }, Text);
        // 百分比显示
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 放大按钮
            Button.createWithChild();
            // 放大按钮
            Button.width(52);
            // 放大按钮
            Button.height(36);
            // 放大按钮
            Button.backgroundColor({ "id": 16777314, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 放大按钮
            Button.borderRadius(18);
            // 放大按钮
            Button.enabled(this.canvasScale < 3.0);
            // 放大按钮
            Button.onClick(() => this.zoomIn());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 2 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831500, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(16);
            SymbolGlyph.fontColor([this.canvasScale < 3.0
                    ? { "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('＋');
            Text.fontSize(18);
            Text.fontColor(this.canvasScale < 3.0
                ? { "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        Row.pop();
        // 放大按钮
        Button.pop();
        // 右上角缩放控制条：放大镜-  100%  放大镜+
        Row.pop();
        // 画布区域（铺满剩余空间）
        Stack.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部工具栏悬浮面板（叠加在画布上方）
            Column.create();
            // 底部工具栏悬浮面板（叠加在画布上方）
            Column.width('100%');
            // 底部工具栏悬浮面板（叠加在画布上方）
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 展开区域：详细设置 + 子工具栏
            if (this.panelExpanded && this.activeToolTab >= 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.backgroundColor({ "id": 16777311, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
                                        color: { "id": 16777315, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
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
            Row.backgroundColor({ "id": 16777314, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 主工具栏（始终显示）
            Row.border({
                width: { top: this.panelExpanded && this.activeToolTab >= 0 ? 0 : 0.5 },
                color: { "id": 16777315, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
            });
        }, Row);
        this.MainToolButton.bind(this)('随手记', 0);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.width(0.5);
            Divider.height(36);
            Divider.color({ "id": 16777315, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Divider);
        this.MainToolButton.bind(this)('背景', 1);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.width(0.5);
            Divider.height(36);
            Divider.color({ "id": 16777315, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Divider);
        this.MainToolButton.bind(this)('文字', 2);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.width(0.5);
            Divider.height(36);
            Divider.color({ "id": 16777315, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Divider);
        this.MainToolButton.bind(this)('贴纸', 3);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.width(0.5);
            Divider.height(36);
            Divider.color({ "id": 16777315, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Divider);
        this.MainToolButton.bind(this)('画笔', 4);
        // 主工具栏（始终显示）
        Row.pop();
        // 底部工具栏悬浮面板（叠加在画布上方）
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
