if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MonthCalendarComponent_Params {
    calendar?: (string | null)[][];
    selectedDate?: string;
    eventDates?: Set<string>;
    onDateSelected?: (date: string) => void;
}
import DateUtils from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtils&";
export default class MonthCalendarComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__calendar = new SynchedPropertyObjectOneWayPU(params.calendar, this, "calendar");
        this.__selectedDate = new SynchedPropertySimpleOneWayPU(params.selectedDate, this, "selectedDate");
        this.__eventDates = new SynchedPropertyObjectOneWayPU(params.eventDates, this, "eventDates");
        this.onDateSelected = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MonthCalendarComponent_Params) {
        if (params.onDateSelected !== undefined) {
            this.onDateSelected = params.onDateSelected;
        }
    }
    updateStateVars(params: MonthCalendarComponent_Params) {
        this.__calendar.reset(params.calendar);
        this.__selectedDate.reset(params.selectedDate);
        this.__eventDates.reset(params.eventDates);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__calendar.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__eventDates.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__calendar.aboutToBeDeleted();
        this.__selectedDate.aboutToBeDeleted();
        this.__eventDates.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __calendar: SynchedPropertySimpleOneWayPU<(string | null)[][]>;
    get calendar() {
        return this.__calendar.get();
    }
    set calendar(newValue: (string | null)[][]) {
        this.__calendar.set(newValue);
    }
    private __selectedDate: SynchedPropertySimpleOneWayPU<string>;
    get selectedDate() {
        return this.__selectedDate.get();
    }
    set selectedDate(newValue: string) {
        this.__selectedDate.set(newValue);
    }
    private __eventDates: SynchedPropertySimpleOneWayPU<Set<string>>; // 有事件的日期集合
    get eventDates() {
        return this.__eventDates.get();
    }
    set eventDates(newValue: Set<string>) {
        this.__eventDates.set(newValue);
    }
    private onDateSelected?: (date: string) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.borderRadius({ "id": 16777310, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.shadow({
                radius: 8,
                color: '#10000000',
                offsetX: 0,
                offsetY: 2
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 星期标题行
            Row.create();
            // 星期标题行
            Row.width('100%');
            // 星期标题行
            Row.padding({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const day = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(day);
                    Text.fontSize({ "id": 16777319, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor({ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.layoutWeight(1);
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, ['日', '一', '二', '三', '四', '五', '六'], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 星期标题行
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期网格
            ForEach.create();
            const forEachItemGenFunction = (_item, weekIndex: number) => {
                const week = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.margin({ bottom: 4 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    ForEach.create();
                    const forEachItemGenFunction = _item => {
                        const date = _item;
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (date === null) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 空白天数
                                        Text.create('');
                                        // 空白天数
                                        Text.layoutWeight(1);
                                        // 空白天数
                                        Text.height(40);
                                    }, Text);
                                    // 空白天数
                                    Text.pop();
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.layoutWeight(1);
                                        Column.height(40);
                                        Column.justifyContent(FlexAlign.Center);
                                        Column.backgroundColor(this.selectedDate === date ? { "id": 16777295, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : Color.Transparent);
                                        Column.borderRadius({ "id": 16777312, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                        Column.onClick(() => {
                                            if (this.onDateSelected) {
                                                this.onDateSelected(date);
                                            }
                                        });
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(date.split('-')[2]);
                                        Text.fontSize(this.selectedDate === date ? { "id": 16777316, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                        Text.fontColor(this.selectedDate === date ? Color.White :
                                            DateUtils.isToday(date) ? { "id": 16777296, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                        Text.fontWeight(this.selectedDate === date ? FontWeight.Bold : FontWeight.Normal);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        // 事件标记点
                                        if (this.eventDates.has(date) && this.selectedDate !== date) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Circle.create();
                                                    Circle.width(4);
                                                    Circle.height(4);
                                                    Circle.fill({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                    Circle.margin({ top: 2 });
                                                }, Circle);
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
                        }, If);
                        If.pop();
                    };
                    this.forEachUpdateFunction(elmtId, week, forEachItemGenFunction);
                }, ForEach);
                ForEach.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.calendar, forEachItemGenFunction, (week: (string | null)[], index: number) => index.toString(), true, true);
        }, ForEach);
        // 日期网格
        ForEach.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
