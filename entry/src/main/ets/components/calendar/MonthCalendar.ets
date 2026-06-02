import DateUtils from '../../common/utils/DateUtils';

/**
 * 月历视图组件
 */
@Component
export default struct MonthCalendarComponent {
  @Prop calendar: (string | null)[][];
  @Prop selectedDate: string;
  @Prop eventDates: Set<string>; // 有事件的日期集合
  onDateSelected?: (date: string) => void;

  build() {
    Column() {
      // 星期标题行
      Row() {
        ForEach(['日', '一', '二', '三', '四', '五', '六'], (day: string) => {
          Text(day)
            .fontSize($r('app.float.font_size_xs'))
            .fontColor($r('app.color.text_secondary'))
            .layoutWeight(1)
            .textAlign(TextAlign.Center)
        })
      }
      .width('100%')
      .padding({ bottom: 8 })

      // 日期网格
      ForEach(this.calendar, (week: (string | null)[], weekIndex: number) => {
        Row() {
          ForEach(week, (date: string | null) => {
            if (date === null) {
              // 空白天数
              Text('')
                .layoutWeight(1)
                .height(40)
            } else {
              Column() {
                Text(date.split('-')[2])
                  .fontSize(this.selectedDate === date ? $r('app.float.font_size_md') : $r('app.float.font_size_sm'))
                  .fontColor(
                    this.selectedDate === date ? Color.White :
                    DateUtils.isToday(date) ? $r('app.color.calendar_today') :
                    $r('app.color.text_primary')
                  )
                  .fontWeight(this.selectedDate === date ? FontWeight.Bold : FontWeight.Normal)

                // 事件标记点
                if (this.eventDates.has(date) && this.selectedDate !== date) {
                  Circle()
                    .width(4)
                    .height(4)
                    .fill($r('app.color.primary_color'))
                    .margin({ top: 2 })
                }
              }
              .layoutWeight(1)
              .height(40)
              .justifyContent(FlexAlign.Center)
              .backgroundColor(this.selectedDate === date ? $r('app.color.calendar_selected') : Color.Transparent)
              .borderRadius($r('app.float.border_radius_sm'))
              .onClick(() => {
                if (this.onDateSelected) {
                  this.onDateSelected(date);
                }
              })
            }
          })
        }
        .width('100%')
        .margin({ bottom: 4 })
      }, (week: (string | null)[], index: number) => index.toString())
    }
    .width('100%')
    .padding(16)
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
