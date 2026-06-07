import CategoryViewModel from '../viewmodel/CategoryViewModel';
import type { DiaryPost } from '../model/DiaryPost';
import { TemplateType } from '../model/TemplateData';
import PostCardComponent from '../components/diary/PostCard';
import { router } from '@kit.ArkUI';
import PreferencesUtil from '../common/database/PreferencesUtil';
import DiaryViewModel from '../viewmodel/DiaryViewModel';
import { promptAction } from '@kit.ArkUI';

/**
 * 合集页 - 展示用户自定义合集及其中记录
 */
@Entry
@Component
struct CategoryPage {
  @State collections: string[] = [];
  @State selectedCollection: string = '';
  @State posts: DiaryPost[] = [];
  @State isLoading: boolean = false;

  // 侧边栏
  @State showSidebar: boolean = false;

  // 新建合集弹窗
  @State showNewCollectionDialog: boolean = false;
  @State newCollectionName: string = '';

  aboutToAppear(): void {
    this.loadCollections();
  }

  async loadCollections(): Promise<void> {
    try {
      const savedCollections = await PreferencesUtil.getCollections();
      const categorySet = new Set<string>();
      const allPosts = await DiaryViewModel.getAllPosts();
      for (const m of allPosts) {
        if (m.category && m.category.trim()) {
          categorySet.add(m.category.trim());
        }
      }
      const merged: string[] = [];
      const seen = new Set<string>();
      for (const c of savedCollections) {
        if (!seen.has(c)) {
          seen.add(c);
          merged.push(c);
        }
      }
      categorySet.forEach((c: string) => {
        if (!seen.has(c)) {
          seen.add(c);
          merged.push(c);
        }
      });
      this.collections = merged;
      if (merged.length > 0) {
        this.selectedCollection = merged[0];
        await this.loadPosts();
      }
    } catch (error) {
      console.error('加载合集列表失败:', error);
    }
  }

  async loadPosts(): Promise<void> {
    if (!this.selectedCollection) {
      return;
    }
    this.isLoading = true;
    try {
      this.posts = await DiaryViewModel.getPostsByCategory(this.selectedCollection);
    } catch (error) {
      console.error('加载合集记录失败:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onCollectionSelected(collection: string): void {
    this.selectedCollection = collection;
    this.loadPosts();
  }

  async createNewCollection(): Promise<void> {
    const name = this.newCollectionName.trim();
    if (!name || name.length > 10) {
      return;
    }
    if (this.collections.includes(name)) {
      promptAction.showToast({ message: '该合集已存在' });
      return;
    }
    this.collections.push(name);
    await PreferencesUtil.saveCollections(this.collections);
    this.newCollectionName = '';
    this.showNewCollectionDialog = false;
    this.selectedCollection = name;
    await this.loadPosts();
    promptAction.showToast({ message: '合集创建成功' });
  }

  build() {
    Stack({ alignContent: Alignment.TopStart }) {
      Column() {
        // 标题栏
        Row() {
          Row({ space: 12 }) {
            // 返回按钮
            Button() {
              SymbolGlyph($r('sys.symbol.chevron_left'))
                .fontSize(18)
                .fontColor([$r('app.color.text_secondary')])
            }
            .width(32)
            .height(32)
            .backgroundColor(Color.Transparent)
            .onClick(() => {
              router.back();
            })

            // 列表按钮
            Button() {
              SymbolGlyph($r('sys.symbol.list_bullet'))
                .fontSize(18)
                .fontColor([$r('app.color.text_secondary')])
            }
            .width(32)
            .height(32)
            .backgroundColor(Color.Transparent)
            .onClick(() => {
              animateTo({ duration: 250, curve: Curve.EaseOut }, () => {
                this.showSidebar = !this.showSidebar;
              });
            })
          }

          Blank()

          Text('合集')
            .fontSize($r('app.float.font_size_lg'))
            .fontWeight(FontWeight.Medium)
            .fontColor($r('app.color.text_primary'))
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16, bottom: 12 })

        Divider()
          .color($r('app.color.divider_color'))

        // 合集名称标题
        if (this.selectedCollection) {
          Row() {
            Text(this.selectedCollection)
              .fontSize($r('app.float.font_size_xl'))
              .fontWeight(FontWeight.Bold)
              .fontColor($r('app.color.text_primary'))

            Blank()

            Text(`${this.posts.length}条记录`)
              .fontSize($r('app.float.font_size_sm'))
              .fontColor($r('app.color.text_hint'))
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 16, bottom: 8 })
        }

        // 记录列表
        if (this.isLoading) {
          Column() {
            LoadingProgress()
              .width(40)
              .height(40)
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Start)
          .padding({ top: 24 })
        } else if (this.posts.length === 0) {
          Column() {
            Text('📝')
              .fontSize(48)
              .margin({ bottom: 12 })

            Text('该合集中还没有记录')
              .fontSize($r('app.float.font_size_base'))
              .fontColor($r('app.color.text_hint'))
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Start)
          .padding({ top: 24 })
        } else {
          Scroll() {
            Column() {
              ForEach(this.posts, (post: DiaryPost) => {
                PostCardComponent({ post: post })
              }, (post: DiaryPost) => post.id.toString())
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 8, bottom: 100 })
          }
          .layoutWeight(1)
          .align(Alignment.TopStart)
          .scrollBar(BarState.Off)
          .edgeEffect(EdgeEffect.Spring)
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor($r('app.color.background_color'))

      // 侧边栏
      if (this.showSidebar) {
        Column() {
          // 合集列表
          Scroll() {
            Column({ space: 4 }) {
              ForEach(this.collections, (collection: string) => {
                Row() {
                  Text(collection)
                    .fontSize($r('app.float.font_size_base'))
                    .fontColor(this.selectedCollection === collection ?
                      $r('app.color.primary_color') : $r('app.color.text_primary'))
                  Blank()
                  if (this.selectedCollection === collection) {
                    Text('●')
                      .fontSize(8)
                      .fontColor($r('app.color.primary_color'))
                  }
                }
                .width('100%')
                .height(44)
                .padding({ left: 16, right: 16 })
                .backgroundColor(this.selectedCollection === collection ?
                  '#10FF6B35' : Color.Transparent)
                .borderRadius($r('app.float.border_radius_md'))
                .onClick(() => {
                  this.onCollectionSelected(collection);
                  animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                    this.showSidebar = false;
                  });
                })
              })
            }
            .width('100%')
            .padding({ left: 12, right: 12 })
          }
          .scrollBar(BarState.Off)
          .align(Alignment.TopStart)
          .margin({ top: 12, left: 4, right: 4 })

          Divider()
            .color($r('app.color.divider_color'))
            .margin({ left: 16, right: 16, top: 8, bottom: 8 })

          // 添加列表按钮
          Row() {
            Text('＋ 添加列表')
              .fontSize($r('app.float.font_size_base'))
              .fontColor($r('app.color.text_primary'))
          }
          .width('100%')
          .height(44)
          .padding({ left: 16, right: 16 })
          .backgroundColor($r('app.color.background_color'))
          .borderRadius($r('app.float.border_radius_md'))
          .margin({ left: 12, right: 12, bottom: 16 })
          .onClick(() => {
            this.showSidebar = false;
            this.newCollectionName = '';
            animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
              this.showNewCollectionDialog = true;
            });
          })
        }
        .width(180)
        .height('calc(100% - 60px)')
        .position({ x: 0, y: 60 })
        .backgroundColor($r('app.color.card_background'))
        .borderRadius($r('app.float.border_radius_xl'))
        .zIndex(100)
        .shadow({ radius: 16, color: '#20000000', offsetX: 4, offsetY: 0 })
        .transition(TransitionEffect.translate({ x: '-100%' })
          .animation({ duration: 250, curve: Curve.EaseOut }))
      }

      // 新建合集弹窗
      if (this.showNewCollectionDialog) {
        Column() {
          Blank()

          Column() {
            // 标题栏
            Row() {
              Button() {
                SymbolGlyph($r('sys.symbol.chevron_left'))
                  .fontSize(18)
                  .fontColor([$r('app.color.text_secondary')])
              }
              .width(32)
              .height(32)
              .backgroundColor(Color.Transparent)
              .onClick(() => {
                animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                  this.showNewCollectionDialog = false;
                });
              })

              Blank()

              Text('新建合集')
                .fontSize($r('app.float.font_size_lg'))
                .fontWeight(FontWeight.Medium)
                .fontColor($r('app.color.text_primary'))

              Blank()

              Text('创建')
                .fontSize($r('app.float.font_size_base'))
                .fontColor(this.newCollectionName.trim().length > 0 && this.newCollectionName.trim().length <= 10
                  ? $r('app.color.primary_color') : $r('app.color.text_hint'))
                .onClick(() => this.createNewCollection())
            }
            .width('100%')
            .margin({ bottom: 20 })

            // 合集名称输入框
            TextInput({
              placeholder: '请输入合集名称（不多于 10 字）',
              text: this.newCollectionName
            })
              .width('100%')
              .height(48)
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor($r('app.color.background_color'))
              .borderRadius($r('app.float.border_radius_md'))
              .padding({ left: 12, right: 12 })
              .border({
                width: this.newCollectionName.length > 10 ? 1 : 0,
                color: this.newCollectionName.length > 10 ? '#FF4D4F' : Color.Transparent
              })
              .fontColor(this.newCollectionName.length > 10 ? '#FF4D4F' : $r('app.color.text_primary'))
              .onChange((value: string) => { this.newCollectionName = value; })
              .onSubmit(() => { this.createNewCollection(); })

            // 字数提示
            if (this.newCollectionName.length > 10) {
              Text('合集名称不能超过10个字')
                .fontSize($r('app.float.font_size_sm'))
                .fontColor('#FF4D4F')
                .width('100%')
                .margin({ top: 6 })
            }
          }
          .width('100%')
          .padding(20)
          .backgroundColor($r('app.color.card_background'))
          .borderRadius({ topLeft: $r('app.float.border_radius_xl'), topRight: $r('app.float.border_radius_xl') })
        }
        .width('100%')
        .height('100%')
        .backgroundColor('#80000000')
        .justifyContent(FlexAlign.End)
        .onClick(() => {
          animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
            this.showNewCollectionDialog = false;
          });
        })
        .transition(TransitionEffect.translate({ y: '100%' })
          .animation({ duration: 250, curve: Curve.EaseOut }))
      }
    }
    .width('100%')
    .height('100%')
  }
}

export default CategoryPage;
