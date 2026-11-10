---
name: 渡月行 · 全屏剧情与乘舟演出
description: 地点风景、静态立绘与逐段剧情组成的全屏模式，延续乘舟入海市的冷青暖灯风格。
colors:
  sea-night: "#071f2b"
  warm-ink: "#fff2d9"
  action-teal: "#163c43"
  control-teal: "#092a37d9"
  control-hover: "#30505b"
  lantern-line: "#e7c58b"
  control-line: "#e8d3a357"
  lantern-focus: "#ffe6a7"
  lantern-progress: "#f1d09a"
  landing-surface: "#082936ed"
  landing-action: "#22444b"
  landing-hover: "#385c5d"
  screen-stage: "#0c2936"
  screen-dialogue: "#082b36e8"
  screen-text: "#fff4e0"
  screen-speaker: "#ffe2aa"
  screen-focus: "#f4d797"
  screen-turn: "#264b50"
  screen-turn-hover: "#395e60"
  screen-choice: "#153c45eb"
  screen-choice-hover: "#31595d"
  screen-nav: "#0c2b36b8"
  screen-nav-hover: "#21414c"
  drawer-paper: "#f5f1e7"
  drawer-ink: "#293e3b"
typography:
  display:
    fontFamily: "'Noto Serif SC', 'Songti SC', 'SimSun', serif"
    fontSize: "clamp(36px, 5vw, 62px)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "5px"
  title:
    fontFamily: "'Noto Serif SC', 'Songti SC', 'SimSun', serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "'Noto Serif SC', 'Songti SC', 'SimSun', serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.7
  screen-body:
    fontFamily: "'Noto Serif SC', 'Songti SC', 'SimSun', serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.95
  screen-speaker:
    fontFamily: "'Noto Serif SC', 'Songti SC', 'SimSun', serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.5
spacing:
  control-gap: "12px"
  control-inline: "15px"
  desktop-edge: "32px"
  mobile-edge: "20px"
components:
  voyage-start:
    backgroundColor: "{colors.action-teal}"
    textColor: "#fff5df"
    padding: "14px 36px"
  voyage-control:
    backgroundColor: "{colors.control-teal}"
    textColor: "{colors.warm-ink}"
    typography: "{typography.label}"
    padding: "9px 15px"
  voyage-control-hover:
    backgroundColor: "{colors.control-hover}"
  landing-panel:
    backgroundColor: "{colors.landing-surface}"
    padding: "24px 28px"
    width: "min(600px, calc(100% - 40px))"
  landing-choice:
    backgroundColor: "{colors.landing-action}"
    textColor: "#fff1d6"
    padding: "12px 16px"
  landing-choice-hover:
    backgroundColor: "{colors.landing-hover}"
  screen-dialogue:
    backgroundColor: "{colors.screen-dialogue}"
    textColor: "{colors.screen-text}"
    typography: "{typography.screen-body}"
    padding: "22px 28px 20px"
  screen-turn:
    backgroundColor: "{colors.screen-turn}"
    textColor: "#fff1d6"
    padding: "10px 20px"
  screen-choice:
    backgroundColor: "{colors.screen-choice}"
    textColor: "#fff1d6"
    padding: "13px 17px"
  screen-navigation:
    backgroundColor: "{colors.screen-nav}"
    textColor: "#f2e4cb"
    padding: "8px 21px"
  screen-drawer:
    backgroundColor: "{colors.drawer-paper}"
    textColor: "{colors.drawer-ink}"
    width: "min(570px, 100vw)"
    height: "100dvh"
---

# Design System: 渡月行 · 全屏剧情与乘舟演出

## Overview

**Creative North Star: "舟入灯海"**

「舟入灯海」延续为两类已实现演出的共同风格：乘舟时，玩家沿冷青色云水穿过门楼，进入暖灯照亮的海市；全屏剧情时，地点风景铺满画面，静态角色立绘与下方宋体对白引导阅读。真实材质、克制暖灯和深青界面使两类画面连贯。

本文件约束乘舟入口、28 秒实时航行、登岸选择，以及新增全屏剧情模式的对白、选项与五个功能侧栏。全屏模式为默认入口，仍可切回原有纸面阅读。乘舟使用环境底图、独立门楼、舟体、WebGL 水面与雾粒实时合成；全屏剧情复用地点循环视频和静态立绘，不是每段新生成的角色视频。旧纸本页的其他布局不因此成为规范。

**Key Characteristics:**
- 冷青云水承托暖色灯火，场景材质比界面装饰更重要。
- 第一视角保持居中水道与近处舟沿，门楼独立推进。
- 宋体叙事、细框直角控件与安静的全屏构图。
- 航行可暂停、拖动进度、跳过和退出，声音初始关闭。
- 初次登岸接入三条剧情入口；旧存档回放返回原进度。
- 全屏剧情逐段呈现，自动推进默认关闭，在选项处交还决定权。
- 地点视频与静态立绘构景，纸面功能以五个侧栏承接。

提取依据：`sea-arrival.css`、`sea-arrival.js`，以及 `sea-shell.html` 的字体变量；素材位于 `../assets/arrival-{harbor,gate,boat}.png`。现有验收图为项目根目录 `.impeccable/review/arrival-mobile.jpg`（390 × 844）与 `arrival-desktop.jpg`（1280 × 720）。新增全屏模式依据 `sea-screen.js`、`sea-screen.css`；验收图为项目根目录 `.impeccable/review/screen-desktop.jpg`（1280 × 720）与 `screen-mobile.jpg`（390 × 844）。本轮交付范围为本地项目；公开项目访问状态不构成视觉规范。

## Colors

海夜底色与半透明青色界面服从画面，暖色用于文字、灯火、进度和可见焦点。

### Primary
- **行动青**（`action-teal`）：出发按钮的实色承托。
- **浮水青**（`control-teal` / `control-hover`）：航行控制的静止与悬停状态。
- **泊岸青**（`landing-action` / `landing-hover`）：结束后剧情入口的静止与悬停状态。

- **剧情青**（`screen-turn` / `screen-turn-hover`）：上一段、继续等翻段控制。
- **选择青**（`screen-choice` / `screen-choice-hover`）：剧情分支选项的静止与悬停状态。
- **导航青**（`screen-nav` / `screen-nav-hover`）：五个功能入口。

### Secondary
- **灯金**（`lantern-line` / `lantern-progress`）：主行动边线与航行进度。
- **可见灯光**（`lantern-focus`）：乘舟键盘焦点；必须与场景中的灯火区分得开。
- **剧情灯光**（`screen-speaker` / `screen-focus`）：说话者与全屏模式焦点。

### Neutral
- **海夜**（`sea-night`）：全屏舞台和遮罩底色。
- **暖纸字**（`warm-ink`）：舞台上的主要文字。
- **透光细线**（`control-line`）：次要控制边界，保持轻薄。
- **深水泊岸**（`landing-surface`）：登岸面板，提高文字与选择的可读性。
- **剧情舞台**（`screen-stage` / `screen-dialogue` / `screen-text`）：风景底色、半透明对白承托与暖色正文。
- **手札纸墨**（`drawer-paper` / `drawer-ink`）：功能侧栏恢复纸面阅读的明暗关系。

**The Lantern Rule.** 暖色点亮灯火、阅读与操作焦点；大面积环境保持冷青，不增加与景物争夺视线的鲜艳界面色。

## Typography

**Display Font / Body Font:** 沿用现有 `--serif` 宋体回退栈。
**Label Font:** 沿用现有 `--sans` 微软雅黑回退栈。

**Character:** 宋体负责标题、航行旁白与登岸选择，无衬线负责控制和状态。字体来源属于与阅读主界面的连续性，不据此提取旧页面布局。

### Hierarchy
- **Display**：欢迎标题，桌面流动字号；手机改为（37px）、字距（3px）。
- **Title**：分段字幕标题；手机降为（22px）。
- **Body**：航行旁白；最大行宽（650px），手机（15px），行高维持宽松。
- **Label**：声音、退出、暂停与跳过；手机顶部控制（11px）。
- 计时使用等宽数字排列；章节标记桌面（11px）、手机（10px）。
- **Screen Body**：全屏正文桌面字号与行高见 frontmatter，手机（17px）；角色名桌面字号见 `screen-speaker`，手机（18px）。选项主文桌面（16px）、手机（15px），条件与提示采用较小的无衬线文字。

**The Quiet Caption Rule.** 乘舟每段只保留短标题与一段旁白；全屏剧情按句子和段落分页，正文留在下方对白区，不扩展为覆盖场景的长篇文本。

## Layout

全屏原生对话框覆盖（100vw × 100dvh）；画面采用 cover 裁切，以中央水道为透视轴。背景、水门、舟体、雾粒和上下渐暗遮罩独立叠放。顶部品牌靠左，声音与退出靠右；底部为暂停、计时、跳过、原生进度条与四个章节标记。

桌面顶部与底部主要侧距（32px）；欢迎内容置于左侧（9%）、上方（25%），宽度不超过（540px）。字幕左右各留（10%）、距底（150px），段落居中。船体宽度使用（max(88vw, 800px)）；门楼宽度（110%），运动锚点在下部中轴。

以（700px）为手机断点：顶部侧距（16px）、底部侧距（20px）；欢迎与字幕侧距（24px）。手机字幕距底（200px），为控制带和舟沿保留空间；操作行不换行挤压按钮与计时，隐藏辅助拖看提示。舟体放大至（135vw），底部偏移（8%）；门楼扩展至（185%），保留穿门尺度。顶部和底部考虑系统安全区。

登岸面板居中，底部距（125px），宽度上限见 frontmatter；最大高度（calc(100dvh - 210px)），必要时面板内部滚动。三个入口纵向排布，不把选择放在景物热点上。

入口横幅衔接原有 hero 之后，桌面横排、手机竖排。其存在不改变纸本故事区的空间规范。

全屏剧情使用独立的固定舞台（100dvh），上方为品牌、日期、自动推进、纸面切换和风景控制，资源与地点信息靠左；对白区靠下、居中，最大宽度（780px），桌面内距见 frontmatter，最小高度（180px）。正文最大高度（25vh），超过时区内滚动；选项最大高度（38vh），功能导航紧随对白区。

桌面静态立绘占右侧（49%），以水平蒙版融入地点风景；手机立绘扩至全宽，上方（12%）、下方（20%），用上下蒙版过渡。地点视频和背景图均 cover，不要求每段正文更换新媒体。

手机沿用（700px）断点：顶部控制可换行、侧距（16px）；下方侧距（14px），对白内距（17px 18px 14px）、最小高度（190px）。全屏高度随动态视口，底部使用（max(12px, env(safe-area-inset-bottom))）；桌面顶部和底部使用安全区最大值，手机顶部当前为（14px）。控制按钮最小高度（44px），剧情选项最小高度（50px），不要因窄屏缩小触控目标。低于（520px）且宽于（700px）的横屏进一步压缩对白内距与正文高度。

功能侧栏右侧贴边，最大宽度与高度见 frontmatter，独立滚动，顶部标题与返回按钮吸顶；手机占满可用宽度。侧栏内容按现有全屏专用适配：行动、人物与资源采用适合抽屉宽度的列数，地图纵向展开。此处记录这些侧栏的实际适配，不推广旧页面布局。

## Elevation & Depth

场景深度依靠真实材质图层、门楼尺度变化、水面反射、雾气和舟体微幅摇动；控件本身保持平面薄框。上下暗色渐变用于文字与边缘控制的可读性。字幕采用深色文字阴影，完整值保存在 sidecar，不能转译为全站浮起卡片。

全屏剧情以地点背景图、循环视频、静态立绘和上下渐暗遮罩叠放；对白用深青半透明承托，不给人物添加 UI 卡片边框。功能侧栏为明亮纸面，使用向左的环境阴影区分舞台与功能层，阴影值见 sidecar。

**The Layered Passage Rule.** 保持港湾、水门与舟体可独立合成和运动；不能用整张图的统一缩放代替穿门过程。

## Shapes

控件与登岸面板为克制的直角矩形，使用细边线或顶部一条灯金线；不加药丸、装饰卡片或悬浮玻璃边框。原生 range 的轨道和滑块保留浏览器形状。图像的自然轮廓、透明门洞与近景舟沿承担场景形态，不裁成 UI 卡片。

## Components

### 出发与入口按钮

宋体文字配实色青底和灯金细线，出发按钮最小高度（52px），入口按钮桌面（50px）、手机（46px）。素材加载期间禁用出发；失败时显示重试文字，仍可直接靠岸。入口按钮焦点沿用其较亮的灯金 outline，舞台内部使用 frontmatter 的焦点灯光。

### 航行控制

细框、半透明海青底，最小高度（44px）。悬停提亮底色；键盘焦点为（3px）描边与（4px）外偏移；声音按钮的按下态提亮边线。暂停与声音状态同步可见文字和 `aria-pressed`。初次声音关闭，由用户开启；暂停及退出同时挂起音频。

### 航行进度

原生 range：范围（0–28 秒）、步长（0.1 秒）、控件高度（26px）。可通过拖动或键盘定位，四段提示依次为开船、过门、入市、靠岸。时间、字幕和画面使用同一个时间值；拖到结尾显示登岸选择。焦点必须清晰，不用自绘假滑块代替原生操作。

### 实时航行舞台

总时长（28 秒），字幕节点为（0 / 6 / 13 / 21 / 28 秒）。门楼独立缩放直至穿过；水面以 WebGL 局部扰动和高光表现航行，近景舟体轻摆，雾粒低强度移动。横向拖画面只提供有限视差，不改变剧情。

优先遵循减少动态偏好：冻结连续水面、摇动与粒子运动，以静态阶段切换表达过门，时间与进度仍可操作。页面转入后台即暂停，回到前台等待玩家继续。设备像素比上限（1.65），WebGL 不可用时使用 2D 或静态背景回退；材质加载失败不阻断剧情。

### 登岸选择与回到故事

深水面板以灯金顶线收束航程；选择按钮为宋体、左对齐，最小高度（48px），纵向间距（9px）。当前状态为 `intro` 时提供浮桥、水阶找闻溪、旧铃问价三个入口，再交由既有剧情选择逻辑处理。已有旅程的回放只提供回到当前旅程，演出本身不推进或重置存档。

原生 modal 管理焦点；完成时聚焦首个登岸选择，退出时恢复先前焦点。顶部「回到故事」与 Escape 均退出，底部「直接靠岸」跳到结尾。

### 全屏剧情与逐段阅读

按当前剧情、角色、地点和日夜状态选用已有地点视频、背景图与静态立绘；没有对应角色时隐藏立绘。视频为静音循环、内联播放，未准备好时保留背景图。提供「暂停风景」控制，不能把地点循环视频包装为逐段角色表演。

正文按段落与句末标点切成目标长度（80 字）的页面，长句必要时按长度分拆；先呈现刚才选择的结果，再呈现当前剧情。「上一段」可回读，首段禁用；末段切到选项、下一旬行动或结局入口。空格/右方向键继续、左方向键回读；焦点在按钮、输入等可交互控件上时，不拦截其按键。

### 剧情选项与自动推进

选项页替换正文并隐藏继续按钮，条件不满足时禁用并显示原因。自动推进初始关闭，按钮文字和 `aria-pressed` 同步；开启后按文本长度等待（6.5–18 秒），在选项页停止，永不代选。侧栏、打开的对话框、后台页面、纸面模式和结束态不安排自动翻段；返回可阅读状态后再按当前偏好计时。

**The Player Choice Rule.** 自动阅读可以翻段，剧情选择必须等待玩家操作。

### 五个功能侧栏

「行动、地图、相逢、手札、存档」固定为全屏模式下方五入口。它们分别承接修行与剧情准备、海图、角色往来、经历记录，以及保存/导入导出/姓名与重开设置。沿用原游戏数据与命令，抽屉并不另建一套进度。

打开时舞台设为 inert，焦点移到「回到画面」，Tab 留在侧栏；Escape 或返回按钮关闭并恢复打开前焦点。导航通过 `aria-expanded` 标记打开状态。功能抽屉、人物与地图保持原有可读纸墨色，避免把所有工具涂成深色舞台。

### 纸面切换与乘舟回放

顶部「手札模式」切回原有纸面，纸面右下「回到全屏演出」恢复舞台。使用 UI 偏好键 `duyuexing.screen-mode.v1`，取值 `screen` / `paper`；无记录时启用全屏，存储不可用时仍可切换。此键只保存界面偏好，不替换游戏存档。

全屏保留「重看乘舟入市」入口；回放打开既有乘舟 modal，结束后继续原进度。切换视图及打开侧栏时交由既有风景控制器同步媒体状态。

## Do's and Don'ts

### Do:
- **Do** 用冷青云水、暖灯与真实材质保持第一视角海市的统一气氛。
- **Do** 分离环境、水门、舟体和雾粒，使用统一时间驱动画面与字幕。
- **Do** 保留暂停、可拖进度、直接靠岸、退出、默认静音、减少动态和后台暂停。
- **Do** 在手机为字幕与控制带留出空间，保持按钮、计时和焦点可读。
- **Do** 只在初次登岸提供三条剧情入口，让旧存档回放返回原进度。
- **Do** 用地点视频与静态立绘承托逐段正文，保留手动翻段、纸面切换和五个功能侧栏。
- **Do** 默认关闭自动推进，并在选项、后台与功能操作期间等待玩家。

### Don't:
- **Don't** 将此实时分层演出描述为连续人物视频。
- **Don't** 用新增控制、装饰卡片或高饱和界面覆盖场景主体。
- **Don't** 把旧游戏其他布局缺陷、纸本页尺寸或现有截图的偶发状态提升为全站规范。
- **Don't** 将地点循环视频和静态立绘描述成每段新生成的角色视频。
- **Don't** 删除纸面阅读入口，或因全屏展示改变已有剧情与存档行为。



