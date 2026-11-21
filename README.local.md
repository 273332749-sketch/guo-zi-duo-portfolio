# 本地运行与验证

这是 Andrew Woan 原仓库的本地复现。上游提交：`8f66120fa633dfb08abded0c9e71e8982a351cfe`。

实际技术栈为 React 19、Vite 6、React Three Fiber 和 Three.js 0.182.0（WebGPU renderer，支持 WebGL 2 后备路径），不是 Next.js。

## 运行

在本目录中执行：

```powershell
npm ci
npm run dev -- --port 5173 --strictPort
```

打开 `http://localhost:5173/`，无需 hash。

```powershell
node scripts/verify-assets.mjs ../upstream-source
npm run build
npm run preview -- --port 4173 --strictPort
```

`dist/` 是可部署的静态产物，无需后台服务。默认使用站点根路径；GitHub Pages 工作流通过 `VITE_BASE_PATH=/guo-zi-duo-portfolio/` 构建仓库子路径版本。GLB、KTX2、解码器、图标和字体均遵从构建基础路径。

## 操作

- 滚轮、触摸上下滑动：沿原作者的相机曲线旅行。
- 按住鼠标左键上下拖动：旅行。
- Tab 聚焦作品集；方向键微调，Page Up / Page Down 跨段推进，Home 返回起点。
- 鼠标移到原场景的纸张、宝箱等物体上：保留原版悬停反应。

自动遵从系统的 `prefers-reduced-motion`。也可用 `/?motion=reduce` 检查同一场景的静止模式；交互仍可切换场景，闲置后停止持续渲染。无自动声音。

## 与原仓库的差异

- 补上原代码遗漏的 mousedown 监听，修正拖拽处理中的未定义变量。
- 增加语义 main、可聚焦的键盘导航、加载进度语义与资源/图形初始化失败提示。
- 减少动态模式冻结原有动画时钟，并在交互取景收敛后停止绘制；页面不可见时暂停帧更新。
- 重置旅程时使用独立曲线实例，避免上一轮位移残留。
- 允许浏览器页面缩放。

原有模型、压缩纹理、字体、解码器和相机曲线数据均保留。`public/` 中 66 个文件与上游 SHA-256 一致；仅修正 `site.webmanifest` 的名称与图标相对路径。依赖沿用原锁文件，没有新增运行依赖。

## 保真范围

遵从需求中“准确源仓库优先”的顺序：保留原站的窄屏相机裁切和手写模型纹理。390×844 下，原站与本地都会裁掉部分标题和熊猫；未声称完成手机取景改良。纸张上原有手写内容属于原模型纹理，未重新绘制为可编辑 DOM 文本；已添加可访问的标题、首屏文案和操作说明。因此不能把本项目描述为“全部画面文字均已改成 DOM”。

`qa/` 仅为本地对照证据，不进入 `dist/`。参考素材不用于运行界面、加载页或后备页。完整 URL 清单见 `REFERENCE.md`；验证记录见 `design-qa.md`。

保留原作者 README、LICENSE.md 及其引用资产的署名和适用条件。
