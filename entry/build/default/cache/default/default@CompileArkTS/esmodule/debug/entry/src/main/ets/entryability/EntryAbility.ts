import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
import type window from "@ohos:window";
import RDBStoreUtil from "@normalized:N&&&entry/src/main/ets/common/database/RDBStoreUtil&";
import PreferencesUtil from "@normalized:N&&&entry/src/main/ets/common/database/PreferencesUtil&";
import DateUtils from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtils&";
import TodoViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/TodoViewModel&";
import ThemeManager from "@normalized:N&&&entry/src/main/ets/common/theme/ThemeManager&";
const DOMAIN = 0x0000;
const TAG = 'EntryAbility';
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        hilog.info(DOMAIN, TAG, 'Ability onCreate');
    }
    async onWindowStageCreate(windowStage: window.WindowStage): Promise<void> {
        hilog.info(DOMAIN, TAG, 'Ability onWindowStageCreate');
        try {
            // 初始化数据库
            await RDBStoreUtil.init(this.context);
            // 初始化Preferences
            await PreferencesUtil.init(this.context);
            // 初始化主题管理器（从 Preferences 加载持久化的主题设置）
            await ThemeManager.init();
            // 检查昨日任务结转
            const lastDate = await PreferencesUtil.getLastOpenDate();
            const today = DateUtils.getToday();
            if (lastDate && lastDate !== today) {
                const yesterday = DateUtils.getYesterday();
                if (lastDate === yesterday) {
                    await TodoViewModel.carryOverYesterdayTasks(yesterday, today);
                }
            }
            // 更新最后打开日期
            await PreferencesUtil.setLastOpenDate(today);
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, '初始化失败: %{public}s', JSON.stringify(error));
        }
        // 加载主页面
        windowStage.loadContent('pages/HomePage', (err) => {
            if (err.code) {
                hilog.error(DOMAIN, TAG, 'Failed to load content. Cause: %{public}s', JSON.stringify(err));
                return;
            }
            hilog.info(DOMAIN, TAG, 'Succeeded in loading the content.');
        });
    }
    onWindowStageDestroy(): void {
        hilog.info(DOMAIN, TAG, 'Ability onWindowStageDestroy');
    }
    onForeground(): void {
        hilog.info(DOMAIN, TAG, 'Ability onForeground');
    }
    onBackground(): void {
        hilog.info(DOMAIN, TAG, 'Ability onBackground');
    }
    onDestroy(): void {
        hilog.info(DOMAIN, TAG, 'Ability onDestroy');
    }
}
