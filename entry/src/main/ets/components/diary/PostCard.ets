import type { DiaryPost } from '../../model/DiaryPost';
import DateUtils from '../../common/utils/DateUtils';

/**
 * 动态卡片组件
 */
@Component
export default struct PostCardComponent {
  @Prop post: DiaryPost;

  build() {
    Column() {
      // 头部:时间和位置
      Row() {
        Text(DateUtils.formatTime(this.post.timestamp))
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.text_secondary'))

        if (this.post.location) {
          Text(`📍 ${this.post.location}`)
            .fontSize($r('app.float.font_size_sm'))
            .fontColor($r('app.color.text_hint'))
            .margin({ left: 12 })
        }

        Blank()

        if (this.post.weather) {
          Text(this.post.weather)
            .fontSize($r('app.float.font_size_sm'))
            .fontColor($r('app.color.text_hint'))
        }
      }
      .width('100%')
      .margin({ bottom: 8 })

      // 文字内容
      if (this.post.content) {
        Text(this.post.content)
          .fontSize($r('app.float.font_size_base'))
          .fontColor($r('app.color.text_primary'))
          .lineHeight(24)
          .width('100%')
          .margin({ bottom: this.post.mediaUrls.length > 0 ? 12 : 0 })
      }

      // 媒体网格(最多9张)
      if (this.post.mediaUrls.length > 0) {
        Grid() {
          ForEach(this.post.mediaUrls.slice(0, 9), (url: string, index: number) => {
            GridItem() {
              Image(url)
                .width('100%')
                .height('100%')
                .objectFit(ImageFit.Cover)
                .borderRadius($r('app.float.border_radius_md'))
            }
          })
        }
        .columnsTemplate(this.post.mediaUrls.length === 1 ? '1fr' :
          this.post.mediaUrls.length <= 4 ? '1fr 1fr' : '1fr 1fr 1fr')
        .rowsTemplate(this.post.mediaUrls.length <= 2 ? '1fr' :
          this.post.mediaUrls.length <= 4 ? '1fr 1fr' : '1fr 1fr 1fr')
        .columnsGap(4)
        .rowsGap(4)
        .width('100%')
        .height(this.post.mediaUrls.length === 1 ? 200 :
          this.post.mediaUrls.length <= 4 ? 300 : 400)
      }
    }
    .width('100%')
    .padding(16)
    .backgroundColor($r('app.color.card_background'))
    .borderRadius($r('app.float.border_radius_lg'))
    .margin({ bottom: 12 })
    .shadow({
      radius: 4,
      color: '#08000000',
      offsetX: 0,
      offsetY: 2
    })
  }
}
