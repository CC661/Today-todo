if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TodoListComponent_Params {
    todos?: TodoItem[];
    onToggleStatus?: (id: number) => void;
    onDelete?: (id: number) => void;
    onReorder?: (fromIndex: number, toIndex: number) => void;
}
import type { TodoItem } from '../../model/TodoItem';
import { TodoItemComponent } from "@normalized:N&&&entry/src/main/ets/components/todo/TodoItem&";
export class TodoListComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__todos = new SynchedPropertyObjectOneWayPU(params.todos, this, "todos");
        this.onToggleStatus = undefined;
        this.onDelete = undefined;
        this.onReorder = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TodoListComponent_Params) {
        if (params.onToggleStatus !== undefined) {
            this.onToggleStatus = params.onToggleStatus;
        }
        if (params.onDelete !== undefined) {
            this.onDelete = params.onDelete;
        }
        if (params.onReorder !== undefined) {
            this.onReorder = params.onReorder;
        }
    }
    updateStateVars(params: TodoListComponent_Params) {
        this.__todos.reset(params.todos);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__todos.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__todos.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __todos: SynchedPropertySimpleOneWayPU<TodoItem[]>;
    get todos() {
        return this.__todos.get();
    }
    set todos(newValue: TodoItem[]) {
        this.__todos.set(newValue);
    }
    private onToggleStatus?: (id: number) => void;
    private onDelete?: (id: number) => void;
    private onReorder?: (fromIndex: number, toIndex: number) => void;
    deleteButtonBuilder(item: TodoItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('删除');
                        Button.backgroundColor('#FF3B30');
                        Button.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: 0 });
            List.width('100%');
            List.layoutWeight(1);
            List.scrollBar(BarState.Off);
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
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new 
                                    // 💡 普通属性对普通属性，最纯粹的赋值，零装饰器污染，100% 绿灯通过编译
                                    TodoItemComponent(this, {
                                        todo: todo,
                                        onToggleStatus: this.onToggleStatus,
                                        onDelete: this.onDelete
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/todo/TodoList.ets", line: 33, col: 11 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            todo: todo,
                                            onToggleStatus: this.onToggleStatus,
                                            onDelete: this.onDelete
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                                }
                            }, { name: "TodoItemComponent" });
                        }
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.todos, forEachItemGenFunction, (todo: TodoItem) => {
                // 💡 极其重要：利用 Key 值联动状态（id + status）
                // 这样只要你在上层页面更改了 status，整个 ListItem 的键值就会变
                // 从而强制整个 List 行刷新，完美规避任何 `skip mark dirty` 的不刷新顽疾！
                return todo && todo.id ? `${todo.id.toString()}_${todo.status}` : Math.random().toString();
            }, true, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
