# 🚀 LifeTracker 快速启动指南 (DevEco Studio 6.1.0)

## ⚡ 3步快速启动

### 第1步: 打开项目

```
1. 启动 DevEco Studio 6.1.0
2. File → Open
3. 选择文件夹: E:\LifeTracker
4. 点击 OK
```

**DevEco Studio 会自动:**
- ✅ 读取配置文件
- ✅ 下载依赖包 (@ohos/hvigor@6.1.0)
- ✅ 同步项目
- ✅ 索引代码

**等待底部显示:** `✓ Sync Successful`

---

### 第2步: 配置签名

首次打开会弹出签名配置向导:

```
1. 选择 "Automatically generate signature" (自动生成签名)
2. 点击 Next
3. 点击 Finish
```

**完成!** 调试证书已自动创建。

---

### 第3步: 运行应用

**连接设备:**
- 方式A: USB连接真机(需开启开发者模式+USB调试)
- 方式B: 启动模拟器 (Tools → Device Manager)

**运行:**
```
1. 顶部工具栏选择目标设备
2. 点击绿色运行按钮 (▶️)
3. 或按快捷键: Shift + F10
```

**等待编译安装**,应用会自动启动! 🎉

---

## ✅ 验证成功

看到以下现象说明配置成功:

1. **Build窗口**: 显示 `BUILD SUCCESSFUL in xxx ms`
2. **设备安装**: 应用图标出现在设备上
3. **首页显示**: 看到"生活记录"首页,有日历和待办列表

---

## 🔧 如遇问题

### 问题: 依赖下载失败

**解决:**
```powershell
# 清理缓存
cd E:\LifeTracker
Remove-Item -Recurse -Force .hvigor, node_modules, oh_modules -ErrorAction SilentlyContinue

# 在 DevEco Studio 中:
File → Invalidate Caches / Restart → Invalidate and Restart
```

---

### 问题: SDK版本不匹配

**解决:**
1. File → Settings → HarmonyOS SDK
2. 勾选 **API Version 23 (6.1.0)**
3. 点击 Apply 下载
4. 重新同步项目

---

### 问题: 找不到模块错误

**解决:**
1. 确认 SDK 已安装 (API 23)
2. File → Invalidate Caches / Restart
3. 重新打开项目

---

## 📱 测试功能

应用启动后,快速测试:

### 1. 日程模块 (首页)
- [ ] 点击"+"添加任务
- [ ] 点击圆圈完成任务
- [ ] 点击日期切换
- [ ] 下滑展开月历

### 2. 日记模块
- [ ] 切换到"日记"标签
- [ ] 点击右下角"+"发布动态
- [ ] 输入文字并发布

### 3. 分类模块
- [ ] 切换到"分类"标签
- [ ] 点击不同分类卡片

### 4. Plog模块
- [ ] 切换到"手账"标签
- [ ] 点击"一键做手账"

---

## 📚 更多文档

- **完整说明**: 查看 `README.md`
- **配置详解**: 查看 `CONFIG_GUIDE_6.1.0.md`
- **项目总结**: 查看 `PROJECT_SUMMARY.md`

---

## 💡 提示

- **首次编译**: 可能需要 2-5 分钟
- **后续编译**: 通常只需几秒
- **热重载**: 修改代码后自动刷新(开发模式)

---

**祝您使用愉快!** 🎊

如有问题,请查看详细文档或联系技术支持。
