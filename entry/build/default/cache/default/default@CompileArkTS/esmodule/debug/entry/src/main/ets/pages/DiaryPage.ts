if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DiaryPage_Params {
    posts?: DiaryPost[];
    isLoading?: boolean;
    showPostDialog?: boolean;
    newPostContent?: string;
}
import DiaryViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/DiaryViewModel&";
import PostCardComponent from "@normalized:N&&&entry/src/main/ets/components/diary/PostCard&";
import type { DiaryPost } from '../model/DiaryPost';
import type { DiaryPostInsertParams } from '../common/database/RDBStoreUtil';
import DateUtils from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtils&";
class DiaryPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__posts = new ObservedPropertyObjectPU([], this, "posts");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__showPostDialog = new ObservedPropertySimplePU(false, this, "showPostDialog");
        this.__newPostContent = new ObservedPropertySimplePU('', this, "newPostContent");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DiaryPage_Params) {
        if (params.posts !== undefined) {
            this.posts = params.posts;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.showPostDialog !== undefined) {
            this.showPostDialog = params.showPostDialog;
        }
        if (params.newPostContent !== undefined) {
            this.newPostContent = params.newPostContent;
        }
    }
    updateStateVars(params: DiaryPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__posts.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__showPostDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__newPostContent.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__posts.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__showPostDialog.aboutToBeDeleted();
        this.__newPostContent.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __posts: ObservedPropertyObjectPU<DiaryPost[]>;
    get posts() {
        return this.__posts.get();
    }
    set posts(newValue: DiaryPost[]) {
        this.__posts.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __showPostDialog: ObservedPropertySimplePU<boolean>;
    get showPostDialog() {
        return this.__showPostDialog.get();
    }
    set showPostDialog(newValue: boolean) {
        this.__showPostDialog.set(newValue);
    }
    private __newPostContent: ObservedPropertySimplePU<string>;
    get newPostContent() {
        return this.__newPostContent.get();
    }
    set newPostContent(newValue: string) {
        this.__newPostContent.set(newValue);
    }
    aboutToAppear(): void {
        this.loadPosts();
    }
    async loadPosts(): Promise<void> {
        this.isLoading = true;
        try {
            this.posts = await DiaryViewModel.getAllPosts();
        }
        catch (error) {
            console.error('加载动态失败:', error);
        }
        finally {
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
        }
        catch (error) {
            console.error('发布动态失败:', error);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 最外层 Stack 确保悬浮按钮和弹窗绝对置顶
            Stack.create({ alignContent: Alignment.BottomEnd });
            // 最外层 Stack 确保悬浮按钮和弹窗绝对置顶
            Stack.width('100%');
            // 最外层 Stack 确保悬浮按钮和弹窗绝对置顶
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 1. 主页面内容
            Column.create();
            // 1. 主页面内容
            Column.width('100%');
            // 1. 主页面内容
            Column.height('100%');
            // 1. 主页面内容
            Column.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 16, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('生活记录');
            Text.fontSize({ "id": 16777320, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(40);
                        LoadingProgress.height(40);
                        LoadingProgress.layoutWeight(1);
                    }, LoadingProgress);
                });
            }
            else if (this.posts.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📸');
                        Text.fontSize(48);
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('还没有动态');
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击右下角按钮发布第一条动态');
                        Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 💡 修复：Scroll 必须显式设置 width('100%') 配合 layoutWeight(1) 确保列表安全撑开
                        Scroll.create();
                        // 💡 修复：Scroll 必须显式设置 width('100%') 配合 layoutWeight(1) 确保列表安全撑开
                        Scroll.width('100%');
                        // 💡 修复：Scroll 必须显式设置 width('100%') 配合 layoutWeight(1) 确保列表安全撑开
                        Scroll.layoutWeight(1);
                        // 💡 修复：Scroll 必须显式设置 width('100%') 配合 layoutWeight(1) 确保列表安全撑开
                        Scroll.scrollBar(BarState.Off);
                        // 💡 修复：Scroll 必须显式设置 width('100%') 配合 layoutWeight(1) 确保列表安全撑开
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, bottom: 100 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const post = _item;
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new PostCardComponent(this, { post: post }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/DiaryPage.ets", line: 102, col: 17 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                post: post
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            post: post
                                        });
                                    }
                                }, { name: "PostCardComponent" });
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.posts, forEachItemGenFunction, (post: DiaryPost) => {
                            return post && post.id ? post.id.toString() : Math.random().toString();
                        }, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    // 💡 修复：Scroll 必须显式设置 width('100%') 配合 layoutWeight(1) 确保列表安全撑开
                    Scroll.pop();
                });
            }
        }, If);
        If.pop();
        // 1. 主页面内容
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 2. 右下角随手记发布按钮 (+)
            Button.createWithChild({ type: ButtonType.Circle });
            // 2. 右下角随手记发布按钮 (+)
            Button.width(56);
            // 2. 右下角随手记发布按钮 (+)
            Button.height(56);
            // 2. 右下角随手记发布按钮 (+)
            Button.backgroundColor(Color.Pink);
            // 2. 右下角随手记发布按钮 (+)
            Button.margin({ right: 24, bottom: 36 });
            // 2. 右下角随手记发布按钮 (+)
            Button.zIndex(999);
            // 2. 右下角随手记发布按钮 (+)
            Button.hitTestBehavior(HitTestMode.Block);
            // 2. 右下角随手记发布按钮 (+)
            Button.onClick(() => {
                this.showPostDialog = true;
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('+');
            Text.fontSize(20);
            Text.fontColor(Color.White);
            Text.fontWeight(FontWeight.Lighter);
            Text.width('100%');
            Text.height('100%');
        }, Text);
        Text.pop();
        // 2. 右下角随手记发布按钮 (+)
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 3. 发布弹窗对话框
            if (this.showPostDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#80000000');
                        Column.zIndex(9999);
                        Column.onClick(() => {
                            // 点击半透明空白处时正常关闭弹窗
                            this.showPostDialog = false;
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 真正的输入白色卡片
                        Column.create();
                        // 真正的输入白色卡片
                        Column.width('90%');
                        // 真正的输入白色卡片
                        Column.padding(20);
                        // 真正的输入白色卡片
                        Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        // 真正的输入白色卡片
                        Column.borderRadius({ "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        // 真正的输入白色卡片
                        Column.margin({ bottom: 24 });
                        // 真正的输入白色卡片
                        Column.hitTestBehavior(HitTestMode.Block);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('发布动态');
                        Text.fontSize({ "id": 16777315, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Medium);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 💡 修复：严格模式下通过 $$ 实现真正的双向数据通道绑定，确保打字能显示
                        TextArea.create({
                            placeholder: '记录这一刻的想法...',
                            text: { value: this.newPostContent, changeEvent: newValue => { this.newPostContent = newValue; } }
                        });
                        // 💡 修复：严格模式下通过 $$ 实现真正的双向数据通道绑定，确保打字能显示
                        TextArea.width('100%');
                        // 💡 修复：严格模式下通过 $$ 实现真正的双向数据通道绑定，确保打字能显示
                        TextArea.height(120);
                        // 💡 修复：严格模式下通过 $$ 实现真正的双向数据通道绑定，确保打字能显示
                        TextArea.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        // 💡 修复：严格模式下通过 $$ 实现真正的双向数据通道绑定，确保打字能显示
                        TextArea.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, TextArea);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ top: 16 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.layoutWeight(1);
                        Button.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.onClick(() => {
                            this.showPostDialog = false;
                            this.newPostContent = '';
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('发布');
                        Button.layoutWeight(1);
                        Button.backgroundColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Button.margin({ left: 12 });
                        Button.onClick(() => {
                            this.createPost();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    // 真正的输入白色卡片
                    Column.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 最外层 Stack 确保悬浮按钮和弹窗绝对置顶
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "DiaryPage";
    }
}
export default DiaryPage;
registerNamedRoute(() => new DiaryPage(undefined, {}), "", { bundleName: "com.example.lifetracker", moduleName: "entry", pagePath: "pages/DiaryPage", pageFullPath: "entry/src/main/ets/pages/DiaryPage", integratedHsp: "false", moduleType: "followWithHap" });
