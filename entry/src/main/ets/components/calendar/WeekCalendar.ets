import DateUtils from '../../common/utils/DateUtils';

/**
 * 周历卡片组件
 */
@Component
export default struct WeekCalendarComponent {
  @Prop currentWeek: string[];
  @Prop selectedDate: string;
  onDateSelected?: (date: string) => void;

  build() {
    Row() {
      ForEach(this.currentWeek, (date: string) => {
        Column() {
          // 星期几
          Text(DateUtils.getChineseWeekday(date).substring(1))
            .fontSize($r('app.float.font_size_xs'))
            .fontColor($r('app.color.text_secondary'))
            .margin({ bottom: 4 })

          // 日期数字
          Text(date.split('-')[2])
            .fontSize(this.selectedDate === date ? $r('app.float.font_size_lg') : $r('app.float.font_size_base'))
            .fontColor(this.selectedDate === date ? Color.White : $r('app.color.text_primary'))
            .fontWeight(this.selectedDate === date ? FontWeight.Bold : FontWeight.Normal)

          // 今天标记
          if (DateUtils.isToday(date)) {
            Circle()
              .width(4)
              .height(4)
              .fill($r('app.color.calendar_today'))
              .margin({ top: 4 })
          }
        }
        .layoutWeight(1)
        .height(60)
        .justifyContent(FlexAlign.Center)
        .backgroundColor(this.selectedDate === date ? $r('app.color.calendar_selected') : Color.Transparent)
        .borderRadius($r('app.float.border_radius_md'))
        .onClick(() => {
          if (this.onDateSelected) {
            this.onDateSelected(date);
          }
        })
      }, (date: string) => date)
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 8, bottom: 8 })
    .backgroundColor($r('app.color.card_background'))
    .borderRadius($r('app.float.border_radius_lg'))
    .shadow({
      radius: 8,
      color: '#10000000',
      offsetX: 0,
      offsetY: 2
    })
  }
}
