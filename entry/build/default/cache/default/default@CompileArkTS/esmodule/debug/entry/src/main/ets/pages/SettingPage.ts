if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SettingPage_Params {
    currentTheme?: string;
    isDarkMode?: boolean;
    showThemePicker?: boolean;
}
import promptAction from "@ohos:promptAction";
import PreferencesUtil from "@normalized:N&&&entry/src/main/ets/common/database/PreferencesUtil&";
import RDBStoreUtil from "@normalized:N&&&entry/src/main/ets/common/database/RDBStoreUtil&";
import AppConstants from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
/**
 * 主题颜色配置
 */
interface ThemeColor {
    key: string;
    name: ResourceStr;
    color: string;
    primary: string;
    secondary: string;
}
const THEME_COLORS: ThemeColor[] = [
    { key: 'orange', name: { "id": 16777276, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, color: '#FF6B35', primary: '#FF6B35', secondary: '#004E89' },
    { key: 'blue', name: { "id": 16777273, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, color: '#1677FF', primary: '#1677FF', secondary: '#FF6B35' },
    { key: 'green', name: { "id": 16777275, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, color: '#52C41A', primary: '#52C41A', secondary: '#004E89' },
    { key: 'purple', name: { "id": 16777278, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, color: '#722ED1', primary: '#722ED1', secondary: '#FF6B35' },
    { key: 'pink', name: { "id": 16777277, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, color: '#EB2F96', primary: '#EB2F96', secondary: '#004E89' },
];
export class SettingPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentTheme = new ObservedPropertySimplePU('orange', this, "currentTheme");
        this.__isDarkMode = new ObservedPropertySimplePU(false, this, "isDarkMode");
        this.__showThemePicker = new ObservedPropertySimplePU(false, this, "showThemePicker");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SettingPage_Params) {
        if (params.currentTheme !== undefined) {
            this.currentTheme = params.currentTheme;
        }
        if (params.isDarkMode !== undefined) {
            this.isDarkMode = params.isDarkMode;
        }
        if (params.showThemePicker !== undefined) {
            this.showThemePicker = params.showThemePicker;
        }
    }
    updateStateVars(params: SettingPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentTheme.purgeDependencyOnElmtId(rmElmtId);
        this.__isDarkMode.purgeDependencyOnElmtId(rmElmtId);
        this.__showThemePicker.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentTheme.aboutToBeDeleted();
        this.__isDarkMode.aboutToBeDeleted();
        this.__showThemePicker.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentTheme: ObservedPropertySimplePU<string>;
    get currentTheme() {
        return this.__currentTheme.get();
    }
    set currentTheme(newValue: string) {
        this.__currentTheme.set(newValue);
    }
    private __isDarkMode: ObservedPropertySimplePU<boolean>;
    get isDarkMode() {
        return this.__isDarkMode.get();
    }
    set isDarkMode(newValue: boolean) {
        this.__isDarkMode.set(newValue);
    }
    private __showThemePicker: ObservedPropertySimplePU<boolean>;
    get showThemePicker() {
        return this.__showThemePicker.get();
    }
    set showThemePicker(newValue: boolean) {
        this.__showThemePicker.set(newValue);
    }
    aboutToAppear(): void {
        this.loadSettings();
    }
    async loadSettings(): Promise<void> {
        try {
            const theme = await PreferencesUtil.getThemeMode();
            this.isDarkMode = theme === 'dark';
            const themeColor = await PreferencesUtil.getString('theme_color', 'orange');
            this.currentTheme = themeColor;
        }
        catch (error) {
            console.error('加载设置失败:', error);
        }
    }
    async toggleDarkMode(): Promise<void> {
        this.isDarkMode = !this.isDarkMode;
        const mode = this.isDarkMode ? 'dark' : 'light';
        await PreferencesUtil.setThemeMode(mode);
    }
    async selectTheme(key: string): Promise<void> {
        this.currentTheme = key;
        await PreferencesUtil.saveString('theme_color', key);
        promptAction.showToast({ message: '主题已切换' });
    }
    getCurrentThemeColor(): ThemeColor {
        return THEME_COLORS.find(t => t.key === this.currentTheme) || THEME_COLORS[0];
    }
    async clearAllData(): Promise<void> {
        try {
            await RDBStoreUtil.deleteAll(AppConstants.TABLE_TODOS);
            await RDBStoreUtil.deleteAll(AppConstants.TABLE_DIARY_POSTS);
            await RDBStoreUtil.deleteAll(AppConstants.TABLE_PLOG_CANVASES);
            promptAction.showToast({ message: { "id": 16777270, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        }
        catch (error) {
            console.error('清除数据失败:', error);
        }
    }
    showClearConfirmDialog(): void {
        AlertDialog.show({
            title: { "id": 16777267, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" },
            message: { "id": 16777266, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" },
            primaryButton: {
                value: { "id": 16777271, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" },
                fontColor: '#FF4D4F',
                action: () => {
                    this.clearAllData();
                }
            },
            secondaryButton: {
                value: { "id": 16777265, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" },
                action: () => { }
            }
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.padding({ left: 16, right: 16, top: 16, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777281, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777320, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: 0 });
            List.width('100%');
            List.layoutWeight(1);
            List.divider({
                strokeWidth: 0.5,
                color: { "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" },
                startMargin: 16,
                endMargin: 16
            });
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 外观分组
            ListItemGroup.create({ header: this.sectionHeader.bind(this, { "id": 16777264, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }) });
        }, ListItemGroup);
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    // 深色模式
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding(16);
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create({ "id": 16777272, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Toggle.create({ type: ToggleType.Switch, isOn: this.isDarkMode });
                    Toggle.onChange(() => {
                        this.toggleDarkMode();
                    });
                }, Toggle);
                Toggle.pop();
                Row.pop();
                // 深色模式
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            // 深色模式
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    // 主题颜色
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding(16);
                    Row.onClick(() => { this.showThemePicker = true; });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create({ "id": 16777280, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create({ space: 6 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.getCurrentThemeColor().name);
                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create();
                    Circle.width(24);
                    Circle.height(24);
                    Circle.fill(this.getCurrentThemeColor().color);
                }, Circle);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    SymbolGlyph.create({ "id": 125832664, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    SymbolGlyph.fontSize(16);
                    SymbolGlyph.fontColor([{ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
                }, SymbolGlyph);
                Row.pop();
                Row.pop();
                // 主题颜色
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            // 主题颜色
            ListItem.pop();
        }
        // 外观分组
        ListItemGroup.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 关于分组
            ListItemGroup.create({ header: this.sectionHeader.bind(this, { "id": 16777263, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }) });
        }, ListItemGroup);
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
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding(16);
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create({ "id": 16777282, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('1.0.0');
                    Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                }, Text);
                Text.pop();
                Row.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        // 关于分组
        ListItemGroup.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数据管理分组
            ListItemGroup.create({ header: this.sectionHeader.bind(this, '数据管理') });
        }, ListItemGroup);
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
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding(16);
                    Row.onClick(() => { this.showClearConfirmDialog(); });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create({ "id": 16777268, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor('#FF4D4F');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create({ "id": 16777269, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.margin({ top: 4 });
                }, Text);
                Text.pop();
                Column.pop();
                Row.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        // 数据管理分组
        ListItemGroup.pop();
        List.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 主题选择面板
            if (this.showThemePicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.ThemePickerPanel.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    ThemePickerPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#80000000');
            Column.onClick(() => { this.showThemePicker = false; });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('90%');
            Column.padding(20);
            Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.borderRadius({ "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题行
            Row.create();
            // 标题行
            Row.width('100%');
            // 标题行
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777280, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777315, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(32);
            Button.height(32);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => { this.showThemePicker = false; });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831487, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        Button.pop();
        // 标题行
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777274, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.width('100%');
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主题色块列表
            List.create({ space: 12 });
            // 主题色块列表
            List.width('100%');
            // 主题色块列表
            List.scrollBar(BarState.Off);
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const theme = _item;
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
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.width('100%');
                            Row.padding(12);
                            Row.backgroundColor(this.currentTheme === theme.key ?
                                theme.color + '10' : { "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                            Row.borderRadius({ "id": 16777310, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                            Row.border({
                                width: this.currentTheme === theme.key ? 1.5 : 0,
                                color: this.currentTheme === theme.key ? theme.color : Color.Transparent
                            });
                            Row.onClick(() => {
                                if (this.currentTheme !== theme.key) {
                                    this.selectTheme(theme.key);
                                }
                            });
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // 颜色预览球
                            Row.create({ space: 12 });
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Circle.create();
                            Circle.width(36);
                            Circle.height(36);
                            Circle.fill(theme.color);
                            Circle.shadow({ radius: 4, color: theme.color + '40', offsetX: 0, offsetY: 2 });
                        }, Circle);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.alignItems(HorizontalAlign.Start);
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(theme.name);
                            Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                            Text.margin({ bottom: 2 });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create({ space: 4 });
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Circle.create();
                            Circle.width(10);
                            Circle.height(10);
                            Circle.fill(theme.primary);
                        }, Circle);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Circle.create();
                            Circle.width(10);
                            Circle.height(10);
                            Circle.fill(theme.secondary);
                        }, Circle);
                        Row.pop();
                        Column.pop();
                        // 颜色预览球
                        Row.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Blank.create();
                        }, Blank);
                        Blank.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            // 选中标记
                            if (this.currentTheme === theme.key) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 4 });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        SymbolGlyph.create({ "id": 125831490, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                        SymbolGlyph.fontSize(16);
                                        SymbolGlyph.fontColor([theme.color]);
                                    }, SymbolGlyph);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create({ "id": 16777279, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                        Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                        Text.fontColor(theme.color);
                                    }, Text);
                                    Text.pop();
                                    Row.pop();
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Button.createWithLabel('选择');
                                        Button.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                        Button.fontColor(theme.color);
                                        Button.backgroundColor(theme.color + '15');
                                        Button.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                        Button.padding({ left: 12, right: 12 });
                                    }, Button);
                                    Button.pop();
                                });
                            }
                        }, If);
                        If.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, THEME_COLORS, forEachItemGenFunction, (theme: ThemeColor) => theme.key, false, false);
        }, ForEach);
        ForEach.pop();
        // 主题色块列表
        List.pop();
        Column.pop();
        Column.pop();
    }
    sectionHeader(title: ResourceStr, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.padding({ left: 16, right: 16, top: 20, bottom: 8 });
            Text.width('100%');
        }, Text);
        Text.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "SettingPage";
    }
}
export default SettingPage;
registerNamedRoute(() => new SettingPage(undefined, {}), "", { bundleName: "com.example.lifetracker", moduleName: "entry", pagePath: "pages/SettingPage", pageFullPath: "entry/src/main/ets/pages/SettingPage", integratedHsp: "false", moduleType: "followWithHap" });
