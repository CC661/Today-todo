import DateUtils from '../../common/utils/DateUtils';
// 修复：必须导入 ThemeColors 类型，用于给 colors 变量做严格的类型声明
import { ThemeColors } from '../../common/theme/ThemeManager';

/**
 * 周历卡片组件
 */
@Component
export default struct WeekCalendarComponent {
  @Prop currentWeek: string[];
  @Prop selectedDate: string;
  onDateSelected?: (date: string) => void;

  // 🛠️ 修复核心：声明 colors 变量，接收父组件传递的主题配色方案
  @Prop colors: ThemeColors;

  build() {
    Row() {
      ForEach(this.currentWeek, (date: string) => {
        Column() {
          // 星期几
          Text(DateUtils.getChineseWeekday(date).substring(1))
            .fontSize($r('app.float.font_size_xs'))
            // 修复：星期的颜色也跟随主题的弱提示文字色走，更和谐
            .fontColor(this.selectedDate === date ? Color.White : this.colors.textMuted)
            .margin({ bottom: 4 })

          // 日期数字
          Text(date.split('-')[2])
            .fontSize(this.selectedDate === date ? $r('app.float.font_size_lg') : $r('app.float.font_size_base'))
            // 修复：非选中状态下，字体使用深色 this.colors.textMain
            .fontColor(this.selectedDate === date ? Color.White : this.colors.textMain)
            .fontWeight(this.selectedDate === date ? FontWeight.Bold : FontWeight.Normal)

          // 今天标记（小圆点）
          if (DateUtils.isToday(date) && this.selectedDate !== date) {
            Circle()
              .width(4)
              .height(4)
              // 修复：今天的标记小圆点使用主题的核心高亮彩色
              .fill(this.colors.primary)
              .margin({ top: 4 })
          }
        }
        .layoutWeight(1)
        .height(60)
        .justifyContent(FlexAlign.Center)
        // 修复：选中的日子背景，使用主题的核心彩色（如橘光、薄荷绿）
        .backgroundColor(this.selectedDate === date ? this.colors.primary : Color.Transparent)
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
    // 修复：整个日历容器的背景跟主题卡片走 (明亮模式下为纯白 #ffffff，暗黑模式下为深灰 #1e1e1e)
    .backgroundColor(this.colors.bgCard)
    .borderRadius($r('app.float.border_radius_lg'))
    // 关键的高级微投影：明亮模式下让纯白卡片在奶油底色背景上飘起来
    .shadow({
      radius: 12,
      color: '#0d000000', // 仅有5%浓度的清透投影，非常有空气感
      offsetX: 0,
      offsetY: 4
    })
  }
}