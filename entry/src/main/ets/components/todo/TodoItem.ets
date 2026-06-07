import type { TodoItem } from '../../model/TodoItem';

/**
 * 待办事项单项组件 - iOS 提醒事项风格
 * 简洁列表项，无卡片背景，细分割线，圆形复选框
 */
@Component
export struct TodoItemComponent {
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
          .fill(this.todo.status === 'completed' ? $r('app.color.primary_color') : Color.Transparent)
          .stroke(this.todo.status === 'completed' ? $r('app.color.primary_color') : $r('app.color.text_hint'))
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
          .fontColor(this.todo.status === 'completed' ? $r('app.color.text_hint') : $r('app.color.text_primary'))
          .decoration({
            type: this.todo.status === 'completed' ? TextDecorationType.LineThrough : TextDecorationType.None,
            color: $r('app.color.text_hint')
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
                .fontColor('#8E8E93')
                .maxLines(1)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
                .width('100%')
            }
            // 提醒时间
            if (this.todo.remindTime && this.todo.remindTime > 0) {
              Text(this.formatRemind(this.todo.remindTime))
                .fontSize(13)
                .fontColor('#8E8E93')
                .width('100%')
            }
            // 位置
            if (this.todo.location) {
              Text(`📍 ${this.todo.location}`)
                .fontSize(13)
                .fontColor('#8E8E93')
                .maxLines(1)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
                .width('100%')
            }
            // 标签
            if (this.todo.tag) {
              Text(`# ${this.todo.tag}`)
                .fontSize(13)
                .fontColor('#8E8E93')
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
            .fontColor(['#FF9500'])
        }
        // 图片标记
        if (this.todo.imageUris) {
          Text('🖼️') // 也可以换成 '📷'
            .fontSize(16)
            // 🌟 核心提醒：既然换成了 Text，颜色外面绝对不要加中括号 []
            .fontColor('#8E8E93')
        }
        // 信息图标（i）
        Stack() {
          Circle()
            .width(22)
            .height(22)
            .fill(Color.Transparent)
            .stroke('#FF9500')
            .strokeWidth(1.5)

          Text('i')
            .fontSize(14)
            .fontColor('#FF9500')
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
    .backgroundColor(Color.White)
  }
}
