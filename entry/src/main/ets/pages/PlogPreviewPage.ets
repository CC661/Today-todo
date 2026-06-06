import PlogViewModel from '../viewmodel/PlogViewModel';
import type { PlogCanvas, CanvasElement } from '../model/PlogCanvas';
import { router } from '@kit.ArkUI';

/**
 * 手账预览页 - 全屏画布，支持左右滑动翻页浏览
 */
@Entry
@Component
struct PlogPreviewPage {
  @State plogs: PlogCanvas[] = [];
  @State currentIndex: number = 0;
  @State isLoading: boolean = true;
  private initialPlogId: number = 0;
  private settings: RenderingContextSettings = new RenderingContextSettings(true);
  private patternCanvasContext: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings);

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
    } catch (error) {
      console.error('加载手账列表失败:', error);
    } finally {
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
    if (a === 0 || a === 360) return 0;
    if (a === 45) return 4;
    if (a === 90) return 3;
    if (a === 135) return 6;
    if (a === 180) return 1;
    if (a === 225) return 7;
    if (a === 270) return 2;
    if (a === 315) return 5;
    return 0;
  }

  drawPatternBg(plog: PlogCanvas, ctx: CanvasRenderingContext2D): void {
    const w: number = ctx.width;
    const h: number = ctx.height;
    if (w === 0 || h === 0) return;
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
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    } else if (pType === 'vertical') {
      for (let x = 0; x < w; x += s) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
    } else if (pType === 'grid') {
      for (let x = 0; x < w; x += s) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += s) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    } else if (pType === 'dots') {
      const r = t * 2;
      for (let y = r; y < h; y += s) {
        for (let x = r; x < w; x += s) {
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }
      }
    } else if (pType === 'waves') {
      const amp = t * 3;
      for (let y = amp; y < h; y += s) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const wy = y + Math.sin((x / s) * Math.PI * 2) * amp;
          if (x === 0) { ctx.moveTo(x, wy); } else { ctx.lineTo(x, wy); }
        }
        ctx.stroke();
      }
    }
  }

  @Builder
  PlogPage(plog: PlogCanvas) {
    Stack() {
      if (plog.bgType === 'custom' && plog.customBgUri) {
        Image(plog.customBgUri)
          .width('100%')
          .height('100%')
          .objectFit(ImageFit.Cover)
      } else if (plog.bgType === 'gradient' && plog.gradientColors.length >= 2) {
        Column()
          .width('100%')
          .height('100%')
          .linearGradient({
            direction: this.gradientAngleToGradientDirection(plog.gradientAngle),
            colors: plog.gradientColors.map((c: string, i: number) =>
              [c, i / (plog.gradientColors.length - 1)] as [ResourceColor, number])
          })
      } else if (plog.bgType === 'solid') {
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor(plog.bgColor || '#FFFFFF')
      } else {
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor(Color.White)
      }

      if (plog.hasPattern && plog.patternType !== 'none') {
        Canvas(this.patternCanvasContext)
          .width('100%')
          .height('100%')
          .onReady(() => { this.drawPatternBg(plog, this.patternCanvasContext); })
      }

      ForEach(plog.elements, (element: CanvasElement) => {
        if (element.type === 'image' || element.type === 'sticker') {
          Stack() {
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
          }
          .width(element.width)
          .height(element.height)
          .position({ x: element.x, y: element.y })
          .rotate({ angle: element.rotation })
          .zIndex(element.zIndex)
        } else if (element.type === 'text') {
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
          .width(element.width)
          .height(element.height)
          .position({ x: element.x, y: element.y })
          .rotate({ angle: element.rotation })
          .zIndex(element.zIndex)
          .justifyContent(
            element.textDirection === 'vertical'
              ? (element.verticalAlign === 0 ? FlexAlign.Start : element.verticalAlign === 2 ? FlexAlign.End : FlexAlign.Center)
              : FlexAlign.Center
          )
        }
      }, (element: CanvasElement, index: number) => `${plog.id}_${index}_${element._version ?? 0}`)
    }
    .width('100%')
    .height('100%')
  }

  build() {
    Stack() {
      Column() {
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

          Text(this.plogs.length > 0 && this.currentIndex < this.plogs.length
            ? `${this.plogs[this.currentIndex].date}  ${this.currentIndex + 1}/${this.plogs.length}`
            : '')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_secondary'))

          Blank()

          Button() {
            SymbolGlyph($r('sys.symbol.square_and_pencil'))
              .fontSize(20)
              .fontColor([$r('app.color.text_primary')])
          }
          .width(40)
          .height(40)
          .backgroundColor(Color.Transparent)
          .enabled(this.plogs.length > 0 && this.currentIndex < this.plogs.length)
          .onClick(() => {
            if (this.plogs.length > 0 && this.currentIndex < this.plogs.length) {
              this.navigateToEdit(this.plogs[this.currentIndex].id);
            }
          })
        }
        .width('100%')
        .height(48)
        .padding({ left: 12, right: 12 })
        .backgroundColor($r('app.color.card_background'))
        .alignItems(VerticalAlign.Center)

        if (this.isLoading) {
          LoadingProgress()
            .width(40)
            .height(40)
            .layoutWeight(1)
        } else if (this.plogs.length === 0) {
          Column() {
            Text('📔')
              .fontSize(48)
              .margin({ bottom: 12 })
            Text('还没有手账')
              .fontSize($r('app.float.font_size_base'))
              .fontColor($r('app.color.text_hint'))
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        } else {
          Swiper() {
            ForEach(this.plogs, (plog: PlogCanvas) => {
              this.PlogPage(plog)
            }, (plog: PlogCanvas) => plog.id.toString())
          }
          .index(this.currentIndex)
          .indicator(false)
          .loop(false)
          .duration(300)
          .curve(Curve.EaseInOut)
          .onChange((index: number) => {
            this.currentIndex = index;
          })
          .width('100%')
          .layoutWeight(1)
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor($r('app.color.background_color'))
    }
    .width('100%')
    .height('100%')
  }
}

export default PlogPreviewPage;
