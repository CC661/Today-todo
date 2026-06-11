if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PostCardComponent_Params {
    post?: DiaryPost;
}
import type { DiaryPost } from '../../model/DiaryPost';
import DateUtils from "@normalized:N&&&entry/src/main/ets/common/utils/DateUtils&";
export default class PostCardComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__post = new SynchedPropertyObjectOneWayPU(params.post, this, "post");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PostCardComponent_Params) {
    }
    updateStateVars(params: PostCardComponent_Params) {
        this.__post.reset(params.post);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__post.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__post.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __post: SynchedPropertySimpleOneWayPU<DiaryPost>;
    get post() {
        return this.__post.get();
    }
    set post(newValue: DiaryPost) {
        this.__post.set(newValue);
    }
    private extractField(json: string, fieldName: string): string {
        try {
            const match = json.match(new RegExp(`"${fieldName}"\\s*:\\s*"([^"]*)"`, 'i'));
            return match ? match[1] : '';
        }
        catch {
            return '';
        }
    }
    TemplateDataBlock(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.post.templateData) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.post.templateData.includes('"type":"accounting"') ||
                            this.post.templateData.includes('"type": "accounting"')) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create({ space: 6 });
                                    Column.width('100%');
                                    Column.padding(10);
                                    Column.backgroundColor({ "id": 16777311, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Column.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Column.margin({ top: 6, bottom: 6 });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('日期：');
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(60);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.extractField(this.post.templateData, 'date'));
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                }, Text);
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.extractField(this.post.templateData, 'location')) {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create();
                                                Row.width('100%');
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create('地点：');
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.width(60);
                                            }, Text);
                                            Text.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(this.extractField(this.post.templateData, 'location'));
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                            }, Text);
                                            Text.pop();
                                            Row.pop();
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('金额：');
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(60);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`￥${this.extractField(this.post.templateData, 'amount')}`);
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontWeight(FontWeight.Medium);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('物品：');
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(60);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.extractField(this.post.templateData, 'item'));
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                }, Text);
                                Text.pop();
                                Row.pop();
                                Column.pop();
                            });
                        }
                        else if (this.post.templateData.includes('"type":"dining"') ||
                            this.post.templateData.includes('"type": "dining"')) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create({ space: 6 });
                                    Column.width('100%');
                                    Column.padding(10);
                                    Column.backgroundColor({ "id": 16777311, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Column.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Column.margin({ top: 6, bottom: 6 });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('日期：');
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(60);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.extractField(this.post.templateData, 'date'));
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                }, Text);
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.extractField(this.post.templateData, 'location')) {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create();
                                                Row.width('100%');
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create('地点：');
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.width(60);
                                            }, Text);
                                            Text.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(this.extractField(this.post.templateData, 'location'));
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                            }, Text);
                                            Text.pop();
                                            Row.pop();
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.extractField(this.post.templateData, 'amount')) {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create();
                                                Row.width('100%');
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create('金额：');
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.width(60);
                                            }, Text);
                                            Text.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(`￥${this.extractField(this.post.templateData, 'amount')}`);
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontWeight(FontWeight.Medium);
                                            }, Text);
                                            Text.pop();
                                            Row.pop();
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('菜品：');
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(60);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.extractField(this.post.templateData, 'dish'));
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                }, Text);
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.extractField(this.post.templateData, 'rating')) {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create();
                                                Row.width('100%');
                                                Row.alignItems(VerticalAlign.Top);
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create('评价：');
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.width(60);
                                            }, Text);
                                            Text.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(this.extractField(this.post.templateData, 'rating'));
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.layoutWeight(1);
                                            }, Text);
                                            Text.pop();
                                            Row.pop();
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                                Column.pop();
                            });
                        }
                        else if (this.post.templateData.includes('"type":"movie"') ||
                            this.post.templateData.includes('"type": "movie"')) {
                            this.ifElseBranchUpdateFunction(2, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create({ space: 6 });
                                    Column.width('100%');
                                    Column.padding(10);
                                    Column.backgroundColor({ "id": 16777311, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Column.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Column.margin({ top: 6, bottom: 6 });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('影片：');
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.width(60);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.extractField(this.post.templateData, 'title'));
                                    Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    Text.fontWeight(FontWeight.Medium);
                                }, Text);
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.extractField(this.post.templateData, 'genre')) {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create();
                                                Row.width('100%');
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create('类型：');
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.width(60);
                                            }, Text);
                                            Text.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(this.extractField(this.post.templateData, 'genre'));
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                            }, Text);
                                            Text.pop();
                                            Row.pop();
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.extractField(this.post.templateData, 'score')) {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create();
                                                Row.width('100%');
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create('评分：');
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.width(60);
                                            }, Text);
                                            Text.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(this.extractField(this.post.templateData, 'score'));
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777317, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontWeight(FontWeight.Medium);
                                            }, Text);
                                            Text.pop();
                                            Row.pop();
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    if (this.extractField(this.post.templateData, 'experience')) {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create();
                                                Row.width('100%');
                                                Row.alignItems(VerticalAlign.Top);
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create('体验：');
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.width(60);
                                            }, Text);
                                            Text.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(this.extractField(this.post.templateData, 'experience'));
                                                Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                                Text.layoutWeight(1);
                                            }, Text);
                                            Text.pop();
                                            Row.pop();
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                                Column.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(3, () => {
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor({ "id": 16777314, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.borderRadius({ "id": 16777327, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Column.margin({ bottom: 12 });
            Column.shadow({
                radius: 4,
                color: '#08000000',
                offsetX: 0,
                offsetY: 2
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 头部:时间和位置
            Row.create();
            // 头部:时间和位置
            Row.width('100%');
            // 头部:时间和位置
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(DateUtils.formatTime(this.post.timestamp));
            Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
            Text.fontColor({ "id": 16777323, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.post.location) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`📍 ${this.post.location}`);
                        Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.margin({ left: 12 });
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.post.weather) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.post.weather);
                        Text.fontSize({ "id": 16777334, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777321, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
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
        // 头部:时间和位置
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 文字内容
            if (this.post.content) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.post.content);
                        Text.fontSize({ "id": 16777331, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontColor({ "id": 16777322, "type": 10001, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Medium);
                        Text.lineHeight(24);
                        Text.width('100%');
                        Text.margin({ bottom: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            // 模板字段
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 模板字段
        this.TemplateDataBlock.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 媒体网格(最多9张)
            if (this.post.mediaUrls.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Grid.create();
                        Grid.columnsTemplate(this.post.mediaUrls.length === 1 ? '1fr' :
                            this.post.mediaUrls.length <= 4 ? '1fr 1fr' : '1fr 1fr 1fr');
                        Grid.rowsTemplate(this.post.mediaUrls.length <= 2 ? '1fr' :
                            this.post.mediaUrls.length <= 4 ? '1fr 1fr' : '1fr 1fr 1fr');
                        Grid.columnsGap(4);
                        Grid.rowsGap(4);
                        Grid.width('100%');
                        Grid.height(this.post.mediaUrls.length === 1 ? 200 :
                            this.post.mediaUrls.length <= 4 ? 300 : 400);
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const url = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Image.create(url);
                                        Image.width('100%');
                                        Image.height('100%');
                                        Image.objectFit(ImageFit.Cover);
                                        Image.borderRadius({ "id": 16777328, "type": 10002, params: [], "bundleName": "com.example.lifetracker", "moduleName": "entry" });
                                    }, Image);
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.post.mediaUrls.slice(0, 9), forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Grid.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
