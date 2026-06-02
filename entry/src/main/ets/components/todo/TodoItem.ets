import type { TodoItem } from '../../model/TodoItem';

/**
 * 待办事项单项组件
 */
@Component
export struct TodoItemComponent {
  // 💡 彻底去掉任何状态装饰器，变成纯粹的常规属性 (regular property)
  // 这样无论父组件怎么传，都绝对不会再报 initialized match type 的错误
  todo: TodoItem = {
    id: 0,
    content: '',
    status: 'pending',
    date: '',
    order: 0,
    createdAt: 0,
    isCarryOver: false
  };

  onToggleStatus?: (id: number) => void;
  onDelete?: (id: number) => void;

  build() {
    Row() {
      Stack() {
        Circle()
          .width(24)
          .height(24)
          .fill(this.todo.status === 'completed' ? $r('app.color.todo_completed') : Color.Transparent)
          .stroke(this.todo.status === 'completed' ? $r('app.color.todo_completed') : $r('app.color.todo_pending'))
          .strokeWidth(2)

        if (this.todo.status === 'completed') {
          Text('✓')
            .fontSize(14)
            .fontColor(Color.White)
            .fontWeight(FontWeight.Bold)
        }
      }
      .width(40)
      .height(40)
      .hitTestBehavior(HitTestMode.Block) // 锁死触摸测试，防止长按手势干扰
      .onClick(() => {
        if (this.onToggleStatus && this.todo.id !== undefined) {
          this.onToggleStatus(this.todo.id);
        }
      })

      // 任务内容
      Column() {
        Text(this.todo.content)
          .fontSize($r('app.float.font_size_md'))
          .fontColor(this.todo.status === 'completed' ? $r('app.color.todo_completed') : $r('app.color.text_primary'))
          .decoration({
            type: this.todo.status === 'completed' ? TextDecorationType.LineThrough : TextDecorationType.None,
            color: $r('app.color.todo_completed')
          })
          .textAlign(TextAlign.Start)
      }
      .layoutWeight(1)
      .margin({ left: 12 })
      .alignItems(HorizontalAlign.Start)
    }
    .width('100%')
    .padding({ top: 12, bottom: 12, left: 16, right: 16 })
    .backgroundColor($r('app.color.card_background'))
    .borderRadius($r('app.float.border_radius_md'))
    .margin({ bottom: 8 })
  }
}