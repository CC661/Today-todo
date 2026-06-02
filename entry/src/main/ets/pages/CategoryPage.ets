import CategoryViewModel from '../viewmodel/CategoryViewModel';
import type { DiaryPost } from '../model/DiaryPost';
import { TemplateType } from '../model/TemplateData';
import PostCardComponent from '../components/diary/PostCard';

/**
 * 分类档案袋页 - 模板化分组记录
 */
@Entry
@Component
struct CategoryPage {
  @State selectedCategory: string = TemplateType.READING;
  @State posts: DiaryPost[] = [];
  @State isLoading: boolean = false;
  @State categoryStats: Map<string, number> = new Map();

  aboutToAppear(): void {
    this.loadCategoryStats();
    this.loadPosts();
  }

  async loadCategoryStats(): Promise<void> {
    try {
      this.categoryStats = await CategoryViewModel.getCategoryStats();
    } catch (error) {
      console.error('加载分类统计失败:', error);
    }
  }

  async loadPosts(): Promise<void> {
    this.isLoading = true;
    try {
      switch (this.selectedCategory) {
        case TemplateType.READING:
          this.posts = await CategoryViewModel.getReadingPosts();
          break;
        case TemplateType.EXPENSE:
          this.posts = await CategoryViewModel.getExpensePosts();
          break;
        case TemplateType.OOTD:
          this.posts = await CategoryViewModel.getOOTDPosts();
          break;
      }
    } catch (error) {
      console.error('加载分类动态失败:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onCategorySelected(category: string): void {
    this.selectedCategory = category;
    this.loadPosts();
  }

  build() {
    Column() {
      // 标题栏
      Row() {
        Text('分类档案')
          .fontSize($r('app.float.font_size_xxl'))
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 16, bottom: 8 })

      // 分类选择器
      Row() {
        // 阅读记录
        Column() {
          Text('📚')
            .fontSize(24)
            .margin({ bottom: 4 })

          Text($r('app.string.reading_template_title'))
            .fontSize($r('app.float.font_size_sm'))
            .fontColor(this.selectedCategory === TemplateType.READING ?
              $r('app.color.primary_color') : $r('app.color.text_secondary'))

          if (this.categoryStats.has(TemplateType.READING)) {
            Text(`${this.categoryStats.get(TemplateType.READING)}条`)
              .fontSize($r('app.float.font_size_xs'))
              .fontColor($r('app.color.text_hint'))
              .margin({ top: 2 })
          }
        }
        .layoutWeight(1)
        .padding(12)
        .backgroundColor(this.selectedCategory === TemplateType.READING ?
          '#10FF6B35' : $r('app.color.card_background'))
        .borderRadius($r('app.float.border_radius_md'))
        .onClick(() => this.onCategorySelected(TemplateType.READING))

        // 记账
        Column() {
          Text('💰')
            .fontSize(24)
            .margin({ bottom: 4 })

          Text($r('app.string.expense_template_title'))
            .fontSize($r('app.float.font_size_sm'))
            .fontColor(this.selectedCategory === TemplateType.EXPENSE ?
              $r('app.color.primary_color') : $r('app.color.text_secondary'))

          if (this.categoryStats.has(TemplateType.EXPENSE)) {
            Text(`${this.categoryStats.get(TemplateType.EXPENSE)}条`)
              .fontSize($r('app.float.font_size_xs'))
              .fontColor($r('app.color.text_hint'))
              .margin({ top: 2 })
          }
        }
        .layoutWeight(1)
        .padding(12)
        .backgroundColor(this.selectedCategory === TemplateType.EXPENSE ?
          '#10FF6B35' : $r('app.color.card_background'))
        .borderRadius($r('app.float.border_radius_md'))
        .margin({ left: 8 })
        .onClick(() => this.onCategorySelected(TemplateType.EXPENSE))

        // OOTD
        Column() {
          Text('👗')
            .fontSize(24)
            .margin({ bottom: 4 })

          Text($r('app.string.ootd_template_title'))
            .fontSize($r('app.float.font_size_sm'))
            .fontColor(this.selectedCategory === TemplateType.OOTD ?
              $r('app.color.primary_color') : $r('app.color.text_secondary'))

          if (this.categoryStats.has(TemplateType.OOTD)) {
            Text(`${this.categoryStats.get(TemplateType.OOTD)}条`)
              .fontSize($r('app.float.font_size_xs'))
              .fontColor($r('app.color.text_hint'))
              .margin({ top: 2 })
          }
        }
        .layoutWeight(1)
        .padding(12)
        .backgroundColor(this.selectedCategory === TemplateType.OOTD ?
          '#10FF6B35' : $r('app.color.card_background'))
        .borderRadius($r('app.float.border_radius_md'))
        .margin({ left: 8 })
        .onClick(() => this.onCategorySelected(TemplateType.OOTD))
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 8, bottom: 12 })

      // 分隔线
      Divider()
        .color($r('app.color.divider_color'))
        .margin({ bottom: 8 })

      // 动态列表
      if (this.isLoading) {
        LoadingProgress()
          .width(40)
          .height(40)
          .layoutWeight(1)
      } else if (this.posts.length === 0) {
        Column() {
          Text('📝')
            .fontSize(48)
            .margin({ bottom: 12 })

          Text('该分类下还没有记录')
            .fontSize($r('app.float.font_size_base'))
            .fontColor($r('app.color.text_hint'))
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        Scroll() {
          Column() {
            ForEach(this.posts, (post: DiaryPost) => {
              PostCardComponent({ post: post })
            }, (post: DiaryPost) => post.id.toString())
          }
          .width('100%')
          .padding(16)
        }
        .layoutWeight(1)
        .scrollBar(BarState.Off)
        .edgeEffect(EdgeEffect.Spring)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.background_color'))
  }
}

export default CategoryPage;
