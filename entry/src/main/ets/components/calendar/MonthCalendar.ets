import DateUtils from '../../common/utils/DateUtils';
import type { ThemeColors } from '../../common/theme/ThemeManager';

/**
 * 月历视图组件
 * 完全跟随全局主题配色（通过 colors prop 传入）
 */
@Component
export default struct MonthCalendarComponent {
  @Prop calendar: (string | null)[][];
  @Prop selectedDate: string;
  @Prop eventDates: Set<string>; // 有事件的日期集合
  @Prop colors: ThemeColors = {
    primary: '#ffac34',
    bgMain: '#fdfaf2',
    bgCard: '#ffffff',
    textMain: '#3e2723',
    textMuted: '#ffcd84',
    border: '#f6f0e2'
  };
  onDateSelected?: (date: string) => void;

  build() {
    Column() {
      // 星期标题行
      Row() {
        ForEach(['日', '一', '二', '三', '四', '五', '六'], (day: string) => {
          Text(day)
            .fontSize($r('app.float.font_size_xs'))
            .fontColor(this.colors.textMuted)
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
                    DateUtils.isToday(date) ? this.colors.primary :
                    this.colors.textMain
                  )
                  .fontWeight(this.selectedDate === date ? FontWeight.Bold : FontWeight.Normal)

                // 事件标记点
                if (this.eventDates.has(date) && this.selectedDate !== date) {
                  Circle()
                    .width(4)
                    .height(4)
                    .fill(this.colors.primary)
                    .margin({ top: 2 })
                }
              }
              .layoutWeight(1)
              .height(40)
              .justifyContent(FlexAlign.Center)
              .backgroundColor(this.selectedDate === date ? this.colors.primary : Color.Transparent)
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
    .backgroundColor(this.colors.bgCard)
    .borderRadius($r('app.float.border_radius_lg'))
    .shadow({
      radius: 12,
      color: '#0d000000',
      offsetX: 0,
      offsetY: 4
    })
  }
}
