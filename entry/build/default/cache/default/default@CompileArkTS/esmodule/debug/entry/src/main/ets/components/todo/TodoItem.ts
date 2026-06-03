if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TodoItemComponent_Params {
    // 💡 彻底去掉任何状态装饰器，变成纯粹的常规属性 (regular property)
    // 这样无论父组件怎么传，都绝对不会再报 initialized match type 的错误
    todo?: TodoItem;
    onToggleStatus?: (id: number) => void;
    onDelete?: (id: number) => void;
}
import type { TodoItem } from '../../model/TodoItem';
export class TodoItemComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.todo = {
            id: 0,
            content: '',
            status: 'pending',
            date: '',
            order: 0,
            createdAt: 0,
            isCarryOver: false
        };
        this.onToggleStatus = undefined;
        this.onDelete = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TodoItemComponent_Params) {
        if (params.todo !== undefined) {
            this.todo = params.todo;
        }
        if (params.onToggleStatus !== undefined) {
            this.onToggleStatus = params.onToggleStatus;
        }
        if (params.onDelete !== undefined) {
            this.onDelete = params.onDelete;
        }
    }
    updateStateVars(params: TodoItemComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 💡 彻底去掉任何状态装饰器，变成纯粹的常规属性 (regular property)
    // 这样无论父组件怎么传，都绝对不会再报 initialized match type 的错误
    private todo: TodoItem;
    private onToggleStatus?: (id: number) => void;
    private onDelete?: (id: number) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 12, bottom: 12, left: 16, right: 16 });
            Row.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Row.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(40);
            Stack.height(40);
            Stack.hitTestBehavior(HitTestMode.Block);
            Stack.onClick(() => {
                if (this.onToggleStatus && this.todo.id !== undefined) {
                    this.onToggleStatus(this.todo.id);
                }
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(24);
            Circle.height(24);
            Circle.fill(this.todo.status === 'completed' ? { "id": 16777307, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : Color.Transparent);
            Circle.stroke(this.todo.status === 'completed' ? { "id": 16777307, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777308, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Circle.strokeWidth(2);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.todo.status === 'completed') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✓');
                        Text.fontSize(14);
                        Text.fontColor(Color.White);
                        Text.fontWeight(FontWeight.Bold);
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
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 任务内容
            Column.create();
            // 任务内容
            Column.layoutWeight(1);
            // 任务内容
            Column.margin({ left: 12 });
            // 任务内容
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.todo.content);
            Text.fontSize({ "id": 16777316, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.todo.status === 'completed' ? { "id": 16777307, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.decoration({
                type: this.todo.status === 'completed' ? TextDecorationType.LineThrough : TextDecorationType.None,
                color: { "id": 16777307, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }
            });
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        // 任务内容
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
