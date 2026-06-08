import { promptAction } from '@kit.ArkUI';
import PreferencesUtil from '../common/database/PreferencesUtil';
import RDBStoreUtil from '../common/database/RDBStoreUtil';
import AppConstants from '../common/constants/AppConstants';
// 核心改动：把 ThemeManager 放到大括号里面
import { ThemeManager, AppTheme, THEME_PRESETS, type ThemeColors } from '../common/theme/ThemeManager';

/**
 * 设置页面 - 含动态马卡龙主题选择
 */
@Entry
@Component
export struct SettingPage {
  @StorageLink('app_is_dark_mode') isDarkMode: boolean = false;
  @StorageLink('app_active_theme') currentColors: ThemeColors = THEME_PRESETS[2].light;
  @State showThemePicker: boolean = false;
  @State currentThemeId: number = 3;

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
    if (this.currentThemeId === themeId) return;
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
            .fontColor(this.currentColors.textMain)
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16, bottom: 8 })

        List({ space: 0 }) {
          // ---- 外观分组 ----
          ListItemGroup({ header: this.sectionHeader($r('app.string.setting_appearance')) }) {
            // 深色模式
            ListItem() {
              Row() {
                Text($r('app.string.setting_dark_mode'))
                  .fontSize($r('app.float.font_size_base'))
                  .fontColor(this.currentColors.textMain)

                Blank()

                Toggle({ type: ToggleType.Switch, isOn: this.isDarkMode })
                  .onChange(() => {
                    this.toggleDarkMode();
                  })
              }
              .width('100%')
              .padding(16)
            }

            // 个性化主题（新：马卡龙主题选择器）
            ListItem() {
              Row() {
                Text($r('app.string.setting_theme_title'))
                  .fontSize($r('app.float.font_size_base'))
                  .fontColor(this.currentColors.textMain)

                Blank()

                Row({ space: 6 }) {
                  // 当前主题名
                  Text(this.getCurrentTheme().themeName)
                    .fontSize($r('app.float.font_size_sm'))
                    .fontColor(this.currentColors.textMuted)

                  // 4 色预览球
                  Row({ space: 2 }) {
                    Circle().width(10).height(10).fill(this.currentColors.primary)
                    Circle().width(10).height(10).fill(this.currentColors.bgMain)
                    Circle().width(10).height(10).fill(this.currentColors.textMain)
                    Circle().width(10).height(10).fill(this.currentColors.textMuted)
                  }

                  SymbolGlyph($r('sys.symbol.chevron_right'))
                    .fontSize(16)
                    .fontColor([this.currentColors.textMuted])
                }
              }
              .width('100%')
              .padding(16)
              .onClick(() => { this.showThemePicker = true; })
            }
          }

          // ---- 关于分组 ----
          ListItemGroup({ header: this.sectionHeader($r('app.string.setting_about')) }) {
            ListItem() {
              Row() {
                Text($r('app.string.setting_version'))
                  .fontSize($r('app.float.font_size_base'))
                  .fontColor(this.currentColors.textMain)

                Blank()

                Text('1.0.0')
                  .fontSize($r('app.float.font_size_base'))
                  .fontColor(this.currentColors.textMuted)
              }
              .width('100%')
              .padding(16)
            }
          }

          // ---- 数据管理分组 ----
          ListItemGroup({ header: this.sectionHeader('数据管理') }) {
            ListItem() {
              Row() {
                Column() {
                  Text($r('app.string.setting_clear_data'))
                    .fontSize($r('app.float.font_size_base'))
                    .fontColor('#FF4D4F')

                  Text($r('app.string.setting_clear_data_desc'))
                    .fontSize($r('app.float.font_size_sm'))
                    .fontColor(this.currentColors.textMuted)
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
          color: this.currentColors.border,
          startMargin: 16,
          endMargin: 16
        })
      }
      .width('100%')
      .height('100%')
      .backgroundColor(this.currentColors.bgMain)

      // 主题选择面板
      if (this.showThemePicker) {
        this.ThemePickerPanel()
      }
    }
    .width('100%')
    .height('100%')
  }

  // ==================== 主题选择面板 ====================

  @Builder
  ThemePickerPanel() {
    Column() {
      Blank()

      Column() {
        // 标题行
        Row() {
          Text('个性化主题')
            .fontSize($r('app.float.font_size_lg'))
            .fontWeight(FontWeight.Medium)
            .fontColor(this.currentColors.textMain)

          Blank()

          Button() {
            SymbolGlyph($r('sys.symbol.xmark'))
              .fontSize(18)
              .fontColor([this.currentColors.textMuted])
          }
          .width(32)
          .height(32)
          .backgroundColor(Color.Transparent)
          .onClick(() => { this.showThemePicker = false; })
        }
        .width('100%')
        .margin({ bottom: 8 })

        Text('选择一套马卡龙色彩搭配，即刻切换全盘UI')
          .fontSize($r('app.float.font_size_sm'))
          .fontColor(this.currentColors.textMuted)
          .width('100%')
          .margin({ bottom: 16 })

        // 主题网格（2列）
        Grid() {
          ForEach(THEME_PRESETS, (theme: AppTheme) => {
            GridItem() {
              this.ThemeCard(theme)
            }
          }, (theme: AppTheme) => theme.themeId.toString())
        }
        .columnsTemplate('1fr 1fr')
        .columnsGap(10)
        .rowsGap(10)
        .width('100%')
        .scrollBar(BarState.Off)
      }
      .width('90%')
      .padding(20)
      .backgroundColor(this.currentColors.bgCard)
      .borderRadius($r('app.float.border_radius_xl'))
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#80000000')
    .onClick(() => { this.showThemePicker = false; })
  }

  @Builder
  ThemeCard(theme: AppTheme) {
    Column() {
      // 4 色预览条：bgMain（微调马卡龙底色）/ primary / textMain / textMuted
      Row({ space: 0 }) {
        Column()
          .width('25%')
          .height(36)
          .backgroundColor(this.isDarkMode ? theme.dark.bgMain : theme.light.bgMain)
          .borderRadius({ topLeft: 8 })
        Column()
          .width('25%')
          .height(36)
          .backgroundColor(this.isDarkMode ? theme.dark.primary : theme.light.primary)
        Column()
          .width('25%')
          .height(36)
          .backgroundColor(this.isDarkMode ? theme.dark.textMain : theme.light.textMain)
        Column()
          .width('25%')
          .height(36)
          .backgroundColor(this.isDarkMode ? theme.dark.textMuted : theme.light.textMuted)
          .borderRadius({ topRight: 8 })
      }
      .width('100%')

      // 下半部分：主题名 + 描述
      Column() {
        Text(theme.themeName)
          .fontSize(13)
          .fontWeight(FontWeight.Medium)
          .fontColor(this.currentColors.textMain)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')

        Text(theme.comment)
          .fontSize(10)
          .fontColor(this.currentColors.textMuted)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')
          .margin({ top: 4 })
          .lineHeight(14)
      }
      .width('100%')
      .padding(10)
      .alignItems(HorizontalAlign.Start)
    }
    .width('100%')
    .backgroundColor(this.currentColors.bgCard)
    .borderRadius(8)
    // 极简投影：所有卡片统一使用极淡阴影，选中卡片额外用 primary 色边框强调
    .shadow({
      radius: 12,
      color: '#0d000000',
      offsetX: 0,
      offsetY: 4
    })
    .border({
      width: this.currentThemeId === theme.themeId ? 2 : 1,
      color: this.currentThemeId === theme.themeId ? (this.isDarkMode ? theme.dark.primary : theme.light.primary) : this.currentColors.border
    })
    .onClick(() => {
      if (this.currentThemeId !== theme.themeId) {
        this.selectTheme(theme.themeId);
      }
    })
  }

  @Builder
  sectionHeader(title: ResourceStr) {
    Text(title)
      .fontSize($r('app.float.font_size_sm'))
      .fontColor(this.currentColors.textMuted)
      .padding({ left: 16, right: 16, top: 20, bottom: 8 })
      .width('100%')
  }
}

export default SettingPage;