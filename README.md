# LifeTracker - 鸿蒙原生生活记录 App

<div align="center">

![Platform](https://img.shields.io/badge/Platform-HarmonyOS%20Next-blue)
![Language](https://img.shields.io/badge/Language-ArkTS-orange)
![Version](https://img.shields.io/badge/Version-1.0.0-green)

**白天高效规划 · 随时碎片留痕 · 晚上仪式复盘**

</div>

---

## 📱 产品简介

LifeTracker 是一款融合了"极简今日待办(To-Do)"与"轻量化生活手账(Plog)"的鸿蒙原生生活记录 App。拒绝精确到分秒的焦虑感,追求一目了然的宏观掌控与精致的生活仪式感。

### ✨ 核心特性

- **📅 智能日程规划** - 今日聚焦视图 + 可展开周/月历,昨日任务自动结转
- **📝 朋友圈式日记** - 随时随地发布图文动态,时间线记录生活点滴
- **🏷️ 模板化分类** - 阅读记录、记账收支、今日穿搭等场景化模板
- **🎨 Plog手账创作** - 自由排版画布,一键生成精美手账,导出长图分享
- **🔲 桌面元服务** - 2x4待办卡片直接勾选,2x2快捷记录一键直达
- **🔄 分布式协同** - 手机随手记,平板做手账,跨设备无缝体验

---

## 🏗️ 技术架构

### 技术栈

- **开发语言**: ArkTS (HarmonyOS Next 6.1.0)
- **UI框架**: ArkUI 声明式开发范式
- **SDK版本**: API Version 23 (6.1.0)
- **构建工具**: Hvigor 6.1.0
- **包管理器**: ohpm 6.1.0
- **数据存储**:
  - RDB (关系型数据库) - 持久化存储待办、动态、手账数据
  - Preferences (轻量键值存储) - 应用配置和用户偏好
- **系统能力**:
  - FormKit - 桌面万能卡片
  - CameraKit - 拍照/录像
  - LocationKit - 位置获取
  - MediaLibraryKit - 媒体库访问
  - DistributedDataObject - 分布式数据同步

### 项目结构

```
LifeTracker/
├── AppScope/                    # 应用全局配置
│   ├── app.json5               # 应用级配置(包名、版本等)
│   └── resources/              # 应用级资源(图标、字符串)
│
├── entry/                       # 主模块
│   ├── src/main/
│   │   ├── ets/
│   │   │   ├── entryability/   # Ability入口
│   │   │   │   └── EntryAbility.ets
│   │   │   ├── pages/          # 页面层(5个主页面)
│   │   │   │   ├── HomePage.ets           # 首页(日程+日历)
│   │   │   │   ├── DiaryPage.ets          # 日记动态页
│   │   │   │   ├── CategoryPage.ets       # 分类档案袋页
│   │   │   │   ├── PlogEditorPage.ets     # 手账编辑页
│   │   │   │   └── PlogGalleryPage.ets    # 手账本画廊页
│   │   │   ├── components/     # 可复用组件层
│   │   │   │   ├── calendar/   # 日历组件
│   │   │   │   ├── todo/       # 待办组件
│   │   │   │   ├── diary/      # 日记组件
│   │   │   │   ├── template/   # 模板组件
│   │   │   │   └── plog/       # 手账组件
│   │   │   ├── viewmodel/      # 数据模型层(ViewModel)
│   │   │   │   ├── TodoViewModel.ets
│   │   │   │   ├── DiaryViewModel.ets
│   │   │   │   ├── CategoryViewModel.ets
│   │   │   │   └── PlogViewModel.ets
│   │   │   ├── model/          # 数据结构定义(TypeScript接口)
│   │   │   │   ├── TodoItem.ts
│   │   │   │   ├── DiaryPost.ts
│   │   │   │   ├── TemplateData.ts
│   │   │   │   └── PlogCanvas.ts
│   │   │   ├── common/         # 公共工具层
│   │   │   │   ├── database/   # 数据库工具
│   │   │   │   │   ├── RDBStoreUtil.ets
│   │   │   │   │   └── PreferencesUtil.ets
│   │   │   │   ├── utils/      # 工具类
│   │   │   │   │   └── DateUtils.ets
│   │   │   │   └── constants/  # 常量定义
│   │   │   │       └── AppConstants.ets
│   │   │   └── formability/    # 元服务能力
│   │   │       ├── TodoFormAbility.ets
│   │   │       └── QuickPostFormAbility.ets
│   │   ├── resources/          # 模块级资源
│   │   │   ├── base/           # 默认资源
│   │   │   │   ├── element/    # 字符串、颜色、尺寸
│   │   │   │   ├── media/      # 图片资源
│   │   │   │   └── profile/    # 配置文件
│   │   │   └── dark/           # 深色主题资源
│   │   └── module.json5        # 模块配置(权限、Ability等)
│   ├── build-profile.json5     # 模块构建配置
│   └── oh-package.json5        # 模块依赖配置
│
├── build-profile.json5         # 项目级构建配置
├── hvigorfile.ts               # 构建脚本
├── oh-package.json5            # 项目级依赖配置
└── README.md                   # 项目说明文档
```

---

## 🚀 快速开始

### 环境要求

- **DevEco Studio**: 6.1.0 或更高版本
- **HarmonyOS SDK**: API Version 23 (6.1.0)
- **Node.js**: 18.x 或更高版本

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd LifeTracker
   ```

2. **打开项目**
   - 启动 DevEco Studio
   - 选择 `File` -> `Open`
   - 选择 `LifeTracker` 文件夹

3. **配置签名**
   - 首次打开会自动提示配置签名
   - 按照向导完成自动签名配置
   - 或使用华为开发者账号配置手动签名

4. **同步依赖**
   ```bash
   # DevEco Studio 会自动同步
   # 如需手动同步,在终端执行:
   ohpm install
   ```

5. **运行项目**
   - 连接 HarmonyOS 真机或启动模拟器
   - 点击运行按钮或按 `Shift+F10`
   - 选择目标设备

### 构建发布版

```bash
# 在 DevEco Studio 中:
# Build -> Build Hap(s)/APP(s) -> Build APP(s)

# 或使用命令行:
hvigorw assembleApp --mode release
```

---

## 📖 功能详解

### 1. 日程记录与规划 (HomePage)

#### 核心功能
- **今日聚焦视图**: 清爽列表展示当日任务,左侧圆圈打钩框
- **状态管理**: 进行中(橙色)、已完成(灰色删除线)、昨日结转(黄色标记)
- **拖拽排序**: 长按任务可上下拖动调整顺序
- **智能结转**: 昨晚未完成任务第二天自动出现在今日列表顶部

#### 日历交互
- **周历卡片**: 顶部单行显示当前周7天,点击切换日期
- **左右滑动**: 切换上一周/下一周
- **月历展开**: 点击下拉箭头或下滑手势展开完整月历
- **事件标记**: 月历格子用彩色圆点标记有任务的日期

#### 使用示例
```typescript
// 添加新任务
await TodoViewModel.addTodo("完成项目文档", "2026-05-28");

// 切换任务状态
await TodoViewModel.toggleTodoStatus(taskId, "completed");

// 获取今日任务
const todos = await TodoViewModel.getTodosByDate(DateUtils.getToday());
```

---

### 2. 朋友圈式日记 (DiaryPage)

#### 核心功能
- **快捷发布**: 右下角悬浮"+"按钮一键发布
- **多媒体支持**: 文字、多图(九宫格)、视频、位置、天气
- **时间线展示**: 按发布时间倒序排列,类似朋友圈
- **实时预览**: 发布前可预览图片和文字效果

#### 使用示例
```typescript
// 发布动态
const post: Omit<DiaryPost, 'id'> = {
  content: "今天的阳光真好 ☀️",
  mediaUrls: ["/path/to/photo1.jpg", "/path/to/photo2.jpg"],
  location: "北京市朝阳区",
  weather: "晴 25°C",
  timestamp: Date.now(),
  date: DateUtils.getToday()
};
await DiaryViewModel.createPost(post);

// 获取所有动态
const posts = await DiaryViewModel.getAllPosts();
```

---

### 3. 模板化分类 (CategoryPage)

#### 内置模板

**📚 阅读记录**
- 书名、作者
- 精选句子摘录
- 阅读心得感想

**💰 记账收支**
- 金额输入
- 收支类型(收入/支出)
- 分类标签(餐饮/购物/娱乐/交通等)
- 备注说明

**👗 今日穿搭 (OOTD)**
- 风格标签(休闲/正式/运动等)
- 单品品牌记录
- 全身搭配照片

#### 分类聚合
- 点击分类卡片查看该类型所有历史记录
- 跨越日期限制,形成专题集合
- 例如:"阅读"分类自动生成电子读书笔记

#### 使用示例
```typescript
// 获取阅读记录
const readingPosts = await CategoryViewModel.getReadingPosts();

// 获取记账记录
const expensePosts = await CategoryViewModel.getExpensePosts();

// 获取分类统计
const stats = await CategoryViewModel.getCategoryStats();
console.log(`阅读: ${stats.get('reading')}条`);
```

---

### 4. Plog手账创作 (PlogEditorPage)

#### 核心功能

**一键做手账**
- 自动提取当天发布的动态照片
- 提取已完成的待办清单
- 智能布局到画布上

**自由排版画布**
- 拖拽元素调整位置
- 双指缩放调整大小
- 旋转元素改变角度
- 图层管理(z-index)

**素材工具包**
- 多种手账背景模板
- 复古/可爱贴纸库
- 艺术字体和文本框
- 胶带胶水特效

**快捷拼图模板**
- 杂志风模板一键套用
- 网格布局自动对齐
- 拍立得相框效果

**导出与保存**
- 导出为精美长图(PNG/JPG)
- 保存到电子手账本
- 分享到社交平台

#### 使用示例
```typescript
// 一键生成手账素材
const materials = await PlogViewModel.generatePlogMaterials("2026-05-28");
console.log(`提取到${materials.posts.length}张照片, ${materials.todos.length}个任务`);

// 添加画布元素
const element: CanvasElement = {
  type: 'image',
  x: 100,
  y: 200,
  width: 150,
  height: 150,
  rotation: 15,
  content: "/path/to/photo.jpg",
  zIndex: 1
};
plog.elements.push(element);

// 保存手账
await PlogViewModel.createPlog(plog);
```

---

### 5. 桌面元服务 (FormAbility)

#### 2x4 待办卡片
- 显示今日未完成任务列表
- 直接在桌面上勾选完成
- 实时更新任务状态
- 最多显示5条任务

#### 2x2 快捷记录卡片
- 一键直达"记账"功能
- 一键发布动态
- 一键记录OOTD
- 缩短操作链路

#### 配置方法
1. 长按桌面空白处
2. 选择"服务卡片"
3. 找到"生活记录"应用
4. 选择卡片样式添加到桌面

---

## 💾 数据存储

### 数据库表结构

#### todos (待办事项表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键,自增 |
| content | TEXT | 任务内容 |
| date | TEXT | 日期 (YYYY-MM-DD) |
| status | TEXT | 状态 (pending/completed) |
| order_num | INTEGER | 排序序号 |
| created_at | INTEGER | 创建时间戳 |
| is_carry_over | INTEGER | 是否昨日结转 (0/1) |

#### diary_posts (动态表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键,自增 |
| content | TEXT | 文字内容 |
| media_urls | TEXT | 媒体文件路径(JSON数组) |
| location | TEXT | 位置信息 |
| weather | TEXT | 天气信息 |
| timestamp | INTEGER | 发布时间戳 |
| date | TEXT | 日期 (YYYY-MM-DD) |
| category | TEXT | 分类标签 |
| template_data | TEXT | 模板专属数据(JSON) |

#### plog_canvases (手账表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键,自增 |
| date | TEXT | 日期 (YYYY-MM-DD) |
| background_image | TEXT | 背景图片路径 |
| elements | TEXT | 画布元素数组(JSON) |
| created_at | INTEGER | 创建时间戳 |
| thumbnail | TEXT | 缩略图路径 |

---

## 🔐 权限说明

应用需要以下权限:

| 权限 | 用途 | 使用时机 |
|------|------|----------|
| `ohos.permission.READ_MEDIA` | 读取相册图片发布动态 | 选择图片时 |
| `ohos.permission.WRITE_MEDIA` | 保存手账和导出的图片 | 导出图片时 |
| `ohos.permission.CAMERA` | 拍摄照片记录生活 | 拍照时 |
| `ohos.permission.LOCATION` | 记录动态发布时的位置 | 获取位置时 |
| `ohos.permission.INTERNET` | 获取天气信息 | 加载天气时 |

所有权限仅在用户使用相关功能时申请,遵循最小权限原则。

---

## 🎨 设计规范

### 色彩系统

**主色调**
- 活力橙: `#FF6B35` - 主要操作按钮、进行中标签
- 深邃蓝: `#004E89` - 次要强调色、选中状态

**中性色**
- 背景色: `#F8F9FA` (浅色) / `#121212` (深色)
- 卡片背景: `#FFFFFF` (浅色) / `#1E1E1E` (深色)
- 主文本: `#1A1A1A` (浅色) / `#FFFFFF` (深色)
- 次文本: `#666666` (浅色) / `#B0B0B0` (深色)

**功能色**
- 成功: `#52C41A`
- 警告: `#FAAD14`
- 错误: `#FF4D4F`

### 字体规范

- 超小: `10fp` - 辅助信息
- 小: `12fp` - 次要文本
- 基础: `14fp` - 正文内容
- 中: `16fp` - 重要文本
- 大: `18fp` - 小标题
- 超大: `20fp` - 标题
- 特大: `24fp` - 页面标题

### 间距规范

- XS: `4vp`
- SM: `8vp`
- MD: `12vp`
- LG: `16vp`
- XL: `24vp`

### 圆角规范

- SM: `4vp` - 小按钮
- MD: `8vp` - 卡片
- LG: `12vp` - 大容器
- XL: `16vp` - 对话框

---

## 🧪 测试指南

### 功能测试清单

**日程模块**
- [ ] 添加新任务
- [ ] 切换任务完成状态
- [ ] 删除任务
- [ ] 切换日期查看不同天的任务
- [ ] 周历左右滑动切换
- [ ] 月历展开/收起
- [ ] 昨日任务自动结转

**日记模块**
- [ ] 发布纯文字动态
- [ ] 发布带图片动态
- [ ] 查看时间线列表
- [ ] 图片九宫格展示

**分类模块**
- [ ] 切换不同分类查看
- [ ] 分类统计数量正确
- [ ] 空分类显示提示

**Plog模块**
- [ ] 一键生成手账素材
- [ ] 添加贴纸元素
- [ ] 拖拽调整元素位置
- [ ] 保存手账
- [ ] 查看手账本画廊

**元服务**
- [ ] 添加桌面卡片
- [ ] 卡片显示任务列表
- [ ] 卡片点击跳转应用

### 性能测试指标

- 启动时间: < 2秒
- 列表滚动帧率: > 50fps
- 内存占用: < 200MB
- 数据库查询响应: < 100ms

---

## 🛠️ 开发指南

### 添加新功能

1. **创建数据模型** (`model/`)
   ```typescript
   // model/NewFeature.ts
   export interface NewFeature {
     id: number;
     // ...
   }
   ```

2. **创建ViewModel** (`viewmodel/`)
   ```typescript
   // viewmodel/NewFeatureViewModel.ets
   export class NewFeatureViewModel {
     // 业务逻辑
   }
   ```

3. **创建UI组件** (`components/`)
   ```typescript
   // components/newfeature/NewFeatureComponent.ets
   @Component
   export default struct NewFeatureComponent {
     // UI实现
   }
   ```

4. **创建页面** (`pages/`)
   ```typescript
   // pages/NewFeaturePage.ets
   @Entry
   @Component
   struct NewFeaturePage {
     // 页面实现
   }
   ```

5. **注册路由** (`resources/base/profile/main_pages.json`)
   ```json
   {
     "src": [
       "pages/NewFeaturePage"
     ]
   }
   ```

### 代码规范

- 使用 ArkTS 严格模式
- 组件命名采用 PascalCase
- 文件命名采用 PascalCase
- 变量命名采用 camelCase
- 常量命名采用 UPPER_SNAKE_CASE
- 所有异步操作必须处理错误

---

## 📱 兼容性

### 支持设备

- ✅ 华为手机 (HarmonyOS 4.0+)
- ✅ 华为平板 (HarmonyOS 4.0+)
- ✅ 其他 HarmonyOS Next 设备

### 屏幕适配

- 手机: 360dp - 480dp 宽度
- 平板: 600dp - 840dp 宽度
- 自动适配不同屏幕密度

### 主题支持

- ✅ 浅色模式
- ✅ 深色模式 (跟随系统)

---

## 🔮 未来规划

### 短期 (v1.x)

- [ ] 完善模板表单填写功能
- [ ] 实现图片裁剪和滤镜
- [ ] 添加更多手账贴纸素材
- [ ] 优化拖拽排序体验
- [ ] 增加数据统计图表

### 中期 (v2.x)

- [ ] 云同步 (华为云空间)
- [ ] AI 智能分类 (OCR识别、图像分析)
- [ ] 社交分享 (微信、微博)
- [ ] 月度/年度回顾报表
- [ ] 主题自定义

### 长期 (v3.x)

- [ ] 多语言支持
- [ ] 小组件市场
- [ ] 第三方模板插件
- [ ] 协作手账 (多人编辑)
- [ ] AR 手账体验

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request!

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 Apache-2.0 许可证。详见 [LICENSE](LICENSE) 文件。

---

## 👥 团队

- **产品经理**: [Your Name]
- **UI设计师**: [Designer Name]
- **开发工程师**: [Developer Name]

---

## 📞 联系我们

- 📧 Email: support@lifetracker.com
- 💬 微信公众号: LifeTracker官方
- 🌐 官网: https://lifetracker.example.com

---

## 🙏 致谢

感谢以下开源项目和工具:

- HarmonyOS Next 开发平台
- DevEco Studio IDE
- ArkTS 编程语言
- ArkUI 框架

---

<div align="center">

**Made with ❤️ by LifeTracker Team**

⭐ 如果这个项目对你有帮助,请给我们一个 Star!

</div>
