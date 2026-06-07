import type { TodoItem } from '../../model/TodoItem';
import { TodoItemComponent } from './TodoItem';

/**
 * 待办列表组件 - iOS 提醒事项风格
 * 支持长按拖拽排序，内联编辑
 */
@Component
export struct TodoListComponent {
  @Prop todos: TodoItem[];
  @Prop editingTodoId: number = 0;
  @Prop isAddingRemark: boolean = false;
  onToggleStatus?: (id: number) => void;
  onDelete?: (id: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onContentChange?: (id: number, content: string) => void;
  onEditSubmit?: (id: number, content: string, remark?: string) => void;
  onStartEdit?: (id: number) => void;
  onAddRemarkClick?: () => void; // 点击"添加备注"回调

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

  /**
   * 长按拖拽时显示的悬浮卡片
   */
  @Builder
  CustomDragPreviewBuilder(todo: TodoItem) {
    Row() {
      Text(todo.content || '')
        .fontSize(16)
        .fontColor('#1D1D1F')
    }
    .width('90%')
    .height(44)
    .backgroundColor(Color.White)
    .borderRadius(8)
    .shadow({ radius: 8, color: '#20000000' })
    .padding({ left: 16, right: 16 })
  }

  build() {
    List({ space: 0 }) {
      ForEach(this.todos, (todo: TodoItem, index: number) => {
        ListItem() {
          if (this.editingTodoId !== undefined && this.editingTodoId !== 0 && todo.id === this.editingTodoId) {
            this.EditingTodoItem(todo)
          } else {
            TodoItemComponent({
              todo: todo,
              onToggleStatus: this.onToggleStatus,
              onDelete: this.onDelete,
              onStartEdit: this.onStartEdit
            })
          }
        }
        .swipeAction({
          end: {
            builder: () => { this.deleteButtonBuilder(todo) }
          }
        })
      }, (todo: TodoItem) => {
        if (todo && todo.id !== undefined && todo.id !== 0) {
          return `Todo_${todo.id}_${todo.status}_${todo.remark || ''}_${todo.remindTime || 0}`;
        }
        return `Todo_temp_${todo.content}`;
      })
    }
    .width('100%')
    .layoutWeight(1)
    .scrollBar(BarState.Off)
    .divider({ strokeWidth: 0.5, color: '#E5E5EA', startMargin: 48 })
    .editMode(true)
    .onItemDragStart((event: ItemDragInfo, itemIndex: number) => {
      // 🌟 使用修改后的新名字
      return this.CustomDragPreviewBuilder(this.todos[itemIndex]);
    })
    .onItemDrop((event: ItemDragInfo, itemIndex: number, insertIndex: number, isSuccess: boolean) => {
      if (isSuccess && this.onReorder && itemIndex !== insertIndex) {
        console.info(`[TodoList] onItemDrop: itemIndex=${itemIndex}, insertIndex=${insertIndex}`);
        this.onReorder(itemIndex, insertIndex);
      }
    })
  }

  @Builder
  EditingTodoItem(todo: TodoItem) {
    InlineEditInputView({
      todo: todo,
      isAddingRemark: this.isAddingRemark,
      onContentChange: this.onContentChange,
      onEditSubmit: this.onEditSubmit,
      onAddRemarkClick: this.onAddRemarkClick
    })
  }
}

/**
 * 内联编辑输入组件 - iOS 风格
 * 支持备注输入框和提醒时间展示
 */
@Component
struct InlineEditInputView {
  @Prop todo: TodoItem;
  @Prop isAddingRemark: boolean = false;
  @State private inputBuffer: string = '';
  @State private remarkBuffer: string = '';
  onContentChange?: (id: number, content: string) => void;
  onEditSubmit?: (id: number, content: string, remark?: string) => void;
  onAddRemarkClick?: () => void;

  aboutToAppear() {
    this.inputBuffer = this.todo.content || '';
    this.remarkBuffer = this.todo.remark || '';
  }

  private formatRemind(timestamp: number): string {
    if (timestamp <= 0) return '';
    const date = new Date(timestamp);
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }

  build() {
    Column() {
      Row() {
        // 圆形复选框（编辑状态空心）
        Stack() {
          Circle()
            .width(22)
            .height(22)
            .fill(Color.Transparent)
            .stroke($r('app.color.text_hint'))
            .strokeWidth(1.5)
        }
        .width(40)
        .height(40)

        Column() {
          // 标题输入框
          TextInput({ text: this.inputBuffer, placeholder: $r('app.string.add_todo_placeholder') })
            .type(InputType.Normal)
            .id(`TodoInput_${this.todo.id}`)
            .fontSize($r('app.float.font_size_md'))
            .fontColor($r('app.color.text_primary'))
            .backgroundColor(Color.Transparent)
            .padding(0)
            .width('100%')
            .height(28)
            .defaultFocus(true)
            .onChange((value: string) => {
              this.inputBuffer = value;
              if (this.onContentChange && this.todo.id !== undefined) {
                this.onContentChange(this.todo.id, value);
              }
            })
            .onSubmit(() => {
              if (this.onEditSubmit && this.todo.id !== undefined) {
                this.onEditSubmit(this.todo.id, this.inputBuffer, this.remarkBuffer);
              }
            })
            .onBlur(() => {
              if (this.todo.id !== undefined && this.todo.content !== this.inputBuffer) {
                this.todo.content = this.inputBuffer;
              }
              if (this.onEditSubmit && this.todo.id !== undefined) {
                this.onEditSubmit(this.todo.id, this.inputBuffer, this.remarkBuffer);
              }
            })

          // 备注输入框（工具栏"备注"按钮展开时显示）
          if (this.isAddingRemark) {
            TextInput({ text: this.remarkBuffer, placeholder: $r('app.string.todo_remark_placeholder') })
              .fontSize(13)
              .fontColor('#8E8E93')
              .backgroundColor('#F5F5F7')
              .borderRadius(6)
              .padding({ left: 8, right: 8 })
              .width('100%')
              .height(30)
              .margin({ top: 4 })
              .onChange((value: string) => {
                this.remarkBuffer = value;
              })
          }

          // 未展开备注时，显示"添加备注"占位文字（可点击唤醒键盘）
          if (!this.isAddingRemark) {
            Text($r('app.string.todo_remark_placeholder'))
              .fontSize(13)
              .fontColor('#C7C7CC')
              .margin({ top: 4 })
              .width('100%')
              .onClick(() => {
                if (this.onAddRemarkClick) {
                  this.onAddRemarkClick();
                }
              })
          }

          // 提醒时间展示（编辑状态下显示）
          if (this.todo.remindTime && this.todo.remindTime > 0) {
            Row({ space: 2 }) {
              SymbolGlyph($r('sys.symbol.alarm'))
                .fontSize(11)
                .fontColor([$r('app.color.primary_color')])
              Text(this.formatRemind(this.todo.remindTime))
                .fontSize(12)
                .fontColor($r('app.color.primary_color'))
            }
            .margin({ top: 6 })
            .width('100%')
          }
        }
        .layoutWeight(1)
        .margin({ left: 8 })
      }
      .width('100%')
      .alignItems(VerticalAlign.Top)
    }
    .width('100%')
    .padding({ top: 10, bottom: 10, left: 16, right: 16 })
    .backgroundColor(Color.White)
  }
}
