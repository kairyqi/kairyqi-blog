import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const Icon = ({ name, size = 18 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    external: <><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
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

const logEntries = [
  { id: 'pinterest', section: 'favorites', date: '2026.10.17', category: '收藏夹 · 网站设计', title: 'Pinterest', note: '收集视觉灵感，也用来参考网站设计与页面布局。', body: ['Pinterest 是一个视觉内容发现与收藏平台。这里先记下它，作为网站设计、版式和视觉表达的灵感入口。'] },
  {
    id: 'personal-space-build', section: 'notes', date: '2026.10.17', category: '技术笔记 · 个人网站',
    title: '从一次个人空间搭建，整理我的设计与实现思路',
    note: '记录从内容定位、页面结构到 React、Vite 与 GitHub Pages 发布的完整过程。',
    body: [
      '这个空间最初从个人 Blog 的样式讨论开始。比起把页面做成简历或作品集，我更希望它像一个长期使用的个人记录本：技术笔记、收藏、项目、生活随记都能放进来，主要写给自己，也让偶然访问的人看得明白。',
      '视觉上经历了几轮调整。最初尝试了全屏 Hero 和较大的展示区块，后来发现它更像传统宣传页，不适合频繁阅读和更新。最终回到相对熟悉的头部导航与左右分栏：侧栏放个人信息，主栏承载日志、技术笔记、收藏、项目和生活随记。保留深色科技感的首页、微弱动效与蓝色强调，但让内容成为页面主体。',
      '内容结构也从静态首页扩展为可浏览的记录系统。首页每个板块只展示少量最新内容，“更多”进入列表页，条目还能打开详情页。这样首页保持轻量，记录积累后也有明确的归档和阅读路径。',
      '实现采用 React 与 Vite，页面针对桌面和手机分别调整布局。内容暂时由前端数据维护，适合当前的静态个人空间；之后新增内容时，按对应分类添加条目即可同步出现在首页、列表和详情中。',
      '发布使用 GitHub 仓库和 GitHub Pages，通过 GitHub Actions 构建并部署。过程中遇到一个典型路径问题：头像使用根路径时，本地运行正常，但仓库站点部署在子目录下会请求错误地址。改为引用 Vite 的 BASE_URL 后，本地和 Pages 都能使用正确的资源路径。',
      '图片适合压缩后随站点发布；视频文件较大，不适合持续塞进 Git 历史，后续更适合放到视频平台或对象存储，再嵌入链接。整体经验是先让内容组织方式稳定，再逐步丰富视觉和媒体，不需要一开始就把所有功能做复杂。',
    ],
  },
]

const bookmarks = [
  { category: '网站设计', type: '视觉灵感', title: 'Pinterest', note: '收集视觉灵感，参考网站设计与页面布局。', icon: 'spark', label: '网站设计', link: 'https://jp.pinterest.com/' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const params = new URLSearchParams(window.location.search)
  const view = params.get('view')
  const searchQuery = (params.get('q') || '').trim()
  const pageSection = params.get('section') || 'journal'
  const pageNumber = Math.max(1, Number(params.get('page')) || 1)
  const sectionNames = { journal: '日志', notes: '技术笔记', moments: '生活随记', favorites: '收藏夹', projects: '项目' }
  const pageSize = 6
  const sectionItems = pageSection === 'journal' ? logEntries : logEntries.filter(item => item.section === pageSection)
  const noteEntries = logEntries.filter(item => item.section === 'notes')
  const searchableItems = [
    ...logEntries,
    ...bookmarks.filter(bookmark => !logEntries.some(entry => entry.section === 'favorites' && entry.title === bookmark.title)).map(bookmark => ({
      id: `favorite-${bookmark.title}`, section: 'favorites', date: '', category: bookmark.label,
      title: bookmark.title, note: bookmark.note, body: [bookmark.note], externalLink: bookmark.link,
    })),
  ]
  const searchResults = searchQuery
    ? searchableItems.filter(item => [item.title, item.category, item.note, ...item.body].join(' ').toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))
    : []
  const pageCount = Math.max(1, Math.ceil(sectionItems.length / pageSize))
  const pageItems = sectionItems.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  const detailItem = view === 'detail' ? logEntries.find(item => item.id === params.get('id')) : null
  const routeForList = (section, page = 1) => '?view=list&section=' + section + '&page=' + page
  const routeForDetail = id => '?view=detail&id=' + id
  const homeUrl = import.meta.env.BASE_URL
  if (view === 'search') return <div className="archive-page"><header className="archive-header page-width"><a className="wordmark" href={homeUrl}><span className="wordmark-icon"><Icon name="spark" size={16}/></span> KairyQi<span className="wordmark-dot">.</span></a><a className="archive-back" href={homeUrl}>返回空间首页 <Icon name="arrow" size={15}/></a></header><main className="archive-main search-main page-width"><div className="section-kicker">空间索引　/　全站搜索</div><h1>搜索记录</h1><p className="archive-description">按标题或正文查找技术笔记、收藏与生活记录。</p><form className="site-search-form" action={homeUrl} method="get"><input type="hidden" name="view" value="search"/><label className="sr-only" htmlFor="site-search">搜索标题和正文</label><input id="site-search" type="search" name="q" defaultValue={searchQuery} placeholder="输入关键词，例如：个人空间" autoFocus/><button type="submit"><Icon name="search" size={17}/> 搜索</button></form><div className="search-results-heading">{searchQuery ? `“${searchQuery}” 的搜索结果 · ${searchResults.length} 条` : '输入关键词开始搜索'}</div><div className="archive-list search-results">{searchQuery ? searchResults.length ? searchResults.map(item => <a className="archive-row" href={item.externalLink || routeForDetail(item.id)} target={item.externalLink ? '_blank' : undefined} rel={item.externalLink ? 'noreferrer' : undefined} key={`${item.section}-${item.id}`}><span className="archive-date">{item.date || '收藏夹'}</span><span className="archive-row-main"><span className="archive-category">{item.category}</span><strong>{item.title}</strong><span className="archive-excerpt">{item.note}</span></span><span className="archive-row-arrow"><Icon name={item.externalLink ? 'external' : 'arrow'} size={17}/></span></a>) : <div className="empty-state">没有找到匹配的记录，试试其他关键词。</div> : <div className="empty-state">搜索会同时匹配记录标题、分类、摘要和正文。</div>}</div></main><footer className="archive-footer page-width">KairyQi 的空间 <span>个人记录 · 持续更新</span></footer></div>
  if (view === 'list') return <div className="archive-page"><header className="archive-header page-width"><a className="wordmark" href={homeUrl}><span className="wordmark-icon"><Icon name="spark" size={16}/></span> KairyQi<span className="wordmark-dot">.</span></a><a className="archive-back" href={homeUrl}>返回空间首页 <Icon name="arrow" size={15}/></a></header><main className="archive-main page-width"><div className="section-kicker">内容归档　/　{sectionNames[pageSection] || '日志'}</div><h1>{sectionNames[pageSection] || '日志'}</h1><p className="archive-description">{pageSection === 'journal' ? '按时间整理空间里的技术笔记、收藏、项目与生活片段。' : '关于「' + (sectionNames[pageSection] || '日志') + '」的记录与整理。'}</p><div className="archive-list">{pageItems.length ? pageItems.map(item => <a className="archive-row" href={routeForDetail(item.id)} key={item.id}><span className="archive-date">{item.date}</span><span className="archive-row-main"><span className="archive-category">{item.category}</span><strong>{item.title}</strong><span className="archive-excerpt">{item.note}</span></span><span className="archive-row-arrow"><Icon name="arrow" size={17}/></span></a>) : <div className="empty-state">这里还没有记录，之后有内容时再慢慢补上。</div>}</div><nav className="pagination" aria-label="列表分页"><a className={pageNumber <= 1 ? 'page-disabled' : ''} href={routeForList(pageSection, Math.max(1, pageNumber - 1))}>上一页</a><span>第 {pageNumber} / {pageCount} 页</span><a className={pageNumber >= pageCount ? 'page-disabled' : ''} href={routeForList(pageSection, Math.min(pageCount, pageNumber + 1))}>下一页</a></nav></main><footer className="archive-footer page-width">KairyQi 的空间 <span>个人记录 · 持续更新</span></footer></div>
  if (view === 'detail' && detailItem) { const detailIndex = logEntries.findIndex(item => item.id === detailItem.id); const newer = logEntries[detailIndex - 1]; const older = logEntries[detailIndex + 1]; return <div className="archive-page"><header className="archive-header page-width"><a className="wordmark" href={homeUrl}><span className="wordmark-icon"><Icon name="spark" size={16}/></span> KairyQi<span className="wordmark-dot">.</span></a><a className="archive-back" href={routeForList(detailItem.section)}>返回{sectionNames[detailItem.section]} <Icon name="arrow" size={15}/></a></header><main className="detail-main page-width"><div className="detail-cover"><span className="section-kicker">{detailItem.category}</span><span className="detail-cover-mark">{detailItem.section === 'moments' ? '记' : detailItem.section === 'favorites' ? '藏' : detailItem.section === 'projects' ? '项' : '札'}</span></div><article className="detail-article"><div className="detail-meta"><span>{detailItem.date}</span><span>·</span><span>{sectionNames[detailItem.section]}</span></div><h1>{detailItem.title}</h1><p className="detail-lead">{detailItem.note}</p><div className="detail-body">{detailItem.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="detail-tags"><span>{detailItem.category}</span><span>KairyQi 的空间</span></div></article><nav className="detail-pagination"><a href={newer ? routeForDetail(newer.id) : routeForList(detailItem.section)}><small>较新的记录</small><strong>{newer ? newer.title : '返回列表'}</strong></a><a href={older ? routeForDetail(older.id) : routeForList(detailItem.section)}><small>较早的记录</small><strong>{older ? older.title : '返回列表'}</strong></a></nav></main></div> }
  return <>
    <section className="hero" id="home">
      <video className="hero-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
        <source src="https://videos.pexels.com/video-files/14209120/14209120-hd_1920_1080_30fps.mp4" type="video/mp4" />
      </video>
      <MotionField />
      <div className="hero-glow" />
      <header className="site-header page-width">
        <a className="wordmark" href="#home" onClick={closeMenu}><span className="wordmark-icon"><Icon name="spark" size={16} /></span> KairyQi<span className="wordmark-dot">.</span><small>个人空间</small></a>
        <button className="menu-toggle" aria-label="切换导航" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="主导航">
          <a href="#about" onClick={closeMenu}>关于空间</a><a href="#experience" onClick={closeMenu}>日志</a><a href="#notes" onClick={closeMenu}>技术笔记</a><a href="#favorites" onClick={closeMenu}>收藏夹</a><a href="#projects" onClick={closeMenu}>项目</a><a href="#moments" onClick={closeMenu}>生活随记</a><a className="nav-search" href="?view=search" onClick={closeMenu}><Icon name="search" size={15}/> 搜索</a>
          <a className="nav-contact" href="#contact" onClick={closeMenu}>联系方式 <Icon name="arrow" size={15} /></a>
        </nav>
      </header>
      <div className="hero-content page-width">
        <div className="hero-copy">
          <div className="availability"><span className="availability-dot" /> 个人记录 · 持续更新</div>
          <p className="hero-overline">KairyQi <span>／</span> 个人记录</p>
          <h1>把感兴趣的事，<br /><span>慢慢记下来</span><b className="hero-cursor">_</b></h1>
          <p className="hero-intro">技术、影像与生活的片段，慢慢整理成自己的记录。</p>
          <div className="hero-actions"><a href="#projects" className="button button-primary">项目记录 <Icon name="arrow" size={16} /></a><a href="#about" className="button button-quiet">关于这个空间 <span className="play-icon"><Icon name="play" size={13} /></span></a></div>
        </div>
        <div className="hero-aside"><div className="hero-coordinate">最近在看<br />AI · 软件 · 影像</div><div className="hero-orbit"><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/><div className="orbit-core"><Icon name="code" size={34}/></div><i className="orbit-dot dot-a"/><i className="orbit-dot dot-b"/><i className="orbit-dot dot-c"/></div><div className="hero-side-note"><span className="mono-label">记录范围</span><strong>技术 × 影像 × 生活</strong><span>随手收集，慢慢整理</span></div></div>
      </div>
      <div className="hero-bottom page-width"><span><span className="scroll-line"/> 继续往下看</span><span className="hero-index">KairyQi 的空间　/　2026</span></div>
    </section>

    <div className="body-layout page-width">
    <aside className="profile-column">
    <section className="about-section section-pad" id="about"><div className="page-width">
      <div className="section-heading"><div><h2><em>01　/</em>　关于空间</h2></div><p>技术、影像和生活，都可以慢慢记录。</p></div>
      <div className="about-grid">
        <div className="portrait-card"><div className="portrait-avatar"><img src={`${import.meta.env.BASE_URL}kairyqi-profile.png`} alt="KairyQi 的个人照片" /></div></div>
        <div className="about-copy"><span className="mono-label">空间说明</span><h3>技术、影像与生活，<br /><span>慢慢记下来</span>。</h3><p>这里收录技术实践、喜欢的网站与账号、正在做的项目，也留给路上的风景和随时冒出的想法。主要写给自己，偶尔整理旧记录。</p><div className="contact-chips"><a href="mailto:kairyqi@gmail.com"><Icon name="mail" size={15}/> kairyqi@gmail.com</a><span><Icon name="pin" size={15}/> 随手记录 · 慢慢整理</span></div><a href="#experience" className="text-link">查看日志 <Icon name="arrow" size={15}/></a></div>
        <div className="about-stats"><div className="stat"><strong>AI × 软件</strong><small>开发与实践</small></div><div className="stat"><strong>影像</strong><small>短视频与旅拍</small></div><div className="stat status-stat"><span className="availability-dot"/><small>持续更新</small><strong>生活与随想</strong></div></div>
      </div>
    </div></section>
    </aside>
    <div className="main-column">

    <section className="experience-section section-pad" id="experience"><div className="page-width"><div className="section-heading"><div><h2><em>02　/</em>　日志</h2></div><div className="heading-aside"><p>空间里的新内容，按时间汇集。</p><a className="text-link" href="?view=list&amp;section=journal&amp;page=1">更多 <Icon name="arrow" size={15}/></a></div></div><div className="timeline">{logEntries.slice(0, 3).map((entry, index) => <a className="timeline-item" href={routeForDetail(entry.id)} key={entry.date + entry.title}><div className="timeline-date">{entry.date}</div><div className="timeline-marker"><i/></div><div className="timeline-content"><div className="timeline-top"><div><span className={index === 0 ? 'role-tag' : 'role-tag muted-tag'}>{entry.category}</span><h3>{entry.title}</h3></div><span className="timeline-number">{String(index + 1).padStart(2, '0')}</span></div><p className="timeline-desc">{entry.note}</p></div></a>)}</div></div></section>

    <section className="notes-section section-pad" id="notes"><div className="page-width"><div className="section-heading"><div><h2><em>03　/</em>　技术笔记</h2></div><div className="heading-aside"><p>技术实践与思路，随手记下。</p><a className="text-link" href="?view=list&amp;section=notes&amp;page=1">更多 <Icon name="arrow" size={15}/></a></div></div><div className="notes-grid">{noteEntries.length ? noteEntries.slice(0, 3).map((entry, index) => <a className={`note-card${index === 0 ? ' note-feature' : ''}`} href={`?view=detail&id=${entry.id}`} key={entry.id}><span className="note-type">{entry.category}</span><div className="note-card-copy"><h3>{entry.title}</h3><p>{entry.note}</p></div><div className="note-foot"><span>{entry.date}　/　个人记录</span><Icon name="arrow" size={17}/></div></a>) : <div className="empty-state">还没有技术笔记，之后有想法时再记下来。</div>}</div></div></section>

    <section className="moments-section section-pad" id="moments"><div className="page-width"><div className="section-heading"><div><h2><em>04　/</em>　生活随记</h2></div><div className="heading-aside"><p>生活里的灵感，也值得记录。</p><a className="text-link" href="?view=list&amp;section=moments&amp;page=1">更多 <Icon name="arrow" size={15}/></a></div></div><div className="moments-grid"><div className="empty-state">这里暂时空着，等下一段生活片段。</div></div></div></section>

    <section className="favorites-section section-pad" id="favorites"><div className="page-width"><div className="section-heading"><div><h2><em>05　/</em>　收藏夹</h2></div><div className="heading-aside"><p>遇见的内容，先放在这里。</p><a className="text-link" href="?view=list&amp;section=favorites&amp;page=1">更多 <Icon name="arrow" size={15}/></a></div></div><div className="favorites-grid">{bookmarks.map(item => <a className={`favorite-card${item.image ? ' has-image' : ''}`} href={item.link} target="_blank" rel="noreferrer" key={item.title}>{item.image && <div className="favorite-visual"><img src={item.image} alt=""/><span className="favorite-open"><Icon name="external" size={15}/></span></div>}<div className="favorite-info"><div className="favorite-meta"><span>{item.type}</span><b>{item.label}</b></div><h3>{item.title}</h3><p>{item.note}</p></div></a>)}</div></div></section>

    <section className="projects-section section-pad" id="projects"><div className="page-width"><div className="section-heading"><div><h2><em>06　/</em>　正在进行</h2></div><div className="heading-aside"><p>项目与尝试，阶段记录。</p><a className="text-link" href="?view=list&amp;section=projects&amp;page=1">更多 <Icon name="arrow" size={15}/></a></div></div><div className="project-grid"><div className="empty-state">还没有项目记录，等有正在进行的尝试时再补充。</div></div></div></section>

    </div></div>
    <section className="contact-section" id="contact"><div className="contact-grid-bg"/><div className="page-width contact-inner"><div className="contact-kicker"><span className="availability-dot"/> 联系方式</div><h2>如果需要联系，<br /><em>邮箱在这里。</em></h2><p>常用的联系入口，放在这里备忘。</p><a className="contact-cta" href="mailto:kairyqi@gmail.com">kairyqi@gmail.com <span><Icon name="arrow" size={19}/></span></a><div className="social-links"><a href="https://github.com/kairyqi" target="_blank" rel="noreferrer"><Icon name="github" size={16}/> GitHub</a></div><footer className="site-footer"><a className="wordmark" href="#home"><span className="wordmark-icon"><Icon name="code" size={14}/></span> KairyQi<span className="wordmark-dot">.</span></a><span>© 2026 · KairyQi 的空间 · 记录所爱，保持好奇。</span><a href="#home">回到顶部 ↑</a></footer></div></section>
  </>
}

const root = window.__personalSiteRoot || createRoot(document.getElementById('root'))
window.__personalSiteRoot = root
root.render(<React.StrictMode><App /></React.StrictMode>)
