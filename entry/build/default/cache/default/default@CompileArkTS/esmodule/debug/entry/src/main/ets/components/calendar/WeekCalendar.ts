if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WeekCalendarComponent_Params {
    currentWeek?: string[];
    selectedDate?: string;
    onDateSelected?: (date: string) => void;
    colors?: ThemeColors;
}
import DateUtils from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtils&";
import type { ThemeColors } from '../../common/theme/ThemeManager';
export default class WeekCalendarComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentWeek = new SynchedPropertyObjectOneWayPU(params.currentWeek, this, "currentWeek");
        this.__selectedDate = new SynchedPropertySimpleOneWayPU(params.selectedDate, this, "selectedDate");
        this.onDateSelected = undefined;
        this.__colors = new SynchedPropertyObjectOneWayPU(params.colors, this, "colors");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WeekCalendarComponent_Params) {
        if (params.onDateSelected !== undefined) {
            this.onDateSelected = params.onDateSelected;
        }
    }
    updateStateVars(params: WeekCalendarComponent_Params) {
        this.__currentWeek.reset(params.currentWeek);
        this.__selectedDate.reset(params.selectedDate);
        this.__colors.reset(params.colors);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentWeek.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__colors.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentWeek.aboutToBeDeleted();
        this.__selectedDate.aboutToBeDeleted();
        this.__colors.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentWeek: SynchedPropertySimpleOneWayPU<string[]>;
    get currentWeek() {
        return this.__currentWeek.get();
    }
    set currentWeek(newValue: string[]) {
        this.__currentWeek.set(newValue);
    }
    private __selectedDate: SynchedPropertySimpleOneWayPU<string>;
    get selectedDate() {
        return this.__selectedDate.get();
    }
    set selectedDate(newValue: string) {
        this.__selectedDate.set(newValue);
    }
    private onDateSelected?: (date: string) => void;
    // 🛠️ 修复核心：声明 colors 变量，接收父组件传递的主题配色方案
    private __colors: SynchedPropertySimpleOneWayPU<ThemeColors>;
    get colors() {
        return this.__colors.get();
    }
    set colors(newValue: ThemeColors) {
        this.__colors.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
            Row.backgroundColor(this.colors.bgCard);
            Row.borderRadius({ "id": 16777327, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Row.shadow({
                radius: 12,
                color: '#0d000000',
                offsetX: 0,
                offsetY: 4
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const date = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.layoutWeight(1);
                    Column.height(60);
                    Column.justifyContent(FlexAlign.Center);
                    Column.backgroundColor(this.selectedDate === date ? this.colors.primary : Color.Transparent);
                    Column.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Column.onClick(() => {
                        if (this.onDateSelected) {
                            this.onDateSelected(date);
                        }
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 星期几
                    Text.create(DateUtils.getChineseWeekday(date).substring(1));
                    // 星期几
                    Text.fontSize({ "id": 16777336, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    // 星期几
                    Text.fontColor(this.selectedDate === date ? Color.White : this.colors.textMuted);
                    // 星期几
                    Text.margin({ bottom: 4 });
                }, Text);
                // 星期几
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 日期数字
                    Text.create(date.split('-')[2]);
                    // 日期数字
                    Text.fontSize(this.selectedDate === date ? { "id": 16777332, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    // 日期数字
                    Text.fontColor(this.selectedDate === date ? Color.White : this.colors.textMain);
                    // 日期数字
                    Text.fontWeight(this.selectedDate === date ? FontWeight.Bold : FontWeight.Normal);
                }, Text);
                // 日期数字
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    // 今天标记（小圆点）
                    if (DateUtils.isToday(date) && this.selectedDate !== date) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Circle.create();
                                Circle.width(4);
                                Circle.height(4);
                                Circle.fill(this.colors.primary);
                                Circle.margin({ top: 4 });
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
            };
            this.forEachUpdateFunction(elmtId, this.currentWeek, forEachItemGenFunction, (date: string) => date, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
