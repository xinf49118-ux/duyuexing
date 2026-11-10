# 渡月行

原创乙女修仙文字游戏。三年剧情，五位可发展关系的成年角色，六种世界结局。全屏演出采用动态场景、人物立绘和分段正文，支持手机与桌面。

游戏源码在 work/，素材在 docs/assets/。剧情修订集中在 work/sea-prose.js，行动、存档与演出逻辑分别在 sea-engine.js、sea-save.js 和 sea-screen.js。

安装 Node.js 后，运行 npm run build，再运行 npm start，打开 http://127.0.0.1:4333/。项目无需安装依赖。修改后运行 npm run build:pages 更新 docs/index.html。GitHub Pages 从 main 分支的 /docs 发布。

进度在浏览器里。换设备或网址前，从游戏的「存档」导出 JSON，然后在新设备导入。文本手札供阅读。
