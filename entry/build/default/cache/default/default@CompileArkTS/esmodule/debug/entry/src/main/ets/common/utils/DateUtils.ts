/**
 * 日期工具类
 */
export class DateUtils {
    /**
     * 格式化日期为 YYYY-MM-DD
     */
    static formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    /**
     * 获取今天的日期字符串
     */
    static getToday(): string {
        return DateUtils.formatDate(new Date());
    }
    /**
     * 获取昨天的日期字符串
     */
    static getYesterday(): string {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return DateUtils.formatDate(yesterday);
    }
    /**
     * 解析日期字符串
     */
    static parseDate(dateStr: string): Date {
        return new Date(dateStr);
    }
    /**
     * 获取某天的星期几 (0-6, 0为周日)
     */
    static getDayOfWeek(dateStr: string): number {
        return DateUtils.parseDate(dateStr).getDay();
    }
    /**
     * 获取某月有多少天
     */
    static getDaysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }
    /**
     * 获取某月的第一天是星期几
     */
    static getFirstDayOfMonth(year: number, month: number): number {
        return new Date(year, month, 1).getDay();
    }
    /**
     * 格式化时间为 HH:mm
     */
    static formatTime(timestamp: number): string {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    /**
     * 获取本周的日期数组 (周一到周日)
     */
    static getCurrentWeek(): string[] {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 调整为周一开始
        const week: string[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + mondayOffset + i);
            week.push(DateUtils.formatDate(date));
        }
        return week;
    }
    /**
     * 获取指定周的日期数组
     */
    static getWeekByDate(dateStr: string): string[] {
        const date = DateUtils.parseDate(dateStr);
        const dayOfWeek = date.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const week: string[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(date);
            d.setDate(date.getDate() + mondayOffset + i);
            week.push(DateUtils.formatDate(d));
        }
        return week;
    }
    /**
     * 获取月份的所有日期 (二维数组,每行7天)
     */
    static getMonthCalendar(year: number, month: number): (string | null)[][] {
        const daysInMonth = DateUtils.getDaysInMonth(year, month);
        const firstDayOfWeek = DateUtils.getFirstDayOfMonth(year, month);
        const calendar: (string | null)[][] = [];
        let week: (string | null)[] = [];
        // 填充第一周的空白天数
        for (let i = 0; i < firstDayOfWeek; i++) {
            week.push(null);
        }
        // 填充日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            week.push(dateStr);
            if (week.length === 7) {
                calendar.push(week);
                week = [];
            }
        }
        // 最后一周不足7天,补null
        if (week.length > 0) {
            while (week.length < 7) {
                week.push(null);
            }
            calendar.push(week);
        }
        return calendar;
    }
    /**
     * 判断是否是今天
     */
    static isToday(dateStr: string): boolean {
        return dateStr === DateUtils.getToday();
    }
    /**
     * 获取中文星期
     */
    static getChineseWeekday(dateStr: string): string {
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const day = DateUtils.getDayOfWeek(dateStr);
        return `周${weekdays[day]}`;
    }
    /**
     * 格式化显示日期
     */
    static formatDisplayDate(dateStr: string): string {
        if (DateUtils.isToday(dateStr)) {
            return '今天';
        }
        const yesterday = DateUtils.getYesterday();
        if (dateStr === yesterday) {
            return '昨天';
        }
        const date = DateUtils.parseDate(dateStr);
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
}
export default DateUtils;
