# HarmonyOS Next 6.1.0 配置指南

## ✅ 已完成的升级

项目配置文件已全部升级到 **HarmonyOS Next 6.1.0 (API 23)**:

### 更新的文件

1. ✅ `oh-package.json5` - 依赖版本: `6.1.0`
2. ✅ `build-profile.json5` - SDK版本: `6.1.0(23)`,添加严格模式配置
3. ✅ `entry/build-profile.json5` - 添加混淆规则和测试目标
4. ✅ `module.json5` - 权限和Ability配置符合6.1.0规范

---

## 🔧 DevEco Studio 6.1.0 配置步骤

### 步骤1: 检查 DevEco Studio 版本

确保您使用的是 **DevEco Studio 6.1 Release** 或更高版本:

1. 打开 DevEco Studio
2. Help → About
3. 确认版本号 ≥ 6.1.0

如果版本过低,请从官网下载最新版:
https://developer.harmonyos.com/cn/develop/deveco-studio

---

### 步骤2: 安装 HarmonyOS Next SDK

1. 打开 DevEco Studio
2. File → Settings → Appearance & Behavior → System Settings → HarmonyOS SDK
3. 勾选 **API Version 23 (6.1.0)**
4. 点击 Apply 开始下载
5. 等待下载完成

**需要下载的组件:**
- ✅ HarmonyOS SDK (API 23)
- ✅ Node.js (内置)
- ✅ ohpm (内置包管理器)
- ✅ Hvigor (构建工具)

---

### 步骤3: 打开项目并自动同步

1. **File → Open**
2. 选择 `E:\LifeTracker` 文件夹
3. 点击 OK

**DevEco Studio 会自动执行:**
- 读取 `oh-package.json5`
- 调用内置 ohpm 安装依赖 (`@ohos/hvigor@6.1.0`)
- 同步项目配置
- 索引源代码

**等待底部状态栏显示:**
```
✓ Sync Successful
✓ Indexing Complete
```

---

### 步骤4: 配置签名

首次打开项目需要配置签名:

#### 方式A: 自动签名(推荐,最简单)

1. 打开项目后,会弹出签名配置向导
2. 选择 **"Automatically generate signature"**
3. 点击 Next → Finish
4. DevEco Studio 会自动创建调试证书

#### 方式B: 手动配置

1. File → Project Structure → Signing Configs
2. 勾选 **"Automatically generate signature"**
3. 或者手动填写:
   - Store File: 选择或创建 `.p12` 文件
   - Store Password: 设置密码
   - Key Alias: 设置别名
   - Key Password: 设置密码
   - Profile: 选择或创建 `.p7b` 文件

---

### 步骤5: 验证配置

检查项目是否正常:

1. **查看 Build 窗口**
   - 应该没有红色错误
   - 显示 "BUILD SUCCESSFUL"

2. **检查 External Libraries**
   - Project 面板 → External Libraries
   - 应该看到 `@ohos:hvigor:6.1.0`

3. **检查 SDK 路径**
   - File → Settings → HarmonyOS SDK
   - 确认 SDK Location 指向正确路径

---

## 🚀 运行项目

### 连接设备

**方式1: 真机调试**
1. 手机开启开发者模式和USB调试
2. 通过USB连接电脑
3. 手机上授权USB调试

**方式2: 模拟器**
1. Tools → Device Manager
2. 下载并启动 HarmonyOS Next 模拟器
3. 选择 Phone 或 Tablet 设备

### 运行应用

1. 顶部工具栏选择目标设备
2. 点击绿色运行按钮 (▶️) 或按 `Shift+F10`
3. 等待编译和安装
4. 应用自动启动

**首次编译可能需要 2-5 分钟**,后续会快很多。

---

## ⚠️ 常见问题解决

### 问题1: ohpm install 失败

**错误信息:**
```
Error: 00617101 Fetch Pkg Info Failed
package '@ohos/hvigor-ohos-plugin@6.1.0' not found
```

**解决方案:**
- ✅ **不要手动运行 ohpm**
- ✅ 直接用 DevEco Studio 打开项目,让IDE自动处理
- ✅ 确保网络连接正常(需要访问华为镜像源)

如果仍有问题:
```powershell
# 清理缓存
Remove-Item -Recurse -Force .hvigor, node_modules, oh_modules

# 在 DevEco Studio 中:
File → Invalidate Caches / Restart → Invalidate and Restart
```

---

### 问题2: SDK 版本不匹配

**错误信息:**
```
The SDK version does not match the required version
```

**解决方案:**
1. File → Settings → HarmonyOS SDK
2. 确认安装了 **API 23 (6.1.0)**
3. 如果没有,勾选并下载
4. 重新同步项目

---

### 问题3: 签名配置错误

**错误信息:**
```
Signing config is not configured
```

**解决方案:**
1. File → Project Structure → Signing Configs
2. 勾选 "Automatically generate signature"
3. 或者按照步骤4手动配置签名

---

### 问题4: 编译错误 - 找不到模块

**错误信息:**
```
Cannot find module '@kit.AbilityKit'
```

**解决方案:**
1. 确认 SDK 已正确安装
2. 检查 `build-profile.json5` 中的 `targetSdkVersion` 是否为 `6.1.0(23)`
3. File → Invalidate Caches / Restart
4. 重新打开项目

---

### 问题5: 网络问题导致依赖下载失败

**症状:**
- ohpm 下载超时
- 连接镜像源失败

**解决方案:**
1. 检查网络连接
2. 尝试切换网络(如使用手机热点)
3. 配置代理(如果需要):
   - File → Settings → Appearance & Behavior → System Settings → HTTP Proxy
   - 配置您的代理服务器

---

## 📋 配置检查清单

在运行项目前,确认以下项:

- [ ] DevEco Studio 版本 ≥ 6.1.0
- [ ] 已安装 HarmonyOS SDK API 23 (6.1.0)
- [ ] 项目已成功同步(Sync Successful)
- [ ] 签名已配置(自动生成或手动)
- [ ] 外部库已加载(@ohos/hvigor:6.1.0)
- [ ] 无编译错误(Build Successful)
- [ ] 设备已连接(真机或模拟器)

---

## 🎯 快速验证

完成配置后,快速验证是否成功:

1. **打开任意 .ets 文件**
   - 应该有语法高亮
   - 代码提示正常工作

2. **查看底部 Build 窗口**
   - 显示 "BUILD SUCCESSFUL in xxx ms"

3. **运行项目**
   - 点击运行按钮
   - 应用成功安装到设备
   - 首页正常显示

如果以上都正常,恭喜!配置完成! 🎉

---

## 📞 获取更多帮助

如果遇到问题:

1. **查看官方文档**
   - https://developer.harmonyos.com/cn/docs

2. **查看日志**
   - DevEco Studio 底部 Logcat 窗口
   - Build 窗口的详细错误信息

3. **社区支持**
   - HarmonyOS 开发者论坛
   - Stack Overflow (harmonyos 标签)

---

## ✨ 下一步

配置完成后:

1. 📱 **运行项目** - 在真机或模拟器上测试
2. 📖 **阅读 README.md** - 了解功能和使用方法
3. 🛠️ **开始开发** - 根据需求修改和扩展功能
4. 🧪 **测试功能** - 按照测试清单逐项验证

祝您开发顺利! 🚀
