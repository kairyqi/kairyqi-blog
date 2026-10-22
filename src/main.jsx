import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './stitch-theme.css'
import profileAvatar from "../kairyqi-profile.jpg"

const Icon = ({ name, size = 18 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    external: <><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,
    notes: <><path d="M5 3h14v18H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    journal: <><rect x="4" y="4" width="16" height="17" rx="2"/><path d="M8 2v4m8-4v4M4 9h16M8 13h3m-3 4h6"/></>,
    projects: <><path d="M4 5h16v14H4z"/><path d="m8 12 2.5 2.5L16 9"/></>,
    person: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,
    code: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/></>,
    play: <><path d="m9 6 10 6-10 6z"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    spark: <><path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z"/></>,
    github: <><path d="M9 19c-4.3 1.3-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6S17.6 1.3 15 3a13.3 13.3 0 0 0-7 0C5.4 1.3 3.2 1.6 3.2 1.6a4.8 4.8 0 0 0-.1 3.6 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.2 6.4 6.2 6.7A3.4 3.4 0 0 0 7 18.1V22"/></>,
    video: <><rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z"/><path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20M8 7h7"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7.5.5l3-3A5 5 0 0 0 13.4 3.4l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"/></>,
  }
  return <svg {...common}>{paths[name] || paths.spark}</svg>
}

function MotionField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = 0, height = 0, frame = 0, raf
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const points = Array.from({ length: 54 }, (_, index) => ({
      x: (index * 197.3 % 997) / 997,
      y: (index * 317.7 % 991) / 991,
      r: 0.5 + (index % 4) * 0.34,
      phase: index * 1.8,
      speed: 0.14 + (index % 6) * 0.025,
    }))
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6)
      width = canvas.clientWidth; height = canvas.clientHeight
      canvas.width = width * ratio; canvas.height = height * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const draw = () => {
      frame += 0.004
      ctx.clearRect(0, 0, width, height)
      const coords = points.map(p => ({ x: p.x * width + Math.sin(frame * p.speed + p.phase) * 18, y: p.y * height + Math.cos(frame * p.speed + p.phase) * 14, r: p.r }))
      for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
          const a = coords[i], b = coords[j], d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 155) {
            ctx.strokeStyle = `rgba(103, 149, 255, ${0.14 * (1 - d / 155)})`
            ctx.lineWidth = 0.7
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      coords.forEach((p, i) => {
        const pulse = 0.5 + Math.sin(frame * 2.1 + i) * 0.24
        ctx.fillStyle = `rgba(134, 180, 255, ${pulse})`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + pulse * 0.55, 0, Math.PI * 2); ctx.fill()
      })
      if (!reduceMotion) raf = requestAnimationFrame(draw)
    }
    resize(); draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas className="motion-field" ref={canvasRef} aria-hidden="true" />
}

const tagGroups = [
  { name: 'AI 与智能工具', tags: ['AI工具', 'AI绘画', 'AI视频', '提示词', '大模型', '自动化'] },
  { name: '技术与开发', tags: ['React', '前端开发', '移动端适配', '服务器', '网络工具', '部署运维', '教程'] },
  { name: '设计与影像', tags: ['网页设计', '视觉灵感', '摄影', '短视频', '剪辑', '运镜'] },
  { name: '资源与收藏', tags: ['实用网站', '效率工具', '优质账号', '素材资源', '教程合集', '待研究'] },
  { name: '生活与灵感', tags: ['生活随记', '旅行', '城市风景', '个人想法', '灵感记录'] },
]
const allTags = tagGroups.flatMap(group => group.tags)
const recommendTags = text => {
  const value = String(text || '').toLocaleLowerCase()
  const rules = [
    ['AI工具', /ai|人工智能|大模型|chatgpt|模型/i], ['AI绘画', /绘画|文生图|midjourney|stable diffusion/i],
    ['AI视频', /ai视频|视频生成|图生视频/i], ['提示词', /提示词|prompt/i],
    ['React', /react/i], ['前端开发', /前端|javascript|typescript|vite|网页开发/i],
    ['服务器', /服务器|vps|linux/i], ['网络工具', /vpn|wireguard|网络工具|代理/i],
    ['部署运维', /部署|运维|github pages|上线/i], ['网页设计', /网页设计|页面布局|ui设计|网站设计/i],
    ['视觉灵感', /灵感|视觉|版式|pinterest/i], ['摄影', /摄影|照片|拍摄/i],
    ['短视频', /短视频|视频/i], ['剪辑', /剪辑|后期/i], ['运镜', /运镜|镜头/i],
    ['实用网站', /网站|网址|在线工具/i], ['效率工具', /效率|工具/i], ['教程', /教程|步骤|指南/i],
    ['生活随记', /生活|随记|日常/i], ['旅行', /旅行|旅游|出行/i], ['城市风景', /城市|风景|湖|街景/i],
    ['个人想法', /想法|思考|观点/i], ['灵感记录', /灵感|记录/i],
  ]
  return rules.filter(([, pattern]) => pattern.test(value)).map(([tag]) => tag).filter(tag => allTags.includes(tag)).slice(0, 6)
}

const logEntries = [
  {
    id: 'bigmeok-bookmark', section: 'favorites', date: '2026.10.19', category: '收藏夹 · 网络工具',
    title: '收藏当前使用的 Bigmeok 代理入口',
    note: '将目前正在使用的 VPN / 代理服务入口加入收藏夹，便于之后快速访问。',
    tags: ['网络工具', '效率工具', '实用网站'],
    externalLink: 'https://pub.bigmeok.me/',
    body: [
      '把 Bigmeok（https://pub.bigmeok.me/）加入个人空间网站的收藏夹，分类为「网络工具」，作为当前使用的 VPN / 代理服务入口。',
      '这条日志只记录收藏事项本身，不记录或混入对个人空间网站进行的界面优化、缩略图调整等维护过程。'
    ],
  },
  {
    id: 'motionsites-bookmark', section: 'favorites', date: '2026.10.18', category: '收藏夹 · AI 建站',
    title: '收藏 MotionSites 网站设计灵感库',
    note: '收藏用于探索高质感网站设计、动态效果与页面灵感的资源。',
    tags: ['AI工具', '提示词', '网页设计', '实用网站', '视觉灵感', '待研究'],
    externalLink: 'https://motionsites.org/',
    body: [
      '把 MotionSites（https://motionsites.org/）加入个人空间网站收藏夹，作为网站设计、动态效果和页面灵感的参考入口。',
      '后续可以结合正在进行的 Vibe Coding 工具研究，筛选适合个人空间的设计思路。'
    ],
  },
  {
    id: 'stitch-bookmark', section: 'favorites', date: '2026.10.19', category: '收藏夹 · AI 设计工具',
    title: 'Google Stitch',
    note: '用于生成和探索网站界面设计，也作为个人空间桌面端与移动端改版的参考。',
    tags: ['AI工具', '网页设计', '视觉灵感', '前端开发'],
    externalLink: 'https://stitch.withgoogle.com/projects/11189735975645787200',
    body: [
      '收藏 Google Stitch 项目，记录这次个人空间 UI 改版所使用的设计参考。',
      '后续遇到界面设计任务时，可以先用 Stitch 明确桌面与移动端结构，再按现有内容和数据把设计落到代码中。'
    ],
  },
  {
    id: 'pinterest', section: 'favorites', date: '2026.10.17', category: '收藏夹 · 网站设计',
    title: 'Pinterest', note: '收集视觉灵感，也用来参考网站设计与页面布局。',
    tags: ['视觉灵感', '网页设计', '实用网站'],
    externalLink: 'https://jp.pinterest.com/',
    body: ['Pinterest 是一个视觉内容发现与收藏平台。这里先记下它，作为网站设计、版式和视觉表达的灵感入口。']
  },
  {
    id: 'personal-space-build', section: 'notes', date: '2026.10.17', category: '技术笔记 · 个人网站',
    title: '从一次个人空间搭建，整理我的设计与实现思路',
    note: '记录从内容定位、页面结构到 React、Vite 与 GitHub Pages 发布的完整过程。',
    tags: ['React', '前端开发', '网页设计', '部署运维', '教程', 'AI工具', '移动端适配'],
    outline: ['记录空间的定位', '从 Hero 回到内容布局', '首页、列表与详情结构', 'React + Vite 数据维护', 'GitHub Pages 发布', '图片与视频资源', '版块层级与字号', '固定导航与层级', 'GitHub 集成授权排障', '头像资源加载排障', 'Stitch 桌面与移动设计迭代', '后续协作更新指引', '列表页与详情页的 Stitch 迭代'],
    body: [
      '这个空间最初从个人 Blog 的样式讨论开始。比起把页面做成简历或作品集，我更希望它像一个长期使用的个人记录本：技术笔记、收藏、项目、生活随记都能放进来，主要写给自己，也让偶然访问的人看得明白。',
      '视觉上经历了几轮调整。最初尝试了全屏 Hero 和较大的展示区块，后来发现它更像传统宣传页，不适合频繁阅读和更新。最终回到相对熟悉的头部导航与左右分栏：侧栏放个人信息，主栏承载日志、技术笔记、收藏、项目和生活随记。保留深色科技感的首页、微弱动效与蓝色强调，但让内容成为页面主体。',
      '内容结构也从静态首页扩展为可浏览的记录系统。首页每个板块只展示少量最新内容，“更多”进入列表页，条目还能打开详情页。这样首页保持轻量，记录积累后也有明确的归档和阅读路径。',
      '实现采用 React 与 Vite，页面针对桌面和手机分别调整布局。内容暂时由前端数据维护，适合当前的静态个人空间；之后新增内容时，按对应分类添加条目即可同步出现在首页、列表和详情中。',
      '发布使用 GitHub 仓库和 GitHub Pages，通过 GitHub Actions 构建并部署。过程中遇到一个典型路径问题：头像使用根路径时，本地运行正常，但仓库站点部署在子目录下会请求错误地址。改为引用 Vite 的 BASE_URL 后，本地和 Pages 都能使用正确的资源路径。',
      '图片适合压缩后随站点发布；视频文件较大，不适合持续塞进 Git 历史，后续更适合放到视频平台或对象存储，再嵌入链接。整体经验是先让内容组织方式稳定，再逐步丰富视觉和媒体，不需要一开始就把所有功能做复杂。',
      '后续围绕首页层级又做了几轮细化：板块标题统一为“编号 / 名称”，标题用 h2 呈现，右侧只保留一句简短说明；主栏标题字号收至 24px，标题栏不再底部对齐。收藏卡片作为字号参照，日志、技术笔记、随记和项目卡片的标题、正文与辅助文字也一并放大，并为手机端单独设定易读字号。',
      '导航固定在视口顶部并铺满页面宽度，内部内容仍与约 1440px 的版心对齐。为避免滚动时被 Hero 或卡片层级遮挡，导航移到 Hero 外并提高层级；头像侧栏的 sticky 顶部间距调整到 112px，给固定导航留出空间。导航移出 Hero 后，wordmark 也需要显式设为浅色，避免继承页面默认的深色文字。',
      '这次新增标签系统时也记录了一次 GitHub 授权排障：最初 ChatGPT 中的 GitHub 连接可以读取仓库，但创建分支和写入文件返回 403 Resource not accessible by integration。GitHub Settings 的 Applications 页面里，Authorized GitHub Apps 能看到 ChatGPT Codex Connector，但 Installed GitHub Apps 为空；这两个入口不是一回事。随后重新打开 ChatGPT Codex Connector 的 Install & Authorize 页面，选择 All repositories，并确认授权页列出的 actions、code、issues、pull requests 与 workflows 读写权限后点击 Install & Authorize，页面随即跳回 ChatGPT。之后才能成功创建分支、提交修改、创建并合并 PR。排障时应区分 ChatGPT 内部的操作许可与 GitHub 端实际授予集成的权限；遇到 403 时检查连接对应的授权和仓库范围，不要误以为仓库本身没有写入权限。最终 GitHub Actions 的 Build website 和 Publish website 均成功，标签系统已发布到 GitHub Pages。',
      '关于空间头像加载排障（2026-10-19）：将成熟版赛博风方形头像加入仓库根目录 `kairyqi-profile.jpg`，并在关于空间中通过 `${import.meta.env.BASE_URL}kairyqi-profile.jpg` 引用。首次更新后，GitHub Actions 的构建与发布均显示成功，但用户实际打开网站时头像仍未加载，说明“部署流程成功”并不等于资源在页面上一定能正确显示。复查代码后，将图片引用改为 `import profileAvatar from "../kairyqi-profile.jpg"`，由 Vite 在构建时处理静态资源并生成对应 URL；修改合并后，用户确认网站图片已正常更新。经验：遇到图片加载失败，不能只看 Actions 成功状态；应同时核对资源是否进入构建产物、引用路径是否适配 GitHub Pages 子路径，并以线上实际页面结果验证。',
      'Stitch 设计迭代记录（2026-10-19）：参考 Google Stitch 项目 Personal Tech Sanctuary Redesign（https://stitch.withgoogle.com/projects/11189735975645787200），先对照画板里的桌面端与移动端结构，再逐项映射到已有 React 页面。视觉上采用深色数字档案风格，以青蓝、靛紫和薄荷色作为强调色，个人信息、导航和各内容区使用一致的边框、间距与字体层级；内容仍读取站点真实数据，不照搬画板里的示例文章、项目进度或虚构计数。桌面端保留左侧主理人信息与右侧内容流；移动端则取消固定侧栏和左右分栏，让主理人模块、日志、笔记、随记、收藏、项目和标签按单列顺序排列。主理人卡按移动参考稿拆成头像/姓名身份行、整行简介、当前关注条和邮箱操作；顶栏收紧并保留搜索与版块菜单，底部增加快捷导航。改版过程采用“看设计稿—实现—本地预览—对照截图修正”的循环：先有一次移动端仍沿用桌面侧栏/并排结构，复查层叠的媒体查询后显式覆盖窄屏网格和 sticky 定位，再按用户提供的卡片截图细调头像形状、文字顺序与操作按钮。经验：移动端需要独立按设计稿实现信息层级，不能只靠缩窄桌面版；CSS 断点出现多次覆盖时，要检查最终生效规则，并以手机视口实际预览确认布局。',
      '后续更新指引：网站仓库为 https://github.com/kairyqi/kairyqi-blog，使用 React 与 Vite，发布到 GitHub Pages（https://kairyqi.github.io/kairyqi-blog/）。新增内容时先确定板块，并整理标题、日期、分类、摘要、正文及相关链接或媒体；保持桌面与手机布局、列表/详情/搜索和 Pages 子路径资源引用正常。修改后先完成构建检查，再提交并推送 main 发布，只提交本次相关内容，不带入临时附件或无关文件；最后说明改动和发布结果。',
      '列表页与详情页的 Stitch 迭代（2026-10-19）：在首页风格基础上，继续把列表页和内容详情页对照 Stitch 画板重做。列表页增加面包屑、板块介绍、真实记录数、标签筛选、标题与正文搜索、排序、分页和主题侧栏；详情页补充标签、摘要、日期与预计阅读时间、复制链接、字号调整、分享、目录和阅读进度，并加入作者信息与前后篇导航。页面只呈现现有真实条目和计算出的数量，不复用画板中的示例内容。桌面端使用主内容加辅助侧栏；手机端将列表和文章收成单列，并把桌面侧边目录改为可展开的目录抽屉。通过本地预览逐页检查后再细调卡片、间距与断点，避免仅凭桌面截图判断响应式效果。',
    ],
  },
  {
    id: 'vibe-coding-design-tools', section: 'projects', date: '2026.10.18', category: '待办项目 · Vibe Coding',
    title: '研究 MotionSites、JiroBuild 与国产 Vibe Coding 平替',
    note: '从设计灵感库与提示词入手，比较网站生成工具，整理适合升级个人空间的视觉与交互方案。',
    tags: ['AI工具', '提示词', '网页设计', '前端开发', '实用网站', '待研究'],
    body: [
      '灵感来源：抖音账号「宇至｜Vibe创业」分享的视频，标题提到 MotionSites 与 JiroBuild 的国产平替。当前先把这件事列入待办，后续再根据视频完整内容核实具体推荐的国产工具，不把尚未确认的产品名称或能力当作结论。',
      '初步认识：MotionSites 与 JiroBuild 更偏向网站设计灵感、页面模板或提示词素材，帮助开发者给 AI 编程工具提供更明确的视觉参考；它们不应简单等同于可以独立完成所有开发、测试与部署的全自动建站平台。',
      '计划研究：1）回看视频并确认国产平替的名称、官网、功能与收费；2）对比设计质量、中文适配、页面生成能力、动效实现、代码导出和部署方式；3）挑选适合个人主页的设计参考，重点观察首屏、内容卡片、滚动动画和移动端布局；4）评估能否融入现有 React + Vite + GitHub Pages 项目。',
      '实施原则：先做小范围视觉实验，不推倒重建现有网站；保留已有记录、标签、搜索与详情页结构。改动后检查手机适配、加载性能、可访问性、资源路径和 GitHub Pages 构建结果。',
      '完成标准：形成一份工具对比与成本记录，选定值得尝试的方案，并完成一个可在现有个人空间中验证的设计或交互改进。'
    ],
  },
  {
    id: 'h3-360-orbit-workflow', section: 'projects', date: '2026.10.22', category: '待办项目 · AI 视频',
    title: '实践 ComfyUI + MiniMax H3 360° 环绕视频工作流',
    note: '本地部署 MiniMax H3 360° 环绕 LoRA，用一张照片生成环绕人物/物体的视频，并沉淀到自有工作流。',
    tags: ['AI视频', 'ComfyUI', 'MiniMax H3', '本地部署', '工作流', '待研究'],
    externalLink: 'https://www.freedidi.com/25755.html',
    body: [
      '灵感来源：零度博客教程《ComfyUI + MiniMax H3：一张照片生成 360° 环绕视频》（https://www.freedidi.com/25755.html）。教程给出本地免费部署 MiniMax H3 360° 环绕 LoRA 的完整流程：安装 ComfyUI（选本地部署并启用镜像加速）、下载 5 个模型文件（Diffusion 模型、Text 编码器、两类 Vae、360° 环绕 LoRA）放到对应目录、导入单张照片或首尾帧两套工作流，提示词默认即可。',
      '与自有环境的关联：本机为 RTX 4070 12GB，已部署 ComfyUI 便携版，正好可以对照教程把 360° 环绕工作流跑通，并评估 12GB 显存下 Diffusion 模型（int8_convrot 量化版）的运行表现。',
      '计划研究：1）按教程路径核对并补齐本机已有模型；2）导入单张照片工作流，用一张人物/物体照片生成 360° 环绕视频；3）记录提示词、节点参数与显存占用；4）评估是否需要首尾帧工作流，以及能否融进现有的 H3 Studio 控制台。',
      '实施原则：先在现有 ComfyUI 环境做小范围实验，不动个人空间网站代码；视频文件较大，不进 Git，完成后用链接或对象存储引用。',
      '完成标准：跑通一条 360° 环绕视频样例，整理出可复用的模型清单、工作流与参数说明，并作为经验沉淀（可写入技术笔记或自有 skill）。'
    ],
  },
  {
    id: 'h3-douyin-long-video', section: 'projects', date: '2026.10.22', category: '待办项目 · AI 视频',
    title: '研究 MiniMax H3 长视频与剧情玩法（零度解说抖音）',
    note: '对照零度解说抖音视频，研究 H3 免费拍大片、长视频与剧情生成的玩法与落地方式。',
    tags: ['AI视频', 'MiniMax H3', '抖音', '长视频', '剧情', '待研究'],
    externalLink: 'https://v.douyin.com/CIY5b8NO_JE/',
    body: [
      '灵感来源：抖音账号「零度解说」的作品《MiniMax H3 免费拍大片！支持长视频、剧情...》（https://v.douyin.com/CIY5b8NO_JE/）。视频展示了 MiniMax H3 免费生成大片、支持长视频与剧情化生成的能力。',
      '与现有研究的关联：前一条待办已把「ComfyUI + MiniMax H3 360° 环绕视频工作流」列入本地实践；这条补充 H3 在长视频与剧情叙事方向的应用，可作为同一工具链的能力扩展去研究。',
      '计划研究：1）回看视频并确认 H3 长视频/剧情的具体入口、模型与提示词要求；2）评估是否需要不同于 360° 环绕的模型或工作流；3）结合本机 RTX 4070 12GB 与 ComfyUI 便携版，做一次小范围长视频/剧情样例实验；4）判断能否沉淀为自有 H3 Studio 控制台的一个模式。',
      '实施原则：先做小范围验证，不动个人空间网站代码；视频文件较大，不进 Git，完成后用链接或对象存储引用。',
      '完成标准：跑通或复现一个 H3 长视频/剧情样例，整理出所需模型、工作流与提示词要点，并作为经验沉淀（可写入技术笔记或自有 skill）。'
    ],
  },
  {
    id: 'h3-360-orbit-and-tdmfast', section: 'journal', date: '2026.10.22', category: '日志 · 网站更新',
    title: '收藏 MiniMax H3 360° 环绕视频教程，并列入待办与下载工具',
    note: '把零度博客的 ComfyUI + MiniMax H3 教程加入收藏与待办，同时收藏 TDM Fast 高速下载器。',
    tags: ['网站更新', '收藏', '待办项目', 'AI视频', 'ComfyUI', '下载工具'],
    body: [
      '今日更新个人空间：将零度博客文章《ComfyUI + MiniMax H3：一张照片生成 360° 环绕视频》（https://www.freedidi.com/25755.html）加入收藏夹，并把「本地实践这套 360° 环绕视频工作流」列入待办项目，链接回同一教程作为参考。',
      '顺便把教程中提到的 TDM Fast 高速下载器加入收藏夹，用于之后加速下载开源模型与大文件。',
      '这三条内容已随本次提交发布到 GitHub Pages；首页收藏夹、待办项目卡片与日志时间轴均会同步展示。'
    ],
  },
]

const bookmarks = [
  { category: '网络工具', type: 'VPN · 代理服务', title: 'Bigmeok', note: '目前正在使用的 VPN / 代理服务入口，方便之后快速访问。', tags: ['网络工具', '效率工具', '实用网站'], icon: 'link', label: '网络工具', link: 'https://pub.bigmeok.me/', image: 'https://image.thum.io/get/width/1200/crop/800/https://pub.bigmeok.me/' },
  { category: 'AI 建站 · 设计灵感', type: 'Vibe Coding', title: 'MotionSites', note: '收藏用于探索高质感网站设计、动态效果与页面灵感的资源，后续研究如何将合适的设计应用到个人空间。', tags: ['AI工具', '提示词', '网页设计', '实用网站', '视觉灵感', '待研究'], icon: 'spark', label: 'AI 建站', link: 'https://motionsites.org/', image: 'https://image.thum.io/get/width/1200/crop/800/https://motionsites.org/' },
  { category: 'AI 设计工具', type: '界面设计', title: 'Google Stitch', note: '用于生成和探索网站界面设计，也作为个人空间桌面端与移动端改版的参考。', tags: ['AI工具', '网页设计', '视觉灵感', '前端开发'], icon: 'spark', label: 'AI 设计', link: 'https://stitch.withgoogle.com/projects/11189735975645787200' },
  { category: '网站设计', type: '视觉灵感', title: 'Pinterest', note: '收集视觉灵感，参考网站设计与页面布局。', tags: ['视觉灵感', '网页设计', '实用网站'], icon: 'spark', label: '网站设计', link: 'https://jp.pinterest.com/', image: 'https://image.thum.io/get/width/1200/crop/800/https://jp.pinterest.com/' },
  { category: 'AI 视频生成 · ComfyUI', type: '教程 · 工作流', title: 'ComfyUI + MiniMax H3：一张照片生成 360° 环绕视频', note: '零度博客教程：本地免费部署 MiniMax H3 360° 环绕 LoRA，附完整工作流，用一张照片即可生成环绕人物/物体的 360° 视频。', tags: ['AI视频', 'ComfyUI', 'MiniMax H3', '教程', '工作流', '本地部署'], icon: 'play', label: 'AI 视频', link: 'https://www.freedidi.com/25755.html', image: 'https://image.thum.io/get/width/1200/crop/800/https://www.freedidi.com/25755.html' },
  { category: '下载工具 · 效率', type: '高速下载器', title: 'TDM Fast', note: '零度博客同款高速下载器，用于加速开源模型与大文件下载。', tags: ['下载工具', '效率工具', '实用网站', '模型下载'], icon: 'link', label: '下载工具', link: 'https://get.tdmfast.com/', image: 'https://image.thum.io/get/width/1200/crop/800/https://get.tdmfast.com/' },
]

function ArchiveHeader({ homeUrl }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <header className="site-header page-width">
    <a className="wordmark" href={homeUrl} onClick={close}><span className="wordmark-icon">KQ</span><span className="wordmark-lockup"><strong>KairyQi 的空间</strong><small>// tech notes &amp; logs</small></span></a>
    <a className="header-search" href={`${homeUrl}?view=search`} aria-label="搜索空间"><Icon name="search" size={16}/><span>快速索引...</span><kbd>⌘K</kbd></a>
    <button className="menu-toggle" aria-label="切换版块导航" aria-expanded={open} onClick={() => setOpen(!open)}><span/><span/><b>版块</b></button>
    <nav className={open ? 'main-nav is-open' : 'main-nav'} aria-label="主导航">
      <a href={`${homeUrl}#about`} onClick={close}>关于空间</a><a href={`${homeUrl}#experience`} onClick={close}>日志</a><a href={`${homeUrl}#notes`} onClick={close}>技术笔记</a><a href={`${homeUrl}#moments`} onClick={close}>生活随记</a><a href={`${homeUrl}#favorites`} onClick={close}>收藏夹</a><a href={`${homeUrl}#projects`} onClick={close}>项目</a><a href={`${homeUrl}#tags`} onClick={close}>标签</a><span className="header-status"><i/> ONLINE <b>⌖</b></span>
    </nav>
  </header>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [articleCopied, setArticleCopied] = useState(false)
  const [articleFontSize, setArticleFontSize] = useState(18)
  const [readingProgress, setReadingProgress] = useState(0)
  const closeMenu = () => setMenuOpen(false)
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('kairyqi@gmail.com')
      setEmailCopied(true)
      window.setTimeout(() => setEmailCopied(false), 1800)
    } catch {
      window.location.href = 'mailto:kairyqi@gmail.com'
    }
  }
  const params = new URLSearchParams(window.location.search)
  const view = params.get('view')
  const searchQuery = (params.get('q') || '').trim()
  const pageSection = params.get('section') || 'journal'
  const pageNumber = Math.max(1, Number(params.get('page')) || 1)
  const sectionNames = { journal: '日志', notes: '技术笔记', moments: '生活随记', favorites: '收藏夹', projects: '项目' }
  const pageSize = 6
  const sortedEntries = [...logEntries].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  const sectionItems = pageSection === 'journal' ? sortedEntries : sortedEntries.filter(item => item.section === pageSection)
  const listQuery = (params.get('q') || '').trim()
  const selectedListTag = params.get('tag') || ''
  const listSort = params.get('sort') || 'newest'
  const sectionTagCounts = [...new Set(sectionItems.flatMap(item => item.tags || []))].map(tag => ({ tag, count: sectionItems.filter(item => (item.tags || []).includes(tag)).length })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  const filteredItems = sectionItems.filter(item => {
    const matchesTag = !selectedListTag || (item.tags || []).includes(selectedListTag) || item.category === selectedListTag
    const matchesQuery = !listQuery || [item.title, item.category, item.note, ...(item.tags || []), ...(item.body || [])].join(' ').toLocaleLowerCase().includes(listQuery.toLocaleLowerCase())
    return matchesTag && matchesQuery
  }).sort((a, b) => listSort === 'oldest' ? (a.date || '').localeCompare(b.date || '') : listSort === 'title' ? a.title.localeCompare(b.title, 'zh-CN') : (b.date || '').localeCompare(a.date || ''))
  const noteEntries = sortedEntries.filter(item => item.section === 'notes')
  const searchableItems = [
    ...logEntries,
    ...bookmarks.filter(bookmark => !logEntries.some(entry => entry.section === 'favorites' && entry.title === bookmark.title)).map(bookmark => ({
      id: `favorite-${bookmark.title}`, section: 'favorites', date: '', category: bookmark.label,
      title: bookmark.title, note: bookmark.note, body: [bookmark.note], externalLink: bookmark.link,
    })),
  ]
  const searchResults = searchQuery
    ? searchableItems.filter(item => [item.title, item.category, item.note, ...(item.tags || []), ...item.body].join(' ').toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))
    : []
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const pageItems = filteredItems.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  const detailItem = view === 'detail' ? logEntries.find(item => item.id === params.get('id')) : null
  const articleText = detailItem ? detailItem.body.join(' ') : ''
  const articleWordCount = articleText.replace(/\s/g, '').length
  const articleReadMinutes = Math.max(1, Math.ceil(articleWordCount / 400))
  const articleOutline = detailItem?.outline?.length ? detailItem.outline : ['记录内容']
  const articleSections = detailItem ? articleOutline.map((heading, index) => ({ heading, paragraphs: detailItem.outline?.length ? [detailItem.body[index]].filter(Boolean) : detailItem.body })) : []
  const articleUrl = window.location.href
  const copyArticleLink = async () => {
    try { await navigator.clipboard.writeText(articleUrl); setArticleCopied(true); window.setTimeout(() => setArticleCopied(false), 1800) }
    catch { window.prompt('复制文章链接', articleUrl) }
  }
  const routeForList = (section, page = 1) => '?view=list&section=' + section + '&page=' + page
  const listHref = (tag = selectedListTag, page = 1) => {
    const query = new URLSearchParams({ view: 'list', section: pageSection, page: String(page) })
    if (tag) query.set('tag', tag)
    if (listQuery) query.set('q', listQuery)
    if (listSort !== 'newest') query.set('sort', listSort)
    return `?${query.toString()}`
  }
  const routeForDetail = id => '?view=detail&id=' + id
  const routeForTag = tag => '?view=tags&tag=' + encodeURIComponent(tag)
  const selectedTag = params.get('tag') || ''
  const tagEntries = selectedTag ? searchableItems.filter(item => (item.tags || []).includes(selectedTag)) : []
  const tagCounts = allTags.map(tag => ({ tag, count: searchableItems.filter(item => (item.tags || []).includes(tag)).length })).filter(item => item.count > 0).sort((a, b) => b.count - a.count || allTags.indexOf(a.tag) - allTags.indexOf(b.tag))
  const homeUrl = import.meta.env.BASE_URL
  useEffect(() => {
    if (view !== 'detail') return undefined
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setReadingProgress(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 100)
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => { window.removeEventListener('scroll', updateProgress); window.removeEventListener('resize', updateProgress) }
  }, [view, detailItem?.id])
  if (view === 'list') return <div className="archive-page stitch-list-page">
    <ArchiveHeader homeUrl={homeUrl}/>
    <main className="archive-main archive-list-main page-width">
      <nav className="archive-breadcrumb" aria-label="面包屑"><a href={homeUrl}>首页</a><span>/</span><span>{sectionNames[pageSection] || '日志'}</span></nav>
      <section className="list-page-intro"><div><div className="section-kicker">// {pageSection === 'notes' ? 'TECHNICAL NOTES & ENGINEERING LOG' : 'PERSONAL ARCHIVE'}</div><h1>{sectionNames[pageSection] || '日志'}</h1><p className="archive-description">{pageSection === 'notes' ? '记录开发过程中的实践、思路与复盘。' : pageSection === 'journal' ? '按时间整理空间里的技术笔记、收藏、项目与生活片段。' : `关于「${sectionNames[pageSection] || '日志'}」的记录与整理。`}</p></div><div className="list-total"><strong>{String(filteredItems.length).padStart(2, '0')}</strong><span>条记录</span><small>{selectedListTag ? `标签：${selectedListTag}` : '持续归档中'}</small></div></section>
      <div className="archive-layout">
        <div className="archive-results-column">
          <form className="list-tools" action={homeUrl} method="get"><input type="hidden" name="view" value="list"/><input type="hidden" name="section" value={pageSection}/><input type="hidden" name="page" value="1"/>{selectedListTag && <input type="hidden" name="tag" value={selectedListTag}/>}<label className="list-search"><Icon name="search" size={16}/><input type="search" name="q" defaultValue={listQuery} placeholder="在本版块中搜索..."/><kbd>⌘K</kbd></label><label className="list-sort"><span>排序</span><select name="sort" defaultValue={listSort} onChange={event => event.currentTarget.form.requestSubmit()}><option value="newest">按发布时间（最新）</option><option value="oldest">按发布时间（最早）</option><option value="title">按标题</option></select></label><button className="list-search-submit" type="submit">搜索</button></form>
          <div className="list-filter-row" aria-label="按标签筛选"><a className={!selectedListTag ? 'is-active' : ''} href={listHref('', 1)}>全部 <b>{sectionItems.length}</b></a>{sectionTagCounts.slice(0, 8).map(item => <a className={selectedListTag === item.tag ? 'is-active' : ''} href={listHref(item.tag, 1)} key={item.tag}>{item.tag}<b>{item.count}</b></a>)}</div>
          <div className="list-result-count">显示 {pageItems.length ? (pageNumber - 1) * pageSize + 1 : 0}–{Math.min(pageNumber * pageSize, filteredItems.length)} 条，共 {filteredItems.length} 条</div>
          <div className="archive-list stitch-archive-list">{pageItems.length ? pageItems.map(item => <a className="archive-row stitch-archive-row" href={routeForDetail(item.id)} key={item.id}><span className="archive-date">{item.date || '收藏夹'}</span><span className="archive-row-main"><span className="archive-category">{item.category}</span><strong>{item.title}</strong><span className="archive-excerpt">{item.note}</span><span className="inline-tags">{(item.tags || []).slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</span></span><span className="archive-row-arrow"><Icon name="arrow" size={17}/></span></a>) : <div className="empty-state">{listQuery || selectedListTag ? '没有找到符合条件的记录，调整搜索词或标签再试试。' : '这里还没有记录，之后有内容时再慢慢补上。'}</div>}</div>
          {pageCount > 1 && <nav className="pagination stitch-pagination" aria-label="列表分页"><a className={pageNumber <= 1 ? 'page-disabled' : ''} href={listHref(selectedListTag, Math.max(1, pageNumber - 1))}>‹ 上一页</a><div>{Array.from({ length: pageCount }, (_, index) => index + 1).map(page => <a className={page === pageNumber ? 'is-current' : ''} href={listHref(selectedListTag, page)} key={page}>{page}</a>)}</div><a className={pageNumber >= pageCount ? 'page-disabled' : ''} href={listHref(selectedListTag, Math.min(pageCount, pageNumber + 1))}>下一页 ›</a></nav>}
        </div>
        <aside className="archive-side"><section className="archive-side-panel"><span className="side-kicker">// COLLECTIONS</span><h2>专栏速览</h2>{sectionTagCounts.length ? sectionTagCounts.slice(0, 4).map(item => <a className="side-topic" href={listHref(item.tag, 1)} key={item.tag}><span>{item.tag}</span><b>{item.count}</b></a>) : <p>内容会按主题整理在这里。</p>}</section><section className="archive-side-panel"><span className="side-kicker">// TOP TAGS</span><h2>热门标签</h2><div className="side-tag-cloud">{sectionTagCounts.slice(0, 8).map(item => <a href={listHref(item.tag, 1)} key={item.tag}>#{item.tag}<small>{item.count}</small></a>)}</div></section><div className="archive-side-note"><span>INDEX ENGINE</span><strong>第 {pageNumber} / {pageCount} 页</strong><small>已按当前筛选条件整理</small></div></aside>
      </div>
    </main><footer className="archive-footer page-width">KairyQi 的空间 <span>个人记录 · 持续更新</span></footer>
  </div>
  if (view === 'detail' && detailItem) {
    const detailIndex = sortedEntries.findIndex(item => item.id === detailItem.id)
    const newer = sortedEntries[detailIndex - 1]
    const older = sortedEntries[detailIndex + 1]
    return <div className="archive-page stitch-detail-page" id="top">
      <ArchiveHeader homeUrl={homeUrl}/>
      <main className="detail-main stitch-detail-main page-width">
        <nav className="archive-breadcrumb" aria-label="面包屑"><a href={homeUrl}>首页</a><span>/</span><a href={routeForList(detailItem.section)}>{sectionNames[detailItem.section]}</a><span>/</span><span>正文</span></nav>
        <div className="detail-layout">
          <article className="stitch-article">
            <div className="article-taxonomy">{(detailItem.tags || []).slice(0, 4).map(tag => <a href={routeForTag(tag)} key={tag}>#{tag}</a>)}</div>
            <h1>{detailItem.title}</h1><p className="article-subtitle">{detailItem.note}</p>
            <div className="article-byline"><img src={profileAvatar} alt="KairyQi"/><div><strong>KairyQi</strong><span>{detailItem.category}</span></div><i/><span>{detailItem.date}</span><span>约 {articleReadMinutes} 分钟</span><span>{articleWordCount.toLocaleString()} 字</span></div>
            <div className="article-toolbar"><button type="button" onClick={copyArticleLink}><Icon name="link" size={15}/>{articleCopied ? '已复制链接' : '复制链接'}</button><div className="font-tools"><button type="button" aria-label="缩小字号" onClick={() => setArticleFontSize(size => Math.max(15, size - 1))}>A−</button><span>|</span><button type="button" aria-label="放大字号" onClick={() => setArticleFontSize(size => Math.min(23, size + 1))}>A＋</button></div><button type="button" onClick={async () => { try { if (navigator.share) await navigator.share({ title: detailItem.title, url: articleUrl }); else await copyArticleLink() } catch { /* Share dialog dismissed. */ } }}><Icon name="external" size={15}/>分享</button></div>
            <blockquote className="detail-lead"><span>“</span><p>{detailItem.note}</p></blockquote>
            <details className="mobile-article-toc"><summary>目录大纲 <span>{articleOutline.length} 节</span></summary><nav>{articleOutline.map((heading, index) => <a href={`#article-part-${index + 1}`} key={heading}>{String(index + 1).padStart(2, '0')}　{heading}</a>)}</nav></details>
            <div className="stitch-detail-body" style={{ '--article-font-size': `${articleFontSize}px` }}>{articleSections.map((section, index) => <section className="article-section" id={`article-part-${index + 1}`} key={section.heading}><h2><small>{String(index + 1).padStart(2, '0')}</small>{section.heading}</h2>{section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</section>)}</div>
            <div className="detail-tags"><span>{detailItem.category}</span>{(detailItem.tags || []).map(tag => <a href={routeForTag(tag)} key={tag}>{tag}</a>)}</div>
            <section className="article-author-card"><img src={profileAvatar} alt="KairyQi"/><div><span>ABOUT THE AUTHOR</span><strong>KairyQi</strong><small>记录技术探索、AI 实践、灵感收藏与日常生活。</small></div><a href="mailto:kairyqi@gmail.com"><Icon name="mail" size={15}/> 与我交流</a></section>
            <nav className="detail-pagination"><a href={newer ? routeForDetail(newer.id) : routeForList(detailItem.section)}><small>较新的记录</small><strong>{newer ? newer.title : '返回列表'}</strong></a><a href={older ? routeForDetail(older.id) : routeForList(detailItem.section)}><small>较早的记录</small><strong>{older ? older.title : '返回列表'}</strong></a></nav>
          </article>
          <aside className="article-rail"><section className="article-toc"><span className="side-kicker">// 目录大纲</span><div className="reading-progress"><span style={{ width: `${readingProgress}%` }}/></div><small>{readingProgress}% 已读</small><nav>{articleOutline.map((heading, index) => <a href={`#article-part-${index + 1}`} key={heading}><b>{String(index + 1).padStart(2, '0')}</b>{heading}</a>)}</nav><a className="back-to-top" href="#top">↑ 返回顶部</a></section><section className="article-rail-meta"><span>{articleWordCount.toLocaleString()} 字符</span><span>约 {articleReadMinutes} 分钟</span></section></aside>
        </div>
      </main><footer className="archive-footer page-width">KairyQi 的空间 <span>个人记录 · 持续更新</span></footer>
    </div>
  }
  if (view === 'search') return <div className="archive-page"><header className="archive-header page-width"><a className="wordmark" href={homeUrl}><span className="wordmark-icon"><Icon name="spark" size={16}/></span> KairyQi<span className="wordmark-dot">.</span></a><a className="archive-back" href={homeUrl}>返回空间首页 <Icon name="arrow" size={15}/></a></header><main className="archive-main search-main page-width"><div className="section-kicker">空间索引　/　全站搜索</div><h1>搜索记录</h1><p className="archive-description">按标题或正文查找技术笔记、收藏与生活记录。</p><form className="site-search-form" action={homeUrl} method="get"><input type="hidden" name="view" value="search"/><label className="sr-only" htmlFor="site-search">搜索标题和正文</label><input id="site-search" type="search" name="q" defaultValue={searchQuery} placeholder="输入关键词，例如：个人空间" autoFocus/><button type="submit"><Icon name="search" size={17}/> 搜索</button></form><div className="search-results-heading">{searchQuery ? `“${searchQuery}” 的搜索结果 · ${searchResults.length} 条` : '输入关键词开始搜索'}</div><div className="archive-list search-results">{searchQuery ? searchResults.length ? searchResults.map(item => <a className="archive-row" href={item.externalLink || routeForDetail(item.id)} target={item.externalLink ? '_blank' : undefined} rel={item.externalLink ? 'noreferrer' : undefined} key={`${item.section}-${item.id}`}><span className="archive-date">{item.date || '收藏夹'}</span><span className="archive-row-main"><span className="archive-category">{item.category}</span><strong>{item.title}</strong><span className="archive-excerpt">{item.note}</span></span><span className="archive-row-arrow"><Icon name={item.externalLink ? 'external' : 'arrow'} size={17}/></span></a>) : <div className="empty-state">没有找到匹配的记录，试试其他关键词。</div> : <div className="empty-state">搜索会同时匹配记录标题、分类、摘要和正文。</div>}</div></main><footer className="archive-footer page-width">KairyQi 的空间 <span>个人记录 · 持续更新</span></footer></div>
  if (view === 'tags') return <div className="archive-page"><header className="archive-header page-width"><a className="wordmark" href={homeUrl}><span className="wordmark-icon"><Icon name="spark" size={16}/></span> KairyQi<span className="wordmark-dot">.</span></a><a className="archive-back" href={homeUrl}>返回空间首页 <Icon name="arrow" size={15}/></a></header><main className="archive-main page-width tags-main"><div className="section-kicker">空间索引　/　标签浏览</div><h1>{selectedTag || '标签浏览'}</h1><p className="archive-description">{selectedTag ? '包含「' + selectedTag + '」标签的记录 · ' + tagEntries.length + ' 条' : '按主题浏览记录。一级分类帮助整理方向，具体标签用于跨板块关联。'}</p><div className="tag-groups">{tagGroups.map(group => <section className="tag-group" key={group.name}><h2>{group.name}</h2><div className="tag-cloud">{group.tags.map(tag => <a className={tag === selectedTag ? 'tag-chip is-active' : 'tag-chip'} href={routeForTag(tag)} key={tag}>{tag}<span>{searchableItems.filter(item => (item.tags || []).includes(tag)).length}</span></a>)}</div></section>)}</div>{selectedTag && <><div className="search-results-heading">相关记录</div><div className="archive-list">{tagEntries.length ? tagEntries.map(item => <a className="archive-row" href={item.externalLink || routeForDetail(item.id)} target={item.externalLink ? '_blank' : undefined} rel={item.externalLink ? 'noreferrer' : undefined} key={item.id}><span className="archive-date">{item.date || '收藏夹'}</span><span className="archive-row-main"><span className="archive-category">{item.category}</span><strong>{item.title}</strong><span className="archive-excerpt">{item.note}</span><span className="inline-tags">{(item.tags || []).map(tag => <span key={tag}>{tag}</span>)}</span></span><span className="archive-row-arrow"><Icon name={item.externalLink ? 'external' : 'arrow'} size={17}/></span></a>) : <div className="empty-state">这个标签下还没有记录。</div>}</div></>}</main><footer className="archive-footer page-width">KairyQi 的空间 <span>个人记录 · 持续更新</span></footer></div>
  return <>
    <header className="site-header page-width">
        <a className="wordmark" href="#home" onClick={closeMenu}><span className="wordmark-icon">KQ</span><span className="wordmark-lockup"><strong>KairyQi 的空间</strong><small>// tech notes &amp; logs</small></span></a>
        <a className="header-search" href="?view=search" aria-label="搜索空间"><Icon name="search" size={16}/><span>快速索引...</span><kbd>⌘K</kbd></a>
        <button className="menu-toggle" aria-label="切换版块导航" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span/><span/><b>版块</b></button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="主导航">
          <a href="#about" onClick={closeMenu}>关于空间</a><a href="#experience" onClick={closeMenu}>日志</a><a href="#notes" onClick={closeMenu}>技术笔记</a><a href="#moments" onClick={closeMenu}>生活随记</a><a href="#favorites" onClick={closeMenu}>收藏夹</a><a href="#projects" onClick={closeMenu}>项目</a><a href="#tags" onClick={closeMenu}>标签</a>
          <span className="header-status"><i/> ONLINE <b>⌖</b></span>
        </nav>
      </header>
    <div className="body-layout page-width" id="home">
    <aside className="profile-column">
    <section className="about-section section-pad" id="about"><div className="page-width">
      <div className="about-grid">
        <div className="portrait-card"><div className="portrait-avatar"><img src={profileAvatar} alt="KairyQi 的个人照片" /></div></div>
        <div className="about-copy"><div className="profile-name-row"><h3>KairyQi</h3><span className="mono-label"><i className="availability-dot"/> 空间主理人</span></div><span className="profile-title">// Developer, Creator &amp; Lifelong Explorer</span></div>
        <p className="about-description">记录技术探索、AI 实践、灵感收藏与日常生活碎片。保持纯粹与热爱，让每一个灵光闪烁的时刻都有迹可循。</p>
        <div className="current-focus"><span><Icon name="spark" size={13}/> CURRENT FOCUS</span><strong><small>正在探索：</small> LLM Agent &amp; Web 交互范式</strong></div>
        <div className="contact-chips"><button type="button" onClick={copyEmail} aria-label="复制邮箱"><Icon name="mail" size={15}/><span>kairyqi@gmail.com</span><small>{emailCopied ? '已复制!' : <Icon name="copy" size={13}/>}</small></button><a href="mailto:kairyqi@gmail.com">来信 <Icon name="arrow" size={14}/></a></div>
      </div>
    </div></section>
    <nav className="profile-index" aria-label="空间内容索引">
      <span className="profile-index-label">// 目录检索 <i>(INDEX)</i></span>
      <a href="#experience"><span>日志</span><span className="index-meta"><small>时间轴</small><b>{Math.min(3, sortedEntries.length).toString().padStart(2, '0')}</b></span></a>
      <a href="#notes"><span>技术笔记</span><span className="index-meta"><small>专栏</small><b>{noteEntries.length.toString().padStart(2, '0')}</b></span></a>
      <a href="#moments"><span>生活随记</span><span className="index-meta"><small>光影</small><b>{sortedEntries.filter(item => item.section === 'moments').length.toString().padStart(2, '0')}</b></span></a>
      <a href="#favorites"><span>收藏夹</span><span className="index-meta"><small>资源</small><b>{bookmarks.length.toString().padStart(2, '0')}</b></span></a>
      <a href="#projects"><span>待办项目</span><span className="index-meta"><small>进展</small><b>{sortedEntries.filter(item => item.section === 'projects').length.toString().padStart(2, '0')}</b></span></a>
      <a href="#tags"><span>标签云</span><span className="index-meta"><small>索引</small><b>{tagCounts.length.toString().padStart(2, '0')}</b></span></a>
      <div className="profile-social"><a href="https://github.com/kairyqi" target="_blank" rel="noreferrer"><Icon name="github" size={15}/> GitHub</a><a href="mailto:kairyqi@gmail.com"><Icon name="mail" size={15}/> 邮件联系</a></div>
    </nav>
    </aside>
    <div className="main-column">



    <section className="experience-section section-pad" id="experience"><div className="page-width"><div className="section-heading"><div><h2>日志</h2><p>3 篇更新</p></div><div className="heading-aside"><a className="text-link" href="?view=list&amp;section=journal&amp;page=1">查看全部归档 <Icon name="arrow" size={15}/></a></div></div><div className="timeline">{sortedEntries.slice(0, 3).map((entry, index) => <a className="timeline-item" href={routeForDetail(entry.id)} key={entry.date + entry.title}><div className="timeline-date">{entry.date}</div><div className="timeline-marker"><i/></div><div className="timeline-content"><div className="timeline-top"><div><span className={index === 0 ? 'role-tag' : 'role-tag muted-tag'}>{entry.category}</span><h3>{entry.title}</h3></div><span className="timeline-number">{String(index + 1).padStart(2, '0')}</span></div><p className="timeline-desc">{entry.note}</p></div></a>)}</div></div></section>

    <section className="notes-section section-pad" id="notes"><div className="page-width"><div className="section-heading"><div><h2>技术笔记</h2><p>深度专栏</p></div><div className="heading-aside"><a className="text-link" href="?view=list&amp;section=notes&amp;page=1">更多技术文章（{noteEntries.length}） <Icon name="arrow" size={15}/></a></div></div><div className="notes-grid">{noteEntries.length ? noteEntries.slice(0, 3).map((entry, index) => <a className={`note-card${index === 0 ? ' note-feature' : ''}`} href={`?view=detail&id=${entry.id}`} key={entry.id}><span className="note-type">{entry.category}</span><div className="note-card-copy"><h3>{entry.title}</h3><p>{entry.note}</p></div><div className="note-foot"><span>{entry.date}　/　个人记录</span><Icon name="arrow" size={17}/></div></a>) : <div className="empty-state">还没有技术笔记，之后有想法时再记下来。</div>}</div></div></section>

    <section className="moments-section section-pad" id="moments"><div className="page-width"><div className="section-heading"><div><h2>生活随记</h2><p>人文与日常</p></div><div className="heading-aside"><a className="text-link" href="?view=list&amp;section=moments&amp;page=1">更多随记 <Icon name="arrow" size={15}/></a></div></div><div className="moments-grid"><div className="empty-state">这里暂时空着，等下一段生活片段。</div></div></div></section>

    <section className="favorites-section section-pad" id="favorites"><div className="page-width"><div className="section-heading"><div><h2>收藏夹</h2><p>精选工具与网站</p></div><div className="heading-aside"><a className="text-link" href="?view=list&amp;section=favorites&amp;page=1">查看全部收藏（{bookmarks.length}） <Icon name="arrow" size={15}/></a></div></div><div className="favorites-grid">{bookmarks.map(item => <a className="favorite-card favorite-text-card" href={item.link} target="_blank" rel="noreferrer" key={item.title}><div className="favorite-info"><span className="favorite-symbol"><Icon name={item.icon || 'link'} size={18}/></span><div className="favorite-meta"><span>{item.type}</span><b>{item.label}</b></div><h3>{item.title}</h3><p>{item.note}</p><span className="favorite-domain">{new URL(item.link).hostname} <Icon name="external" size={12}/></span></div></a>)}</div></div></section>

    <section className="projects-section section-pad" id="projects"><div className="page-width"><div className="section-heading"><div><h2>待办项目</h2><p>研发进行时</p></div><div className="heading-aside"><a className="text-link" href="?view=list&amp;section=projects&amp;page=1">所有项目存档 <Icon name="arrow" size={15}/></a></div></div><div className="project-grid">{logEntries.filter(entry => entry.section === 'projects').length ? logEntries.filter(entry => entry.section === 'projects').map((entry, index) => <a className="project-card" href={routeForDetail(entry.id)} key={entry.id}><span className="note-type">{entry.category}</span><div className="project-card-copy"><h3>{entry.title}</h3><p>{entry.note}</p></div><div className="project-card-foot"><span>{entry.date}　/　待办研究</span><Icon name="arrow" size={17}/></div></a>) : <div className="empty-state">还没有项目记录，等有正在进行的尝试时再补充。</div>}</div></div></section>

    <section className="home-tags-section section-pad" id="tags"><div className="page-width"><div className="section-heading"><div><h2>标签云</h2><p>全站关键词 · {tagCounts.length} 个主要领域</p></div><div className="heading-aside"><a className="text-link" href="?view=tags">全览 <Icon name="arrow" size={15}/></a></div></div><div className="home-tag-cloud">{tagCounts.slice(0, 10).map(item => <a className="home-tag-chip" href={routeForTag(item.tag)} key={item.tag}><span>#{item.tag}</span><small>{item.count}</small></a>)}</div></div></section>

    </div></div>
    <section className="contact-section" id="contact"><div className="page-width contact-inner"><div className="closing-note"><span>terminal</span><strong>保持记录，观察日常。</strong><small>由 KairyQi 整理编写 · 持续演进中 · 用代码构建世界，用文字与光影捕捉真实</small></div><div className="closing-links"><a href="mailto:kairyqi@gmail.com"><Icon name="mail" size={14}/> kairyqi@gmail.com</a><a href="https://github.com/kairyqi" target="_blank" rel="noreferrer"><Icon name="github" size={14}/> GitHub</a></div><footer className="site-footer"><a className="wordmark" href="#home"><span className="wordmark-icon">KQ</span> KairyQi 的空间</a><span>© 2026 · KairyQi · 个人记录</span><a href="#home">回到顶部 ↑</a></footer></div></section>
    <nav className="mobile-dock" aria-label="移动端快捷导航"><a href="#home"><Icon name="home" size={18}/><span>首页</span></a><a href="#notes"><Icon name="notes" size={18}/><span>笔记</span></a><a href="#experience"><Icon name="journal" size={18}/><span>日志</span></a><a href="#projects"><Icon name="projects" size={18}/><span>项目</span></a><a href="#about"><Icon name="person" size={18}/><span>关于</span></a></nav>
  </>
}

const root = window.__personalSiteRoot || createRoot(document.getElementById('root'))
window.__personalSiteRoot = root
root.render(<React.StrictMode><App /></React.StrictMode>)
