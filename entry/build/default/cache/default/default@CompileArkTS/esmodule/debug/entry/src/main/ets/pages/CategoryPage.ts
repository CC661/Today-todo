if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CategoryPage_Params {
    collections?: string[];
    selectedCollection?: string;
    posts?: DiaryPost[];
    isLoading?: boolean;
    showSidebar?: boolean;
    showNewCollectionDialog?: boolean;
    newCollectionName?: string;
}
import type { DiaryPost } from '../model/DiaryPost';
import PostCardComponent from "@normalized:N&&&entry/src/main/ets/components/diary/PostCard&";
import router from "@ohos:router";
import PreferencesUtil from "@normalized:N&&&entry/src/main/ets/common/database/PreferencesUtil&";
import DiaryViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/DiaryViewModel&";
import promptAction from "@ohos:promptAction";
class CategoryPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__collections = new ObservedPropertyObjectPU([], this, "collections");
        this.__selectedCollection = new ObservedPropertySimplePU('', this, "selectedCollection");
        this.__posts = new ObservedPropertyObjectPU([], this, "posts");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__showSidebar = new ObservedPropertySimplePU(false, this, "showSidebar");
        this.__showNewCollectionDialog = new ObservedPropertySimplePU(false, this, "showNewCollectionDialog");
        this.__newCollectionName = new ObservedPropertySimplePU('', this, "newCollectionName");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CategoryPage_Params) {
        if (params.collections !== undefined) {
            this.collections = params.collections;
        }
        if (params.selectedCollection !== undefined) {
            this.selectedCollection = params.selectedCollection;
        }
        if (params.posts !== undefined) {
            this.posts = params.posts;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.showSidebar !== undefined) {
            this.showSidebar = params.showSidebar;
        }
        if (params.showNewCollectionDialog !== undefined) {
            this.showNewCollectionDialog = params.showNewCollectionDialog;
        }
        if (params.newCollectionName !== undefined) {
            this.newCollectionName = params.newCollectionName;
        }
    }
    updateStateVars(params: CategoryPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__collections.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedCollection.purgeDependencyOnElmtId(rmElmtId);
        this.__posts.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__showSidebar.purgeDependencyOnElmtId(rmElmtId);
        this.__showNewCollectionDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__newCollectionName.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__collections.aboutToBeDeleted();
        this.__selectedCollection.aboutToBeDeleted();
        this.__posts.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__showSidebar.aboutToBeDeleted();
        this.__showNewCollectionDialog.aboutToBeDeleted();
        this.__newCollectionName.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __collections: ObservedPropertyObjectPU<string[]>;
    get collections() {
        return this.__collections.get();
    }
    set collections(newValue: string[]) {
        this.__collections.set(newValue);
    }
    private __selectedCollection: ObservedPropertySimplePU<string>;
    get selectedCollection() {
        return this.__selectedCollection.get();
    }
    set selectedCollection(newValue: string) {
        this.__selectedCollection.set(newValue);
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
    // 侧边栏
    private __showSidebar: ObservedPropertySimplePU<boolean>;
    get showSidebar() {
        return this.__showSidebar.get();
    }
    set showSidebar(newValue: boolean) {
        this.__showSidebar.set(newValue);
    }
    // 新建合集弹窗
    private __showNewCollectionDialog: ObservedPropertySimplePU<boolean>;
    get showNewCollectionDialog() {
        return this.__showNewCollectionDialog.get();
    }
    set showNewCollectionDialog(newValue: boolean) {
        this.__showNewCollectionDialog.set(newValue);
    }
    private __newCollectionName: ObservedPropertySimplePU<string>;
    get newCollectionName() {
        return this.__newCollectionName.get();
    }
    set newCollectionName(newValue: string) {
        this.__newCollectionName.set(newValue);
    }
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
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('加载合集记录失败:', error);
        }
        finally {
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopStart });
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.padding({ left: 16, right: 16, top: 16, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 返回按钮
            Button.createWithChild();
            // 返回按钮
            Button.width(32);
            // 返回按钮
            Button.height(32);
            // 返回按钮
            Button.backgroundColor(Color.Transparent);
            // 返回按钮
            Button.onClick(() => {
                router.back();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832663, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        // 返回按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 列表按钮
            Button.createWithChild();
            // 列表按钮
            Button.width(32);
            // 列表按钮
            Button.height(32);
            // 列表按钮
            Button.backgroundColor(Color.Transparent);
            // 列表按钮
            Button.onClick(() => {
                Context.animateTo({ duration: 250, curve: Curve.EaseOut }, () => {
                    this.showSidebar = !this.showSidebar;
                });
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831650, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
        }, SymbolGlyph);
        // 列表按钮
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('合集');
            Text.fontSize({ "id": 16777315, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 合集名称标题
            if (this.selectedCollection) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.padding({ left: 16, right: 16, top: 16, bottom: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedCollection);
                        Text.fontSize({ "id": 16777318, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.posts.length}条记录`);
                        Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            // 记录列表
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 记录列表
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Start);
                        Column.padding({ top: 24 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(40);
                        LoadingProgress.height(40);
                    }, LoadingProgress);
                    Column.pop();
                });
            }
            else if (this.posts.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Start);
                        Column.padding({ top: 24 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📝');
                        Text.fontSize(48);
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('该合集中还没有记录');
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.layoutWeight(1);
                        Scroll.align(Alignment.TopStart);
                        Scroll.scrollBar(BarState.Off);
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, top: 8, bottom: 100 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const post = _item;
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new PostCardComponent(this, { post: post }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CategoryPage.ets", line: 198, col: 17 });
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
                        this.forEachUpdateFunction(elmtId, this.posts, forEachItemGenFunction, (post: DiaryPost) => post.id.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    Scroll.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 侧边栏
            if (this.showSidebar) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width(180);
                        Column.height('calc(100% - 60px)');
                        Column.position({ x: 0, y: 60 });
                        Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Column.borderRadius({ "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Column.zIndex(100);
                        Column.shadow({ radius: 16, color: '#20000000', offsetX: 4, offsetY: 0 });
                        Column.transition(TransitionEffect.translate({ x: '-100%' })
                            .animation({ duration: 250, curve: Curve.EaseOut }));
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 合集列表
                        Scroll.create();
                        // 合集列表
                        Scroll.scrollBar(BarState.Off);
                        // 合集列表
                        Scroll.align(Alignment.TopStart);
                        // 合集列表
                        Scroll.margin({ top: 12, left: 4, right: 4 });
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 4 });
                        Column.width('100%');
                        Column.padding({ left: 12, right: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const collection = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.height(44);
                                Row.padding({ left: 16, right: 16 });
                                Row.backgroundColor(this.selectedCollection === collection ?
                                    '#10FF6B35' : Color.Transparent);
                                Row.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                Row.onClick(() => {
                                    this.onCollectionSelected(collection);
                                    Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                                        this.showSidebar = false;
                                    });
                                });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(collection);
                                Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                Text.fontColor(this.selectedCollection === collection ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Blank.create();
                            }, Blank);
                            Blank.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (this.selectedCollection === collection) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('●');
                                            Text.fontSize(8);
                                            Text.fontColor({ "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                        }, Text);
                                        Text.pop();
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.collections, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    // 合集列表
                    Scroll.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Divider.create();
                        Divider.color({ "id": 16777298, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Divider.margin({ left: 16, right: 16, top: 8, bottom: 8 });
                    }, Divider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 添加列表按钮
                        Row.create();
                        // 添加列表按钮
                        Row.width('100%');
                        // 添加列表按钮
                        Row.height(44);
                        // 添加列表按钮
                        Row.padding({ left: 16, right: 16 });
                        // 添加列表按钮
                        Row.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        // 添加列表按钮
                        Row.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        // 添加列表按钮
                        Row.margin({ left: 12, right: 12, bottom: 16 });
                        // 添加列表按钮
                        Row.onClick(() => {
                            this.showSidebar = false;
                            this.newCollectionName = '';
                            Context.animateTo({ duration: 200, curve: Curve.EaseOut }, () => {
                                this.showNewCollectionDialog = true;
                            });
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('＋ 添加列表');
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    // 添加列表按钮
                    Row.pop();
                    Column.pop();
                });
            }
            // 新建合集弹窗
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 新建合集弹窗
            if (this.showNewCollectionDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#80000000');
                        Column.justifyContent(FlexAlign.End);
                        Column.onClick(() => {
                            Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                                this.showNewCollectionDialog = false;
                            });
                        });
                        Column.transition(TransitionEffect.translate({ y: '100%' })
                            .animation({ duration: 250, curve: Curve.EaseOut }));
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(20);
                        Column.backgroundColor({ "id": 16777297, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Column.borderRadius({ topLeft: { "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }, topRight: { "id": 16777313, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 标题栏
                        Row.create();
                        // 标题栏
                        Row.width('100%');
                        // 标题栏
                        Row.margin({ bottom: 20 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(32);
                        Button.height(32);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            Context.animateTo({ duration: 200, curve: Curve.EaseIn }, () => {
                                this.showNewCollectionDialog = false;
                            });
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125832663, "type": 40000, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        SymbolGlyph.fontSize(18);
                        SymbolGlyph.fontColor([{ "id": 16777306, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" }]);
                    }, SymbolGlyph);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('新建合集');
                        Text.fontSize({ "id": 16777315, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor({ "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('创建');
                        Text.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor(this.newCollectionName.trim().length > 0 && this.newCollectionName.trim().length <= 10
                            ? { "id": 16777300, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" } : { "id": 16777304, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.onClick(() => this.createNewCollection());
                    }, Text);
                    Text.pop();
                    // 标题栏
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 合集名称输入框
                        TextInput.create({
                            placeholder: '请输入合集名称（不多于 10 字）',
                            text: this.newCollectionName
                        });
                        // 合集名称输入框
                        TextInput.width('100%');
                        // 合集名称输入框
                        TextInput.height(48);
                        // 合集名称输入框
                        TextInput.fontSize({ "id": 16777314, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        // 合集名称输入框
                        TextInput.backgroundColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        // 合集名称输入框
                        TextInput.borderRadius({ "id": 16777311, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        // 合集名称输入框
                        TextInput.padding({ left: 12, right: 12 });
                        // 合集名称输入框
                        TextInput.border({
                            width: this.newCollectionName.length > 10 ? 1 : 0,
                            color: this.newCollectionName.length > 10 ? '#FF4D4F' : Color.Transparent
                        });
                        // 合集名称输入框
                        TextInput.fontColor(this.newCollectionName.length > 10 ? '#FF4D4F' : { "id": 16777305, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        // 合集名称输入框
                        TextInput.onChange((value: string) => { this.newCollectionName = value; });
                        // 合集名称输入框
                        TextInput.onSubmit(() => { this.createNewCollection(); });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 字数提示
                        if (this.newCollectionName.length > 10) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('合集名称不能超过10个字');
                                    Text.fontSize({ "id": 16777317, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor('#FF4D4F');
                                    Text.width('100%');
                                    Text.margin({ top: 6 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
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
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "CategoryPage";
    }
}
export default CategoryPage;
registerNamedRoute(() => new CategoryPage(undefined, {}), "", { bundleName: "com.example.lifetracker", moduleName: "entry", pagePath: "pages/CategoryPage", pageFullPath: "entry/src/main/ets/pages/CategoryPage", integratedHsp: "false", moduleType: "followWithHap" });
