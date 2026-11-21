# Zhiming Zhang · Academic Homepage

英文首页支持切换中文、深浅色和论文图预览。直接用浏览器打开 `index.html` 即可，图片和原始 PDF 均可离线查看。

## 更新论文

在 `publications.js` 中找到 `see2work` 或 `saycan`。将 `authors` 填为按 arXiv 正式排序的姓名数组，将 `arxiv` 填为完整的摘要页链接。刷新后页面会显示作者，并将待补提示替换成可点击的 arXiv 链接。其余英文和中文内容可直接编辑 `index.html`。

两张论文图位于 `assets/`。See2Work 提供原始 PDF，SayCan+ 使用上传的 `6-panel-demo-last.png` 原文件（4897 × 2795），完整保留原始字节。点击缩略图打开大图，再点击原图链接可在浏览器中按原始像素查看。导航栏和网站图标使用 `assets/avatar.jpg` 中的史迪奇。左侧个人照片使用 `assets/portrait.jpg` 原图，通过 `assets/local.css` 中的 `.portrait-frame` 控制圆形取景。

## GitHub Pages

把本目录里的文件放到 `Gaoxing-art.github.io` 仓库的根目录，在 Settings → Pages 中选择 Deploy from a branch → main → /(root)。也可以放在其他仓库的 Pages 根目录，站内资源均使用相对路径。

## 设计来源

布局和基础样式沿用 [王道宇的个人主页模板](https://github.com/Melmaphother/Melmaphother.github.io)。本站使用独立的静态 HTML 和 JavaScript；不需要 Node、外部字体或 CDN。上游授权见 LICENSE。个人资料、论文插图和 GitHub 头像由各自权利人保留权利。
