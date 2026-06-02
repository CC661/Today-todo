import PlogViewModel from '../viewmodel/PlogViewModel';
import type { PlogCanvas, CanvasElement } from '../model/PlogCanvas';
import type { TodoItem } from '../model/TodoItem';
import type { PlogInsertParams } from '../common/database/RDBStoreUtil';
import DateUtils from '../common/utils/DateUtils';

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

  aboutToAppear(): void {
    this.initPlog();
  }

  async initPlog(): Promise<void> {
    const today = DateUtils.getToday();
    const existingPlog = await PlogViewModel.getPlogByDate(today);

    if (existingPlog) {
      this.plog = existingPlog;
      this.elements = existingPlog.elements;
    } else {
      this.plog = {
        id: 0,
        date: today,
        backgroundImage: '',
        elements: [],
        createdAt: Date.now(),
        thumbnail: ''
      };
      this.elements = [];
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
        if (this.plog.id === 0) {
          const insertParams: PlogInsertParams = {
            date: this.plog.date,
            backgroundImage: this.plog.backgroundImage,
            elements: this.plog.elements,
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

  /**
   * 添加贴纸元素
   */
  addSticker(stickerUrl: string): void {
    const element: CanvasElement = {
      type: 'sticker',
      x: 100,
      y: 200,
      width: 80,
      height: 80,
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

      if (this.plog.id === 0) {
        const insertParams: PlogInsertParams = {
          date: this.plog.date,
          backgroundImage: this.plog.backgroundImage,
          elements: this.plog.elements,
          createdAt: this.plog.createdAt,
          thumbnail: this.plog.thumbnail
        };
        await PlogViewModel.createPlog(insertParams);
      } else {
        await PlogViewModel.updatePlog(this.plog);
      }

      console.info('手账保存成功');
    } catch (error) {
      console.error('保存手账失败:', error);
    }
  }

  build() {
    Stack() {
      Column() {
        // 标题栏
        Row() {
          Text($r('app.string.create_plog'))
            .fontSize($r('app.float.font_size_xl'))
            .fontWeight(FontWeight.Bold)
            .fontColor($r('app.color.text_primary'))

          Blank()

          Button('保存')
            .fontSize($r('app.float.font_size_base'))
            .backgroundColor($r('app.color.primary_color'))
            .onClick(() => {
              this.savePlog();
            })
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16, bottom: 8 })

        // 画布区域
        Stack() {
          // 背景
          if (this.plog && this.plog.backgroundImage) {
            Image(this.plog.backgroundImage)
              .width('100%')
              .height('100%')
              .objectFit(ImageFit.Cover)
          } else {
            Column()
              .width('100%')
              .height('100%')
              .backgroundColor('#FFF9F0')
          }

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
        .layoutWeight(1)
        .width('100%')
        .backgroundColor('#F5F5F5')

        // 底部工具栏
        Row() {
          Button('一键做手账')
            .layoutWeight(1)
            .backgroundColor($r('app.color.secondary_color'))
            .fontSize($r('app.float.font_size_base'))
            .onClick(() => {
              this.oneClickGenerate();
            })

          Button('贴纸')
            .layoutWeight(1)
            .backgroundColor($r('app.color.card_background'))
            .fontColor($r('app.color.text_primary'))
            .margin({ left: 8 })
            .onClick(() => {
              this.showMaterialPanel = true;
            })

          Button('文字')
            .layoutWeight(1)
            .backgroundColor($r('app.color.card_background'))
            .fontColor($r('app.color.text_primary'))
            .margin({ left: 8 })
            .onClick(() => {
              // TODO: 添加文字
            })
        }
        .width('100%')
        .padding(12)
        .backgroundColor($r('app.color.card_background'))
      }
      .width('100%')
      .height('100%')
      .backgroundColor($r('app.color.background_color'))

      // 贴纸面板
      if (this.showMaterialPanel) {
        Column() {
          Blank()

          Column() {
            Text('选择贴纸')
              .fontSize($r('app.float.font_size_lg'))
              .fontWeight(FontWeight.Medium)
              .margin({ bottom: 16 })

            Grid() {
              ForEach(['⭐', '❤️', '🌸', '🎀', '✨', '🌈'], (sticker: string) => {
                GridItem() {
                  Column() {
                    Text(sticker)
                      .fontSize(32)
                  }
                  .width('100%')
                  .height('100%')
                  .justifyContent(FlexAlign.Center)
                }
                .width(60)
                .height(60)
                .onClick(() => {
                  // TODO: 实际应该使用图片URL
                  this.addSticker('');
                  this.showMaterialPanel = false;
                })
              })
            }
            .columnsTemplate('1fr 1fr 1fr')
            .rowsGap(12)
            .columnsGap(12)
            .width('100%')
          }
          .width('90%')
          .padding(20)
          .backgroundColor($r('app.color.card_background'))
          .borderRadius($r('app.float.border_radius_xl'))
        }
        .width('100%')
        .height('100%')
        .backgroundColor('#80000000')
        .onClick(() => {
          this.showMaterialPanel = false;
        })
      }
    }
    .width('100%')
    .height('100%')
  }
}

export default PlogEditorPage;
