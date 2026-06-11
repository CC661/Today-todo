import type { DiaryPost } from '../../model/DiaryPost';
import DateUtils from '../../common/utils/DateUtils';

/**
 * 动态卡片组件
 */
@Component
export default struct PostCardComponent {
  @Prop post: DiaryPost;

  private extractField(json: string, fieldName: string): string {
    try {
      const match = json.match(new RegExp(`"${fieldName}"\\s*:\\s*"([^"]*)"`, 'i'));
      return match ? match[1] : '';
    } catch {
      return '';
    }
  }

  @Builder
  TemplateDataBlock() {
    if (this.post.templateData) {
      if (this.post.templateData.includes('"type":"accounting"') ||
          this.post.templateData.includes('"type": "accounting"')) {
        Column({ space: 6 }) {
          Row() {
            Text('日期：').fontSize($r('app.float.font_size_sm'))
              .fontColor($r('app.color.text_secondary')).width(60)
            Text(this.extractField(this.post.templateData, 'date'))
              .fontSize($r('app.float.font_size_sm')).fontColor($r('app.color.text_primary'))
          }.width('100%')
          if (this.extractField(this.post.templateData, 'location')) {
            Row() {
              Text('地点：').fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary')).width(60)
              Text(this.extractField(this.post.templateData, 'location'))
                .fontSize($r('app.float.font_size_sm')).fontColor($r('app.color.text_primary'))
            }.width('100%')
          }
          Row() {
            Text('金额：').fontSize($r('app.float.font_size_sm'))
              .fontColor($r('app.color.text_secondary')).width(60)
            Text(`￥${this.extractField(this.post.templateData, 'amount')}`)
              .fontSize($r('app.float.font_size_sm'))
              .fontColor($r('app.color.primary_color')).fontWeight(FontWeight.Medium)
          }.width('100%')
          Row() {
            Text('物品：').fontSize($r('app.float.font_size_sm'))
              .fontColor($r('app.color.text_secondary')).width(60)
            Text(this.extractField(this.post.templateData, 'item'))
              .fontSize($r('app.float.font_size_sm')).fontColor($r('app.color.text_primary'))
          }.width('100%')
        }
        .width('100%').padding(10)
        .backgroundColor($r('app.color.background_color'))
        .borderRadius($r('app.float.border_radius_md'))
        .margin({ top: 6, bottom: 6 })
      } else if (this.post.templateData.includes('"type":"dining"') ||
                 this.post.templateData.includes('"type": "dining"')) {
        Column({ space: 6 }) {
          Row() {
            Text('日期：').fontSize($r('app.float.font_size_sm'))
              .fontColor($r('app.color.text_secondary')).width(60)
            Text(this.extractField(this.post.templateData, 'date'))
              .fontSize($r('app.float.font_size_sm')).fontColor($r('app.color.text_primary'))
          }.width('100%')
          if (this.extractField(this.post.templateData, 'location')) {
            Row() {
              Text('地点：').fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary')).width(60)
              Text(this.extractField(this.post.templateData, 'location'))
                .fontSize($r('app.float.font_size_sm')).fontColor($r('app.color.text_primary'))
            }.width('100%')
          }
          if (this.extractField(this.post.templateData, 'amount')) {
            Row() {
              Text('金额：').fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary')).width(60)
              Text(`￥${this.extractField(this.post.templateData, 'amount')}`)
                .fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.primary_color')).fontWeight(FontWeight.Medium)
            }.width('100%')
          }
          Row() {
            Text('菜品：').fontSize($r('app.float.font_size_sm'))
              .fontColor($r('app.color.text_secondary')).width(60)
            Text(this.extractField(this.post.templateData, 'dish'))
              .fontSize($r('app.float.font_size_sm')).fontColor($r('app.color.text_primary'))
          }.width('100%')
          if (this.extractField(this.post.templateData, 'rating')) {
            Row() {
              Text('评价：').fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary')).width(60)
              Text(this.extractField(this.post.templateData, 'rating'))
                .fontSize($r('app.float.font_size_sm')).fontColor($r('app.color.text_primary'))
                .layoutWeight(1)
            }.width('100%').alignItems(VerticalAlign.Top)
          }
        }
        .width('100%').padding(10)
        .backgroundColor($r('app.color.background_color'))
        .borderRadius($r('app.float.border_radius_md'))
        .margin({ top: 6, bottom: 6 })
      } else if (this.post.templateData.includes('"type":"movie"') ||
                 this.post.templateData.includes('"type": "movie"')) {
        Column({ space: 6 }) {
          Row() {
            Text('影片：').fontSize($r('app.float.font_size_sm'))
              .fontColor($r('app.color.text_secondary')).width(60)
            Text(this.extractField(this.post.templateData, 'title'))
              .fontSize($r('app.float.font_size_sm')).fontColor($r('app.color.text_primary'))
              .fontWeight(FontWeight.Medium)
          }.width('100%')
          if (this.extractField(this.post.templateData, 'genre')) {
            Row() {
              Text('类型：').fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary')).width(60)
              Text(this.extractField(this.post.templateData, 'genre'))
                .fontSize($r('app.float.font_size_sm')).fontColor($r('app.color.text_primary'))
            }.width('100%')
          }
          if (this.extractField(this.post.templateData, 'score')) {
            Row() {
              Text('评分：').fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary')).width(60)
              Text(this.extractField(this.post.templateData, 'score'))
                .fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.primary_color')).fontWeight(FontWeight.Medium)
            }.width('100%')
          }
          if (this.extractField(this.post.templateData, 'experience')) {
            Row() {
              Text('体验：').fontSize($r('app.float.font_size_sm'))
                .fontColor($r('app.color.text_secondary')).width(60)
              Text(this.extractField(this.post.templateData, 'experience'))
                .fontSize($r('app.float.font_size_sm')).fontColor($r('app.color.text_primary'))
                .layoutWeight(1)
            }.width('100%').alignItems(VerticalAlign.Top)
          }
        }
        .width('100%').padding(10)
        .backgroundColor($r('app.color.background_color'))
        .borderRadius($r('app.float.border_radius_md'))
        .margin({ top: 6, bottom: 6 })
      }
    }
  }

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
          .fontWeight(FontWeight.Medium)
          .lineHeight(24)
          .width('100%')
          .margin({ bottom: 4 })
      }

      // 模板字段
      this.TemplateDataBlock()

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
