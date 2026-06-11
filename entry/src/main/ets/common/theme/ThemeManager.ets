import PreferencesUtil from '../database/PreferencesUtil';

export interface ThemeColors {
  primary: string;
  bgMain: string;
  bgCard: string;
  textMain: string;
  textMuted: string;
  border: string;
}

export interface AppTheme {
  themeId: number;
  themeName: string;
  comment: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export const THEME_PRESETS: AppTheme[] = [
  {
    themeId: 1,
    themeName: '薄荷清风',
    comment: '清新薄荷绿，宁静舒适',
    light: {
      primary: '#5dd39e',
      bgMain: '#f4fdf9',
      bgCard: '#ffffff',
      textMain: '#2c3e50',
      textMuted: '#95e1c1',
      border: '#e8f8f2'
    },
    dark: {
      primary: '#5dd39e',
      bgMain: '#1a1e1b',
      bgCard: '#252a26',
      textMain: '#e8f8f2',
      textMuted: '#7fc9a8',
      border: '#2f3830'
    }
  },
  {
    themeId: 2,
    themeName: '樱花微醺',
    comment: '温柔粉色，浪漫甜美',
    light: {
      primary: '#ff8fad',
      bgMain: '#fff5f8',
      bgCard: '#ffffff',
      textMain: '#4a2c35',
      textMuted: '#ffc4d6',
      border: '#ffe8ef'
    },
    dark: {
      primary: '#ff8fad',
      bgMain: '#1e1819',
      bgCard: '#2a2022',
      textMain: '#ffe8ef',
      textMuted: '#d17a91',
      border: '#3a2c30'
    }
  },
  {
    themeId: 3,
    themeName: '橘光暖阳',
    comment: '温暖橙黄，活力满满',
    light: {
      primary: '#ffac34',
      bgMain: '#fdfaf2',
      bgCard: '#ffffff',
      textMain: '#3e2723',
      textMuted: '#ffcd84',
      border: '#f6f0e2'
    },
    dark: {
      primary: '#ffac34',
      bgMain: '#1c1816',
      bgCard: '#262220',
      textMain: '#f6f0e2',
      textMuted: '#c9914a',
      border: '#36302a'
    }
  },
  {
    themeId: 4,
    themeName: '天空蔚蓝',
    comment: '清澈天蓝，开阔明朗',
    light: {
      primary: '#50b5ff',
      bgMain: '#f5fbff',
      bgCard: '#ffffff',
      textMain: '#2c3e50',
      textMuted: '#9cd4ff',
      border: '#e8f5ff'
    },
    dark: {
      primary: '#50b5ff',
      bgMain: '#181c1f',
      bgCard: '#22262a',
      textMain: '#e8f5ff',
      textMuted: '#6a9bcc',
      border: '#2a3640'
    }
  },
  {
    themeId: 5,
    themeName: '薰衣草紫',
    comment: '优雅紫色，神秘优雅',
    light: {
      primary: '#a78bfa',
      bgMain: '#faf8ff',
      bgCard: '#ffffff',
      textMain: '#3e2c5e',
      textMuted: '#c9b8fc',
      border: '#f0ebff'
    },
    dark: {
      primary: '#a78bfa',
      bgMain: '#1a181e',
      bgCard: '#252229',
      textMain: '#f0ebff',
      textMuted: '#8770c7',
      border: '#352f40'
    }
  },
  {
    themeId: 6,
    themeName: '柠檬气泡',
    comment: '明亮柠檬黄，清爽活泼',
    light: {
      primary: '#ffd93d',
      bgMain: '#fffef5',
      bgCard: '#ffffff',
      textMain: '#3e3420',
      textMuted: '#ffe88a',
      border: '#fff8e0'
    },
    dark: {
      primary: '#ffd93d',
      bgMain: '#1c1b16',
      bgCard: '#262520',
      textMain: '#fff8e0',
      textMuted: '#ccae4f',
      border: '#36342a'
    }
  }
];

export class ThemeManager {
  private static instance: ThemeManager;
  private currentThemeId: number = 3;
  private isDarkMode: boolean = false;

  private constructor() {}

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  public static async init(): Promise<void> {
    const manager = ThemeManager.getInstance();
    try {
      const savedThemeId = await PreferencesUtil.getNumber('app_theme_id', 3);
      const savedDarkMode = await PreferencesUtil.getBoolean('app_is_dark_mode', false);
      
      manager.currentThemeId = savedThemeId;
      manager.isDarkMode = savedDarkMode;
      
      manager.applyTheme();
    } catch (error) {
      console.error('主题初始化失败:', error);
      manager.applyTheme();
    }
  }

  public getCurrentThemeId(): number {
    return this.currentThemeId;
  }

  public async switchTheme(themeId: number): Promise<void> {
    if (themeId === this.currentThemeId) {
      return;
    }
    
    const theme = THEME_PRESETS.find(t => t.themeId === themeId);
    if (!theme) {
      console.error(`主题 ${themeId} 不存在`);
      return;
    }
    
    this.currentThemeId = themeId;
    await PreferencesUtil.saveNumber('app_theme_id', themeId);
    this.applyTheme();
  }

  public async toggleDarkMode(isDark: boolean): Promise<void> {
    this.isDarkMode = isDark;
    await PreferencesUtil.saveBoolean('app_is_dark_mode', isDark);
    this.applyTheme();
  }

  private applyTheme(): void {
    const theme = THEME_PRESETS.find(t => t.themeId === this.currentThemeId);
    if (!theme) {
      return;
    }
    
    const colors = this.isDarkMode ? theme.dark : theme.light;
    
    AppStorage.setOrCreate('app_active_theme', colors);
    AppStorage.setOrCreate('app_is_dark_mode', this.isDarkMode);
  }
}

export default ThemeManager;
