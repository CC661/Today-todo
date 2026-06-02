import type { TodoItem } from '../../model/TodoItem';
import { TodoItemComponent } from './TodoItem';

@Component
export struct TodoListComponent {
  @Prop todos: TodoItem[];
  onToggleStatus?: (id: number) => void;
  onDelete?: (id: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;

  @Builder
  deleteButtonBuilder(item: TodoItem) {
    if (item) {
      Button('删除')
        .backgroundColor('#FF3B30')
        .fontSize($r('app.float.font_size_base'))
        .fontColor(Color.White)
        .width(80)
        .height('100%')
        .onClick(() => {
          if (this.onDelete && item.id !== undefined) {
            this.onDelete(item.id);
          }
        })
    }
  }

  build() {
    List({ space: 0 }) {
      ForEach(this.todos, (todo: TodoItem, index: number) => {
        ListItem() {
          // 💡 普通属性对普通属性，最纯粹的赋值，零装饰器污染，100% 绿灯通过编译
          TodoItemComponent({
            todo: todo,
            onToggleStatus: this.onToggleStatus,
            onDelete: this.onDelete
          })
        }
        .swipeAction({
          end: {
            builder: () => { this.deleteButtonBuilder(todo) }
          }
        })
      }, (todo: TodoItem) => {
        // 💡 极其重要：利用 Key 值联动状态（id + status）
        // 这样只要你在上层页面更改了 status，整个 ListItem 的键值就会变
        // 从而强制整个 List 行刷新，完美规避任何 `skip mark dirty` 的不刷新顽疾！
        return todo && todo.id ? `${todo.id.toString()}_${todo.status}` : Math.random().toString();
      })
    }
    .width('100%')
    .layoutWeight(1)
    .scrollBar(BarState.Off)
  }
}