import { promptAction } from '@kit.ArkUI';
import PreferencesUtil from '../common/database/PreferencesUtil';
import RDBStoreUtil from '../common/database/RDBStoreUtil';
import AppConstants from '../common/constants/AppConstants';

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
  { key: 'orange', name: $r('app.string.setting_theme_orange'), color: '#FF6B35', primary: '#FF6B35', secondary: '#004E89' },
  { key: 'blue', name: $r('app.string.setting_theme_blue'), color: '#1677FF', primary: '#1677FF', secondary: '#FF6B35' },
  { key: 'green', name: $r('app.string.setting_theme_green'), color: '#52C41A', primary: '#52C41A', secondary: '#004E89' },
  { key: 'purple', name: $r('app.string.setting_theme_purple'), color: '#722ED1', primary: '#722ED1', secondary: '#FF6B35' },
  { key: 'pink', name: $r('app.string.setting_theme_pink'), color: '#EB2F96', primary: '#EB2F96', secondary: '#004E89' },
];

/**
 * 设置页面
 */
@Entry
@Component
export struct SettingPage {
  @State currentTheme: string = 'orange';
  @State isDarkMode: boolean = false;
  @State showThemePicker: boolean = false;

  aboutToAppear(): void {
    this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    try {
      const theme = await PreferencesUtil.getThemeMode();
      this.isDarkMode = theme === 'dark';
      const themeColor = await PreferencesUtil.getString('theme_color', 'orange');
      this.currentTheme = themeColor;
    } catch (error) {
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
      promptAction.showToast({ message: $r('app.string.setting_cleared') });
    } catch (error) {
      console.error('清除数据失败:', error);
    }
  }

  showClearConfirmDialog(): void {
    AlertDialog.show({
      title: $r('app.string.setting_clear_confirm_title'),
      message: $r('app.string.setting_clear_confirm_msg'),
      primaryButton: {
        value: $r('app.string.setting_confirm'),
        fontColor: '#FF4D4F',
        action: () => {
          this.clearAllData();
        }
      },
      secondaryButton: {
        value: $r('app.string.setting_cancel'),
        action: () => { }
      }
    });
  }

  build() {
    Stack() {
      Column() {
        // 标题栏
        Row() {
          Text($r('app.string.setting_title'))
            .fontSize($r('app.float.font_size_xxl'))
            .fontWeight(FontWeight.Bold)
            .fontColor($r('app.color.text_primary'))
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16, bottom: 8 })

        List({ space: 0 }) {
          // 外观分组
          ListItemGroup({ header: this.sectionHeader($r('app.string.setting_appearance')) }) {
            // 深色模式
            ListItem() {
              Row() {
                Text($r('app.string.setting_dark_mode'))
                  .fontSize($r('app.float.font_size_base'))
                  .fontColor($r('app.color.text_primary'))

                Blank()

                Toggle({ type: ToggleType.Switch, isOn: this.isDarkMode })
                  .onChange(() => {
                    this.toggleDarkMode();
                  })
              }
              .width('100%')
              .padding(16)
            }

            // 主题颜色
            ListItem() {
              Row() {
                Text($r('app.string.setting_theme_title'))
                  .fontSize($r('app.float.font_size_base'))
                  .fontColor($r('app.color.text_primary'))

                Blank()

                Row({ space: 6 }) {
                  Text(this.getCurrentThemeColor().name)
                    .fontSize($r('app.float.font_size_sm'))
                    .fontColor($r('app.color.text_hint'))

                  Circle()
                    .width(24)
                    .height(24)
                    .fill(this.getCurrentThemeColor().color)

                  SymbolGlyph($r('sys.symbol.chevron_right'))
                    .fontSize(16)
                    .fontColor([$r('app.color.text_hint')])
                }
              }
              .width('100%')
              .padding(16)
              .onClick(() => { this.showThemePicker = true; })
            }
          }

          // 关于分组
          ListItemGroup({ header: this.sectionHeader($r('app.string.setting_about')) }) {
            ListItem() {
              Row() {
                Text($r('app.string.setting_version'))
                  .fontSize($r('app.float.font_size_base'))
                  .fontColor($r('app.color.text_primary'))

                Blank()

                Text('1.0.0')
                  .fontSize($r('app.float.font_size_base'))
                  .fontColor($r('app.color.text_hint'))
              }
              .width('100%')
              .padding(16)
            }
          }

          // 数据管理分组
          ListItemGroup({ header: this.sectionHeader('数据管理') }) {
            ListItem() {
              Row() {
                Column() {
                  Text($r('app.string.setting_clear_data'))
                    .fontSize($r('app.float.font_size_base'))
                    .fontColor('#FF4D4F')

                  Text($r('app.string.setting_clear_data_desc'))
                    .fontSize($r('app.float.font_size_sm'))
                    .fontColor($r('app.color.text_hint'))
                    .margin({ top: 4 })
                }
              }
              .width('100%')
              .padding(16)
              .onClick(() => { this.showClearConfirmDialog(); })
            }
          }
        }
        .width('100%')
        .layoutWeight(1)
        .divider({
          strokeWidth: 0.5,
          color: $r('app.color.divider_color'),
          startMargin: 16,
          endMargin: 16
        })
      }
      .width('100%')
      .height('100%')
      .backgroundColor($r('app.color.background_color'))

      // 主题选择面板
      if (this.showThemePicker) {
        this.ThemePickerPanel()
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  ThemePickerPanel() {
    Column() {
      Blank()

      Column() {
        // 标题行
        Row() {
          Text($r('app.string.setting_theme_title'))
            .fontSize($r('app.float.font_size_lg'))
            .fontWeight(FontWeight.Medium)
            .fontColor($r('app.color.text_primary'))

          Blank()

          Button() {
            SymbolGlyph($r('sys.symbol.xmark'))
              .fontSize(18)
              .fontColor([$r('app.color.text_secondary')])
          }
          .width(32)
          .height(32)
          .backgroundColor(Color.Transparent)
          .onClick(() => { this.showThemePicker = false; })
        }
        .width('100%')
        .margin({ bottom: 8 })

        Text($r('app.string.setting_theme_desc'))
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.text_hint'))
          .width('100%')
          .margin({ bottom: 16 })

        // 主题色块列表
        List({ space: 12 }) {
          ForEach(THEME_COLORS, (theme: ThemeColor) => {
            ListItem() {
              Row() {
                // 颜色预览球
                Row({ space: 12 }) {
                  Circle()
                    .width(36)
                    .height(36)
                    .fill(theme.color)
                    .shadow({ radius: 4, color: theme.color + '40', offsetX: 0, offsetY: 2 })

                  Column() {
                    Text(theme.name)
                      .fontSize($r('app.float.font_size_base'))
                      .fontColor($r('app.color.text_primary'))
                      .margin({ bottom: 2 })

                    Row({ space: 4 }) {
                      Circle().width(10).height(10).fill(theme.primary)
                      Circle().width(10).height(10).fill(theme.secondary)
                    }
                  }
                  .alignItems(HorizontalAlign.Start)
                }

                Blank()

                // 选中标记
                if (this.currentTheme === theme.key) {
                  Row({ space: 4 }) {
                    SymbolGlyph($r('sys.symbol.checkmark'))
                      .fontSize(16)
                      .fontColor([theme.color])
                    Text($r('app.string.setting_theme_selected'))
                      .fontSize($r('app.float.font_size_sm'))
                      .fontColor(theme.color)
                  }
                } else {
                  Button('选择')
                    .fontSize($r('app.float.font_size_sm'))
                    .fontColor(theme.color)
                    .backgroundColor(theme.color + '15')
                    .borderRadius($r('app.float.border_radius_md'))
                    .padding({ left: 12, right: 12 })
                }
              }
              .width('100%')
              .padding(12)
              .backgroundColor(this.currentTheme === theme.key ?
                theme.color + '10' : $r('app.color.card_background'))
              .borderRadius($r('app.float.border_radius_lg'))
              .border({
                width: this.currentTheme === theme.key ? 1.5 : 0,
                color: this.currentTheme === theme.key ? theme.color : Color.Transparent
              })
              .onClick(() => {
                if (this.currentTheme !== theme.key) {
                  this.selectTheme(theme.key);
                }
              })
            }
          }, (theme: ThemeColor) => theme.key)
        }
        .width('100%')
        .scrollBar(BarState.Off)
      }
      .width('90%')
      .padding(20)
      .backgroundColor($r('app.color.card_background'))
      .borderRadius($r('app.float.border_radius_xl'))
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#80000000')
    .onClick(() => { this.showThemePicker = false; })
  }

  @Builder
  sectionHeader(title: ResourceStr) {
    Text(title)
      .fontSize($r('app.float.font_size_sm'))
      .fontColor($r('app.color.text_hint'))
      .padding({ left: 16, right: 16, top: 20, bottom: 8 })
      .width('100%')
  }
}

export default SettingPage;
