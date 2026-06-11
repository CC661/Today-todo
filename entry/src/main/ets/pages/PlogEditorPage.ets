import PlogViewModel from '../viewmodel/PlogViewModel';
import DiaryViewModel from '../viewmodel/DiaryViewModel';
import type { PlogCanvas, CanvasElement, BgType, PatternType, TextStyle, TextDirection, DrawStroke } from '../model/PlogCanvas';
import type { DiaryPost } from '../model/DiaryPost';
import type { TodoItem } from '../model/TodoItem';
import type { PlogInsertParams } from '../common/database/RDBStoreUtil';
import DateUtils from '../common/utils/DateUtils';
import { router, curves, componentSnapshot, promptAction, font } from '@kit.ArkUI';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { image } from '@kit.ImageKit';
import { fileIo as fs } from '@kit.CoreFileKit';
import { common } from '@kit.AbilityKit';

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

/**
 * 手账编辑页 - Plog排版拼贴
 */
@Entry
@Component
struct PlogEditorPage {
  @State plog: PlogCanvas | null = null;
  @State elements: CanvasElement[] = [];
  @State selectedElementIndex: number = -1;
  @State editingTextIndex: number = -1;
  @State editingTextValue: string = '';
  @State showMaterialPanel: boolean = false;

  // 随手记相关
  @State todayDiaryPosts: DiaryPost[] = [];
  @State showDiaryPanel: boolean = false;
  @State selectedDiaryIds: Set<number> = new Set();

  // 当前激活的主工具: 0=随手记, 1=背景, 2=文字, 3=贴纸, 4=画笔
  @State activeToolTab: number = -1;
  // 当前激活的子工具（文字: 0=样式,1=颜色,2=排版,3=粗斜体,4=弯曲; 背景: 0=纯色,1=渐变,2=花纹,3=自定义）
  @State activeSubTool: number = 0;
  // 面板展开状态（子工具栏+详细设置是否显示）
  @State panelExpanded: boolean = false;

  // ---- 背景状态 ----
  @State bgType: BgType = 'none';
  @State bgColor: string = '#FFFFFF';          // 纯色色值
  @State bgHue: number = 0;                    // 色相 0-360
  @State bgSaturation: number = 0;             // 饱和度 0-100
  @State bgOpacity: number = 100;              // 透明度 0-100
  @State gradientColors: string[] = ['#FF6B6B', '#4ECDC4'];  // 渐变色
  @State gradientAngle: number = 135;          // 渐变角度
  @State patternType: PatternType = 'horizontal'; // 花纹类型
  @State hasPattern: boolean = false;             // 是否叠加花纹
  @State patternColor: string = '#E0E0E0';         // 花纹颜色
  @State patternHue: number = 0;                  // 花纹色相 0-360
  @State patternSaturation: number = 0;           // 花纹饱和度 0-100
  @State patternThickness: number = 3;         // 花纹粗细 1-10
  @State patternSpacing: number = 20;           // 花纹间隔 5-50
  @State customBgUri: string = '';              // 自定义背景图 URI

  // 取色器状态
  @State showEyedropper: boolean = false;
  private eyedropperTarget: number = 0;  // 0=背景色, 1=花纹色, 2=文字色, 3=画笔色
  private eyedropperPixelMap: image.PixelMap | null = null;
  private settings: RenderingContextSettings = new RenderingContextSettings(true);
  private eyedropperCanvasContext: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings);
  private patternCanvasContext: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings);

  private plogIdFromParams: number = 0;
  private diaryIdsFromParams: number[] = [];
  private textSubTools: string[] = ['样式', '颜色', '排版', '粗斜体'];
  private bgSubTools: string[] = ['纯色', '渐变', '花纹', '自定义'];
  private resizeStartWidth: number = 0;
  private resizeStartHeight: number = 0;
  private dragStartX: number = 0;
  private dragStartY: number = 0;

  // ---- 画笔状态 ----
  @State brushType: number = 1;  // 0=橡皮, 1=基础画笔, 2=毛笔, 3=马克笔, 4=荧光笔, 5=铅笔, 6=蜡笔, 7=水彩笔
  @State brushColor: string = '#333333';
  @State brushColorHue: number = 0;
  @State brushColorSaturation: number = 0;
  @State brushThickness: number = 4;     // 1-50
  @State brushOpacity: number = 100;     // 0-100
  @State isDrawing: boolean = false;
  private drawLastX: number = 0;
  private drawLastY: number = 0;
  private drawingCanvasContext: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings);
  @State drawStrokes: DrawStroke[] = [];     // 所有笔画数据
  private currentStroke: DrawStroke | null = null;  // 当前正在绘制的笔画
  private canvasReady: boolean = false;       // Canvas 是否已准备好

  // ---- 文字工具状态 ----
  @State textFontStyle: TextStyle = 'normal';
  @State textFontSize: number = 16;
  @State textShadowOpacity: number = 0;
  @State textColor: string = '#333333';
  @State textOpacity: number = 100;
  @State textColorHue: number = 0;
  @State textColorSaturation: number = 0;
  @State textAlign: TextAlign = TextAlign.Center;
  @State textVerticalAlign: number = 1; // 0=Top 1=Center 2=Bottom
  @State textDirection: TextDirection = 'horizontal';
  @State textLineSpacing: number = 1.2;
  @State textLetterSpacing: number = 0;
  @State textFontWeight: number = 400;
  @State textItalicAngle: number = 0;
  @State newTextContent: string = '';

  // ---- 撤销/重做状态 ----
  @State historyStack: CanvasElement[][] = [];
  @State historyIndex: number = -1;
  private maxHistorySize: number = 50;

  // ---- 画布缩放状态 ----
  @State canvasScale: number = 1.0;
  @State canvasOffsetX: number = 0;
  @State canvasOffsetY: number = 0;
  private panStartOffsetX: number = 0;
  private panStartOffsetY: number = 0;

  // 字体风格预设映射: styleKey -> fontFamily名
  private fontStyleMap: Record<string, string> = {
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

  aboutToAppear(): void {
    // 注册自定义字体（必须使用 $rawfile() 函数格式）
    font.registerFont({ familyName: 'LXGWWenKai', familySrc: $rawfile('LXGWWenKai-Regular.ttf') });
    font.registerFont({ familyName: 'LXGWWenKaiLite', familySrc: $rawfile('LXGWWenKaiLite-Regular.ttf') });
    font.registerFont({ familyName: 'ZCOOLKuaiLe', familySrc: $rawfile('ZCOOLKuaiLe-Regular.ttf') });
    font.registerFont({ familyName: 'MaShanZheng', familySrc: $rawfile('MaShanZheng-Regular.ttf') });
    font.registerFont({ familyName: 'ZCOOLXiaoWei', familySrc: $rawfile('ZCOOLXiaoWei-Regular.ttf') });
    font.registerFont({ familyName: 'LiuJianMaoCao', familySrc: $rawfile('LiuJianMaoCao-Regular.ttf') });
    font.registerFont({ familyName: 'ZhiMangXing', familySrc: $rawfile('ZhiMangXing-Regular.ttf') });
    font.registerFont({ familyName: 'LongCang', familySrc: $rawfile('LongCang-Regular.ttf') });
    font.registerFont({ familyName: 'Pacifico', familySrc: $rawfile('Pacifico-Regular.ttf') });
    font.registerFont({ familyName: 'DancingScript', familySrc: $rawfile('DancingScript-Regular.ttf') });
    font.registerFont({ familyName: 'Lobster', familySrc: $rawfile('Lobster-Regular.ttf') });
    font.registerFont({ familyName: 'GreatVibes', familySrc: $rawfile('GreatVibes-Regular.ttf') });
    font.registerFont({ familyName: 'Caveat', familySrc: $rawfile('Caveat-Regular.ttf') });

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
        } else {
          this.todayDiaryPosts = matched;
        }
      } else {
        this.todayDiaryPosts = allPostsByDate;
      }
    } catch (error) {
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
    animateTo({ duration: 400, curve: curves.springMotion() }, () => {
      if (this.activeToolTab === tab) {
        this.activeToolTab = -1;
        this.panelExpanded = false;
      } else {
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
    animateTo({ duration: 180, curve: Curve.EaseOut }, () => {
      this.activeSubTool = subIndex;
    });
    // 仅在背景工具下同步更新底色类型
    if (this.activeToolTab === 1) {
      if (subIndex === 0) {
        this.bgType = 'solid';
      } else if (subIndex === 1) {
        this.bgType = 'gradient';
      } else if (subIndex === 3) {
        // 自定义标签页，不自动切换 bgType，由 pickCustomBg 处理
      }
      this.applyBgToPlog();
    }
  }

  /**
   * 展开/收起面板
   */
  togglePanel(): void {
    animateTo({ duration: 280, curve: Curve.EaseInOut }, () => {
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
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
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
    if (w === 0 || h === 0) return;
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
    } else if (this.patternType === 'vertical') {
      for (let x = 0; x < w; x += s) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
    } else if (this.patternType === 'grid') {
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
    } else if (this.patternType === 'dots') {
      const r = t * 2;
      for (let y = r; y < h; y += s) {
        for (let x = r; x < w; x += s) {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (this.patternType === 'waves') {
      const amp = t * 3;
      for (let y = amp; y < h; y += s) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const wy = y + Math.sin((x / s) * Math.PI * 2) * amp;
          if (x === 0) {
            ctx.moveTo(x, wy);
          } else {
            ctx.lineTo(x, wy);
          }
        }
        ctx.stroke();
      }
    }
  }

  /** 将背景设置同步到 plog 对象 */
  applyBgToPlog(): void {
    if (!this.plog) return;
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
    } catch (error) {
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
    if (w === 0 || h === 0 || !this.eyedropperPixelMap) return;
    ctx.clearRect(0, 0, w, h);
    // CanvasRenderingContext2D.drawImage 支持直接传入 PixelMap
    ctx.drawImage(this.eyedropperPixelMap, 0, 0, w, h);
  }

  /** 从 Canvas 指定坐标吸取颜色 */
  pickColorFromCanvas(x: number, y: number): void {
    const ctx = this.eyedropperCanvasContext;
    const w = ctx.width;
    const h = ctx.height;
    if (w === 0 || h === 0) return;
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
      } else if (this.eyedropperTarget === 1) {
        this.patternColor = pickedColor;
      } else if (this.eyedropperTarget === 2) {
        this.textColor = pickedColor;
        this.applyTextPropsToSelected();
      } else if (this.eyedropperTarget === 3) {
        this.brushColor = pickedColor;
      }
      this.applyBgToPlog();
      this.showEyedropper = false;
      this.eyedropperPixelMap = null;
      promptAction.showToast({ message: `已吸取颜色` });
    } catch (e) {
      console.error('取色失败:', e);
      promptAction.showToast({ message: '取色失败，请重试' });
    }
  }

  /** 渐变角度 → GradientDirection 枚举值 */
  gradientAngleToGradientDirection(): number {
    const a = Math.round(this.gradientAngle / 45) * 45;
    // GradientDirection: 0=Bottom, 1=Top, 2=Left, 3=Right, 4=BottomRight, 5=BottomLeft, 6=TopRight, 7=TopLeft
    if (a === 0 || a === 360) return 0;   // Bottom (↓)
    if (a === 45) return 4;               // BottomRight (↘)
    if (a === 90) return 3;               // Right (→)
    if (a === 135) return 6;              // TopRight (↗)
    if (a === 180) return 1;              // Top (↑)
    if (a === 225) return 7;              // TopLeft (↖)
    if (a === 270) return 2;              // Left (←)
    if (a === 315) return 5;              // BottomLeft (↙)
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
    } else {
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
    } catch {
      return '';
    }
  }

  private buildTemplateText(post: DiaryPost): string {
    if (!post.templateData) return post.content;
    const d = post.templateData;
    const lines: string[] = [];
    if (d.includes('"type":"accounting"') || d.includes('"type": "accounting"')) {
      lines.push(`💰 记账`);
      lines.push(`日期：${this.extractField(d, 'date')}`);
      const loc = this.extractField(d, 'location');
      if (loc) lines.push(`地点：${loc}`);
      lines.push(`金额：￥${this.extractField(d, 'amount')}`);
      lines.push(`物品：${this.extractField(d, 'item')}`);
    } else if (d.includes('"type":"dining"') || d.includes('"type": "dining"')) {
      lines.push(`🍜 饮食`);
      lines.push(`日期：${this.extractField(d, 'date')}`);
      const loc = this.extractField(d, 'location');
      if (loc) lines.push(`地点：${loc}`);
      const amt = this.extractField(d, 'amount');
      if (amt) lines.push(`金额：￥${amt}`);
      lines.push(`菜品：${this.extractField(d, 'dish')}`);
      const rating = this.extractField(d, 'rating');
      if (rating) lines.push(`评价：${rating}`);
    } else if (d.includes('"type":"movie"') || d.includes('"type": "movie"')) {
      lines.push(`🎬 观影`);
      lines.push(`影片：${this.extractField(d, 'title')}`);
      const genre = this.extractField(d, 'genre');
      if (genre) lines.push(`类型：${genre}`);
      const score = this.extractField(d, 'score');
      if (score) lines.push(`评分：${score}`);
      const exp = this.extractField(d, 'experience');
      if (exp) lines.push(`体验：${exp}`);
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
    } catch (error) {
      console.error('选择图片贴纸失败:', error);
    }
  }

  /** 重绘所有已保存的笔画（Canvas onReady 或工具切换后调用） */
  redrawAllStrokes(): void {
    const ctx = this.drawingCanvasContext;
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    for (const stroke of this.drawStrokes) {
      if (!stroke.points || stroke.points.length === 0) continue;
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
      } else {
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
    } else {
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
    } else {
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
      } else if (this.brushType === 2) {
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
      } else if (this.brushType === 3) {
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
      } else if (this.brushType === 4) {
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
      } else if (this.brushType === 5) {
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
      } else if (this.brushType === 6) {
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
      } else if (this.brushType === 7) {
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
      } else if (this.brushType === 8) {
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
      } else if (this.brushType === 9) {
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
      } else if (this.brushType === 10) {
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
      } else if (this.brushType === 11) {
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
      } else if (this.brushType === 12) {
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
      } else if (this.brushType === 13) {
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
    if (idx < 0 || idx >= this.elements.length) return;
    const el = this.elements[idx];
    if (el.type !== 'text') return;
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
    if (idx < 0 || idx >= this.elements.length) return;
    const el = this.elements[idx];
    if (el.type !== 'text') return;
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
    } else if (this.selectedElementIndex > index) {
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
    if (!this.plog) return;

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
      } else {
        await PlogViewModel.updatePlog(this.plog);
      }

      promptAction.showToast({ message: '保存成功' });
    } catch (error) {
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
    } catch (error) {
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
        const todoText = materials.todos.map((t: TodoItem) =>
          `${t.status === 'completed' ? '✓' : '○'} ${t.content}`
        ).join('\n');

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
        } else {
          await PlogViewModel.updatePlog(this.plog);
        }
      }
    } catch (error) {
      console.error('生成素材失败:', error);
    }
  }

  @Builder
  MainToolButton(label: string, tabIndex: number) {
    Column() {
      Text(label)
        .fontSize($r('app.float.font_size_sm'))
        .fontColor(this.activeToolTab === tabIndex
          ? $r('app.color.primary_color')
          : $r('app.color.text_secondary'))
        .textAlign(TextAlign.Center)
        .maxLines(2)
        .fontWeight(this.activeToolTab === tabIndex ? FontWeight.Medium : FontWeight.Normal)
    }
    .layoutWeight(1)
    .height(36)
    .justifyContent(FlexAlign.Center)
    .backgroundColor(this.activeToolTab === tabIndex ? '#FFF0E8' : Color.Transparent)
    .borderRadius(18)
    .onClick(() => {
      this.switchToolTab(tabIndex);
    })
  }

  @Builder
  SubToolButton(label: string, subIndex: number) {
    Column() {
      Text(label)
        .fontSize($r('app.float.font_size_sm'))
        .fontColor(this.activeSubTool === subIndex
          ? $r('app.color.primary_color')
          : $r('app.color.text_secondary'))
        .fontWeight(this.activeSubTool === subIndex ? FontWeight.Medium : FontWeight.Normal)
        .textAlign(TextAlign.Center)
    }
    .layoutWeight(1)
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .border({
      width: { bottom: this.activeSubTool === subIndex ? 2 : 0 },
      color: $r('app.color.primary_color')
    })
    .onClick(() => this.switchSubTool(subIndex))
  }

  @Builder
  DetailContent() {
    if (this.activeToolTab === 0) {
      // 随手记详细设置
      if (this.todayDiaryPosts.length === 0) {
        Column() {
          Text('今天还没有随手记')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_hint'))
        }
        .width('100%')
        .height(160)
        .justifyContent(FlexAlign.Center)
      } else {
        Scroll() {
          Column() {
            ForEach(this.todayDiaryPosts, (post: DiaryPost) => {
              this.DiaryPostItem(post)
            }, (post: DiaryPost) => post.id.toString())
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 8, bottom: 8 })
        }
        .width('100%')
        .height(200)
        .scrollBar(BarState.Off)
      }
    } else if (this.activeToolTab === 1) {
      // 背景详细设置
      Column() {
        if (this.activeSubTool === 0) {
          // ===== 纯色 =====
          Scroll() {
            Column({ space: 12 }) {
              Row({ space: 10 }) {
                // 吸色笔
                Column() {
                  Text('吸')
                    .fontSize(14)
                    .fontColor($r('app.color.primary_color'))
                    .fontWeight(FontWeight.Medium)
                }
                .width(36)
                .height(36)
                .borderRadius(18)
                .justifyContent(FlexAlign.Center)
                .backgroundColor('#FFF0E8')
                .border({ width: 1.5, color: $r('app.color.primary_color') })
                .onClick(() => this.startEyedropper(0))

                ForEach(['#FFFFFF', '#F5F5F5', '#FFF8E1', '#E8F5E9', '#E3F2FD', '#FCE4EC',
                         '#F3E5F5', '#E0F7FA', '#FFF3E0', '#EFEBE9', '#333333', '#000000'],
                  (color: string) => {
                    Column()
                      .width(36)
                      .height(36)
                      .backgroundColor(color)
                      .borderRadius(18)
                      .border({ width: this.bgColor === color ? 2 : 0.5, color: this.bgColor === color ? $r('app.color.primary_color') : '#CCCCCC' })
                      .onClick(() => {
                        this.bgColor = color;
                        this.bgType = 'solid';
                        this.applyBgToPlog();
                      })
                  }, (color: string) => color)
              }
              .width('100%')

              Row() {
                Text('色相')
                  .fontSize($r('app.float.font_size_sm'))
                  .fontColor($r('app.color.text_secondary'))
                  .width(40)
                Slider({ value: this.bgHue, min: 0, max: 360, step: 1 })
                  .layoutWeight(1)
                  .selectedColor(this.hslToHex(this.bgHue, this.bgSaturation))
                  .onChange((value: number) => {
                    this.bgHue = value;
                    this.bgColor = this.hslToHex(this.bgHue, this.bgSaturation);
                    this.bgType = 'solid';
                    this.applyBgToPlog();
                  })
                Text(`${Math.round(this.bgHue)}°`)
                  .fontSize($r('app.float.font_size_xs'))
                  .fontColor($r('app.color.text_hint'))
                  .width(36)
              }
              .width('100%')

              Row() {
                Text('饱和度')
                  .fontSize($r('app.float.font_size_sm'))
                  .fontColor($r('app.color.text_secondary'))
                  .width(40)
                Slider({ value: this.bgSaturation, min: 0, max: 100, step: 1 })
                  .layoutWeight(1)
                  .selectedColor(this.hslToHex(this.bgHue, this.bgSaturation))
                  .onChange((value: number) => {
                    this.bgSaturation = value;
                    this.bgColor = this.hslToHex(this.bgHue, this.bgSaturation);
                    this.bgType = 'solid';
                    this.applyBgToPlog();
                  })
                Text(`${Math.round(this.bgSaturation)}%`)
                  .fontSize($r('app.float.font_size_xs'))
                  .fontColor($r('app.color.text_hint'))
                  .width(36)
              }
              .width('100%')

              Row() {
                Text('透明度')
                  .fontSize($r('app.float.font_size_sm'))
                  .fontColor($r('app.color.text_secondary'))
                  .width(40)
                Slider({ value: this.bgOpacity, min: 0, max: 100, step: 1 })
                  .layoutWeight(1)
                  .onChange((value: number) => {
                    this.bgOpacity = value;
                    this.bgType = 'solid';
                    this.applyBgToPlog();
                  })
                Text(`${Math.round(this.bgOpacity)}%`)
                  .fontSize($r('app.float.font_size_xs'))
                  .fontColor($r('app.color.text_hint'))
                  .width(36)
              }
              .width('100%')
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
          }
          .width('100%')
          .height(200)
          .scrollBar(BarState.Off)
        } else if (this.activeSubTool === 1) {
          // ===== 渐变 =====
          Column({ space: 12 }) {
            Scroll() {
              Row({ space: 10 }) {
                ForEach([
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
                ], (colors: string[]) => {
                  Column()
                    .width(64)
                    .height(48)
                    .borderRadius(8)
                    .linearGradient({
                      direction: this.gradientAngleToGradientDirection(),
                      colors: [[colors[0], 0.0], [colors[1], 1.0]]
                    })
                    .border({
                      width: this.gradientColors[0] === colors[0] && this.gradientColors[1] === colors[1] ? 2 : 0,
                      color: $r('app.color.primary_color')
                    })
                    .onClick(() => {
                      this.gradientColors = [colors[0], colors[1]];
                      this.bgType = 'gradient';
                      this.applyBgToPlog();
                    })
                }, (colors: string[]) => colors[0])
              }
              .height(60)
            }
            .width('100%')
            .scrollBar(BarState.Off)
            .scrollable(ScrollDirection.Horizontal)

            Row() {
              Text('方向')
                .fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary'))
                .width(40)
              Slider({ value: this.gradientAngle, min: 0, max: 360, step: 15 })
                .layoutWeight(1)
                .onChange((value: number) => {
                  this.gradientAngle = value;
                  this.bgType = 'gradient';
                  this.applyBgToPlog();
                })
              Text(`${Math.round(this.gradientAngle)}°`)
                .fontSize($r('app.float.font_size_xs'))
                .fontColor($r('app.color.text_hint'))
                .width(36)
            }
            .width('100%')
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 8, bottom: 8 })
        } else if (this.activeSubTool === 2) {
          // ===== 花纹 =====
          Scroll() {
            Column({ space: 12 }) {
              Scroll() {
                Row({ space: 10 }) {
                  ForEach([
                    { type: 'none' as PatternType, label: '无花纹' },
                    { type: 'horizontal' as PatternType, label: '横条纹' },
                    { type: 'vertical' as PatternType, label: '竖条纹' },
                    { type: 'grid' as PatternType, label: '网格' },
                    { type: 'dots' as PatternType, label: '波点' },
                    { type: 'waves' as PatternType, label: '波浪' },
                  ], (item: PatternItem) => {
                    Text(item.label)
                      .fontSize($r('app.float.font_size_sm'))
                      .fontColor(this.patternType === item.type
                        ? $r('app.color.primary_color')
                        : $r('app.color.text_secondary'))
                      .padding({ left: 12, right: 12, top: 8, bottom: 8 })
                      .borderRadius(16)
                      .backgroundColor(this.patternType === item.type ? '#FFF0E8' : '#F5F5F5')
                      .border({
                        width: this.patternType === item.type ? 1.5 : 0,
                        color: $r('app.color.primary_color')
                      })
                      .onClick(() => {
                        this.patternType = item.type;
                        if (item.type === 'none') {
                          this.hasPattern = false;
                        } else {
                          this.hasPattern = true;
                        }
                        this.applyBgToPlog();
                      })
                  }, (item: PatternItem) => item.type)
                }
              }
              .width('100%')
              .scrollBar(BarState.Off)
              .scrollable(ScrollDirection.Horizontal)

              Row() {
                Text('粗细')
                  .fontSize($r('app.float.font_size_sm'))
                  .fontColor($r('app.color.text_secondary'))
                  .width(40)
                Slider({ value: this.patternThickness, min: 1, max: 10, step: 1 })
                  .layoutWeight(1)
                  .onChange((value: number) => {
                    this.patternThickness = value;
                    this.hasPattern = true;
                    this.applyBgToPlog();
                  })
                Text(`${Math.round(this.patternThickness)}`)
                  .fontSize($r('app.float.font_size_xs'))
                  .fontColor($r('app.color.text_hint'))
                  .width(36)
              }
              .width('100%')

              Row() {
                Text('间隔')
                  .fontSize($r('app.float.font_size_sm'))
                  .fontColor($r('app.color.text_secondary'))
                  .width(40)
                Slider({ value: this.patternSpacing, min: 5, max: 50, step: 1 })
                  .layoutWeight(1)
                  .onChange((value: number) => {
                    this.patternSpacing = value;
                    this.hasPattern = true;
                    this.applyBgToPlog();
                  })
                Text(`${Math.round(this.patternSpacing)}`)
                  .fontSize($r('app.float.font_size_xs'))
                  .fontColor($r('app.color.text_hint'))
                  .width(36)
              }
              .width('100%')

              // --- 花纹颜色 ---
              Divider().color('#EEEEEE')
              Text('花纹颜色')
                .fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary'))
                .width('100%')
                .margin({ top: 4 })

              Row({ space: 10 }) {
                // 吸色笔
                Column() {
                  Text('吸')
                    .fontSize(14)
                    .fontColor($r('app.color.primary_color'))
                    .fontWeight(FontWeight.Medium)
                }
                .width(36)
                .height(36)
                .borderRadius(18)
                .justifyContent(FlexAlign.Center)
                .backgroundColor('#FFF0E8')
                .border({ width: 1.5, color: $r('app.color.primary_color') })
                .onClick(() => this.startEyedropper(1))

                ForEach(['#E0E0E0', '#FFFFFF', '#000000', '#FFB6C1', '#FFD700', '#87CEEB',
                         '#98FB98', '#DDA0DD', '#F0E68C', '#FFA07A', '#B0C4DE', '#FF6B6B'],
                  (color: string) => {
                    Column()
                      .width(36)
                      .height(36)
                      .backgroundColor(color)
                      .borderRadius(18)
                      .border({ width: this.patternColor === color ? 2 : 0.5, color: this.patternColor === color ? $r('app.color.primary_color') : '#CCCCCC' })
                      .onClick(() => {
                        this.patternColor = color;
                        this.applyBgToPlog();
                      })
                  }, (color: string) => color)
              }
              .width('100%')

              Row() {
                Text('色相')
                  .fontSize($r('app.float.font_size_sm'))
                  .fontColor($r('app.color.text_secondary'))
                  .width(40)
                Slider({ value: this.patternHue, min: 0, max: 360, step: 1 })
                  .layoutWeight(1)
                  .selectedColor(this.hslToHex(this.patternHue, this.patternSaturation))
                  .onChange((value: number) => {
                    this.patternHue = value;
                    this.patternColor = this.hslToHex(this.patternHue, this.patternSaturation);
                    this.applyBgToPlog();
                  })
                Text(`${Math.round(this.patternHue)}°`)
                  .fontSize($r('app.float.font_size_xs'))
                  .fontColor($r('app.color.text_hint'))
                  .width(36)
              }
              .width('100%')

              Row() {
                Text('饱和度')
                  .fontSize($r('app.float.font_size_sm'))
                  .fontColor($r('app.color.text_secondary'))
                  .width(40)
                Slider({ value: this.patternSaturation, min: 0, max: 100, step: 1 })
                  .layoutWeight(1)
                  .selectedColor(this.hslToHex(this.patternHue, this.patternSaturation))
                  .onChange((value: number) => {
                    this.patternSaturation = value;
                    this.patternColor = this.hslToHex(this.patternHue, this.patternSaturation);
                    this.applyBgToPlog();
                  })
                Text(`${Math.round(this.patternSaturation)}%`)
                  .fontSize($r('app.float.font_size_xs'))
                  .fontColor($r('app.color.text_hint'))
                  .width(36)
              }
              .width('100%')
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
          }
          .width('100%')
          .height(320)
          .scrollBar(BarState.Off)
        } else if (this.activeSubTool === 3) {
          // ===== 自定义 =====
          Column({ space: 12 }) {
            Row() {
              Text('从相册选择背景图')
                .fontSize($r('app.float.font_size_base'))
                .fontColor($r('app.color.primary_color'))
            }
            .width('100%')
            .height(48)
            .justifyContent(FlexAlign.Center)
            .borderRadius(10)
            .border({ width: 1, color: $r('app.color.primary_color') })
            .onClick(() => this.pickCustomBg())

            if (this.customBgUri) {
              Image(this.customBgUri)
                .width(80)
                .height(80)
                .borderRadius(8)
                .objectFit(ImageFit.Cover)
                .margin({ top: 8 })
            }
          }
          .width('100%')
          .height(160)
          .justifyContent(FlexAlign.Center)
          .padding({ left: 16, right: 16 })
        }
      }
      .width('100%')
      .transition(TransitionEffect.OPACITY.animation({ duration: 180, curve: Curve.EaseOut }))
    } else if (this.activeToolTab === 2) {
      // 文字详细设置（根据子工具切换）
      Scroll() {
        Column() {
          // 顶部：添加新文字
          Row({ space: 10 }) {
            TextInput({ placeholder: '输入文字内容', text: this.newTextContent })
              .fontSize(14)
              .layoutWeight(1)
              .height(40)
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
              .padding({ left: 12, right: 12 })
              .onChange((value: string) => {
                this.newTextContent = value;
              })
            Text('+')
              .fontSize(24)
              .fontColor(Color.White)
              .fontWeight(FontWeight.Bold)
              .width(40)
              .height(40)
              .textAlign(TextAlign.Center)
              .backgroundColor($r('app.color.primary_color'))
              .borderRadius(20)
              .onClick(() => {
                if (this.newTextContent.trim()) {
                  this.addTextElement(this.newTextContent.trim());
                  this.newTextContent = '';
                }
              })
          }
          .width('100%')
          .alignItems(VerticalAlign.Center)
          .margin({ bottom: 16 })

          if (this.activeSubTool === 0) {
            // ===== 样式 =====
            // 风格选择（标签与选项同一行，横向滚动）
            Row({ space: 8 }) {
              Text('风格')
                .fontSize(13)
                .fontColor($r('app.color.text_secondary'))
              Scroll() {
                Row({ space: 8 }) {
                  ForEach([
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
                  ], (item: FontStyleItem) => {
                    Column() {
                      Text(item.label)
                        .fontSize(item.style === 'pacifico' || item.style === 'dancing' || item.style === 'lobster' || item.style === 'greatvibes' || item.style === 'caveat' ? 9 : 12)
                        .fontColor(this.textFontStyle === item.style
                          ? $r('app.color.primary_color')
                          : $r('app.color.text_primary'))
                        .fontWeight(this.textFontStyle === item.style ? FontWeight.Medium : FontWeight.Normal)
                        .fontFamily(this.fontStyleMap[item.style] || undefined)
                    }
                    .width(item.style === 'greatvibes' ? 72 : 52)
                    .height(36)
                    .justifyContent(FlexAlign.Center)
                    .backgroundColor(this.textFontStyle === item.style ? '#FFF0E8' : '#F5F5F5')
                    .borderRadius(18)
                    .border({
                      width: this.textFontStyle === item.style ? 1.5 : 0,
                      color: $r('app.color.primary_color')
                    })
                    .onClick(() => {
                      this.textFontStyle = item.style;
                      this.applyTextPropsToSelected();
                    })
                  }, (item: FontStyleItem) => item.style)
                }
              }
              .layoutWeight(1)
              .scrollBar(BarState.Off)
              .scrollable(ScrollDirection.Horizontal)
            }
            .width('100%')
            .justifyContent(FlexAlign.Center)
            .alignItems(VerticalAlign.Center)
            .margin({ bottom: 12 })

            // 大小
            Row() {
              Text('大小')
                .fontSize(13)
                .fontColor($r('app.color.text_secondary'))
                .width(40)
              Slider({ value: this.textFontSize, min: 8, max: 72, step: 1 })
                .layoutWeight(1)
                .onChange((value: number) => {
                  this.textFontSize = value;
                  this.applyTextPropsToSelected();
                })
              Text(`${Math.round(this.textFontSize)}`)
                .fontSize($r('app.float.font_size_xs'))
                .fontColor($r('app.color.text_hint'))
                .width(28)
            }
            .width('100%')
            .margin({ bottom: 12 })

            // 阴影透明度
            Row() {
              Text('阴影')
                .fontSize(13)
                .fontColor($r('app.color.text_secondary'))
                .width(40)
              Slider({ value: this.textShadowOpacity, min: 0, max: 100, step: 1 })
                .layoutWeight(1)
                .onChange((value: number) => {
                  this.textShadowOpacity = value;
                  this.applyTextPropsToSelected();
                })
              Text(`${Math.round(this.textShadowOpacity)}%`)
                .fontSize($r('app.float.font_size_xs'))
                .fontColor($r('app.color.text_hint'))
                .width(36)
            }
            .width('100%')

          } else if (this.activeSubTool === 1) {
            // ===== 颜色 =====（参照背景纯色设置）
            Scroll() {
              Column({ space: 12 }) {
                Row({ space: 10 }) {
                  // 吸色笔
                  Column() {
                    Text('吸')
                      .fontSize(14)
                      .fontColor($r('app.color.primary_color'))
                      .fontWeight(FontWeight.Medium)
                  }
                  .width(36)
                  .height(36)
                  .borderRadius(18)
                  .justifyContent(FlexAlign.Center)
                  .backgroundColor('#FFF0E8')
                  .border({ width: 1.5, color: $r('app.color.primary_color') })
                  .onClick(() => this.startEyedropper(2))

                  ForEach(['#333333', '#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1',
                    '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF8A65', '#64B5F6', '#81C784'],
                    (color: string) => {
                      Column()
                        .width(32)
                        .height(32)
                        .backgroundColor(color)
                        .borderRadius(16)
                        .border({
                          width: this.textColor === color ? 2 : 0.5,
                          color: this.textColor === color ? $r('app.color.primary_color') : '#CCCCCC'
                        })
                        .onClick(() => {
                          this.textColor = color;
                          this.applyTextPropsToSelected();
                        })
                    }, (color: string) => color)
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)

                Row() {
                  Text('色相')
                    .fontSize($r('app.float.font_size_sm'))
                    .fontColor($r('app.color.text_secondary'))
                    .width(40)
                  Slider({ value: this.textColorHue, min: 0, max: 360, step: 1 })
                    .layoutWeight(1)
                    .selectedColor(this.hslToHex(this.textColorHue, this.textColorSaturation))
                    .onChange((value: number) => {
                      this.textColorHue = value;
                      this.textColor = this.hslToHex(this.textColorHue, this.textColorSaturation);
                      this.applyTextPropsToSelected();
                    })
                  Text(`${Math.round(this.textColorHue)}°`)
                    .fontSize($r('app.float.font_size_xs'))
                    .fontColor($r('app.color.text_hint'))
                    .width(36)
                }
                .width('100%')

                Row() {
                  Text('饱和度')
                    .fontSize($r('app.float.font_size_sm'))
                    .fontColor($r('app.color.text_secondary'))
                    .width(40)
                  Slider({ value: this.textColorSaturation, min: 0, max: 100, step: 1 })
                    .layoutWeight(1)
                    .selectedColor(this.hslToHex(this.textColorHue, this.textColorSaturation))
                    .onChange((value: number) => {
                      this.textColorSaturation = value;
                      this.textColor = this.hslToHex(this.textColorHue, this.textColorSaturation);
                      this.applyTextPropsToSelected();
                    })
                  Text(`${Math.round(this.textColorSaturation)}%`)
                    .fontSize($r('app.float.font_size_xs'))
                    .fontColor($r('app.color.text_hint'))
                    .width(36)
                }
                .width('100%')

                Row() {
                  Text('透明度')
                    .fontSize($r('app.float.font_size_sm'))
                    .fontColor($r('app.color.text_secondary'))
                    .width(40)
                  Slider({ value: this.textOpacity, min: 0, max: 100, step: 1 })
                    .layoutWeight(1)
                    .onChange((value: number) => {
                      this.textOpacity = value;
                      this.applyTextPropsToSelected();
                    })
                  Text(`${Math.round(this.textOpacity)}%`)
                    .fontSize($r('app.float.font_size_xs'))
                    .fontColor($r('app.color.text_hint'))
                    .width(36)
                }
                .width('100%')
              }
              .width('100%')
              .padding({ left: 16, right: 16, top: 8, bottom: 8 })
            }
            .width('100%')
            .scrollBar(BarState.Off)

          } else if (this.activeSubTool === 2) {
            // ===== 排版 =====
            Row({ space: 12 }) {
              // 横竖切换
              Row({ space: 0 }) {
                Column() {
                  Text('横')
                    .fontSize(13)
                    .fontColor(this.textDirection === 'horizontal' ? Color.White : '#666666')
                    .fontWeight(FontWeight.Medium)
                }
                .width(36)
                .height(28)
                .justifyContent(FlexAlign.Center)
                .backgroundColor(this.textDirection === 'horizontal' ? $r('app.color.primary_color') : 'transparent')
                .borderRadius(14)
                .onClick(() => {
                  this.textDirection = 'horizontal';
                  this.applyTextPropsToSelected();
                })

                Column() {
                  Text('竖')
                    .fontSize(13)
                    .fontColor(this.textDirection === 'vertical' ? Color.White : '#666666')
                    .fontWeight(FontWeight.Medium)
                }
                .width(36)
                .height(28)
                .justifyContent(FlexAlign.Center)
                .backgroundColor(this.textDirection === 'vertical' ? $r('app.color.primary_color') : 'transparent')
                .borderRadius(14)
                .onClick(() => {
                  this.textDirection = 'vertical';
                  this.applyTextPropsToSelected();
                })
              }
              .width(72)
              .height(32)
              .backgroundColor('#F0F0F0')
              .borderRadius(16)

              // 对齐方式
              if (this.textDirection === 'horizontal') {
                Row({ space: 6 }) {
                  ForEach([
                    { align: TextAlign.Start, label: '左对齐' },
                    { align: TextAlign.Center, label: '居中' },
                    { align: TextAlign.End, label: '右对齐' },
                  ], (item: TextAlignItem) => {
                    Column() {
                      Text(item.label)
                        .fontSize(12)
                        .fontColor(this.textAlign === item.align
                          ? $r('app.color.primary_color')
                          : $r('app.color.text_primary'))
                    }
                    .layoutWeight(1)
                    .height(32)
                    .justifyContent(FlexAlign.Center)
                    .backgroundColor(this.textAlign === item.align ? '#FFF0E8' : '#F5F5F5')
                    .borderRadius(16)
                    .border({
                      width: this.textAlign === item.align ? 1.5 : 0,
                      color: $r('app.color.primary_color')
                    })
                    .onClick(() => {
                      this.textAlign = item.align;
                      this.applyTextPropsToSelected();
                    })
                  }, (item: TextAlignItem) => item.label)
                }
                .layoutWeight(1)
                .height(32)
              } else {
                Row({ space: 6 }) {
                  ForEach([
                    { va: 0, label: '上对齐' },
                    { va: 1, label: '居中' },
                    { va: 2, label: '下对齐' },
                  ], (item: VerticalAlignItem) => {
                    Column() {
                      Text(item.label)
                        .fontSize(12)
                        .fontColor(this.textVerticalAlign === item.va
                          ? $r('app.color.primary_color')
                          : $r('app.color.text_primary'))
                    }
                    .layoutWeight(1)
                    .height(32)
                    .justifyContent(FlexAlign.Center)
                    .backgroundColor(this.textVerticalAlign === item.va ? '#FFF0E8' : '#F5F5F5')
                    .borderRadius(16)
                    .border({
                      width: this.textVerticalAlign === item.va ? 1.5 : 0,
                      color: $r('app.color.primary_color')
                    })
                    .onClick(() => {
                      this.textVerticalAlign = item.va;
                      this.applyTextPropsToSelected();
                    })
                  }, (item: VerticalAlignItem) => item.label)
                }
                .layoutWeight(1)
                .height(32)
              }
            }
            .width('100%')
            .alignItems(VerticalAlign.Center)
            .padding(16)
            .backgroundColor(Color.White)
            .borderRadius(12)
            .margin({ bottom: 12 })

            // 间距设置
            Column({ space: 12 }) {
              Row() {
                Text(this.textDirection === 'vertical' ? '字距' : '行距')
                  .fontSize(13)
                  .fontColor($r('app.color.text_secondary'))
                  .width(40)
                Slider({ value: this.textLineSpacing, min: 1, max: 3, step: 0.1 })
                  .layoutWeight(1)
                  .onChange((value: number) => {
                    this.textLineSpacing = value;
                    this.applyTextPropsToSelected();
                  })
                Text(`${this.textLineSpacing.toFixed(1)}`)
                  .fontSize($r('app.float.font_size_xs'))
                  .fontColor($r('app.color.text_hint'))
                  .width(32)
              }
              .width('100%')

              Row() {
                Text(this.textDirection === 'vertical' ? '行距' : '字距')
                  .fontSize(13)
                  .fontColor($r('app.color.text_secondary'))
                  .width(40)
                Slider({ value: this.textLetterSpacing, min: 0, max: 20, step: 0.5 })
                  .layoutWeight(1)
                  .onChange((value: number) => {
                    this.textLetterSpacing = value;
                    this.applyTextPropsToSelected();
                  })
                Text(`${this.textLetterSpacing.toFixed(1)}`)
                  .fontSize($r('app.float.font_size_xs'))
                  .fontColor($r('app.color.text_hint'))
                  .width(32)
              }
              .width('100%')
            }
            .width('100%')
            .padding(16)
            .backgroundColor(Color.White)
            .borderRadius(12)

          } else if (this.activeSubTool === 3) {
            // ===== 粗斜体 =====
            // 粗体（标签居左，选项居中）
            Row() {
              Text('粗体')
                .fontSize(13)
                .fontColor($r('app.color.text_secondary'))
                .width(40)
              Row({ space: 8 }) {
                ForEach([
                  { w: 100, label: '细体' },
                  { w: 400, label: '常规' },
                  { w: 700, label: '粗体' },
                  { w: 900, label: '特粗' },
                ], (item: FontWeightItem) => {
                  Column() {
                    Text(item.label)
                      .fontSize(13)
                      .fontWeight(item.w)
                      .fontColor(this.textFontWeight === item.w
                        ? $r('app.color.primary_color')
                        : $r('app.color.text_primary'))
                  }
                  .padding({ left: 14, right: 14, top: 6, bottom: 6 })
                  .backgroundColor(this.textFontWeight === item.w ? '#FFF0E8' : '#F5F5F5')
                  .borderRadius(16)
                  .border({
                    width: this.textFontWeight === item.w ? 1.5 : 0,
                    color: $r('app.color.primary_color')
                  })
                  .onClick(() => {
                    this.textFontWeight = item.w;
                    this.applyTextPropsToSelected();
                  })
                }, (item: FontWeightItem) => item.w.toString())
              }
              .layoutWeight(1)
              .justifyContent(FlexAlign.Center)
            }
            .width('100%')
            .justifyContent(FlexAlign.Start)
            .alignItems(VerticalAlign.Center)
            .margin({ bottom: 12 })

            // 字体粗细微调
            Row() {
              Text('粗细')
                .fontSize(13)
                .fontColor($r('app.color.text_secondary'))
                .width(40)
              Slider({ value: this.textFontWeight, min: 100, max: 900, step: 100 })
                .layoutWeight(1)
                .onChange((value: number) => {
                  this.textFontWeight = value;
                  this.applyTextPropsToSelected();
                })
              Text(`${Math.round(this.textFontWeight)}`)
                .fontSize($r('app.float.font_size_xs'))
                .fontColor($r('app.color.text_hint'))
                .width(32)
            }
            .width('100%')
            .margin({ bottom: 12 })

            // 斜体角度（斜体+角度 合并为一行）
            Row() {
              Text('斜体角度')
                .fontSize(13)
                .fontColor($r('app.color.text_secondary'))
                .width(56)
              Slider({ value: this.textItalicAngle, min: -30, max: 30, step: 1 })
                .layoutWeight(1)
                .onChange((value: number) => {
                  this.textItalicAngle = value;
                  this.applyTextPropsToSelected();
                })
              Text(`${Math.round(this.textItalicAngle)}°`)
                .fontSize($r('app.float.font_size_xs'))
                .fontColor($r('app.color.text_hint'))
                .width(36)
            }
            .width('100%')

          }
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 8, bottom: 8 })
      }
      .width('100%')
      .constraintSize({ minHeight: 120, maxHeight: 300 })
      .scrollBar(BarState.Off)
      .transition(TransitionEffect.OPACITY.animation({ duration: 180, curve: Curve.EaseOut }))
    } else if (this.activeToolTab === 3) {
      // 贴纸详细设置
      Grid() {
        // + 号按钮：从相册添加图片贴纸
        GridItem() {
          Column() {
            Text('+')
              .fontSize(28)
              .fontColor('#999999')
              .fontWeight(FontWeight.Bold)
          }
          .width('100%')
          .height('100%')
          .justifyContent(FlexAlign.Center)
          .borderWidth(2)
          .borderStyle(BorderStyle.Dashed)
          .borderColor('#CCCCCC')
          .borderRadius(8)
          .onClick(() => {
            this.pickStickerFromAlbum();
          })
        }
        .width(52)
        .height(52)

        ForEach(['⭐', '❤️', '🌸', '🎀', '✨', '🌈', '🌟', '💎', '🍀', '🦋', '🌙', '🎈',
          '🌻', '🎶', '🦊', '🐱', '🐶', '🐻', '🍬', '🎨', '📖', '💡', '🔥', '☕',
          '🎀', '💝', '🏡', '🌴', '🍄', '🐰', '🧸', '🍰', '🪄', '🎊', '💖', '⛅'], (sticker: string) => {
          GridItem() {
            Column() {
              Text(sticker)
                .fontSize(28)
            }
            .width('100%')
            .height('100%')
            .justifyContent(FlexAlign.Center)
          }
          .width(52)
          .height(52)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .onClick(() => {
            this.addSticker(sticker);
            promptAction.showToast({ message: '已添加贴纸' });
          })
        })
      }
      .columnsTemplate('1fr 1fr 1fr 1fr')
      .rowsGap(8)
      .columnsGap(8)
      .width('100%')
      .height(220)
      .padding({ left: 16, right: 16, top: 8, bottom: 8 })
    } else if (this.activeToolTab === 4) {
      // 画笔详细设置
      Scroll() {
        Column({ space: 12 }) {
          // 横向滚动画笔选择
          Scroll() {
            Row({ space: 8 }) {
              ForEach([
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
              ], (item: Record<string, Object>) => {
                Text(item.label as string)
                  .fontSize(13)
                  .fontColor(this.brushType === (item.type as number)
                    ? $r('app.color.primary_color')
                    : $r('app.color.text_hint'))
                  .fontWeight(this.brushType === (item.type as number) ? FontWeight.Medium : FontWeight.Normal)
                  .padding({ left: 10, right: 10, top: 8, bottom: 8 })
                  .backgroundColor(this.brushType === (item.type as number) ? '#FFF0E8' : '#F5F5F5')
                  .borderRadius(16)
                  .border({
                    width: this.brushType === (item.type as number) ? 1.5 : 0,
                    color: $r('app.color.primary_color')
                  })
                  .onClick(() => {
                    this.brushType = item.type as number;
                  })
              }, (item: Record<string, Object>) => (item.type as number).toString())
            }
            .padding({ left: 4, right: 4 })
          }
          .scrollable(ScrollDirection.Horizontal)
          .scrollBar(BarState.Off)
          .width('100%')

          // 分割线
          Divider().color('#EEEEEE')

          // 颜色选择（橡皮不显示）
          if (this.brushType !== 0) {
            Row({ space: 10 }) {
              // 吸色笔
              Column() {
                Text('吸')
                  .fontSize(14)
                  .fontColor($r('app.color.primary_color'))
                  .fontWeight(FontWeight.Medium)
              }
              .width(36)
              .height(36)
              .borderRadius(18)
              .justifyContent(FlexAlign.Center)
              .backgroundColor('#FFF0E8')
              .border({ width: 1.5, color: $r('app.color.primary_color') })
              .onClick(() => this.startEyedropper(3))

              ForEach(['#333333', '#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1',
                '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF8A65', '#64B5F6', '#81C784'],
                (color: string) => {
                  Column()
                    .width(32)
                    .height(32)
                    .backgroundColor(color)
                    .borderRadius(16)
                    .border({
                      width: this.brushColor === color ? 2 : 0.5,
                      color: this.brushColor === color ? $r('app.color.primary_color') : '#CCCCCC'
                    })
                    .onClick(() => {
                      this.brushColor = color;
                    })
                }, (color: string) => color)
            }
            .width('100%')
            .justifyContent(FlexAlign.Center)

            // 色相滑块
            Row() {
              Text('色相')
                .fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary'))
                .width(40)
              Slider({ value: this.brushColorHue, min: 0, max: 360, step: 1 })
                .layoutWeight(1)
                .selectedColor(this.hslToHex(this.brushColorHue, this.brushColorSaturation))
                .onChange((value: number) => {
                  this.brushColorHue = value;
                  this.brushColor = this.hslToHex(this.brushColorHue, this.brushColorSaturation);
                })
              Text(`${Math.round(this.brushColorHue)}°`)
                .fontSize($r('app.float.font_size_xs'))
                .fontColor($r('app.color.text_hint'))
                .width(36)
            }
            .width('100%')

            // 饱和度滑块
            Row() {
              Text('饱和度')
                .fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary'))
                .width(40)
              Slider({ value: this.brushColorSaturation, min: 0, max: 100, step: 1 })
                .layoutWeight(1)
                .selectedColor(this.hslToHex(this.brushColorHue, this.brushColorSaturation))
                .onChange((value: number) => {
                  this.brushColorSaturation = value;
                  this.brushColor = this.hslToHex(this.brushColorHue, this.brushColorSaturation);
                })
              Text(`${Math.round(this.brushColorSaturation)}%`)
                .fontSize($r('app.float.font_size_xs'))
                .fontColor($r('app.color.text_hint'))
                .width(36)
            }
            .width('100%')
          }

          // 粗细滑块
          Row() {
            Text('粗细')
              .fontSize($r('app.float.font_size_sm'))
              .fontColor($r('app.color.text_secondary'))
              .width(40)
            Slider({ value: this.brushThickness, min: 1, max: 50, step: 1 })
              .layoutWeight(1)
              .selectedColor($r('app.color.primary_color'))
              .onChange((value: number) => {
                this.brushThickness = value;
              })
            Text(`${Math.round(this.brushThickness)}`)
              .fontSize($r('app.float.font_size_xs'))
              .fontColor($r('app.color.text_hint'))
              .width(36)
          }
          .width('100%')

          // 透明度滑块（橡皮不显示）
          if (this.brushType !== 0) {
            Row() {
              Text('透明度')
                .fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary'))
                .width(40)
              Slider({ value: this.brushOpacity, min: 0, max: 100, step: 1 })
                .layoutWeight(1)
                .onChange((value: number) => {
                  this.brushOpacity = value;
                })
              Text(`${Math.round(this.brushOpacity)}%`)
                .fontSize($r('app.float.font_size_xs'))
                .fontColor($r('app.color.text_hint'))
                .width(36)
            }
            .width('100%')
          }


        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 8, bottom: 8 })
      }
      .width('100%')
      .scrollBar(BarState.Off)
    }
  }

  @Builder
  DiaryPostItem(post: DiaryPost) {
    Row() {
      // 图片缩略图
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        Image(post.mediaUrls[0])
          .width(50)
          .height(50)
          .borderRadius(6)
          .objectFit(ImageFit.Cover)
          .margin({ right: 10 })
      } else {
        Column()
          .width(50)
          .height(50)
          .borderRadius(6)
          .backgroundColor('#F0F0F0')
          .margin({ right: 10 })
      }

      Column() {
        Text(post.content || '')
          .fontSize($r('app.float.font_size_base'))
          .fontColor($r('app.color.text_primary'))
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')

        Text(DateUtils.formatTime(post.timestamp))
          .fontSize($r('app.float.font_size_xs'))
          .fontColor($r('app.color.text_hint'))
          .margin({ top: 4 })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)

      Column() {
        Text('＋')
          .fontSize(18)
          .fontColor($r('app.color.primary_color'))
          .fontWeight(FontWeight.Medium)
      }
      .width(32)
      .height(32)
      .justifyContent(FlexAlign.Center)
      .border({
        width: 1.5,
        color: $r('app.color.primary_color'),
        style: BorderStyle.Dashed
      })
      .borderRadius(4)
      .onClick(() => this.addDiaryToCanvas(post))
    }
    .width('100%')
    .padding(12)
    .backgroundColor($r('app.color.card_background'))
    .borderRadius($r('app.float.border_radius_md'))
    .margin({ bottom: 8 })
  }

  build() {
    Stack({ alignContent: Alignment.Bottom }) {
      Column() {
        // 顶部栏
        Row() {
          Button() {
            SymbolGlyph($r('sys.symbol.chevron_left'))
              .fontSize(20)
              .fontColor([$r('app.color.text_primary')])
          }
          .width(40)
          .height(40)
          .backgroundColor(Color.Transparent)
          .onClick(() => this.navigateBack())

          Blank()

          // 撤销/重做按钮组
          Row({ space: 4 }) {
            Button() {
              SymbolGlyph($r('sys.symbol.arrow_counterclockwise'))
                .fontSize(18)
                .fontColor([this.historyIndex > 0
                  ? $r('app.color.text_primary')
                  : $r('app.color.text_hint')])
            }
            .width(36)
            .height(36)
            .backgroundColor(Color.Transparent)
            .enabled(this.historyIndex > 0)
            .onClick(() => this.undo())

            Button() {
              SymbolGlyph($r('sys.symbol.arrow_clockwise'))
                .fontSize(18)
                .fontColor([this.historyIndex < this.historyStack.length - 1
                  ? $r('app.color.text_primary')
                  : $r('app.color.text_hint')])
            }
            .width(36)
            .height(36)
            .backgroundColor(Color.Transparent)
            .enabled(this.historyIndex < this.historyStack.length - 1)
            .onClick(() => this.redo())
          }

          Blank()

          Button('保存')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.primary_color'))
            .backgroundColor(Color.Transparent)
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
            .onClick(() => this.savePlog())
        }
        .width('100%')
        .height(48)
        .padding({ left: 12, right: 16 })
        .alignItems(VerticalAlign.Center)

        // 画布区域（铺满剩余空间）
        Stack() {
          // 画布内容层（可缩放和平移）
          Stack() {
            // 画布底色
            if (this.bgType === 'custom' && this.customBgUri) {
            Image(this.customBgUri)
              .width('100%')
              .height('100%')
              .objectFit(ImageFit.Cover)
          } else if (this.bgType === 'gradient' && this.gradientColors.length >= 2) {
            Column()
              .width('100%')
              .height('100%')
              .linearGradient({
                direction: this.gradientAngleToGradientDirection(),
                colors: this.gradientColors.map((c: string, i: number) =>
                  [c, i / (this.gradientColors.length - 1)] as [ResourceColor, number])
              })
          } else if (this.bgType === 'solid') {
            Column()
              .width('100%')
              .height('100%')
              .backgroundColor(this.bgColor || '#FFFFFF')
              .opacity(this.bgOpacity / 100)
          } else {
            Column()
              .width('100%')
              .height('100%')
              .backgroundColor(Color.White)
          }

          // 花纹叠加层
          if (this.hasPattern && this.patternType !== 'none') {
            Canvas(this.patternCanvasContext)
              .width('100%')
              .height('100%')
              .onReady(() => {
                this.drawPatternBg();
              })
          }

          // 画布元素
          ForEach(this.elements, (element: CanvasElement, index: number) => {
            if (element.type === 'image' || element.type === 'sticker') {
              Stack() {
                // 区分：图片路径用 Image，emoji 贴纸用 Text
                if (element.content.startsWith('file://') || element.content.startsWith('content://') ||
                  element.content.startsWith('http') || element.content.startsWith('/')) {
                  Image(element.content)
                    .width('100%')
                    .height('100%')
                    .objectFit(ImageFit.Contain)
                } else {
                  Text(element.content)
                    .fontSize(Math.min(element.width, element.height) * 0.7)
                    .width('100%')
                    .height('100%')
                    .textAlign(TextAlign.Center)
                }

                // 选中时的边框（白色虚线）
                if (this.selectedElementIndex === index) {
                  Column()
                    .width('100%')
                    .height('100%')
                    .border({
                      width: 3,
                      color: Color.White,
                      style: BorderStyle.Dashed
                    })
                    .borderRadius(4)
                    .hitTestBehavior(HitTestMode.None)
                }

                // 选中时的控制按钮
                if (this.selectedElementIndex === index) {
                  // 删除按钮（右上角）×
                  Column() {
                    Text('×')
                      .fontSize(14)
                      .fontColor('#333333')
                      .fontWeight(FontWeight.Bold)
                      .textAlign(TextAlign.Center)
                  }
                  .width(22)
                  .height(22)
                  .backgroundColor(Color.White)
                  .borderRadius(11)
                  .position({ x: this.elements[index].width - 11, y: -11 })
                  .justifyContent(FlexAlign.Center)
                  .zIndex(100)
                  .onClick(() => {
                    this.deleteElement(index);
                  })

                  // 复制按钮（左下角）+1
                  Column() {
                    Text('+1')
                      .fontSize(9)
                      .fontColor('#333333')
                      .fontWeight(FontWeight.Bold)
                      .textAlign(TextAlign.Center)
                  }
                  .width(22)
                  .height(22)
                  .backgroundColor(Color.White)
                  .borderRadius(11)
                  .position({ x: -11, y: this.elements[index].height - 11 })
                  .justifyContent(FlexAlign.Center)
                  .zIndex(100)
                  .onClick(() => {
                    this.duplicateElement(index);
                  })

                  // 缩放手柄（右下角）↻
                  Column() {
                    Text('↻')
                      .fontSize(14)
                      .fontColor('#333333')
                      .fontWeight(FontWeight.Bold)
                      .textAlign(TextAlign.Center)
                  }
                  .width(22)
                  .height(22)
                  .backgroundColor(Color.White)
                  .borderRadius(11)
                  .position({ x: this.elements[index].width - 11, y: this.elements[index].height - 11 })
                  .justifyContent(FlexAlign.Center)
                  .zIndex(100)
                  .gesture(
                    PanGesture()
                      .onActionStart(() => {
                        this.resizeStartWidth = this.elements[index].width;
                        this.resizeStartHeight = this.elements[index].height;
                      })
                      .onActionUpdate((event: GestureEvent) => {
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
                      })
                      .onActionEnd(() => {
                        this.elements = [...this.elements];
                      })
                  )
                }
              }
              .position({ x: this.elements[index].x, y: this.elements[index].y })
              .width(this.elements[index].width)
              .height(this.elements[index].height)
              .zIndex(element.zIndex)
              .rotate({ angle: element.rotation })
              .gesture(
                GestureGroup(GestureMode.Exclusive,
                  PanGesture({ fingers: 1, distance: 5 })
                    .onActionStart(() => {
                      this.dragStartX = this.elements[index].x;
                      this.dragStartY = this.elements[index].y;
                      this.selectedElementIndex = index;
                    })
                    .onActionUpdate((event: GestureEvent) => {
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
                    })
                    .onActionEnd(() => {
                      this.elements = [...this.elements];
                    }),
                  TapGesture({ count: 1 })
                    .onAction(() => {
                      this.selectedElementIndex = index;
                    })
                )
              )
            } else if (element.type === 'text') {
              Stack() {
                if (this.editingTextIndex === index) {
                  // 编辑模式
                  Column() {
                    TextInput({ text: this.editingTextValue })
                      .fontSize(element.fontSize || 14)
                      .fontColor(element.color || '#333333')
                      .fontWeight(element.fontWeight ?? 400)
                      .fontFamily(element.fontFamily || undefined)
                      .opacity((element.textOpacity ?? 100) / 100)
                      .backgroundColor(Color.Transparent)
                      .width('100%')
                      .padding({ left: 12, right: 12, top: 8, bottom: 8 })
                      .textAlign(element.textAlign ?? TextAlign.Center)
                      .onChange((value: string) => {
                        this.editingTextValue = value;
                      })
                      .onBlur(() => {
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
                      })
                  }
                  .width('100%')
                  .height('100%')
                  .justifyContent(
                    element.textDirection === 'vertical'
                      ? (element.verticalAlign === 0 ? FlexAlign.Start : element.verticalAlign === 2 ? FlexAlign.End : FlexAlign.Center)
                      : FlexAlign.Center
                  )
                } else {
                  // 普通模式
                  Column() {
                    Text(element.textDirection === 'vertical' ? element.content.split('').join('\n') : element.content)
                      .fontSize(element.fontSize || 14)
                      .fontColor(element.color || '#333333')
                      .fontWeight(element.fontWeight ?? 400)
                      .fontFamily(element.fontFamily || undefined)
                      .textAlign(element.textAlign ?? TextAlign.Center)
                      .maxLines(50)
                      .textOverflow({ overflow: TextOverflow.Clip })
                      .letterSpacing(element.letterSpacing ?? 0)
                      .lineHeight(element.textDirection === 'vertical'
                        ? (element.fontSize ?? 14) + (element.letterSpacing ?? 0)
                        : (element.fontSize ?? 14) * (element.lineSpacing ?? 1.2))
                      .textShadow({
                        radius: (element.shadowOpacity ?? 0) > 0 ? 2 : 0,
                        color: (element.shadowOpacity ?? 0) > 0
                          ? `rgba(0,0,0,${Math.max(0.15, (element.shadowOpacity ?? 0) / 100)})`
                          : 'rgba(0,0,0,0)',
                        offsetX: (element.shadowOpacity ?? 0) > 0 ? 0.5 : 0,
                        offsetY: (element.shadowOpacity ?? 0) > 0 ? 0.5 : 0
                      })
                      .opacity((element.textOpacity ?? 100) / 100)
                      .width('100%')
                      .padding({ left: 12, right: 12, top: 8, bottom: 8 })
                      .rotate({ angle: element.italicAngle ?? 0 })
                  }
                  .width('100%')
                  .height('100%')
                  .justifyContent(
                    element.textDirection === 'vertical'
                      ? (element.verticalAlign === 0 ? FlexAlign.Start : element.verticalAlign === 2 ? FlexAlign.End : FlexAlign.Center)
                      : FlexAlign.Center
                  )
                  .gesture(
                    GestureGroup(GestureMode.Exclusive,
                      // 拖拽移动（移动超过5px触发）
                      PanGesture({ fingers: 1, distance: 5 })
                        .onActionStart(() => {
                          this.dragStartX = this.elements[index].x;
                          this.dragStartY = this.elements[index].y;
                          this.selectedElementIndex = index;
                          this.loadTextPropsFromSelected();
                        })
                        .onActionUpdate((event: GestureEvent) => {
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
                        })
                        .onActionEnd(() => {
                          this.elements = [...this.elements];
                        }),
                      // 双击编辑
                      TapGesture({ count: 2 })
                        .onAction(() => {
                          this.editingTextValue = element.content;
                          this.editingTextIndex = index;
                        }),
                      // 单击选中
                      TapGesture({ count: 1 })
                        .onAction(() => {
                          this.selectedElementIndex = index;
                          this.loadTextPropsFromSelected();
                        })
                    )
                  )
                }

                // 选中时的边框（白色虚线，不拦截触摸事件）
                if (this.selectedElementIndex === index) {
                  Column()
                    .width('100%')
                    .height('100%')
                    .border({
                      width: 3,
                      color: Color.White,
                      style: BorderStyle.Dashed
                    })
                    .borderRadius(4)
                    .hitTestBehavior(HitTestMode.None)
                }

                // 选中时的控制按钮（白底黑字）
                if (this.selectedElementIndex === index && this.editingTextIndex !== index) {
                  // 删除按钮（右上角）×
                  Column() {
                    Text('×')
                      .fontSize(14)
                      .fontColor('#333333')
                      .fontWeight(FontWeight.Bold)
                      .textAlign(TextAlign.Center)
                  }
                  .width(22)
                  .height(22)
                  .backgroundColor(Color.White)
                  .borderRadius(11)
                  .position({ x: this.elements[index].width - 11, y: -11 })
                  .justifyContent(FlexAlign.Center)
                  .zIndex(100)
                  .onClick(() => {
                    this.deleteElement(index);
                  })

                  // 复制按钮（左下角）+1
                  Column() {
                    Text('+1')
                      .fontSize(9)
                      .fontColor('#333333')
                      .fontWeight(FontWeight.Bold)
                      .textAlign(TextAlign.Center)
                  }
                  .width(22)
                  .height(22)
                  .backgroundColor(Color.White)
                  .borderRadius(11)
                  .position({ x: -11, y: this.elements[index].height - 11 })
                  .justifyContent(FlexAlign.Center)
                  .zIndex(100)
                  .onClick(() => {
                    this.duplicateElement(index);
                  })

                  // 缩放手柄（右下角）循环箭头
                  Column() {
                    Text('↻')
                      .fontSize(14)
                      .fontColor('#333333')
                      .fontWeight(FontWeight.Bold)
                      .textAlign(TextAlign.Center)
                  }
                  .width(22)
                  .height(22)
                  .backgroundColor(Color.White)
                  .borderRadius(11)
                  .position({ x: this.elements[index].width - 11, y: this.elements[index].height - 11 })
                  .justifyContent(FlexAlign.Center)
                  .zIndex(100)
                  .gesture(
                    PanGesture()
                      .onActionStart(() => {
                        this.resizeStartWidth = this.elements[index].width;
                        this.resizeStartHeight = this.elements[index].height;
                      })
                      .onActionUpdate((event: GestureEvent) => {
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
                      })
                      .onActionEnd(() => {
                        this.elements = [...this.elements];
                      })
                  )
                }
              }
              .position({ x: this.elements[index].x, y: this.elements[index].y })
              .width(this.elements[index].width)
              .height(this.elements[index].height)
              .zIndex(element.zIndex)
              .rotate({ angle: element.rotation })
            }
          }, (element: CanvasElement, index: number) => `${index}_${element._version ?? 0}`)

          // 画笔绘图层（始终渲染以保留绘画内容，仅在画笔工具激活时可交互）
          Canvas(this.drawingCanvasContext)
            .width('100%')
            .height('100%')
            .id('drawingCanvas')
            .hitTestBehavior(this.activeToolTab === 4 ? HitTestMode.Default : HitTestMode.None)
            .onReady(() => {
              this.canvasReady = true;
              this.redrawAllStrokes();
            })
            .onTouch((event: TouchEvent) => {
              if (this.activeToolTab !== 4) return;
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
              } else if (event.type === TouchType.Move && event.touches.length > 0 && this.isDrawing) {
                const x = event.touches[0].x;
                const y = event.touches[0].y;
                this.drawStroke(this.drawLastX, this.drawLastY, x, y);
                // 记录点到当前笔画
                if (this.currentStroke) {
                  this.currentStroke.points.push({ x, y });
                }
                this.drawLastX = x;
                this.drawLastY = y;
              } else if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                this.isDrawing = false;
                // 保存当前笔画
                if (this.currentStroke && this.currentStroke.points.length > 0) {
                  this.drawStrokes = [...this.drawStrokes, this.currentStroke];
                  this.currentStroke = null;
                }
              }
            })
          }
          .width('100%')
          .height('100%')
          .scale({ x: this.canvasScale, y: this.canvasScale })
          .translate({ x: this.canvasOffsetX, y: this.canvasOffsetY })
          .gesture(
            PanGesture()
              .onActionStart(() => {
                this.panStartOffsetX = this.canvasOffsetX;
                this.panStartOffsetY = this.canvasOffsetY;
              })
              .onActionUpdate((event: GestureEvent) => {
                if (this.activeToolTab !== 4) {
                  this.canvasOffsetX = this.panStartOffsetX + event.offsetX;
                  this.canvasOffsetY = this.panStartOffsetY + event.offsetY;
                }
              })
          )

          // 右上角缩放控制条：放大镜-  100%  放大镜+
          Row({ space: 8 }) {
            // 缩小按钮
            Button() {
              Row({ space: 2 }) {
                SymbolGlyph($r('sys.symbol.magnifyingglass'))
                  .fontSize(16)
                  .fontColor([this.canvasScale > 0.5
                    ? $r('app.color.text_primary')
                    : $r('app.color.text_hint')])
                Text('−')
                  .fontSize(18)
                  .fontColor(this.canvasScale > 0.5
                    ? $r('app.color.text_primary')
                    : $r('app.color.text_hint'))
                  .fontWeight(FontWeight.Medium)
              }
            }
            .width(52)
            .height(36)
            .backgroundColor($r('app.color.card_background'))
            .borderRadius(18)
            .enabled(this.canvasScale > 0.5)
            .onClick(() => this.zoomOut())

            // 百分比显示
            Text(`${Math.round(this.canvasScale * 100)}%`)
              .fontSize(14)
              .fontColor($r('app.color.text_primary'))
              .fontWeight(FontWeight.Medium)
              .width(50)
              .textAlign(TextAlign.Center)

            // 放大按钮
            Button() {
              Row({ space: 2 }) {
                SymbolGlyph($r('sys.symbol.magnifyingglass'))
                  .fontSize(16)
                  .fontColor([this.canvasScale < 3.0
                    ? $r('app.color.text_primary')
                    : $r('app.color.text_hint')])
                Text('＋')
                  .fontSize(18)
                  .fontColor(this.canvasScale < 3.0
                    ? $r('app.color.text_primary')
                    : $r('app.color.text_hint'))
                  .fontWeight(FontWeight.Medium)
              }
            }
            .width(52)
            .height(36)
            .backgroundColor($r('app.color.card_background'))
            .borderRadius(18)
            .enabled(this.canvasScale < 3.0)
            .onClick(() => this.zoomIn())
          }
          .padding({ left: 8, right: 8, top: 6, bottom: 6 })
          .backgroundColor($r('app.color.card_background'))
          .borderRadius(20)
          .shadow({ radius: 8, color: '#15000000', offsetX: 0, offsetY: 2 })
          .position({ x: '50%', y: 16 })
          .translate({ x: '-50%', y: 0 })
          .zIndex(200)
        }
        .width('100%')
        .layoutWeight(1)
        .padding(16)
        .clip(true)
        .id('plogCanvas')
      }
      .width('100%')
      .height('100%')
      .backgroundColor($r('app.color.background_color'))

      // 底部工具栏悬浮面板（叠加在画布上方）
      Column() {
        // 展开区域：详细设置 + 子工具栏
        if (this.panelExpanded && this.activeToolTab >= 0) {
          Column() {
            // 下拉指示横线（点击收起/展开）
            Row() {
              Column()
                .width(36)
                .height(4)
                .borderRadius(2)
                .backgroundColor('#CCCCCC')
            }
            .width('100%')
            .height(20)
            .justifyContent(FlexAlign.Center)
            .onClick(() => this.togglePanel())

            // 详细设置内容区
            this.DetailContent()

            // 子工具栏（文字/背景工具有）
            if (this.activeToolTab === 2 || this.activeToolTab === 1) {
              Row() {
                ForEach(this.activeToolTab === 1 ? this.bgSubTools : this.textSubTools,
                  (tool: string, idx: number) => {
                    this.SubToolButton(tool, idx)
                  }, (tool: string, idx: number) => idx.toString())
              }
              .width('100%')
              .height(40)
              .justifyContent(FlexAlign.SpaceEvenly)
              .border({
                width: { top: 0.5 },
                color: $r('app.color.divider_color')
              })
            }
          }
          .width('100%')
          .backgroundColor($r('app.color.background_color'))
          .borderRadius({ topLeft: 16, topRight: 16 })
          .shadow({ radius: 8, color: '#15000000', offsetX: 0, offsetY: -2 })
          .transition(TransitionEffect.asymmetric(
            TransitionEffect.OPACITY.combine(TransitionEffect.translate({ y: 20 })),
            TransitionEffect.OPACITY.combine(TransitionEffect.translate({ y: 20 }))
          ).animation({ duration: 280, curve: Curve.EaseInOut }))
        }

        // 主工具栏（始终显示）
        Row() {
          this.MainToolButton('随手记', 0)

          Divider()
            .width(0.5)
            .height(36)
            .color($r('app.color.divider_color'))

          this.MainToolButton('背景', 1)

          Divider()
            .width(0.5)
            .height(36)
            .color($r('app.color.divider_color'))

          this.MainToolButton('文字', 2)

          Divider()
            .width(0.5)
            .height(36)
            .color($r('app.color.divider_color'))

          this.MainToolButton('贴纸', 3)

          Divider()
            .width(0.5)
            .height(36)
            .color($r('app.color.divider_color'))

          this.MainToolButton('画笔', 4)
        }
        .width('100%')
        .height(56)
        .backgroundColor($r('app.color.card_background'))
        .border({
          width: { top: this.panelExpanded && this.activeToolTab >= 0 ? 0 : 0.5 },
          color: $r('app.color.divider_color')
        })
      }
      .width('100%')
      .alignItems(HorizontalAlign.Start)

      // 取色器覆盖层
      if (this.showEyedropper) {
        Column() {
          Row() {
            Text('点击图片取色')
              .fontSize(16)
              .fontColor('#FFFFFF')
              .layoutWeight(1)
            Button('取消')
              .fontSize(14)
              .fontColor('#FFFFFF')
              .backgroundColor('rgba(255,255,255,0.2)')
              .padding({ left: 12, right: 12, top: 6, bottom: 6 })
              .onClick(() => { this.showEyedropper = false; this.eyedropperPixelMap = null; })
          }
          .width('100%')
          .height(56)
          .padding({ left: 16, right: 16 })
          .backgroundColor('rgba(0,0,0,0.75)')
          .alignItems(VerticalAlign.Center)

          Canvas(this.eyedropperCanvasContext)
            .width('100%')
            .layoutWeight(1)
            .onReady(() => this.drawEyedropperImage())
            .onTouch((event: TouchEvent) => {
              if (event.type === TouchType.Down && event.touches.length > 0) {
                const touch = event.touches[0];
                this.pickColorFromCanvas(touch.x, touch.y);
              }
            })

          Row() {
            Text('点击任意位置吸取颜色')
              .fontSize(13)
              .fontColor('#FFFFFF')
          }
          .width('100%')
          .height(44)
          .justifyContent(FlexAlign.Center)
          .backgroundColor('rgba(0,0,0,0.6)')
        }
        .width('100%')
        .height('100%')
        .backgroundColor('#000000')
        .zIndex(999)
      }
    }
    .width('100%')
    .height('100%')
  }
}

export default PlogEditorPage;
