import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import AppConstants from '../constants/AppConstants';

/**
 * 轻量级键值存储工具类
 * 用于保存应用配置和用户偏好
 */
export class PreferencesUtil {
  private static instance: PreferencesUtil;
  private preference: preferences.Preferences | null = null;

  private constructor() {}

  public static getInstance(): PreferencesUtil {
    if (!PreferencesUtil.instance) {
      PreferencesUtil.instance = new PreferencesUtil();
    }
    return PreferencesUtil.instance;
  }

  /**
   * 初始化Preferences
   */
  async init(context: common.UIAbilityContext): Promise<void> {
    try {
      this.preference = await preferences.getPreferences(context, {
        name: 'LifeTrackerPrefs'
      });
      console.info('Preferences初始化成功');
    } catch (e) {
      console.error('Preferences初始化失败:', JSON.stringify(e));
    }
  }

  /**
   * 保存字符串
   */
  async saveString(key: string, value: string): Promise<void> {
    if (!this.preference) {
      console.error('Preferences未初始化');
      return;
    }

    try {
      await this.preference.put(key, value);
      await this.preference.flush();
    } catch (e) {
      console.error('保存字符串失败:', JSON.stringify(e));
    }
  }

  /**
   * 读取字符串
   */
  async getString(key: string, defaultValue: string = ''): Promise<string> {
    if (!this.preference) {
      return defaultValue;
    }

    try {
      const value = await this.preference.get(key, defaultValue);
      return value as string;
    } catch (e) {
      console.error('读取字符串失败:', JSON.stringify(e));
      return defaultValue;
    }
  }

  /**
   * 保存数字
   */
  async saveNumber(key: string, value: number): Promise<void> {
    if (!this.preference) {
      console.error('Preferences未初始化');
      return;
    }

    try {
      await this.preference.put(key, value);
      await this.preference.flush();
    } catch (e) {
      console.error('保存数字失败:', JSON.stringify(e));
    }
  }

  /**
   * 读取数字
   */
  async getNumber(key: string, defaultValue: number = 0): Promise<number> {
    if (!this.preference) {
      return defaultValue;
    }

    try {
      const value = await this.preference.get(key, defaultValue);
      return value as number;
    } catch (e) {
      console.error('读取数字失败:', JSON.stringify(e));
      return defaultValue;
    }
  }

  /**
   * 保存布尔值
   */
  async saveBoolean(key: string, value: boolean): Promise<void> {
    if (!this.preference) {
      console.error('Preferences未初始化');
      return;
    }

    try {
      await this.preference.put(key, value);
      await this.preference.flush();
    } catch (e) {
      console.error('保存布尔值失败:', JSON.stringify(e));
    }
  }

  /**
   * 读取布尔值
   */
  async getBoolean(key: string, defaultValue: boolean = false): Promise<boolean> {
    if (!this.preference) {
      return defaultValue;
    }

    try {
      const value = await this.preference.get(key, defaultValue);
      return value as boolean;
    } catch (e) {
      console.error('读取布尔值失败:', JSON.stringify(e));
      return defaultValue;
    }
  }

  /**
   * 删除键
   */
  async delete(key: string): Promise<void> {
    if (!this.preference) {
      console.error('Preferences未初始化');
      return;
    }

    try {
      await this.preference.delete(key);
      await this.preference.flush();
    } catch (e) {
      console.error('删除键失败:', JSON.stringify(e));
    }
  }

  /**
   * 检查键是否存在
   */
  async has(key: string): Promise<boolean> {
    if (!this.preference) {
      return false;
    }

    try {
      return await this.preference.has(key);
    } catch (e) {
      console.error('检查键是否存在失败:', JSON.stringify(e));
      return false;
    }
  }

  // ==================== 便捷方法 ====================

  /**
   * 获取主题模式
   */
  async getThemeMode(): Promise<string> {
    return await this.getString(AppConstants.PREF_THEME, 'light');
  }

  /**
   * 设置主题模式
   */
  async setThemeMode(mode: 'light' | 'dark'): Promise<void> {
    await this.saveString(AppConstants.PREF_THEME, mode);
  }

  /**
   * 判断是否首次启动
   */
  async isFirstLaunch(): Promise<boolean> {
    const firstLaunch = await this.getBoolean(AppConstants.PREF_FIRST_LAUNCH, true);
    if (firstLaunch) {
      await this.saveBoolean(AppConstants.PREF_FIRST_LAUNCH, false);
    }
    return firstLaunch;
  }

  /**
   * 获取上次打开日期
   */
  async getLastOpenDate(): Promise<string> {
    return await this.getString(AppConstants.PREF_LAST_DATE, '');
  }

  /**
   * 设置上次打开日期
   */
  async setLastOpenDate(date: string): Promise<void> {
    await this.saveString(AppConstants.PREF_LAST_DATE, date);
  }

  /**
   * 获取合集列表
   */
  async getCollections(): Promise<string[]> {
    const json = await this.getString(AppConstants.PREF_COLLECTIONS, '[]');
    try {
      return JSON.parse(json) as string[];
    } catch (e) {
      return [];
    }
  }

  /**
   * 保存合集列表
   */
  async saveCollections(collections: string[]): Promise<void> {
    await this.saveString(AppConstants.PREF_COLLECTIONS, JSON.stringify(collections));
  }
}

export default PreferencesUtil.getInstance();
