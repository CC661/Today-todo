import type { TodoItem } from '../../model/TodoItem';
import type { ThemeColors } from '../../common/theme/ThemeManager';

/**
 * 待办事项单项组件 - iOS 提醒事项风格
 * 简洁列表项，无卡片背景，细分割线，圆形复选框
 * 支持动态主题（通过 @StorageLink 读取 app_active_theme）
 */
@Component
export struct TodoItemComponent {
  @StorageLink('app_active_theme') currentColors: ThemeColors = {
    primary: '#ffac34',
    bgMain: '#fdfaf2',
    bgCard: '#ffffff',
    textMain: '#3e2723',
    textMuted: '#ffcd84',
    border: '#f6f0e2'
  };
  @Prop todo: TodoItem = {
    id: 0,
    content: '',
    status: 'pending',
    date: '',
    order: 0,
    createdAt: 0,
    isCarryOver: false,
    remindTime: 0,
    remark: '',
    location: '',
    tag: '',
    flagged: false,
    imageUris: ''
  };

  onToggleStatus?: (id: number) => void;
  onDelete?: (id: number) => void;
  onStartEdit?: (id: number) => void;

  /**
   * 格式化提醒时间为 HH:MM
   */
  private formatRemind(timestamp: number): string {
    if (timestamp <= 0) return '';
    const date = new Date(timestamp);
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }

  build() {
    Row() {
      // 圆形复选框
      Stack() {
        Circle()
          .width(22)
          .height(22)
          .fill(this.todo.status === 'completed' ? this.currentColors.primary : Color.Transparent)
          .stroke(this.todo.status === 'completed' ? this.currentColors.primary : this.currentColors.textMuted)
          .strokeWidth(1.5)

        if (this.todo.status === 'completed') {
          SymbolGlyph($r('sys.symbol.checkmark'))
            .fontSize(12)
            .fontColor([Color.White])
            .fontWeight(FontWeight.Bold)
        }
      }
      .width(40)
      .height(40)
      .hitTestBehavior(HitTestMode.Block)
      .onClick(() => {
        if (this.onToggleStatus && this.todo.id !== undefined) {
          this.onToggleStatus(this.todo.id);
        }
      })

      // 任务内容 + 子信息
      Column() {
        Text(this.todo.content)
          .fontSize($r('app.float.font_size_md'))
          .fontColor(this.todo.status === 'completed' ? this.currentColors.textMuted : this.currentColors.textMain)
          .decoration({
            type: this.todo.status === 'completed' ? TextDecorationType.LineThrough : TextDecorationType.None,
            color: this.currentColors.textMuted
          })
          .textAlign(TextAlign.Start)
          .maxLines(3)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        // 子信息行：备注 / 提醒时间 / 位置 / 标签
        if (this.todo.remark || (this.todo.remindTime && this.todo.remindTime > 0) || this.todo.location || this.todo.tag) {
          Column() {
            // 备注文字
            if (this.todo.remark) {
              Text(this.todo.remark)
                .fontSize(13)
                .fontColor(this.currentColors.textMuted)
                .maxLines(1)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
                .width('100%')
            }
            // 提醒时间
            if (this.todo.remindTime && this.todo.remindTime > 0) {
              Text(this.formatRemind(this.todo.remindTime))
                .fontSize(13)
                .fontColor(this.currentColors.textMuted)
                .width('100%')
            }
            // 位置
            if (this.todo.location) {
              Text(`📍 ${this.todo.location}`)
                .fontSize(13)
                .fontColor(this.currentColors.textMuted)
                .maxLines(1)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
                .width('100%')
            }
            // 标签
            if (this.todo.tag) {
              Text(`# ${this.todo.tag}`)
                .fontSize(13)
                .fontColor(this.currentColors.textMuted)
                .maxLines(1)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
                .width('100%')
            }
          }
          .margin({ top: 2 })
          .width('100%')
          .alignItems(HorizontalAlign.Start)
        }
      }
      .layoutWeight(1)
      .margin({ left: 8 })
      .alignItems(HorizontalAlign.Start)
      .onClick(() => {
        if (this.onStartEdit && this.todo.id !== undefined) {
          this.onStartEdit(this.todo.id);
        }
      })

      // 右侧：旗帜标记 / 图片标记 / 信息图标
      Row({ space: 4 }) {
        // 旗帜标记
        if (this.todo.flagged) {
          SymbolGlyph($r('sys.symbol.flag_fill'))
            .fontSize(16)
            .fontColor([this.currentColors.primary])
        }
        // 图片标记
        if (this.todo.imageUris) {
          Text('🖼️')
            .fontSize(16)
            .fontColor(this.currentColors.textMuted)
        }
        // 信息图标（i）
        Stack() {
          Circle()
            .width(22)
            .height(22)
            .fill(Color.Transparent)
            .stroke(this.currentColors.primary)
            .strokeWidth(1.5)

          Text('i')
            .fontSize(14)
            .fontColor(this.currentColors.primary)
            .fontWeight(FontWeight.Medium)
        }
        .width(36)
        .height(36)
        .onClick(() => {
          if (this.onStartEdit && this.todo.id !== undefined) {
            this.onStartEdit(this.todo.id);
          }
        })
      }
      .alignItems(VerticalAlign.Center)
    }
    .width('100%')
    .padding({ top: 10, bottom: 10, left: 16, right: 16 })
    .backgroundColor(this.currentColors.bgCard)
  }
}
