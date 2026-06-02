import PlogViewModel from '../viewmodel/PlogViewModel';
import type { PlogCanvas } from '../model/PlogCanvas';

/**
 * 手账本画廊页 - 查看历史手账
 */
@Entry
@Component
struct PlogGalleryPage {
  @State plogs: PlogCanvas[] = [];
  @State isLoading: boolean = false;

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

  build() {
    Column() {
      // 标题栏
      Row() {
        Text($r('app.string.my_plogs'))
          .fontSize($r('app.float.font_size_xxl'))
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 16, bottom: 8 })

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
              Column() {
                // 缩略图
                if (plog.thumbnail) {
                  Image(plog.thumbnail)
                    .width('100%')
                    .height(120)
                    .objectFit(ImageFit.Cover)
                    .borderRadius($r('app.float.border_radius_md'))
                } else {
                  Stack() {
                    Column()
                      .width('100%')
                      .height(120)
                      .backgroundColor('#FFF9F0')
                      .borderRadius($r('app.float.border_radius_md'))

                    Text(`${plog.elements.length}个元素`)
                      .fontSize($r('app.float.font_size_sm'))
                      .fontColor($r('app.color.text_hint'))
                  }
                  .width('100%')
                  .height(120)
                }

                // 日期
                Text(plog.date)
                  .fontSize($r('app.float.font_size_sm'))
                  .fontColor($r('app.color.text_secondary'))
                  .margin({ top: 8 })
              }
              .width('100%')
              .padding(8)
              .backgroundColor($r('app.color.card_background'))
              .borderRadius($r('app.float.border_radius_lg'))
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
  }
}

export default PlogGalleryPage;
