import PlogViewModel from '../viewmodel/PlogViewModel';
import type { PlogCanvas } from '../model/PlogCanvas';
import { router } from '@kit.ArkUI';
import { promptAction } from '@kit.ArkUI';

class BtnPosition {
  x: number = 0;
  y: number = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

/**
 * 手账本画廊页 - 查看历史手账
 */
@Entry
@Component
struct PlogGalleryPage {
  @State plogs: PlogCanvas[] = [];
  @State isLoading: boolean = false;
  @State showMoreDropdown: boolean = false;
  @State showDeleteDialog: boolean = false;
  @State pendingDeletePlogId: number = -1;
  @State dropdownX: number = 0;
  @State dropdownY: number = 0;
  private morePlogId: number = -1;
  private moreBtnPositions: Map<number, BtnPosition> = new Map();
  private rootGlobalX: number = 0;
  private rootGlobalY: number = 0;

  aboutToAppear(): void {
    this.loadPlogs();
  }

  async loadPlogs(): Promise<void> {
    this.isLoading = true;
    try {
      this.plogs = await PlogViewModel.getAllPlogs();
    } catch (error) {
      console.error('加载手账列表失败:', error);
    } finally {
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
    animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
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
    animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
      this.showDeleteDialog = true;
    });
  }

  async confirmDelete(): Promise<void> {
    if (this.pendingDeletePlogId < 0) return;
    try {
      await PlogViewModel.deletePlog(this.pendingDeletePlogId);
      this.pendingDeletePlogId = -1;
      this.showDeleteDialog = false;
      promptAction.showToast({ message: '已删除' });
      await this.loadPlogs();
    } catch (error) {
      console.error('删除手账失败:', error);
    }
  }

  build() {
    Stack() {
      Column() {
        // 标题栏
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

          Text('手账')
            .fontSize($r('app.float.font_size_xxl'))
            .fontWeight(FontWeight.Bold)
            .fontColor($r('app.color.text_primary'))
        }
        .width('100%')
        .padding({ left: 12, right: 16, top: 16, bottom: 8 })

        // 手账网格
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

            Text('还没有手账作品')
              .fontSize($r('app.float.font_size_base'))
              .fontColor($r('app.color.text_hint'))

            Text('去创建你的第一本手账吧')
              .fontSize($r('app.float.font_size_sm'))
              .fontColor($r('app.color.text_hint'))
              .margin({ top: 4 })
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        } else {
          Grid() {
            ForEach(this.plogs, (plog: PlogCanvas) => {
              GridItem() {
                this.PlogCard(plog)
              }
            }, (plog: PlogCanvas) => plog.id.toString())
          }
          .columnsTemplate('1fr 1fr')
          .rowsGap(12)
          .columnsGap(12)
          .width('100%')
          .padding(16)
          .layoutWeight(1)
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor($r('app.color.background_color'))

      // 更多下拉菜单 + 全屏遮罩
      if (this.showMoreDropdown) {
        Stack() {
          // 全屏透明遮罩（点击关闭）
          Column()
            .width('100%')
            .height('100%')
            .onClick(() => this.hideMoreMenu())

          // 下拉菜单
          this.MoreDropdownOverlay()
        }
        .width('100%')
        .height('100%')
        .zIndex(100)
        .transition(TransitionEffect.OPACITY
          .combine(TransitionEffect.translate({ y: -6 }))
          .animation({ duration: 200, curve: Curve.EaseOut }))
      }

      // 删除确认弹窗
      if (this.showDeleteDialog) {
        Column() {
          Blank()

          Column() {
            Text('确定删除？')
              .fontSize($r('app.float.font_size_lg'))
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.error_color'))
              .margin({ bottom: 12 })

            Text('此操作不可恢复，是否继续删除该手账？')
              .fontSize($r('app.float.font_size_base'))
              .fontColor($r('app.color.text_secondary'))
              .textAlign(TextAlign.Center)
              .margin({ bottom: 20 })

            Row() {
              Button('取消')
                .layoutWeight(1)
                .height(40)
                .backgroundColor($r('app.color.background_color'))
                .fontColor($r('app.color.text_primary'))
                .borderRadius($r('app.float.border_radius_md'))
                .onClick(() => {
                  animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                    this.showDeleteDialog = false;
                  });
                  this.pendingDeletePlogId = -1;
                })

              Button('确定')
                .layoutWeight(1)
                .height(40)
                .backgroundColor($r('app.color.error_color'))
                .fontColor(Color.White)
                .borderRadius($r('app.float.border_radius_md'))
                .margin({ left: 12 })
                .onClick(() => this.confirmDelete())
            }
            .width('100%')
          }
          .width('85%')
          .padding(24)
          .backgroundColor($r('app.color.card_background'))
          .borderRadius($r('app.float.border_radius_xl'))

          Blank()
        }
        .width('100%')
        .height('100%')
        .backgroundColor('#80000000')
        .zIndex(200)
        .onClick(() => {
          animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
            this.showDeleteDialog = false;
          });
          this.pendingDeletePlogId = -1;
        })
      }
    }
    .width('100%')
    .height('100%')
    .id('plog_gallery_root')
    .onAreaChange((oldValue: Area, newValue: Area) => {
      this.rootGlobalX = newValue.globalPosition.x as number;
      this.rootGlobalY = newValue.globalPosition.y as number;
    })
  }

  @Builder
  PlogCard(plog: PlogCanvas) {
    Column() {
      // 日期标题栏 + 更多按钮
      Row() {
        Text(plog.date)
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.text_primary'))
          .fontWeight(FontWeight.Medium)

        Blank()

        Button() {
          Text('⋮')
            .fontSize(18)
            .fontColor($r('app.color.text_secondary'))
        }
        .width(28)
        .height(28)
        .backgroundColor(Color.Transparent)
        .onAreaChange((oldValue: Area, newValue: Area) => {
          this.moreBtnPositions.set(plog.id,
            new BtnPosition(newValue.globalPosition.x as number, newValue.globalPosition.y as number));
        })
        .onClick(() => this.showMoreMenu(plog.id))
      }
      .width('100%')
      .padding({ left: 10, right: 6, top: 8, bottom: 6 })

      // 手账内容预览
      Stack() {
        if (plog.thumbnail) {
          Image(plog.thumbnail)
            .width('100%')
            .height('100%')
            .objectFit(ImageFit.Cover)
        } else if (plog.backgroundImage) {
          Image(plog.backgroundImage)
            .width('100%')
            .height('100%')
            .objectFit(ImageFit.Cover)
        } else {
          Column()
            .width('100%')
            .height('100%')
            .backgroundColor('#FFF9F0')
        }
      }
      .width('100%')
      .layoutWeight(1)
    }
    .width('100%')
    .height(180)
    .backgroundColor($r('app.color.card_background'))
    .borderRadius($r('app.float.border_radius_lg'))
    .onClick(() => this.navigateToEditor(plog.id))
  }

  // 更多下拉菜单（全屏遮罩 + 绝对定位）
  @Builder
  MoreDropdownOverlay() {
    Column() {
      // 小三角箭头（指向更多按钮）
      Row() {
        Blank()
        Column()
          .width(8)
          .height(8)
          .backgroundColor($r('app.color.card_background'))
          .rotate({ angle: 45 })
          .margin({ top: -4 })
      }
      .width('100%')
      .height(0)

      // 编辑选项
      Row({ space: 10 }) {
        SymbolGlyph($r('sys.symbol.square_and_pencil'))
          .fontSize(15)
          .fontColor([$r('app.color.text_secondary')])
        Text('编辑')
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.text_primary'))
      }
      .width('100%')
      .height(40)
      .padding({ left: 14, right: 14 })
      .borderRadius({ topLeft: 12, topRight: 12 })
      .stateStyles({
        pressed: { .backgroundColor('#F0F0F0') },
        normal: { .backgroundColor(Color.Transparent) }
      })
      .onClick(() => {
        this.hideMoreMenu();
        const plogId = this.morePlogId;
        this.morePlogId = -1;
        this.navigateToEditor(plogId);
      })

      Divider()
        .strokeWidth(0.5)
        .color($r('app.color.divider_color'))
        .margin({ left: 14, right: 14 })

      // 删除选项
      Row({ space: 10 }) {
        SymbolGlyph($r('sys.symbol.trash'))
          .fontSize(15)
          .fontColor([$r('app.color.error_color')])
        Text('删除')
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.error_color'))
      }
      .width('100%')
      .height(40)
      .padding({ left: 14, right: 14 })
      .borderRadius({ bottomLeft: 12, bottomRight: 12 })
      .stateStyles({
        pressed: { .backgroundColor('#F0F0F0') },
        normal: { .backgroundColor(Color.Transparent) }
      })
      .onClick(() => {
        const plogId = this.morePlogId;
        this.hideMoreMenu();
        this.showDeleteConfirm(plogId);
      })
    }
    .width(140)
    .backgroundColor($r('app.color.card_background'))
    .borderRadius(12)
    .shadow({ radius: 12, color: '#15000000', offsetX: 0, offsetY: 6 })
    // 定位在更多按钮正下方，菜单右对齐按钮右边
    .position({
      x: Math.max(0, this.dropdownX + 28 - 140),
      y: this.dropdownY + 28
    })
  }
}

export default PlogGalleryPage;
