if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TodoItemComponent_Params {
    currentColors?: ThemeColors;
    todo?: TodoItem;
    onToggleStatus?: (id: number) => void;
    onDelete?: (id: number) => void;
    onStartEdit?: (id: number) => void;
}
import type { TodoItem } from '../../model/TodoItem';
import type { ThemeColors } from '../../common/theme/ThemeManager';
export class TodoItemComponent extends ViewPU {
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
        this.onToggleStatus = undefined;
        this.onDelete = undefined;
        this.onStartEdit = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TodoItemComponent_Params) {
        if (params.todo === undefined) {
            this.__todo.set({
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
            });
        }
        if (params.onToggleStatus !== undefined) {
            this.onToggleStatus = params.onToggleStatus;
        }
        if (params.onDelete !== undefined) {
            this.onDelete = params.onDelete;
        }
        if (params.onStartEdit !== undefined) {
            this.onStartEdit = params.onStartEdit;
        }
    }
    updateStateVars(params: TodoItemComponent_Params) {
        this.__todo.reset(params.todo);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentColors.purgeDependencyOnElmtId(rmElmtId);
        this.__todo.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentColors.aboutToBeDeleted();
        this.__todo.aboutToBeDeleted();
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
    private onToggleStatus?: (id: number) => void;
    private onDelete?: (id: number) => void;
    private onStartEdit?: (id: number) => void;
    /**
     * 格式化提醒时间为 HH:MM
     */
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
            Row.create();
            Row.width('100%');
            Row.padding({ top: 10, bottom: 10, left: 16, right: 16 });
            Row.backgroundColor(this.currentColors.bgCard);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 圆形复选框
            Stack.create();
            // 圆形复选框
            Stack.width(40);
            // 圆形复选框
            Stack.height(40);
            // 圆形复选框
            Stack.hitTestBehavior(HitTestMode.Block);
            // 圆形复选框
            Stack.onClick(() => {
                if (this.onToggleStatus && this.todo.id !== undefined) {
                    this.onToggleStatus(this.todo.id);
                }
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(22);
            Circle.height(22);
            Circle.fill(this.todo.status === 'completed' ? this.currentColors.primary : Color.Transparent);
            Circle.stroke(this.todo.status === 'completed' ? this.currentColors.primary : this.currentColors.textMuted);
            Circle.strokeWidth(1.5);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.todo.status === 'completed') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831490, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        SymbolGlyph.fontSize(12);
                        SymbolGlyph.fontColor([Color.White]);
                        SymbolGlyph.fontWeight(FontWeight.Bold);
                    }, SymbolGlyph);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 圆形复选框
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 任务内容 + 子信息
            Column.create();
            // 任务内容 + 子信息
            Column.layoutWeight(1);
            // 任务内容 + 子信息
            Column.margin({ left: 8 });
            // 任务内容 + 子信息
            Column.alignItems(HorizontalAlign.Start);
            // 任务内容 + 子信息
            Column.onClick(() => {
                if (this.onStartEdit && this.todo.id !== undefined) {
                    this.onStartEdit(this.todo.id);
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.todo.content);
            Text.fontSize({ "id": 16777333, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.todo.status === 'completed' ? this.currentColors.textMuted : this.currentColors.textMain);
            Text.decoration({
                type: this.todo.status === 'completed' ? TextDecorationType.LineThrough : TextDecorationType.None,
                color: this.currentColors.textMuted
            });
            Text.textAlign(TextAlign.Start);
            Text.maxLines(3);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 子信息行：备注 / 提醒时间 / 位置 / 标签
            if (this.todo.remark || (this.todo.remindTime && this.todo.remindTime > 0) || this.todo.location || this.todo.tag) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.margin({ top: 2 });
                        Column.width('100%');
                        Column.alignItems(HorizontalAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 备注文字
                        if (this.todo.remark) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.todo.remark);
                                    Text.fontSize(13);
                                    Text.fontColor(this.currentColors.textMuted);
                                    Text.maxLines(1);
                                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                    Text.width('100%');
                                }, Text);
                                Text.pop();
                            });
                        }
                        // 提醒时间
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 提醒时间
                        if (this.todo.remindTime && this.todo.remindTime > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.formatRemind(this.todo.remindTime));
                                    Text.fontSize(13);
                                    Text.fontColor(this.currentColors.textMuted);
                                    Text.width('100%');
                                }, Text);
                                Text.pop();
                            });
                        }
                        // 位置
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 位置
                        if (this.todo.location) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`📍 ${this.todo.location}`);
                                    Text.fontSize(13);
                                    Text.fontColor(this.currentColors.textMuted);
                                    Text.maxLines(1);
                                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                    Text.width('100%');
                                }, Text);
                                Text.pop();
                            });
                        }
                        // 标签
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 标签
                        if (this.todo.tag) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`# ${this.todo.tag}`);
                                    Text.fontSize(13);
                                    Text.fontColor(this.currentColors.textMuted);
                                    Text.maxLines(1);
                                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                    Text.width('100%');
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 任务内容 + 子信息
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 右侧：旗帜标记 / 图片标记 / 信息图标
            Row.create({ space: 4 });
            // 右侧：旗帜标记 / 图片标记 / 信息图标
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 旗帜标记
            if (this.todo.flagged) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831595, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        SymbolGlyph.fontSize(16);
                        SymbolGlyph.fontColor([this.currentColors.primary]);
                    }, SymbolGlyph);
                });
            }
            // 图片标记
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 图片标记
            if (this.todo.imageUris) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🖼️');
                        Text.fontSize(16);
                        Text.fontColor(this.currentColors.textMuted);
                    }, Text);
                    Text.pop();
                });
            }
            // 信息图标（i）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 信息图标（i）
            Stack.create();
            // 信息图标（i）
            Stack.width(36);
            // 信息图标（i）
            Stack.height(36);
            // 信息图标（i）
            Stack.onClick(() => {
                if (this.onStartEdit && this.todo.id !== undefined) {
                    this.onStartEdit(this.todo.id);
                }
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(22);
            Circle.height(22);
            Circle.fill(Color.Transparent);
            Circle.stroke(this.currentColors.primary);
            Circle.strokeWidth(1.5);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('i');
            Text.fontSize(14);
            Text.fontColor(this.currentColors.primary);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        // 信息图标（i）
        Stack.pop();
        // 右侧：旗帜标记 / 图片标记 / 信息图标
        Row.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
