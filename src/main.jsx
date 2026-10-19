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
  { name: '技术与开发', tags: ['React', '前端开发', '服务器', '网络工具', '部署运维', '教程'] },
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
    tags: ['React', '前端开发', '网页设计', '部署运维', '教程'],
    body: [
      '这个空间最初从个人 Blog 的样式讨论开始。比起把页面做成简历或作品集，我更希望它像一个长期使用的个人记录本：技术笔记、收藏、项目、生活随记都能放进来，主要写给自己，也让偶然访问的人看得明白。',
      '视觉上经历了几轮调整。最初尝试了全屏 Hero 和较大的展示区块，后来发现它更像传统宣传页，不适合频繁阅读和更新。最终回到相对熟悉的头部导航与左右分栏：侧栏放个人信息，主栏承载日志、技术笔记、收藏、项目和生活随记。保留深色科技感的首页、微弱动效与蓝色强调，但让内容成为页面主体。',
      '内容结构也从静态首页扩展为可浏览的记录系统。首页每个板块只展示少量最新内容，“更多”进入列表页，条目还能打开详情页。这样首页保持轻量，记录积累后也有明确的归档和阅读路径。',
      '实现采用 React 与 Vite，页面针对桌面和手机分别调整布局。内容暂时由前端数据维护，适合当前的静态个人空间；之后新增内容时，按对应分类添加条目即可同步出现在首页、列表和详情中。',
      '发布使用 GitHub 仓库和 GitHub Pages，通过 GitHub Actions 构建并部署。过程中遇到一个典型路径问题：头像使用根路径时，本地运行正常，但仓库站点部署在子目录下会请求错误地址。改为引用 Vite 的 BASE_URL 后，本地和 Pages 都能使用正确的资源路径。',
      '图片适合压缩后随站点发布；视频文件较大，不适合持续塞进 Git 历史，后续更适合放到视频平台或对象存储，再嵌入链接。整体经验是先让内容组织方式稳定，再逐步丰富视觉和媒体，不需要一开始就把所有功能做复杂。',
      '后续围绕首页层级又做了几轮细化：板块标题统一为“编号 / 名称”，标题用 h2 呈现，右侧只保留一句简短说明；主栏标题字号收至 24px，标题栏不再底部对齐。收藏卡片作为字号参照，日志、技术笔记、随记和项目卡片的标题、正文与辅助文字也一并放大，并为手机端单独设定易读字号。',
      '导航固定在视口顶部并铺满页面宽度，内部内容仍与约 1700px 的版心对齐。为避免滚动时被 Hero 或卡片层级遮挡，导航移到 Hero 外并提高层级；头像侧栏的 sticky 顶部间距调整到 112px，给固定导航留出空间。导航移出 Hero 后，wordmark 也需要显式设为浅色，避免继承页面默认的深色文字。',
      '这次新增标签系统时也记录了一次 GitHub 授权排障：最初 ChatGPT 中的 GitHub 连接可以读取仓库，但创建分支和写入文件返回 403 Resource not accessible by integration。GitHub Settings 的 Applications 页面里，Authorized GitHub Apps 能看到 ChatGPT Codex Connector，但 Installed GitHub Apps 为空；这两个入口不是一回事。随后重新打开 ChatGPT Codex Connector 的 Install & Authorize 页面，选择 All repositories，并确认授权页列出的 actions、code、issues、pull requests 与 workflows 读写权限后点击 Install & Authorize，页面随即跳回 ChatGPT。之后才能成功创建分支、提交修改、创建并合并 PR。排障时应区分 ChatGPT 内部的操作许可与 GitHub 端实际授予集成的权限；遇到 403 时检查连接对应的授权和仓库范围，不要误以为仓库本身没有写入权限。最终 GitHub Actions 的 Build website 和 Publish website 均成功，标签系统已发布到 GitHub Pages。',
      '关于空间头像加载排障（2026-10-19）：将成熟版赛博风方形头像加入仓库根目录 `kairyqi-profile.jpg`，并在关于空间中通过 `${import.meta.env.BASE_URL}kairyqi-profile.jpg` 引用。首次更新后，GitHub Actions 的构建与发布均显示成功，但用户实际打开网站时头像仍未加载，说明“部署流程成功”并不等于资源在页面上一定能正确显示。复查代码后，将图片引用改为 `import profileAvatar from "../kairyqi-profile.jpg"`，由 Vite 在构建时处理静态资源并生成对应 URL；修改合并后，用户确认网站图片已正常更新。经验：遇到图片加载失败，不能只看 Actions 成功状态；应同时核对资源是否进入构建产物、引用路径是否适配 GitHub Pages 子路径，并以线上实际页面结果验证。',
      '后续更新指引：网站仓库为 https://github.com/kairyqi/kairyqi-blog，使用 React 与 Vite，发布到 GitHub Pages（https://kairyqi.github.io/kairyqi-blog/）。新增内容时先确定板块，并整理标题、日期、分类、摘要、正文及相关链接或媒体；保持桌面与手机布局、列表/详情/搜索和 Pages 子路径资源引用正常。修改后先完成构建检查，再提交并推送 main 发布，只提交本次相关内容，不带入临时附件或无关文件；最后说明改动和发布结果。',
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
]

const bookmarks = [
  { category: '网络工具', type: 'VPN · 代理服务', title: 'Bigmeok', note: '目前正在使用的 VPN / 代理服务入口，方便之后快速访问。', tags: ['网络工具', '效率工具', '实用网站'], icon: 'link', label: '网络工具', link: 'https://pub.bigmeok.me/', image: 'https://image.thum.io/get/width/1200/crop/800/https://pub.bigmeok.me/' },
  { category: 'AI 建站 · 设计灵感', type: 'Vibe Coding', title: 'MotionSites', note: '收藏用于探索高质感网站设计、动态效果与页面灵感的资源，后续研究如何将合适的设计应用到个人空间。', tags: ['AI工具', '提示词', '网页设计', '实用网站', '视觉灵感', '待研究'], icon: 'spark', label: 'AI 建站', link: 'https://motionsites.org/', image: 'https://image.thum.io/get/width/1200/crop/800/https://motionsites.org/' },
  { category: '网站设计', type: '视觉灵感', title: 'Pinterest', note: '收集视觉灵感，参考网站设计与页面布局。', tags: ['视觉灵感', '网页设计', '实用网站'], icon: 'spark', label: '网站设计', link: 'https://jp.pinterest.com/', image: 'https://image.thum.io/get/width/1200/crop/800/https://jp.pinterest.com/' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
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
  const sectionItems = (pageSection === 'journal' ? sortedEntries : sortedEntries.filter(item => item.section === pageSection))
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
  const pageCount = Math.max(1, Math.ceil(sectionItems.length / pageSize))
  const pageItems = sectionItems.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  const detailItem = view === 'detail' ? logEntries.find(item => item.id === params.get('id')) : null
  const routeForList = (section, page = 1) => '?view=list&section=' + section + '&page=' + page
  const routeForDetail = id => '?view=detail&id=' + id
  const routeForTag = tag => '?view=tags&tag=' + encodeURIComponent(tag)
  const selectedTag = params.get('tag') || ''
  const tagEntries = selectedTag ? searchableItems.filter(item => (item.tags || []).includes(selectedTag)) : []
  const tagCounts = allTags.map(tag => ({ tag, count: searchableItems.filter(item => (item.tags || []).includes(tag)).length })).filter(item => item.count > 0).sort((a, b) => b.count - a.count || allTags.indexOf(a.tag) - allTags.indexOf(b.tag))
  const homeUrl = import.meta.env.BASE_URL
  if (view === 'search') return <div className="archive-page"><header className="archive-header page-width"><a className="wordmark" href={homeUrl}><span className="wordmark-icon"><Icon name="spark" size={16}/></span> KairyQi<span className="wordmark-dot">.</span></a><a className="archive-back" href={homeUrl}>返回空间首页 <Icon name="arrow" size={15}/></a></header><main className="archive-main search-main page-width"><div className="section-kicker">空间索引　/　全站搜索</div><h1>搜索记录</h1><p className="archive-description">按标题或正文查找技术笔记、收藏与生活记录。</p><form className="site-search-form" action={homeUrl} method="get"><input type="hidden" name="view" value="search"/><label className="sr-only" htmlFor="site-search">搜索标题和正文</label><input id="site-search" type="search" name="q" defaultValue={searchQuery} placeholder="输入关键词，例如：个人空间" autoFocus/><button type="submit"><Icon name="search" size={17}/> 搜索</button></form><div className="search-results-heading">{searchQuery ? `“${searchQuery}” 的搜索结果 · ${searchResults.length} 条` : '输入关键词开始搜索'}</div><div className="archive-list search-results">{searchQuery ? searchResults.length ? searchResults.map(item => <a className="archive-row" href={item.externalLink || routeForDetail(item.id)} target={item.externalLink ? '_blank' : undefined} rel={item.externalLink ? 'noreferrer' : undefined} key={`${item.section}-${item.id}`}><span className="archive-date">{item.date || '收藏夹'}</span><span className="archive-row-main"><span className="archive-category">{item.category}</span><strong>{item.title}</strong><span className="archive-excerpt">{item.note}</span></span><span className="archive-row-arrow"><Icon name={item.externalLink ? 'external' : 'arrow'} size={17}/></span></a>) : <div className="empty-state">没有找到匹配的记录，试试其他关键词。</div> : <div className="empty-state">搜索会同时匹配记录标题、分类、摘要和正文。</div>}</div></main><footer className="archive-footer page-width">KairyQi 的空间 <span>个人记录 · 持续更新</span></footer></div>
  if (view === 'list') return <div className="archive-page"><header className="archive-header page-width"><a className="wordmark" href={homeUrl}><span className="wordmark-icon"><Icon name="spark" size={16}/></span> KairyQi<span className="wordmark-dot">.</span></a><a className="archive-back" href={homeUrl}>返回空间首页 <Icon name="arrow" size={15}/></a></header><main className="archive-main page-width"><div className="section-kicker">内容归档　/　{sectionNames[pageSection] || '日志'}</div><h1>{sectionNames[pageSection] || '日志'}</h1><p className="archive-description">{pageSection === 'journal' ? '按时间整理空间里的技术笔记、收藏、项目与生活片段。' : '关于「' + (sectionNames[pageSection] || '日志') + '」的记录与整理。'}</p><div className="archive-list">{pageItems.length ? pageItems.map(item => <a className="archive-row" href={routeForDetail(item.id)} key={item.id}><span className="archive-date">{item.date}</span><span className="archive-row-main"><span className="archive-category">{item.category}</span><strong>{item.title}</strong><span className="archive-excerpt">{item.note}</span></span><span className="archive-row-arrow"><Icon name="arrow" size={17}/></span></a>) : <div className="empty-state">这里还没有记录，之后有内容时再慢慢补上。</div>}</div><nav className="pagination" aria-label="列表分页"><a className={pageNumber <= 1 ? 'page-disabled' : ''} href={routeForList(pageSection, Math.max(1, pageNumber - 1))}>上一页</a><span>第 {pageNumber} / {pageCount} 页</span><a className={pageNumber >= pageCount ? 'page-disabled' : ''} href={routeForList(pageSection, Math.min(pageCount, pageNumber + 1))}>下一页</a></nav></main><footer className="archive-footer page-width">KairyQi 的空间 <span>个人记录 · 持续更新</span></footer></div>
  if (view === 'tags') return <div className="archive-page"><header className="archive-header page-width"><a className="wordmark" href={homeUrl}><span className="wordmark-icon"><Icon name="spark" size={16}/></span> KairyQi<span className="wordmark-dot">.</span></a><a className="archive-back" href={homeUrl}>返回空间首页 <Icon name="arrow" size={15}/></a></header><main className="archive-main page-width tags-main"><div className="section-kicker">空间索引　/　标签浏览</div><h1>{selectedTag || '标签浏览'}</h1><p className="archive-description">{selectedTag ? '包含「' + selectedTag + '」标签的记录 · ' + tagEntries.length + ' 条' : '按主题浏览记录。一级分类帮助整理方向，具体标签用于跨板块关联。'}</p><div className="tag-groups">{tagGroups.map(group => <section className="tag-group" key={group.name}><h2>{group.name}</h2><div className="tag-cloud">{group.tags.map(tag => <a className={tag === selectedTag ? 'tag-chip is-active' : 'tag-chip'} href={routeForTag(tag)} key={tag}>{tag}<span>{searchableItems.filter(item => (item.tags || []).includes(tag)).length}</span></a>)}</div></section>)}</div>{selectedTag && <><div className="search-results-heading">相关记录</div><div className="archive-list">{tagEntries.length ? tagEntries.map(item => <a className="archive-row" href={item.externalLink || routeForDetail(item.id)} target={item.externalLink ? '_blank' : undefined} rel={item.externalLink ? 'noreferrer' : undefined} key={item.id}><span className="archive-date">{item.date || '收藏夹'}</span><span className="archive-row-main"><span className="archive-category">{item.category}</span><strong>{item.title}</strong><span className="archive-excerpt">{item.note}</span><span className="inline-tags">{(item.tags || []).map(tag => <span key={tag}>{tag}</span>)}</span></span><span className="archive-row-arrow"><Icon name={item.externalLink ? 'external' : 'arrow'} size={17}/></span></a>) : <div className="empty-state">这个标签下还没有记录。</div>}</div></>}</main><footer className="archive-footer page-width">KairyQi 的空间 <span>个人记录 · 持续更新</span></footer></div>
  if (view === 'detail' && detailItem) { const detailIndex = sortedEntries.findIndex(item => item.id === detailItem.id); const newer = sortedEntries[detailIndex - 1]; const older = sortedEntries[detailIndex + 1]; return <div className="archive-page"><header className="archive-header page-width"><a className="wordmark" href={homeUrl}><span className="wordmark-icon"><Icon name="spark" size={16}/></span> KairyQi<span className="wordmark-dot">.</span></a><a className="archive-back" href={routeForList(detailItem.section)}>返回{sectionNames[detailItem.section]} <Icon name="arrow" size={15}/></a></header><main className="detail-main page-width"><div className="detail-cover"><span className="section-kicker">{detailItem.category}</span><span className="detail-cover-mark">{detailItem.section === 'moments' ? '记' : detailItem.section === 'favorites' ? '藏' : detailItem.section === 'projects' ? '项' : '札'}</span></div><article className="detail-article"><div className="detail-meta"><span>{detailItem.date}</span><span>·</span><span>{sectionNames[detailItem.section]}</span></div><h1>{detailItem.title}</h1><p className="detail-lead">{detailItem.note}</p><div className="detail-body">{detailItem.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="detail-tags"><span>{detailItem.category}</span>{(detailItem.tags || []).map(tag => <a href={routeForTag(tag)} key={tag}>{tag}</a>)}<span>KairyQi 的空间</span></div></article><nav className="detail-pagination"><a href={newer ? routeForDetail(newer.id) : routeForList(detailItem.section)}><small>较新的记录</small><strong>{newer ? newer.title : '返回列表'}</strong></a><a href={older ? routeForDetail(older.id) : routeForList(detailItem.section)}><small>较早的记录</small><strong>{older ? older.title : '返回列表'}</strong></a></nav></main></div> }
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
