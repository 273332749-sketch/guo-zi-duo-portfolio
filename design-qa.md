# 当前版本冻结与验证记录

用户于 2026-11-21 要求暂停作品集制作，以当前成品测试 GitHub 部署。本版本可运行；未宣称完成原始规格的全部视觉、DOM 文本及移动端验收。完整视觉 QA 的 final result 仍为 blocked。

## 当前已完成

- 初始浏览器阻塞已解除；已取得并运行准确上游提交 `8f66120fa633dfb08abded0c9e71e8982a351cfe`，先运行原版再适配。
- 已查看原站桌面/手机、Foxora 静帧和完整动态参考。动画为 960×610、19 帧；已查看第 0、9、18 帧。
- 保留源场景、模型、纹理、字体、解码器和相机曲线数据。66 个 public 文件与上游 SHA-256 一致，仅修正 webmanifest 名称和图标相对路径。
- 补上鼠标拖拽监听，修复未定义变量；添加键盘导航、Home 重置、语义 main、加载进度和失败提示。
- 静止模式使用真实 3D 场景；`qa/reduced-a.jpg` 与 `qa/reduced-b.jpg` 的像素差异边界为空。
- 已截图检查 960×610、1440×900、1024×768、768×1024、390×844，均无 DOM 水平溢出。键盘 Page Down 已实际进入樱花树和乘船段落。
- 锁文件安装和生产构建通过。子路径预览 `/guo-zi-duo-portfolio/` 的 67 个 public 文件、2 个应用 JS/CSS 文件均通过 HTTP 状态和内容检查。
- 源码和运行包无 Foxora 素材 URL；QA 媒体不提交、不部署。

## 当前证据与限制

源证据：`qa/source-live.jpg`（1280×720）、`qa/source-mobile-390.jpg`（390×844）；原版本地证据：`qa/original-local-960.jpg`。实现证据：`qa/local-960.jpg`、`qa/local-1440.jpg`、`qa/local-1024.jpg`、`qa/local-768.jpg`、`qa/local-mobile-390.jpg`、`qa/local-ship.jpg`。本地显式视口为 1× CSS 像素。

字体和文案仍保留原模型手写纹理，未全部改成 DOM。手机沿用原版取景，390×844 会裁掉部分熊猫和标题。未做实体手机触摸、全部悬停对象和无限循环的完整回归。未制作完整并排与局部比较板，不声明完整视觉 QA 通过。

控制台未见运行错误；热更新后曾出现 IntroScreen 的 GSAP 空引用警告，已加空引用保护，未宣称全流程无警告复测完成。颜色、图像画质和相机数据保留源实现，没有进行二次视觉设计。

发布范围：用户已明确授权将当前冻结版本发布到 `273332749-sketch/guo-zi-duo-portfolio`，用于测试托管与部署。

---

# 历史记录：首次浏览器连接阻塞（已解除）

final result: blocked

检查日期：2026-11-21（Asia/Shanghai）。尚未创建页面实现、安装依赖、启动服务或部署。

## 已确认

- 工作区初始为空，未发现现有应用或 AGENTS.md；使用独立子目录 `codrops-papercraft-portfolio`。
- 原作者仓库 https://github.com/andrewwoan/mr-pandas-psychologically-safe-portfolio 可通过网页读取，仓库页面列出了 MIT 许可、public、src、package-lock.json、package.json 和 vite.config.js。
- 参考静帧的准确 URL 在沙箱外的 HTTPS HEAD 检查中返回 HTTP 200、Content-Type: image/webp。这仅证明可下载，不等于已完成视觉检查。
- 未把参考图或动画嵌入任何运行页面。

## 阻塞原因

用户要求先查看准确的参考资产与原站，并在无法访问视觉或交互基准时停止。

- 内置浏览器创建了原站标签页，但创建和读取标签页时超时，无法取得截图或交互状态。
- Chrome 备用路径的文档所列导航和页面读取接口报错：`Cannot read properties of undefined (reading 'timeoutMs')`，未能取得原站截图。
- Browser Use 公共网页读取工具返回 `insufficient_credits`；没有添加余额或继续重试该工具。
- 网页读取工具无法读取 Foxora 静帧、动画和详情页；对原站返回无可读文本的 HTML，不能据此推断其画面或交互。

没有原站的有效渲染与交互证据，因此没有开始搭建替代场景，也没有声称复刻成功。

## QA 证据与未执行项

- source visual truth: https://showcase.foxora.studio/thumbnails/curated-codrops-papercraft-portfolio.webp
- source interaction truth: https://www.mr-pandas-psychologically-safe-portfolio.com/
- implementation screenshot path: 无，未实施。
- 要求视口：960×610、1440×900、1024×768、768×1024、390×844；全部未完成渲染测试。
- source / implementation pixel dimensions、CSS size、density normalization：未采集，未比较。
- state：源页面视觉与交互捕获被阻塞。
- full-view comparison evidence：无。
- focused region comparison evidence：无，等待浏览器恢复。
- 字体、布局、颜色、资产画质、文案：均未完成视觉校验。
- opening / midpoint / settled motion、键盘、reduced motion、控制台、资源加载、溢出：均未测试。
- comparison history：无实现与有效截图，未进行视觉修正轮次。

## 恢复工作

1. 恢复至少一种受支持的浏览器控制路径，捕获参考资产及原站桌面、手机和关键交互状态。
2. 从准确的作者仓库获取代码，检查 README、许可、锁文件、模型、着色器、相机和入口。
3. 先运行未修改的原版体验，再执行必要适配，保留根路由 `/`。
4. 完成指定视口和交互检查，并在相同视口、相同状态下比较参考和实际渲染。

## 作者与不可变参考清单

作者：Andrew Woan。源代码与资产使用须保留原仓库许可及其引用材料的适用条件；此处尚未克隆或完整审查资产许可。

Foxora 详情：https://showcase.foxora.studio/prompts/codrops-papercraft-portfolio/

原视频：https://codrops-1f606.kxcdn.com/codrops/wp-content/uploads/demovideos/107252_Hand-drawn%20Papercraft%20Portfolio.mp4?x48895

作品集目录：https://tympanus.net/codrops/hub/all/page/2/

```json
{
  "registryVersion": "7.4.0",
  "slug": "codrops-papercraft-portfolio",
  "kind": "Motion",
  "source": "https://www.mr-pandas-psychologically-safe-portfolio.com/",
  "poster": "https://showcase.foxora.studio/thumbnails/curated-codrops-papercraft-portfolio.webp",
  "motion": "https://showcase.foxora.studio/motion/codrops-papercraft-portfolio.webp",
  "originalVisual": "https://codrops-1f606.kxcdn.com/codrops/wp-content/uploads/2025/12/handpaper-400x300.jpg?x48895",
  "referenceOnly": true,
  "normalRootMayRenderReferenceMedia": false,
  "frame": {
    "width": 960,
    "height": 610,
    "aspectRatio": 1.5738
  }
}
```
