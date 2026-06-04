import PlogViewModel from '../viewmodel/PlogViewModel';
import DiaryViewModel from '../viewmodel/DiaryViewModel';
import type { PlogCanvas, CanvasElement } from '../model/PlogCanvas';
import type { DiaryPost } from '../model/DiaryPost';
import type { TodoItem } from '../model/TodoItem';
import type { PlogInsertParams } from '../common/database/RDBStoreUtil';
import DateUtils from '../common/utils/DateUtils';
import { router, curves } from '@kit.ArkUI';
import { promptAction } from '@kit.ArkUI';

/**
 * 手账编辑页 - Plog排版拼贴
 */
@Entry
@Component
struct PlogEditorPage {
  @State plog: PlogCanvas | null = null;
  @State elements: CanvasElement[] = [];
  @State selectedElementIndex: number = -1;
  @State showMaterialPanel: boolean = false;

  // 随手记相关
  @State todayDiaryPosts: DiaryPost[] = [];
  @State showDiaryPanel: boolean = false;
  @State selectedDiaryIds: Set<number> = new Set();

  // 当前激活的主工具: 0=随手记, 1=背景, 2=文字, 3=贴纸, 4=画笔
  @State activeToolTab: number = -1;
  // 当前激活的子工具（文字: 0=样式,1=颜色,2=排版,3=粗斜体,4=弯曲）
  @State activeSubTool: number = 0;
  // 面板展开状态（子工具栏+详细设置是否显示）
  @State panelExpanded: boolean = false;

  private plogIdFromParams: number = 0;
  private diaryIdsFromParams: number[] = [];
  private textSubTools: string[] = ['样式', '颜色', '排版', '粗斜体', '弯曲'];

  aboutToAppear(): void {
    const params = router.getParams() as Record<string, Object> | null;
    if (params) {
      if (params['plogId']) {
        this.plogIdFromParams = params['plogId'] as number;
      }
      if (params['diaryIdsStr']) {
        const str = params['diaryIdsStr'] as string;
        if (str && str.length > 0) {
          this.diaryIdsFromParams = str.split(',').map((s: string) => parseInt(s, 10));
        }
      }
    }
    this.initPlogAndLoadDiary();
  }

  async initPlogAndLoadDiary(): Promise<void> {
    await this.initPlog();
    await this.loadTodayDiaryPosts();
  }

  async initPlog(): Promise<void> {
    if (this.plogIdFromParams > 0) {
      const existingPlog = await PlogViewModel.getPlogById(this.plogIdFromParams);
      if (existingPlog) {
        this.plog = existingPlog;
        this.elements = existingPlog.elements;
        // 从已保存的手账中恢复diaryIds
        if (existingPlog.diaryIds && existingPlog.diaryIds.length > 0) {
          this.diaryIdsFromParams = existingPlog.diaryIds;
        }
        return;
      }
    }

    // 始终创建新手账，支持同一天创建多个手账
    const today = DateUtils.getToday();
    this.plog = {
      id: 0,
      date: today,
      backgroundImage: '',
      elements: [],
      diaryIds: this.diaryIdsFromParams.length > 0 ? [...this.diaryIdsFromParams] : undefined,
      createdAt: Date.now(),
      thumbnail: ''
    };
    this.elements = [];
  }

  async loadTodayDiaryPosts(): Promise<void> {
    try {
      const allPosts = await DiaryViewModel.getPostsByDate(DateUtils.getToday());
      // 优先使用路由传入的diaryIds，其次使用已保存plog中的diaryIds
      const diaryIds = this.diaryIdsFromParams.length > 0
        ? this.diaryIdsFromParams
        : (this.plog?.diaryIds ?? []);
      if (diaryIds.length > 0) {
        const idSet = new Set<number>(diaryIds);
        this.todayDiaryPosts = allPosts.filter((post: DiaryPost) => idSet.has(post.id));
      } else {
        this.todayDiaryPosts = allPosts;
      }
    } catch (error) {
      console.error('加载随手记失败:', error);
    }
  }

  navigateBack(): void {
    router.back();
  }

  /**
   * 切换主工具标签
   */
  switchToolTab(tab: number): void {
    animateTo({ duration: 400, curve: curves.springMotion() }, () => {
      if (this.activeToolTab === tab) {
        this.activeToolTab = -1;
        this.panelExpanded = false;
      } else {
        this.activeToolTab = tab;
        this.activeSubTool = 0;
        this.panelExpanded = true;
      }
    });
  }

  /**
   * 切换子工具
   */
  switchSubTool(subIndex: number): void {
    animateTo({ duration: 180, curve: Curve.EaseOut }, () => {
      this.activeSubTool = subIndex;
    });
  }

  /**
   * 展开/收起面板
   */
  togglePanel(): void {
    animateTo({ duration: 280, curve: Curve.EaseInOut }, () => {
      this.panelExpanded = !this.panelExpanded;
    });
  }

  /**
   * 添加随手记到手账
   */
  addDiaryToCanvas(post: DiaryPost): void {
    const baseIndex = this.elements.length;

    // 添加文字内容
    if (post.content && post.content.trim()) {
      const textElement: CanvasElement = {
        type: 'text',
        x: 20,
        y: 20 + baseIndex * 60,
        width: 200,
        height: 60,
        rotation: 0,
        content: post.content,
        zIndex: baseIndex,
        fontSize: 14,
        color: '#333333'
      };
      this.elements.push(textElement);
    }

    // 添加图片
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      post.mediaUrls.forEach((url, idx) => {
        const imgElement: CanvasElement = {
          type: 'image',
          x: 20 + ((baseIndex + idx) % 3) * 120,
          y: 100 + Math.floor((baseIndex + idx) / 3) * 120,
          width: 100,
          height: 100,
          rotation: 0,
          content: url,
          zIndex: baseIndex + idx + 1
        };
        this.elements.push(imgElement);
      });
    }

    promptAction.showToast({ message: '已添加随手记' });
  }

  /**
   * 添加文字元素
   */
  addTextElement(): void {
    const element: CanvasElement = {
      type: 'text',
      x: 50,
      y: 50 + this.elements.length * 30,
      width: 200,
      height: 40,
      rotation: 0,
      content: '双击编辑文字',
      zIndex: this.elements.length,
      fontSize: 16,
      color: '#333333'
    };
    this.elements.push(element);
    this.activeToolTab = -1;
  }

  /**
   * 添加贴纸元素
   */
  addSticker(stickerUrl: string): void {
    const element: CanvasElement = {
      type: 'sticker',
      x: 80 + (this.elements.length % 3) * 80,
      y: 100 + Math.floor(this.elements.length / 3) * 80,
      width: 60,
      height: 60,
      rotation: 0,
      content: stickerUrl,
      zIndex: this.elements.length
    };
    this.elements.push(element);
  }

  /**
   * 保存手账
   */
  async savePlog(): Promise<void> {
    if (!this.plog) return;

    try {
      this.plog.elements = this.elements;
      // 确保diaryIds被保存
      if (this.diaryIdsFromParams.length > 0 && !this.plog.diaryIds) {
        this.plog.diaryIds = [...this.diaryIdsFromParams];
      }

      if (this.plog.id === 0) {
        const insertParams: PlogInsertParams = {
          date: this.plog.date,
          backgroundImage: this.plog.backgroundImage,
          elements: this.plog.elements,
          diaryIds: this.plog.diaryIds,
          createdAt: this.plog.createdAt,
          thumbnail: this.plog.thumbnail
        };
        await PlogViewModel.createPlog(insertParams);
      } else {
        await PlogViewModel.updatePlog(this.plog);
      }

      promptAction.showToast({ message: '保存成功' });
    } catch (error) {
      console.error('保存手账失败:', error);
      promptAction.showToast({ message: '保存失败' });
    }
  }

  /**
   * 一键生成手账素材
   */
  async oneClickGenerate(): Promise<void> {
    try {
      const materials = await PlogViewModel.generatePlogMaterials(DateUtils.getToday());

      // 将动态照片添加到画布
      materials.posts.forEach((post, index) => {
        if (post.mediaUrls && post.mediaUrls.length > 0) {
          const element: CanvasElement = {
            type: 'image',
            x: 20 + (index % 3) * 120,
            y: 100 + Math.floor(index / 3) * 150,
            width: 100,
            height: 100,
            rotation: 0,
            content: post.mediaUrls[0],
            zIndex: index
          };
          this.elements.push(element);
        }
      });

      // 将待办清单作为文本添加到画布
      if (materials.todos.length > 0) {
        const todoText = materials.todos.map((t: TodoItem) =>
          `${t.status === 'completed' ? '✓' : '○'} ${t.content}`
        ).join('\n');

        const textElement: CanvasElement = {
          type: 'text',
          x: 20,
          y: 20,
          width: 200,
          height: 60,
          rotation: 0,
          content: `今日任务:\n${todoText}`,
          zIndex: materials.posts.length,
          fontSize: 14,
          color: '#333333'
        };
        this.elements.push(textElement);
      }

      // 保存
      if (this.plog) {
        this.plog.elements = this.elements;
        // 保存关联的随手记ID
        this.plog.diaryIds = materials.posts.map((post: DiaryPost) => post.id);
        if (this.plog.id === 0) {
          const insertParams: PlogInsertParams = {
            date: this.plog.date,
            backgroundImage: this.plog.backgroundImage,
            elements: this.plog.elements,
            diaryIds: this.plog.diaryIds,
            createdAt: this.plog.createdAt,
            thumbnail: this.plog.thumbnail
          };
          await PlogViewModel.createPlog(insertParams);
        } else {
          await PlogViewModel.updatePlog(this.plog);
        }
      }
    } catch (error) {
      console.error('生成素材失败:', error);
    }
  }

  @Builder
  MainToolButton(label: string, tabIndex: number) {
    Column() {
      Text(label)
        .fontSize($r('app.float.font_size_sm'))
        .fontColor(this.activeToolTab === tabIndex
          ? $r('app.color.primary_color')
          : $r('app.color.text_secondary'))
        .textAlign(TextAlign.Center)
        .maxLines(2)
        .fontWeight(this.activeToolTab === tabIndex ? FontWeight.Medium : FontWeight.Normal)
    }
    .layoutWeight(1)
    .height(36)
    .justifyContent(FlexAlign.Center)
    .backgroundColor(this.activeToolTab === tabIndex ? '#FFF0E8' : Color.Transparent)
    .borderRadius(18)
    .onClick(() => {
      if (tabIndex === 2) {
        this.switchToolTab(tabIndex);
      } else if (tabIndex === 4) {
        promptAction.showToast({ message: '画笔功能开发中' });
      } else {
        this.switchToolTab(tabIndex);
      }
    })
  }

  @Builder
  SubToolButton(label: string, subIndex: number) {
    Column() {
      Text(label)
        .fontSize($r('app.float.font_size_sm'))
        .fontColor(this.activeSubTool === subIndex
          ? $r('app.color.primary_color')
          : $r('app.color.text_secondary'))
        .fontWeight(this.activeSubTool === subIndex ? FontWeight.Medium : FontWeight.Normal)
    }
    .height('100%')
    .padding({ left: 16, right: 16 })
    .justifyContent(FlexAlign.Center)
    .border({
      width: { bottom: this.activeSubTool === subIndex ? 2 : 0 },
      color: $r('app.color.primary_color')
    })
    .onClick(() => this.switchSubTool(subIndex))
  }

  @Builder
  DetailContent() {
    if (this.activeToolTab === 0) {
      // 随手记详细设置
      if (this.todayDiaryPosts.length === 0) {
        Column() {
          Text('今天还没有随手记')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_hint'))
        }
        .width('100%')
        .height(160)
        .justifyContent(FlexAlign.Center)
      } else {
        Scroll() {
          Column() {
            ForEach(this.todayDiaryPosts, (post: DiaryPost) => {
              this.DiaryPostItem(post)
            }, (post: DiaryPost) => post.id.toString())
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 8, bottom: 8 })
        }
        .width('100%')
        .height(200)
        .scrollBar(BarState.Off)
      }
    } else if (this.activeToolTab === 1) {
      // 背景详细设置
      Column() {
        Text('背景设置')
          .fontSize($r('app.float.font_size_base'))
          .fontColor($r('app.color.text_hint'))
          .margin({ top: 20, bottom: 20 })
        Text('选择纯色或图片作为背景')
          .fontSize($r('app.float.font_size_sm'))
          .fontColor($r('app.color.text_hint'))
      }
      .width('100%')
      .height(160)
      .justifyContent(FlexAlign.Center)
    } else if (this.activeToolTab === 2) {
      // 文字详细设置（根据子工具切换）
      Column() {
        if (this.activeSubTool === 0) {
          Text('选择文字样式')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_primary'))
            .margin({ bottom: 12 })
          Row({ space: 12 }) {
            Text('常规').padding(8).backgroundColor('#F5F5F5').borderRadius(6)
            Text('手写').padding(8).backgroundColor('#F5F5F5').borderRadius(6)
            Text('艺术').padding(8).backgroundColor('#F5F5F5').borderRadius(6)
          }
        } else if (this.activeSubTool === 1) {
          Text('选择文字颜色')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_primary'))
            .margin({ bottom: 12 })
          Row({ space: 10 }) {
            ForEach(['#333333', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#000000'],
              (color: string) => {
                Column()
                  .width(32)
                  .height(32)
                  .backgroundColor(color)
                  .borderRadius(16)
              }, (color: string) => color)
          }
        } else if (this.activeSubTool === 2) {
          Text('文字排版')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_primary'))
            .margin({ bottom: 12 })
          Row({ space: 16 }) {
            Text('左对齐').padding(8).backgroundColor('#F5F5F5').borderRadius(6)
            Text('居中').padding(8).backgroundColor('#F5F5F5').borderRadius(6)
            Text('右对齐').padding(8).backgroundColor('#F5F5F5').borderRadius(6)
          }
        } else if (this.activeSubTool === 3) {
          Text('粗斜体设置')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_primary'))
            .margin({ bottom: 12 })
          Row({ space: 16 }) {
            Text('B').fontWeight(FontWeight.Bold).fontSize(20).padding(8).backgroundColor('#F5F5F5').borderRadius(6)
            Text('I').fontStyle(FontStyle.Italic).fontSize(20).padding(8).backgroundColor('#F5F5F5').borderRadius(6)
          }
        } else if (this.activeSubTool === 4) {
          Text('文字弯曲效果')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_primary'))
            .margin({ bottom: 12 })
          Text('弯曲效果开发中')
            .fontSize($r('app.float.font_size_sm'))
            .fontColor($r('app.color.text_hint'))
        }
      }
      .width('100%')
      .height(160)
      .justifyContent(FlexAlign.Center)
      .padding({ left: 16, right: 16 })
      .transition(TransitionEffect.OPACITY.animation({ duration: 180, curve: Curve.EaseOut }))
    } else if (this.activeToolTab === 3) {
      // 贴纸详细设置
      Grid() {
        ForEach(['⭐', '❤️', '🌸', '🎀', '✨', '🌈', '🌟', '💎', '🍀', '🦋', '🌙', '🎈'], (sticker: string) => {
          GridItem() {
            Column() {
              Text(sticker)
                .fontSize(28)
            }
            .width('100%')
            .height('100%')
            .justifyContent(FlexAlign.Center)
          }
          .width(52)
          .height(52)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .onClick(() => {
            this.addSticker(sticker);
            promptAction.showToast({ message: '已添加贴纸' });
          })
        })
      }
      .columnsTemplate('1fr 1fr 1fr 1fr')
      .rowsGap(8)
      .columnsGap(8)
      .width('100%')
      .height(160)
      .padding({ left: 16, right: 16, top: 8, bottom: 8 })
    }
  }

  @Builder
  DiaryPostItem(post: DiaryPost) {
    Row() {
      // 图片缩略图
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        Image(post.mediaUrls[0])
          .width(50)
          .height(50)
          .borderRadius(6)
          .objectFit(ImageFit.Cover)
          .margin({ right: 10 })
      } else {
        Column()
          .width(50)
          .height(50)
          .borderRadius(6)
          .backgroundColor('#F0F0F0')
          .margin({ right: 10 })
      }

      Column() {
        Text(post.content || '')
          .fontSize($r('app.float.font_size_base'))
          .fontColor($r('app.color.text_primary'))
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')

        Text(DateUtils.formatTime(post.timestamp))
          .fontSize($r('app.float.font_size_xs'))
          .fontColor($r('app.color.text_hint'))
          .margin({ top: 4 })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)

      // 添加按钮
      Button('添加')
        .fontSize($r('app.float.font_size_sm'))
        .height(32)
        .backgroundColor($r('app.color.primary_color'))
        .onClick(() => this.addDiaryToCanvas(post))
    }
    .width('100%')
    .padding(12)
    .backgroundColor($r('app.color.card_background'))
    .borderRadius($r('app.float.border_radius_md'))
    .margin({ bottom: 8 })
  }

  build() {
    Stack() {
      Column() {
        // 顶部栏
        Row() {
          Button() {
            SymbolGlyph($r('sys.symbol.chevron_left'))
              .fontSize(20)
              .fontColor([$r('app.color.text_primary')])
          }
          .width(40)
          .height(40)
          .backgroundColor(Color.Transparent)
          .onClick(() => this.navigateBack())

          Blank()

          Text('保存')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.primary_color'))
            .onClick(() => this.savePlog())
        }
        .width('100%')
        .height(48)
        .padding({ left: 12, right: 16 })
        .alignItems(VerticalAlign.Center)

        // 白色画布区域
        Stack() {
          // 白色画布背景
          Column()
            .width('100%')
            .height('100%')
            .backgroundColor(Color.White)

          // 画布元素
          ForEach(this.elements, (element: CanvasElement, index: number) => {
            if (element.type === 'image' || element.type === 'sticker') {
              Image(element.content)
                .width(element.width)
                .height(element.height)
                .position({ x: element.x, y: element.y })
                .rotate({ angle: element.rotation })
                .zIndex(element.zIndex)
                .border({
                  width: this.selectedElementIndex === index ? 2 : 0,
                  color: $r('app.color.primary_color')
                })
                .onClick(() => {
                  this.selectedElementIndex = index;
                })
            } else if (element.type === 'text') {
              Text(element.content)
                .fontSize(element.fontSize || 14)
                .fontColor(element.color || '#333333')
                .position({ x: element.x, y: element.y })
                .width(element.width)
                .zIndex(element.zIndex)
                .border({
                  width: this.selectedElementIndex === index ? 2 : 0,
                  color: $r('app.color.primary_color')
                })
                .onClick(() => {
                  this.selectedElementIndex = index;
                })
            }
          }, (element: CanvasElement, index: number) => index.toString())
        }
        .width('100%')
        .layoutWeight(1)
        .padding(16)

        // 底部综合面板（主工具栏 + 子工具栏 + 详细设置）
        Column() {
          // 展开区域：详细设置 + 子工具栏
          if (this.panelExpanded && this.activeToolTab >= 0) {
            Column() {
              // 下拉指示横线（点击收起/展开）
              Row() {
                Column()
                  .width(36)
                  .height(4)
                  .borderRadius(2)
                  .backgroundColor('#CCCCCC')
              }
              .width('100%')
              .height(20)
              .justifyContent(FlexAlign.Center)
              .onClick(() => this.togglePanel())

              // 详细设置内容区
              this.DetailContent()

              // 子工具栏（仅文字工具有）
              if (this.activeToolTab === 2) {
                Row() {
                  ForEach(this.textSubTools, (tool: string, idx: number) => {
                    this.SubToolButton(tool, idx)
                  }, (tool: string, idx: number) => idx.toString())
                }
                .width('100%')
                .height(40)
                .justifyContent(FlexAlign.Center)
                .border({
                  width: { top: 0.5 },
                  color: $r('app.color.divider_color')
                })
              }
            }
            .width('100%')
            .backgroundColor($r('app.color.background_color'))
            .borderRadius({ topLeft: 16, topRight: 16 })
            .shadow({ radius: 8, color: '#15000000', offsetX: 0, offsetY: -2 })
            .transition(TransitionEffect.asymmetric(
              TransitionEffect.OPACITY.combine(TransitionEffect.translate({ y: 20 })),
              TransitionEffect.OPACITY.combine(TransitionEffect.translate({ y: 20 }))
            ).animation({ duration: 280, curve: Curve.EaseInOut }))
          }

          // 主工具栏（始终显示）
          Row() {
            this.MainToolButton('随手记', 0)

            Divider()
              .width(0.5)
              .height(36)
              .color($r('app.color.divider_color'))

            this.MainToolButton('背景', 1)

            Divider()
              .width(0.5)
              .height(36)
              .color($r('app.color.divider_color'))

            this.MainToolButton('文字', 2)

            Divider()
              .width(0.5)
              .height(36)
              .color($r('app.color.divider_color'))

            this.MainToolButton('贴纸', 3)

            Divider()
              .width(0.5)
              .height(36)
              .color($r('app.color.divider_color'))

            this.MainToolButton('画笔', 4)
          }
          .width('100%')
          .height(56)
          .backgroundColor($r('app.color.card_background'))
          .border({
            width: { top: this.panelExpanded && this.activeToolTab >= 0 ? 0 : 0.5 },
            color: $r('app.color.divider_color')
          })
        }
        .width('100%')
      }
      .width('100%')
      .height('100%')
      .backgroundColor($r('app.color.background_color'))
    }
    .width('100%')
    .height('100%')
  }
}

export default PlogEditorPage;
