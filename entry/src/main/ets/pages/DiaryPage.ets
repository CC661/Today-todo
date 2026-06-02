import DiaryViewModel from '../viewmodel/DiaryViewModel';
import PostCardComponent from '../components/diary/PostCard';
import type { DiaryPost } from '../model/DiaryPost';
import type { DiaryPostInsertParams } from '../common/database/RDBStoreUtil';
import DateUtils from '../common/utils/DateUtils';

/**
 * 日记动态页 - 朋友圈式记录
 */
@Entry
@Component
struct DiaryPage {
  @State posts: DiaryPost[] = [];
  @State isLoading: boolean = false;
  @State showPostDialog: boolean = false;
  @State newPostContent: string = '';

  aboutToAppear(): void {
    this.loadPosts();
  }

  async loadPosts(): Promise<void> {
    this.isLoading = true;
    try {
      this.posts = await DiaryViewModel.getAllPosts();
    } catch (error) {
      console.error('加载动态失败:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async createPost(): Promise<void> {
    if (!this.newPostContent || !this.newPostContent.trim()) {
      return;
    }

    try {
      const post: DiaryPostInsertParams = {
        content: this.newPostContent,
        mediaUrls: [],
        location: '',
        weather: '',
        timestamp: Date.now(),
        date: DateUtils.getToday(),
        category: '',
        templateData: ''
      };

      await DiaryViewModel.createPost(post);
      this.newPostContent = '';
      this.showPostDialog = false;
      await this.loadPosts();
    } catch (error) {
      console.error('发布动态失败:', error);
    }
  }

  build() {
    // 最外层 Stack 确保悬浮按钮和弹窗绝对置顶
    Stack({ alignContent: Alignment.BottomEnd }) {

      // 1. 主页面内容
      Column() {
        Row() {
          Text('生活记录')
            .fontSize($r('app.float.font_size_xxl'))
            .fontWeight(FontWeight.Bold)
            .fontColor($r('app.color.text_primary'))
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16, bottom: 8 })

        if (this.isLoading) {
          LoadingProgress()
            .width(40)
            .height(40)
            .layoutWeight(1)
        } else if (this.posts.length === 0) {
          Column() {
            Text('📸')
              .fontSize(48)
              .margin({ bottom: 12 })

            Text('还没有动态')
              .fontSize($r('app.float.font_size_base'))
              .fontColor($r('app.color.text_hint'))

            Text('点击右下角按钮发布第一条动态')
              .fontSize($r('app.float.font_size_sm'))
              .fontColor($r('app.color.text_hint'))
              .margin({ top: 4 })
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        } else {
          // 💡 修复：Scroll 必须显式设置 width('100%') 配合 layoutWeight(1) 确保列表安全撑开
          Scroll() {
            Column() {
              ForEach(this.posts, (post: DiaryPost) => {
                PostCardComponent({ post: post })
              }, (post: DiaryPost) => {
                return post && post.id ? post.id.toString() : Math.random().toString();
              })
            }
            .width('100%')
            .padding({ left: 16, right: 16, bottom: 100 }) // 留出底部空间防悬浮按钮遮挡
          }
          .width('100%')
          .layoutWeight(1)
          .scrollBar(BarState.Off)
          .edgeEffect(EdgeEffect.Spring)
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor($r('app.color.background_color'))

      // 2. 右下角随手记发布按钮 (+)
      Button({ type: ButtonType.Circle }) {
        Text('+')
          .fontSize(20)
          .fontColor(Color.White)
          .fontWeight(FontWeight.Lighter)
          // 💡 加上这两行，把图标容器撑满，迫使加号在按钮内部居中
          .width('100%')
          .height('100%')
      }
      .width(56)
      .height(56)
      .backgroundColor(Color.Pink)
      .margin({ right: 24, bottom: 36 })
      .zIndex(999) // 确保在列表上方
      .hitTestBehavior(HitTestMode.Block) // 严格模式阻断测试冲突
      .onClick(() => {
        this.showPostDialog = true;
      })

      // 3. 发布弹窗对话框
      if (this.showPostDialog) {
        Column() {
          Blank()

          // 真正的输入白色卡片
          Column() {
            Text('发布动态')
              .fontSize($r('app.float.font_size_lg'))
              .fontWeight(FontWeight.Medium)
              .margin({ bottom: 16 })

            // 💡 修复：严格模式下通过 $$ 实现真正的双向数据通道绑定，确保打字能显示
            TextArea({
              placeholder: '记录这一刻的想法...',
              text: $$this.newPostContent
            })
              .width('100%')
              .height(120)
              .fontSize($r('app.float.font_size_base'))
              .backgroundColor($r('app.color.background_color'))

            Row() {
              Button('取消')
                .layoutWeight(1)
                .backgroundColor($r('app.color.background_color'))
                .fontColor($r('app.color.text_primary'))
                .onClick(() => {
                  this.showPostDialog = false;
                  this.newPostContent = '';
                })

              Button('发布')
                .layoutWeight(1)
                .backgroundColor($r('app.color.primary_color'))
                .margin({ left: 12 })
                .onClick(() => {
                  this.createPost();
                })
            }
            .width('100%')
            .margin({ top: 16 })
          }
          .width('90%')
          .padding(20)
          .backgroundColor($r('app.color.card_background'))
          .borderRadius($r('app.float.border_radius_xl'))
          .margin({ bottom: 24 })
          // 💡 修复：极其重要！把卡片区域的手势命中设为 Block，吃掉点击事件
          // 从而彻底阻止点击卡片内部时，事件冒泡到外层遮罩导致弹窗意外关闭
          .hitTestBehavior(HitTestMode.Block)
        }
        .width('100%')
        .height('100%')
        .backgroundColor('#80000000')
        .zIndex(9999) // 弹窗层级最高
        .onClick(() => {
          // 点击半透明空白处时正常关闭弹窗
          this.showPostDialog = false;
        })
      }
    }
    .width('100%')
    .height('100%')
  }
}

export default DiaryPage