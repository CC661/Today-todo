/*
import type { TodoItem } from '../model/TodoItem'

@Component
export struct TodoItemView {
  @Prop item: TodoItem;
  @Prop isEditing: boolean = false; // 是否处于编辑状态

  // 编辑态的临时数据
  @State editTitle: string = '';
  @State editNote: string = '';
  @State editTime: string = '';
  @State isAddingNote: boolean = false;

  // 事件回调（由父组件实现）
  onToggle: (item: TodoItem) => void = () => {};
  onEditStart: (item: TodoItem) => void = () => {};
  onEditCommit: (id: string, title: string, note: string, time: string) => void = () => {};

  aboutToAppear() {
    this.editTitle = this.item.title;
    this.editNote = this.item.note || '';
    this.editTime = this.item.remindTime || '';
    this.isAddingNote = !!this.item.note;
  }

  build() {
    Column() {
      if (this.isEditing) {
        // --- 编辑模式 ---
        Row() {
          Circle({ width: 22, height: 22 }).strokeWidth(1.5).stroke('#D1D1D6').fill(Color.Transparent).margin({ right: 12 })
          Column() {
            TextInput({ placeholder: '准备做什么？', text: this.editTitle })
              .fontSize(16).fontColor('#1D1D1F').backgroundColor(Color.Transparent).padding(0).width('100%').height(28)
              .onChange((v) => this.editTitle = v)
              .onSubmit(() => this.onEditCommit(this.item.id, this.editTitle, this.editNote, this.editTime))

            if (this.isAddingNote) {
              TextInput({ placeholder: '备注详情...', text: this.editNote })
                .fontSize(13).fontColor('#8E8E93').backgroundColor('#F5F5F7').borderRadius(6)
                .padding({ left: 8, right: 8 }).width('100%').height(30).margin({ top: 4 })
                .onChange((v) => this.editNote = v)
            }
            if (this.editTime) {
              Row() { Text(`⏰ ${this.editTime}`).fontSize(12).fontColor('#007AFF') }.margin({ top: 6 }).width('100%')
            }
          }.layoutWeight(1)
        }
        .width('100%')
        .padding({ left: 16, right: 12, top: 12, bottom: 12 })
      } else {
        // --- 普通展示模式 ---
        Row() {
          // 打勾圆圈
          if (this.item.status === TodoStatus.COMPLETED) {
            Image($r('sys.symbol.checkmark_circle_fill')).width(22).height(22).fillColor('#34C759')
              .onClick(() => this.onToggle(this.item))
          } else {
            Circle({ width: 22, height: 22 })
              .strokeWidth(1.5)
              .stroke(this.item.status === TodoStatus.YESTERDAY_LEFT ? '#AEAEB2' : '#D1D1D6')
              .fill(Color.Transparent)
              .onClick(() => this.onToggle(this.item))
          }

          // 标题与副标题
          Column({ space: 4 }) {
            Row() {
              Text(this.item.title)
                .fontSize(16)
                .fontColor(this.item.status === TodoStatus.COMPLETED ? '#C7C7CC' : '#1D1D1F')
                .decoration(this.item.status === TodoStatus.COMPLETED ? { type: TextDecorationType.LineThrough } : { type: TextDecorationType.None })
                .maxLines(1)
                .textOverflow({ overflow: TextOverflow.Ellipsis })

              if (this.item.status === TodoStatus.YESTERDAY_LEFT) {
                Text('昨日').fontSize(10).fontColor('#86868B').backgroundColor('#F0F0F5').borderRadius(4).padding({ left: 5, right: 5, top: 2, bottom: 2 }).margin({ left: 6 })
              }
            }.width('100%')

            if (this.item.note || this.item.remindTime) {
              Row({ space: 8 }) {
                if (this.item.remindTime) Text(`⏰ ${this.item.remindTime}`).fontSize(12).fontColor('#007AFF')
                if (this.item.note) Text(this.item.note).fontSize(12).fontColor('#8E8E93').maxLines(1).textOverflow({ overflow: TextOverflow.Ellipsis }).layoutWeight(1)
              }.width('100%')
            }
          }
          .layoutWeight(1)
          .margin({ left: 12 })
          .alignItems(HorizontalAlign.Start)
          .onClick(() => this.onEditStart(this.item))

          Text('≡').fontSize(18).fontColor('#C7C7CC').width(28).textAlign(TextAlign.Center)
        }
        .width('100%')
        .padding({ left: 16, right: 12, top: 10, bottom: 10 })
      }
    }
    .width('100%')
    .backgroundColor('#FFFFFF')
  }
}*/
