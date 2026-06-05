import PlogViewModel from '../viewmodel/PlogViewModel';
import DiaryViewModel from '../viewmodel/DiaryViewModel';
import type { PlogCanvas, CanvasElement, BgType, PatternType } from '../model/PlogCanvas';
import type { DiaryPost } from '../model/DiaryPost';
import type { TodoItem } from '../model/TodoItem';
import type { PlogInsertParams } from '../common/database/RDBStoreUtil';
import DateUtils from '../common/utils/DateUtils';
import { router, curves, componentSnapshot } from '@kit.ArkUI';
import { promptAction } from '@kit.ArkUI';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { image } from '@kit.ImageKit';

class PatternItem {
  type: PatternType = 'horizontal';
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
  private eyedropperTarget: number = 0;  // 0=背景色, 1=花纹色
  private eyedropperPixelMap: image.PixelMap | null = null;
  private settings: RenderingContextSettings = new RenderingContextSettings(true);
  private eyedropperCanvasContext: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings);
  private patternCanvasContext: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings);

  private plogIdFromParams: number = 0;
  private diaryIdsFromParams: number[] = [];
  private textSubTools: string[] = ['样式', '颜色', '排版', '粗斜体', '弯曲'];
  private bgSubTools: string[] = ['纯色', '渐变', '花纹', '自定义'];

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
      } else {
        this.todayDiaryPosts = allPosts;
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
    // 切换标签时同步更新底色类型（花纹作为独立叠加层不受影响）
    if (subIndex === 0) {
      this.bgType = 'solid';
    } else if (subIndex === 1) {
      this.bgType = 'gradient';
    } else if (subIndex === 3) {
      // 自定义标签页，不自动切换 bgType，由 pickCustomBg 处理
    }
    this.applyBgToPlog();
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
    const img = new ImageBitmap(this.eyedropperPixelMap);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
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
      } else {
        this.patternColor = pickedColor;
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
    if (!this.plog) return;

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
      if (tabIndex === 2) {
        this.switchToolTab(tabIndex);
      } else if (tabIndex === 4) {
        promptAction.showToast({ message: '画笔功能开发中' });
      } else {
        this.switchToolTab(tabIndex);
      }
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
    }
    .height('100%')
    .padding({ left: 16, right: 16 })
    .justifyContent(FlexAlign.Center)
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
      Column() {
        if (this.activeSubTool === 0) {
          Text('选择文字样式')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_primary'))
            .margin({ bottom: 12 })
          Row({ space: 12 }) {
            Text('常规').padding(8).backgroundColor('#F5F5F5').borderRadius(6)
            Text('手写').padding(8).backgroundColor('#F5F5F5').borderRadius(6)
            Text('艺术').padding(8).backgroundColor('#F5F5F5').borderRadius(6)
          }
        } else if (this.activeSubTool === 1) {
          Text('选择文字颜色')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_primary'))
            .margin({ bottom: 12 })
          Row({ space: 10 }) {
            ForEach(['#333333', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#000000'],
              (color: string) => {
                Column()
                  .width(32)
                  .height(32)
                  .backgroundColor(color)
                  .borderRadius(16)
              }, (color: string) => color)
          }
        } else if (this.activeSubTool === 2) {
          Text('文字排版')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_primary'))
            .margin({ bottom: 12 })
          Row({ space: 16 }) {
            Text('左对齐').padding(8).backgroundColor('#F5F5F5').borderRadius(6)
            Text('居中').padding(8).backgroundColor('#F5F5F5').borderRadius(6)
            Text('右对齐').padding(8).backgroundColor('#F5F5F5').borderRadius(6)
          }
        } else if (this.activeSubTool === 3) {
          Text('粗斜体设置')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_primary'))
            .margin({ bottom: 12 })
          Row({ space: 16 }) {
            Text('B').fontWeight(FontWeight.Bold).fontSize(20).padding(8).backgroundColor('#F5F5F5').borderRadius(6)
            Text('I').fontStyle(FontStyle.Italic).fontSize(20).padding(8).backgroundColor('#F5F5F5').borderRadius(6)
          }
        } else if (this.activeSubTool === 4) {
          Text('文字弯曲效果')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_primary'))
            .margin({ bottom: 12 })
          Text('弯曲效果开发中')
            .fontSize($r('app.float.font_size_sm'))
            .fontColor($r('app.color.text_hint'))
        }
      }
      .width('100%')
      .height(160)
      .justifyContent(FlexAlign.Center)
      .padding({ left: 16, right: 16 })
      .transition(TransitionEffect.OPACITY.animation({ duration: 180, curve: Curve.EaseOut }))
    } else if (this.activeToolTab === 3) {
      // 贴纸详细设置
      Grid() {
        ForEach(['⭐', '❤️', '🌸', '🎀', '✨', '🌈', '🌟', '💎', '🍀', '🦋', '🌙', '🎈'], (sticker: string) => {
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
      .height(160)
      .padding({ left: 16, right: 16, top: 8, bottom: 8 })
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

      // 添加按钮
      Button('添加')
        .fontSize($r('app.float.font_size_sm'))
        .height(32)
        .backgroundColor($r('app.color.primary_color'))
        .onClick(() => this.addDiaryToCanvas(post))
    }
    .width('100%')
    .padding(12)
    .backgroundColor($r('app.color.card_background'))
    .borderRadius($r('app.float.border_radius_md'))
    .margin({ bottom: 8 })
  }

  build() {
    Stack() {
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

        // 画布区域
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
              Image(element.content)
                .width(element.width)
                .height(element.height)
                .position({ x: element.x, y: element.y })
                .rotate({ angle: element.rotation })
                .zIndex(element.zIndex)
                .border({
                  width: this.selectedElementIndex === index ? 2 : 0,
                  color: $r('app.color.primary_color')
                })
                .onClick(() => {
                  this.selectedElementIndex = index;
                })
            } else if (element.type === 'text') {
              Text(element.content)
                .fontSize(element.fontSize || 14)
                .fontColor(element.color || '#333333')
                .position({ x: element.x, y: element.y })
                .width(element.width)
                .zIndex(element.zIndex)
                .border({
                  width: this.selectedElementIndex === index ? 2 : 0,
                  color: $r('app.color.primary_color')
                })
                .onClick(() => {
                  this.selectedElementIndex = index;
                })
            }
          }, (element: CanvasElement, index: number) => index.toString())
        }
        .width('100%')
        .layoutWeight(1)
        .padding(16)
        .id('plogCanvas')

        // 底部综合面板（主工具栏 + 子工具栏 + 详细设置）
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
                .justifyContent(FlexAlign.Center)
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
      }
      .width('100%')
      .height('100%')
      .backgroundColor($r('app.color.background_color'))

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
