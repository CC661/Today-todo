if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface InlineEditInputView_Params {
    currentColors?: ThemeColors;
    todo?: TodoItem;
    isAddingRemark?: boolean;
    inputBuffer?: string;
    remarkBuffer?: string;
    onContentChange?: (id: number, content: string) => void;
    onEditSubmit?: (id: number, content: string, remark?: string) => void;
    onAddRemarkClick?: () => void;
}
interface TodoListComponent_Params {
    currentColors?: ThemeColors;
    todos?: TodoItem[];
    editingTodoId?: number;
    isAddingRemark?: boolean;
    onToggleStatus?: (id: number) => void;
    onDelete?: (id: number) => void;
    onReorder?: (fromIndex: number, toIndex: number) => void;
    onContentChange?: (id: number, content: string) => void;
    onEditSubmit?: (id: number, content: string, remark?: string) => void;
    onStartEdit?: (id: number) => void;
    onAddRemarkClick?: () => void;
}
import type { TodoItem } from '../../model/TodoItem';
import type { ThemeColors } from '../../common/theme/ThemeManager';
import { TodoItemComponent } from "@normalized:N&&&entry/src/main/ets/components/todo/TodoItem&";
export class TodoListComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentColors = this.createStorageLink('app_active_theme', {
            primary: '#ffac34',
            bgMain: '#fdfaf2',
            bgCard: '#ffffff',
            textMain: '#3e2723',
            textMuted: '#ffcd84',
            border: '#f6f0e2'
        }, "currentColors");
        this.__todos = new SynchedPropertyObjectOneWayPU(params.todos, this, "todos");
        this.__editingTodoId = new SynchedPropertySimpleOneWayPU(params.editingTodoId, this, "editingTodoId");
        this.__isAddingRemark = new SynchedPropertySimpleOneWayPU(params.isAddingRemark, this, "isAddingRemark");
        this.onToggleStatus = undefined;
        this.onDelete = undefined;
        this.onReorder = undefined;
        this.onContentChange = undefined;
        this.onEditSubmit = undefined;
        this.onStartEdit = undefined;
        this.onAddRemarkClick = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TodoListComponent_Params) {
        if (params.editingTodoId === undefined) {
            this.__editingTodoId.set(0);
        }
        if (params.isAddingRemark === undefined) {
            this.__isAddingRemark.set(false);
        }
        if (params.onToggleStatus !== undefined) {
            this.onToggleStatus = params.onToggleStatus;
        }
        if (params.onDelete !== undefined) {
            this.onDelete = params.onDelete;
        }
        if (params.onReorder !== undefined) {
            this.onReorder = params.onReorder;
        }
        if (params.onContentChange !== undefined) {
            this.onContentChange = params.onContentChange;
        }
        if (params.onEditSubmit !== undefined) {
            this.onEditSubmit = params.onEditSubmit;
        }
        if (params.onStartEdit !== undefined) {
            this.onStartEdit = params.onStartEdit;
        }
        if (params.onAddRemarkClick !== undefined) {
            this.onAddRemarkClick = params.onAddRemarkClick;
        }
    }
    updateStateVars(params: TodoListComponent_Params) {
        this.__todos.reset(params.todos);
        this.__editingTodoId.reset(params.editingTodoId);
        this.__isAddingRemark.reset(params.isAddingRemark);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentColors.purgeDependencyOnElmtId(rmElmtId);
        this.__todos.purgeDependencyOnElmtId(rmElmtId);
        this.__editingTodoId.purgeDependencyOnElmtId(rmElmtId);
        this.__isAddingRemark.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentColors.aboutToBeDeleted();
        this.__todos.aboutToBeDeleted();
        this.__editingTodoId.aboutToBeDeleted();
        this.__isAddingRemark.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentColors: ObservedPropertyAbstractPU<ThemeColors>;
    get currentColors() {
        return this.__currentColors.get();
    }
    set currentColors(newValue: ThemeColors) {
        this.__currentColors.set(newValue);
    }
    private __todos: SynchedPropertySimpleOneWayPU<TodoItem[]>;
    get todos() {
        return this.__todos.get();
    }
    set todos(newValue: TodoItem[]) {
        this.__todos.set(newValue);
    }
    private __editingTodoId: SynchedPropertySimpleOneWayPU<number>;
    get editingTodoId() {
        return this.__editingTodoId.get();
    }
    set editingTodoId(newValue: number) {
        this.__editingTodoId.set(newValue);
    }
    private __isAddingRemark: SynchedPropertySimpleOneWayPU<boolean>;
    get isAddingRemark() {
        return this.__isAddingRemark.get();
    }
    set isAddingRemark(newValue: boolean) {
        this.__isAddingRemark.set(newValue);
    }
    private onToggleStatus?: (id: number) => void;
    private onDelete?: (id: number) => void;
    private onReorder?: (fromIndex: number, toIndex: number) => void;
    private onContentChange?: (id: number, content: string) => void;
    private onEditSubmit?: (id: number, content: string, remark?: string) => void;
    private onStartEdit?: (id: number) => void;
    private onAddRemarkClick?: () => void; // 点击"添加备注"回调
    deleteButtonBuilder(item: TodoItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('删除');
                        Button.backgroundColor('#FF3B30');
                        Button.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.fontColor(Color.White);
                        Button.width(80);
                        Button.height('100%');
                        Button.onClick(() => {
                            if (this.onDelete && item.id !== undefined) {
                                this.onDelete(item.id);
                            }
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else /**
             * 长按拖拽时显示的悬浮卡片
             */ {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    /**
     * 长按拖拽时显示的悬浮卡片
     */
    CustomDragPreviewBuilder(todo: TodoItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('90%');
            Row.height(44);
            Row.backgroundColor(this.currentColors.bgCard);
            Row.borderRadius(8);
            Row.shadow({ radius: 8, color: '#20000000' });
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(todo.content || '');
            Text.fontSize(16);
            Text.fontColor(this.currentColors.textMain);
        }, Text);
        Text.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: 0 });
            List.width('100%');
            List.layoutWeight(1);
            List.scrollBar(BarState.Off);
            List.divider({ strokeWidth: 0.5, color: this.currentColors.border, startMargin: 48 });
            List.editMode(true);
            List.onItemDragStart((event: ItemDragInfo, itemIndex: number) => {
                return { builder: () => {
                        this.CustomDragPreviewBuilder.call(this, this.todos[itemIndex]);
                    } };
            });
            List.onItemDrop((event: ItemDragInfo, itemIndex: number, insertIndex: number, isSuccess: boolean) => {
                if (isSuccess && this.onReorder && itemIndex !== insertIndex) {
                    console.info(`[TodoList] onItemDrop: itemIndex=${itemIndex}, insertIndex=${insertIndex}`);
                    this.onReorder(itemIndex, insertIndex);
                }
            });
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const todo = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, true);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                        ListItem.swipeAction({
                            end: {
                                builder: () => { this.deleteButtonBuilder(todo); }
                            }
                        });
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (this.editingTodoId !== undefined && this.editingTodoId !== 0 && todo.id === this.editingTodoId) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.EditingTodoItem.bind(this)(todo);
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new TodoItemComponent(this, {
                                                    todo: todo,
                                                    onToggleStatus: this.onToggleStatus,
                                                    onDelete: this.onDelete,
                                                    onStartEdit: this.onStartEdit
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/todo/TodoList.ets", line: 73, col: 13 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        todo: todo,
                                                        onToggleStatus: this.onToggleStatus,
                                                        onDelete: this.onDelete,
                                                        onStartEdit: this.onStartEdit
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    todo: todo
                                                });
                                            }
                                        }, { name: "TodoItemComponent" });
                                    }
                                });
                            }
                        }, If);
                        If.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.todos, forEachItemGenFunction, (todo: TodoItem) => {
                if (todo && todo.id !== undefined && todo.id !== 0) {
                    return `Todo_${todo.id}_${todo.status}_${todo.remark || ''}_${todo.remindTime || 0}`;
                }
                return `Todo_temp_${todo.content}`;
            }, true, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
    }
    EditingTodoItem(todo: TodoItem, parent = null) {
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new InlineEditInputView(this, {
                        todo: todo,
                        isAddingRemark: this.isAddingRemark,
                        onContentChange: this.onContentChange,
                        onEditSubmit: this.onEditSubmit,
                        onAddRemarkClick: this.onAddRemarkClick
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/todo/TodoList.ets", line: 111, col: 5 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            todo: todo,
                            isAddingRemark: this.isAddingRemark,
                            onContentChange: this.onContentChange,
                            onEditSubmit: this.onEditSubmit,
                            onAddRemarkClick: this.onAddRemarkClick
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        todo: todo,
                        isAddingRemark: this.isAddingRemark
                    });
                }
            }, { name: "InlineEditInputView" });
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class InlineEditInputView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentColors = this.createStorageLink('app_active_theme', {
            primary: '#ffac34',
            bgMain: '#fdfaf2',
            bgCard: '#ffffff',
            textMain: '#3e2723',
            textMuted: '#ffcd84',
            border: '#f6f0e2'
        }, "currentColors");
        this.__todo = new SynchedPropertyObjectOneWayPU(params.todo, this, "todo");
        this.__isAddingRemark = new SynchedPropertySimpleOneWayPU(params.isAddingRemark, this, "isAddingRemark");
        this.__inputBuffer = new ObservedPropertySimplePU('', this, "inputBuffer");
        this.__remarkBuffer = new ObservedPropertySimplePU('', this, "remarkBuffer");
        this.onContentChange = undefined;
        this.onEditSubmit = undefined;
        this.onAddRemarkClick = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: InlineEditInputView_Params) {
        if (params.isAddingRemark === undefined) {
            this.__isAddingRemark.set(false);
        }
        if (params.inputBuffer !== undefined) {
            this.inputBuffer = params.inputBuffer;
        }
        if (params.remarkBuffer !== undefined) {
            this.remarkBuffer = params.remarkBuffer;
        }
        if (params.onContentChange !== undefined) {
            this.onContentChange = params.onContentChange;
        }
        if (params.onEditSubmit !== undefined) {
            this.onEditSubmit = params.onEditSubmit;
        }
        if (params.onAddRemarkClick !== undefined) {
            this.onAddRemarkClick = params.onAddRemarkClick;
        }
    }
    updateStateVars(params: InlineEditInputView_Params) {
        this.__todo.reset(params.todo);
        this.__isAddingRemark.reset(params.isAddingRemark);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentColors.purgeDependencyOnElmtId(rmElmtId);
        this.__todo.purgeDependencyOnElmtId(rmElmtId);
        this.__isAddingRemark.purgeDependencyOnElmtId(rmElmtId);
        this.__inputBuffer.purgeDependencyOnElmtId(rmElmtId);
        this.__remarkBuffer.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentColors.aboutToBeDeleted();
        this.__todo.aboutToBeDeleted();
        this.__isAddingRemark.aboutToBeDeleted();
        this.__inputBuffer.aboutToBeDeleted();
        this.__remarkBuffer.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentColors: ObservedPropertyAbstractPU<ThemeColors>;
    get currentColors() {
        return this.__currentColors.get();
    }
    set currentColors(newValue: ThemeColors) {
        this.__currentColors.set(newValue);
    }
    private __todo: SynchedPropertySimpleOneWayPU<TodoItem>;
    get todo() {
        return this.__todo.get();
    }
    set todo(newValue: TodoItem) {
        this.__todo.set(newValue);
    }
    private __isAddingRemark: SynchedPropertySimpleOneWayPU<boolean>;
    get isAddingRemark() {
        return this.__isAddingRemark.get();
    }
    set isAddingRemark(newValue: boolean) {
        this.__isAddingRemark.set(newValue);
    }
    private __inputBuffer: ObservedPropertySimplePU<string>;
    get inputBuffer() {
        return this.__inputBuffer.get();
    }
    set inputBuffer(newValue: string) {
        this.__inputBuffer.set(newValue);
    }
    private __remarkBuffer: ObservedPropertySimplePU<string>;
    get remarkBuffer() {
        return this.__remarkBuffer.get();
    }
    set remarkBuffer(newValue: string) {
        this.__remarkBuffer.set(newValue);
    }
    private onContentChange?: (id: number, content: string) => void;
    private onEditSubmit?: (id: number, content: string, remark?: string) => void;
    private onAddRemarkClick?: () => void;
    aboutToAppear() {
        this.inputBuffer = this.todo.content || '';
        this.remarkBuffer = this.todo.remark || '';
    }
    private formatRemind(timestamp: number): string {
        if (timestamp <= 0)
            return '';
        const date = new Date(timestamp);
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        return `${hour}:${minute}`;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ top: 10, bottom: 10, left: 16, right: 16 });
            Column.backgroundColor(this.currentColors.bgCard);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 圆形复选框（编辑状态空心）
            Stack.create();
            // 圆形复选框（编辑状态空心）
            Stack.width(40);
            // 圆形复选框（编辑状态空心）
            Stack.height(40);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(22);
            Circle.height(22);
            Circle.fill(Color.Transparent);
            Circle.stroke(this.currentColors.textMuted);
            Circle.strokeWidth(1.5);
        }, Circle);
        // 圆形复选框（编辑状态空心）
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.margin({ left: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题输入框
            TextInput.create({ text: this.inputBuffer, placeholder: { "id": 16777220, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
            // 标题输入框
            TextInput.type(InputType.Normal);
            // 标题输入框
            TextInput.id(`TodoInput_${this.todo.id}`);
            // 标题输入框
            TextInput.fontSize({ "id": 16777333, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            // 标题输入框
            TextInput.fontColor(this.currentColors.textMain);
            // 标题输入框
            TextInput.backgroundColor(Color.Transparent);
            // 标题输入框
            TextInput.padding(0);
            // 标题输入框
            TextInput.width('100%');
            // 标题输入框
            TextInput.height(28);
            // 标题输入框
            TextInput.defaultFocus(true);
            // 标题输入框
            TextInput.onChange((value: string) => {
                this.inputBuffer = value;
                if (this.onContentChange && this.todo.id !== undefined) {
                    this.onContentChange(this.todo.id, value);
                }
            });
            // 标题输入框
            TextInput.onSubmit(() => {
                if (this.onEditSubmit && this.todo.id !== undefined) {
                    this.onEditSubmit(this.todo.id, this.inputBuffer, this.remarkBuffer);
                }
            });
            // 标题输入框
            TextInput.onBlur(() => {
                if (this.todo.id !== undefined && this.todo.content !== this.inputBuffer) {
                    this.todo.content = this.inputBuffer;
                }
                if (this.onEditSubmit && this.todo.id !== undefined) {
                    this.onEditSubmit(this.todo.id, this.inputBuffer, this.remarkBuffer);
                }
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 备注输入框（工具栏"备注"按钮展开时显示）
            if (this.isAddingRemark) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ text: this.remarkBuffer, placeholder: { "id": 16777306, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
                        TextInput.fontSize(13);
                        TextInput.fontColor(this.currentColors.textMuted);
                        TextInput.backgroundColor(this.currentColors.bgMain);
                        TextInput.borderRadius(6);
                        TextInput.padding({ left: 8, right: 8 });
                        TextInput.width('100%');
                        TextInput.height(30);
                        TextInput.margin({ top: 4 });
                        TextInput.onChange((value: string) => {
                            this.remarkBuffer = value;
                        });
                    }, TextInput);
                });
            }
            // 未展开备注时，显示"添加备注"占位文字（可点击唤醒键盘）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 未展开备注时，显示"添加备注"占位文字（可点击唤醒键盘）
            if (!this.isAddingRemark) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777306, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontSize(13);
                        Text.fontColor(this.currentColors.textMuted);
                        Text.margin({ top: 4 });
                        Text.width('100%');
                        Text.onClick(() => {
                            if (this.onAddRemarkClick) {
                                this.onAddRemarkClick();
                            }
                        });
                    }, Text);
                    Text.pop();
                });
            }
            // 提醒时间展示（编辑状态下显示）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 提醒时间展示（编辑状态下显示）
            if (this.todo.remindTime && this.todo.remindTime > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 2 });
                        Row.margin({ top: 6 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125832300, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        SymbolGlyph.fontSize(11);
                        SymbolGlyph.fontColor([this.currentColors.primary]);
                    }, SymbolGlyph);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.formatRemind(this.todo.remindTime));
                        Text.fontSize(12);
                        Text.fontColor(this.currentColors.primary);
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
