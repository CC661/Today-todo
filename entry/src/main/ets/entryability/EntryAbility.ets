import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
import RDBStoreUtil from '../common/database/RDBStoreUtil';
import PreferencesUtil from '../common/database/PreferencesUtil';
import DateUtils from '../common/utils/DateUtils';
import TodoViewModel from '../viewmodel/TodoViewModel';

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

    } catch (error) {
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
