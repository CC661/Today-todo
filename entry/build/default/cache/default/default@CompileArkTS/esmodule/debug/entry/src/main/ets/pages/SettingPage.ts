if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SettingPage_Params {
    isDarkMode?: boolean;
    currentColors?: ThemeColors;
    showThemePicker?: boolean;
    currentThemeId?: number;
}
import promptAction from "@ohos:promptAction";
import RDBStoreUtil from "@normalized:N&&&entry/src/main/ets/common/database/RDBStoreUtil&";
import AppConstants from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
import { ThemeManager, THEME_PRESETS, type ThemeColors } from "@normalized:N&&&entry/src/main/ets/common/theme/ThemeManager&";
import type { AppTheme } from "@normalized:N&&&entry/src/main/ets/common/theme/ThemeManager&";
export class SettingPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isDarkMode = this.createStorageLink('app_is_dark_mode', false, "isDarkMode");
        this.__currentColors = this.createStorageLink('app_active_theme', THEME_PRESETS[2].light, "currentColors");
        this.__showThemePicker = new ObservedPropertySimplePU(false, this, "showThemePicker");
        this.__currentThemeId = new ObservedPropertySimplePU(3, this, "currentThemeId");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SettingPage_Params) {
        if (params.showThemePicker !== undefined) {
            this.showThemePicker = params.showThemePicker;
        }
        if (params.currentThemeId !== undefined) {
            this.currentThemeId = params.currentThemeId;
        }
    }
    updateStateVars(params: SettingPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isDarkMode.purgeDependencyOnElmtId(rmElmtId);
        this.__currentColors.purgeDependencyOnElmtId(rmElmtId);
        this.__showThemePicker.purgeDependencyOnElmtId(rmElmtId);
        this.__currentThemeId.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isDarkMode.aboutToBeDeleted();
        this.__currentColors.aboutToBeDeleted();
        this.__showThemePicker.aboutToBeDeleted();
        this.__currentThemeId.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isDarkMode: ObservedPropertyAbstractPU<boolean>;
    get isDarkMode() {
        return this.__isDarkMode.get();
    }
    set isDarkMode(newValue: boolean) {
        this.__isDarkMode.set(newValue);
    }
    private __currentColors: ObservedPropertyAbstractPU<ThemeColors>;
    get currentColors() {
        return this.__currentColors.get();
    }
    set currentColors(newValue: ThemeColors) {
        this.__currentColors.set(newValue);
    }
    private __showThemePicker: ObservedPropertySimplePU<boolean>;
    get showThemePicker() {
        return this.__showThemePicker.get();
    }
    set showThemePicker(newValue: boolean) {
        this.__showThemePicker.set(newValue);
    }
    private __currentThemeId: ObservedPropertySimplePU<number>;
    get currentThemeId() {
        return this.__currentThemeId.get();
    }
    set currentThemeId(newValue: number) {
        this.__currentThemeId.set(newValue);
    }
    aboutToAppear(): void {
        // 修复：确保单例的静态调用正确无误
        this.currentThemeId = ThemeManager.getInstance().getCurrentThemeId();
    }
    async toggleDarkMode(): Promise<void> {
        const newDark = !this.isDarkMode;
        // 修复：确保单例的静态调用正确无误
        await ThemeManager.getInstance().toggleDarkMode(newDark);
    }
    async selectTheme(themeId: number): Promise<void> {
        if (this.currentThemeId === themeId)
            return;
        this.currentThemeId = themeId;
        // 修复：确保单例的静态调用正确无误
        await ThemeManager.getInstance().switchTheme(themeId);
        this.showThemePicker = false;
        promptAction.showToast({ message: '主题已切换' });
    }
    getCurrentTheme(): AppTheme {
        return THEME_PRESETS.find(t => t.themeId === this.currentThemeId) || THEME_PRESETS[2];
    }
    async clearAllData(): Promise<void> {
        try {
            await RDBStoreUtil.deleteAll(AppConstants.TABLE_TODOS);
            await RDBStoreUtil.deleteAll(AppConstants.TABLE_DIARY_POSTS);
            await RDBStoreUtil.deleteAll(AppConstants.TABLE_PLOG_CANVASES);
            promptAction.showToast({ message: { "id": 16777283, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
        }
        catch (error) {
            console.error('清除数据失败:', error);
        }
    }
    showClearConfirmDialog(): void {
        AlertDialog.show({
            title: { "id": 16777280, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" },
            message: { "id": 16777279, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" },
            primaryButton: {
                value: { "id": 16777284, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" },
                fontColor: '#FF4D4F',
                action: () => {
                    this.clearAllData();
                }
            },
            secondaryButton: {
                value: { "id": 16777278, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" },
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
            Column.backgroundColor(this.currentColors.bgMain);
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
            Text.create({ "id": 16777294, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontSize({ "id": 16777337, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.currentColors.textMain);
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
                color: this.currentColors.border,
                startMargin: 16,
                endMargin: 16
            });
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ---- 外观分组 ----
            ListItemGroup.create({ header: this.sectionHeader.bind(this, { "id": 16777277, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }) });
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
                    Text.create({ "id": 16777285, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor(this.currentColors.textMain);
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
                    // 个性化主题（新：马卡龙主题选择器）
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
                    Text.create({ "id": 16777293, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor(this.currentColors.textMain);
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
                    // 当前主题名
                    Text.create(this.getCurrentTheme().themeName);
                    // 当前主题名
                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    // 当前主题名
                    Text.fontColor(this.currentColors.textMuted);
                }, Text);
                // 当前主题名
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 4 色预览球
                    Row.create({ space: 2 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create();
                    Circle.width(10);
                    Circle.height(10);
                    Circle.fill(this.currentColors.primary);
                }, Circle);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create();
                    Circle.width(10);
                    Circle.height(10);
                    Circle.fill(this.currentColors.bgMain);
                }, Circle);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create();
                    Circle.width(10);
                    Circle.height(10);
                    Circle.fill(this.currentColors.textMain);
                }, Circle);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create();
                    Circle.width(10);
                    Circle.height(10);
                    Circle.fill(this.currentColors.textMuted);
                }, Circle);
                // 4 色预览球
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    SymbolGlyph.create({ "id": 125832664, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    SymbolGlyph.fontSize(16);
                    SymbolGlyph.fontColor([this.currentColors.textMuted]);
                }, SymbolGlyph);
                Row.pop();
                Row.pop();
                // 个性化主题（新：马卡龙主题选择器）
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            // 个性化主题（新：马卡龙主题选择器）
            ListItem.pop();
        }
        // ---- 外观分组 ----
        ListItemGroup.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ---- 关于分组 ----
            ListItemGroup.create({ header: this.sectionHeader.bind(this, { "id": 16777276, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }) });
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
                    Text.create({ "id": 16777295, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor(this.currentColors.textMain);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('1.0.0');
                    Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor(this.currentColors.textMuted);
                }, Text);
                Text.pop();
                Row.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        // ---- 关于分组 ----
        ListItemGroup.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ---- 数据管理分组 ----
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
                    Text.create({ "id": 16777281, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor('#FF4D4F');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create({ "id": 16777282, "type": 10003, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    Text.fontColor(this.currentColors.textMuted);
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
        // ---- 数据管理分组 ----
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
    // ==================== 主题选择面板 ====================
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
            Column.backgroundColor(this.currentColors.bgCard);
            Column.borderRadius({ "id": 16777330, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
            Text.create('个性化主题');
            Text.fontSize({ "id": 16777332, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.currentColors.textMain);
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
            SymbolGlyph.fontColor([this.currentColors.textMuted]);
        }, SymbolGlyph);
        Button.pop();
        // 标题行
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择一套马卡龙色彩搭配，即刻切换全盘UI');
            Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.currentColors.textMuted);
            Text.width('100%');
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主题网格（2列）
            Grid.create();
            // 主题网格（2列）
            Grid.columnsTemplate('1fr 1fr');
            // 主题网格（2列）
            Grid.columnsGap(10);
            // 主题网格（2列）
            Grid.rowsGap(10);
            // 主题网格（2列）
            Grid.width('100%');
            // 主题网格（2列）
            Grid.scrollBar(BarState.Off);
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const theme = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        this.ThemeCard.bind(this)(theme);
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, THEME_PRESETS, forEachItemGenFunction, (theme: AppTheme) => theme.themeId.toString(), false, false);
        }, ForEach);
        ForEach.pop();
        // 主题网格（2列）
        Grid.pop();
        Column.pop();
        Column.pop();
    }
    ThemeCard(theme: AppTheme, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor(this.currentColors.bgCard);
            Column.borderRadius(8);
            Column.shadow({
                radius: 12,
                color: '#0d000000',
                offsetX: 0,
                offsetY: 4
            });
            Column.border({
                width: this.currentThemeId === theme.themeId ? 2 : 1,
                color: this.currentThemeId === theme.themeId ? (this.isDarkMode ? theme.dark.primary : theme.light.primary) : this.currentColors.border
            });
            Column.onClick(() => {
                if (this.currentThemeId !== theme.themeId) {
                    this.selectTheme(theme.themeId);
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 4 色预览条：bgMain（微调马卡龙底色）/ primary / textMain / textMuted
            Row.create({ space: 0 });
            // 4 色预览条：bgMain（微调马卡龙底色）/ primary / textMain / textMuted
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('25%');
            Column.height(36);
            Column.backgroundColor(this.isDarkMode ? theme.dark.bgMain : theme.light.bgMain);
            Column.borderRadius({ topLeft: 8 });
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('25%');
            Column.height(36);
            Column.backgroundColor(this.isDarkMode ? theme.dark.primary : theme.light.primary);
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('25%');
            Column.height(36);
            Column.backgroundColor(this.isDarkMode ? theme.dark.textMain : theme.light.textMain);
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('25%');
            Column.height(36);
            Column.backgroundColor(this.isDarkMode ? theme.dark.textMuted : theme.light.textMuted);
            Column.borderRadius({ topRight: 8 });
        }, Column);
        Column.pop();
        // 4 色预览条：bgMain（微调马卡龙底色）/ primary / textMain / textMuted
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 下半部分：主题名 + 描述
            Column.create();
            // 下半部分：主题名 + 描述
            Column.width('100%');
            // 下半部分：主题名 + 描述
            Column.padding(10);
            // 下半部分：主题名 + 描述
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(theme.themeName);
            Text.fontSize(13);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.currentColors.textMain);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(theme.comment);
            Text.fontSize(10);
            Text.fontColor(this.currentColors.textMuted);
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
            Text.margin({ top: 4 });
            Text.lineHeight(14);
        }, Text);
        Text.pop();
        // 下半部分：主题名 + 描述
        Column.pop();
        Column.pop();
    }
    sectionHeader(title: ResourceStr, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor(this.currentColors.textMuted);
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
