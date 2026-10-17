import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const Icon = ({ name, size = 18 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    external: <><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></>,
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

const bookmarks = [
  { category: '网站与工具', type: '网站 / 工具', title: 'MDN Web Docs', note: 'Web 技术参考手册', icon: 'code', label: '网站', link: 'https://developer.mozilla.org/' },
  { category: '社交媒体', type: '代码社区', title: 'GitHub 账号', note: '开源项目与代码动态', icon: 'github', label: 'GitHub', link: 'https://github.com/' },
  { category: '社交媒体', type: '视频 / 社交', title: '抖音账号', note: '短视频与日常记录', icon: 'video', label: '抖音', link: 'https://www.douyin.com/' },
  { category: '文章与灵感', type: '文章 / 灵感', title: '设计工程手记', note: '界面、交互与工程实践', icon: 'book', label: '文章', link: '#' },
]

const logEntries = [
  { id: 'travel-street', section: 'moments', date: '2026.10.16', category: '生活随记 · 旅拍', title: '把相机带上，去没走过的街区', note: '不设目的地地走一走，常常比计划好的路线更容易遇见惊喜。', body: ['一次没有预设路线的城市漫游。把相机带在身边，沿途的光线、街角和偶遇都成为这次记录的一部分。'] },
  { id: 'ai-dev', section: 'notes', date: '2026.10.12', category: '技术笔记 · AI 开发', title: '用 AI 辅助开发：从需求拆解到代码验证', note: '记录 AI 参与需求梳理、方案比较与代码验证的过程。', body: ['把 AI 放进开发流程里，先从需求梳理和方案比较开始，再回到代码与验证。它适合协助探索，但关键判断仍要结合实际场景完成。'] },
  { id: 'mdn', section: 'favorites', date: '2026.10.10', category: '收藏夹 · 网站', title: 'MDN Web Docs', note: 'Web 技术参考手册，留作查阅。', body: ['Web API、HTML、CSS 与 JavaScript 的常用参考资料入口。'] },
  { id: 'daily-time', section: 'moments', date: '2026.10.08', category: '生活随记 · 日常', title: '给自己留一点不被安排的时间', note: '读几页书、剪一段视频，或者什么也不做。', body: ['日程之外留一点空白。读几页书、剪一段视频，或者什么也不做，让注意力从待办里暂时松开。'] },
  { id: 'knowledge-base', section: 'projects', date: '2026.10.05', category: '项目记录', title: '个人知识库', note: '整理技术笔记、链接收藏与日常想法的尝试。', body: ['一个持续整理中的个人知识库尝试，把技术笔记、链接收藏和日常想法放在同一个地方。'] },
  { id: 'github', section: 'favorites', date: '2026.10.02', category: '收藏夹 · 社交媒体', title: 'GitHub 账号', note: '开源项目与代码动态，留作入口。', body: ['代码仓库、开源项目与开发动态的常用入口。'] },
  { id: 'short-video', section: 'moments', date: '2026.09.30', category: '生活随记 · 影像', title: '短视频不一定要讲很多', note: '一个画面、一种声音，也可以留下一段完整的记录。', body: ['有时一个画面、一种声音或一段简单的感受，就足以留下一条完整的影像记录。'] },
  { id: 'software-boundaries', section: 'notes', date: '2026.09.26', category: '技术笔记 · 软件开发', title: '软件项目里，先把边界想清楚', note: '整理模块职责、接口约定与协作方式，让软件更容易维护。', body: ['模块职责、接口约定与协作边界会影响后续维护。动手实现之前，先把各部分的关系理清楚，能减少许多反复修改。'] },
  { id: 'douyin', section: 'favorites', date: '2026.09.22', category: '收藏夹 · 社交媒体', title: '抖音账号', note: '短视频与日常记录，留作入口。', body: ['短视频内容与社交动态的常用入口。'] },
  { id: 'design-notes', section: 'favorites', date: '2026.09.18', category: '收藏夹 · 文章', title: '设计工程手记', note: '界面、交互与工程实践，留作参考。', body: ['收藏的界面设计、交互细节与工程实践资料。'] },
  { id: 'toolbox', section: 'projects', date: '2026.09.15', category: '项目记录', title: '开发者工具箱', note: '把常用的小工具整理到一个轻量页面里。', body: ['一个把常用小工具逐步收拢到轻量页面的尝试。'] },
  { id: 'performance', section: 'notes', date: '2026.09.14', category: '技术笔记 · 性能优化', title: '一次真实的页面性能优化复盘', note: '先测量，再优化：记录排查过程与关键指标变化。', body: ['从测量开始定位问题，再逐项尝试优化，并记录排查过程与关键指标变化。'] },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookmarkCategory, setBookmarkCategory] = useState('全部')
  const closeMenu = () => setMenuOpen(false)
  const visibleBookmarks = bookmarkCategory === '全部' ? bookmarks : bookmarks.filter(item => item.category === bookmarkCategory)
  const params = new URLSearchParams(window.location.search)
  const view = params.get('view')
  const pageSection = params.get('section') || 'journal'
  const pageNumber = Math.max(1, Number(params.get('page')) || 1)
  const sectionNames = { journal: '日志', notes: '技术笔记', moments: '生活随记', favorites: '收藏夹', projects: '项目' }
  const pageSize = 6
  const sectionItems = pageSection === 'journal' ? logEntries : logEntries.filter(item => item.section === pageSection)
  const pageCount = Math.max(1, Math.ceil(sectionItems.length / pageSize))
  const pageItems = sectionItems.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  const detailItem = view === 'detail' ? logEntries.find(item => item.id === params.get('id')) : null
  const routeForList = (section, page = 1) => '?view=list&section=' + section + '&page=' + page
  const routeForDetail = id => '?view=detail&id=' + id
  if (view === 'list') return <div className="archive-page"><header className="archive-header page-width"><a className="wordmark" href="/"><span className="wordmark-icon"><Icon name="spark" size={16}/></span> KairyQi<span className="wordmark-dot">.</span></a><a className="archive-back" href="/">返回空间首页 <Icon name="arrow" size={15}/></a></header><main className="archive-main page-width"><div className="section-kicker">内容归档　/　{sectionNames[pageSection] || '日志'}</div><h1>{sectionNames[pageSection] || '日志'}</h1><p className="archive-description">{pageSection === 'journal' ? '按时间整理空间里的技术笔记、收藏、项目与生活片段。' : '关于「' + (sectionNames[pageSection] || '日志') + '」的记录与整理。'}</p><div className="archive-list">{pageItems.map(item => <a className="archive-row" href={routeForDetail(item.id)} key={item.id}><span className="archive-date">{item.date}</span><span className="archive-row-main"><span className="archive-category">{item.category}</span><strong>{item.title}</strong><span className="archive-excerpt">{item.note}</span></span><span className="archive-row-arrow"><Icon name="arrow" size={17}/></span></a>)}</div><nav className="pagination" aria-label="列表分页"><a className={pageNumber <= 1 ? 'page-disabled' : ''} href={routeForList(pageSection, Math.max(1, pageNumber - 1))}>上一页</a><span>第 {pageNumber} / {pageCount} 页</span><a className={pageNumber >= pageCount ? 'page-disabled' : ''} href={routeForList(pageSection, Math.min(pageCount, pageNumber + 1))}>下一页</a></nav></main><footer className="archive-footer page-width">KairyQi 的空间 <span>个人记录 · 持续更新</span></footer></div>
  if (view === 'detail' && detailItem) { const detailIndex = logEntries.findIndex(item => item.id === detailItem.id); const newer = logEntries[detailIndex - 1]; const older = logEntries[detailIndex + 1]; return <div className="archive-page"><header className="archive-header page-width"><a className="wordmark" href="/"><span className="wordmark-icon"><Icon name="spark" size={16}/></span> KairyQi<span className="wordmark-dot">.</span></a><a className="archive-back" href={routeForList(detailItem.section)}>返回{sectionNames[detailItem.section]} <Icon name="arrow" size={15}/></a></header><main className="detail-main page-width"><div className="detail-cover"><span className="section-kicker">{detailItem.category}</span><span className="detail-cover-mark">{detailItem.section === 'moments' ? '记' : detailItem.section === 'favorites' ? '藏' : detailItem.section === 'projects' ? '项' : '札'}</span></div><article className="detail-article"><div className="detail-meta"><span>{detailItem.date}</span><span>·</span><span>{sectionNames[detailItem.section]}</span></div><h1>{detailItem.title}</h1><p className="detail-lead">{detailItem.note}</p><div className="detail-body">{detailItem.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="detail-tags"><span>{detailItem.category}</span><span>KairyQi 的空间</span></div></article><nav className="detail-pagination"><a href={newer ? routeForDetail(newer.id) : routeForList(detailItem.section)}><small>较新的记录</small><strong>{newer ? newer.title : '返回列表'}</strong></a><a href={older ? routeForDetail(older.id) : routeForList(detailItem.section)}><small>较早的记录</small><strong>{older ? older.title : '返回列表'}</strong></a></nav></main></div> }
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
          <a href="#about" onClick={closeMenu}>关于空间</a><a href="#experience" onClick={closeMenu}>日志</a><a href="#notes" onClick={closeMenu}>技术笔记</a><a href="#favorites" onClick={closeMenu}>收藏夹</a><a href="#projects" onClick={closeMenu}>项目</a><a href="#moments" onClick={closeMenu}>生活随记</a>
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
      <div className="section-heading"><div><span className="section-kicker">01　/　关于空间</span></div><p>技术、影像和生活，都可以慢慢记录。</p></div>
      <div className="about-grid">
        <div className="portrait-card"><div className="portrait-avatar"><img src={`${import.meta.env.BASE_URL}kairyqi-profile.png`} alt="KairyQi 的个人照片" /></div></div>
        <div className="about-copy"><span className="mono-label">空间说明</span><h3>技术、影像与生活，<br /><span>慢慢记下来</span>。</h3><p>这里收录技术实践、喜欢的网站与账号、正在做的项目，也留给路上的风景和随时冒出的想法。主要写给自己，偶尔整理旧记录。</p><div className="contact-chips"><a href="mailto:kairyqi@gmail.com"><Icon name="mail" size={15}/> kairyqi@gmail.com</a><span><Icon name="pin" size={15}/> 随手记录 · 慢慢整理</span></div><a href="#experience" className="text-link">查看日志 <Icon name="arrow" size={15}/></a></div>
        <div className="about-stats"><div className="stat"><strong>AI × 软件</strong><small>开发与实践</small></div><div className="stat"><strong>影像</strong><small>短视频与旅拍</small></div><div className="stat status-stat"><span className="availability-dot"/><small>持续更新</small><strong>生活与随想</strong></div></div>
      </div>
    </div></section>
    </aside>
    <div className="main-column">

    <section className="experience-section section-pad" id="experience"><div className="page-width"><div className="section-heading"><div><span className="section-kicker">02　/　日志</span><h2>空间里的新内容，<em>按时间汇集。</em></h2></div><div className="heading-aside"><p>技术笔记、收藏、项目和生活片段，都在这里留下时间。</p><a className="text-link" href="?view=list&amp;section=journal&amp;page=1">更多 <Icon name="arrow" size={15}/></a></div></div><div className="timeline">{logEntries.slice(0, 3).map((entry, index) => <article className="timeline-item" key={entry.date + entry.title}><div className="timeline-date">{entry.date}</div><div className="timeline-marker"><i/></div><div className="timeline-content"><div className="timeline-top"><div><span className={index === 0 ? 'role-tag' : 'role-tag muted-tag'}>{entry.category}</span><h3>{entry.title}</h3></div><span className="timeline-number">{String(index + 1).padStart(2, '0')}</span></div><p className="timeline-desc">{entry.note}</p></div></article>)}</div></div></section>

    <section className="notes-section section-pad" id="notes"><div className="page-width"><div className="section-heading"><div><span className="section-kicker">03　/　技术笔记</span><h2>技术实践与思路，<em>随手记下。</em></h2></div><a className="text-link" href="?view=list&amp;section=notes&amp;page=1">更多 <Icon name="arrow" size={15}/></a></div><div className="notes-grid"><a className="note-card note-feature" href="?view=detail&amp;id=ai-dev"><span className="note-type">AI 开发　·　7 分钟阅读</span><div><div className="note-icon"><Icon name="code" size={22}/></div><h3>用 AI 辅助开发：从需求拆解到代码验证</h3><p>记录如何让 AI 参与需求梳理、方案比较与代码验证，同时保留开发者的判断。</p></div><div className="note-foot"><span>2026.10.12　/　#AI开发</span><Icon name="arrow" size={17}/></div></a><a className="note-card" href="?view=detail&amp;id=software-boundaries"><span className="note-type">工程效率　·　6 分钟阅读</span><div><div className="note-icon green-icon"><Icon name="spark" size={22}/></div><h3>软件项目里，先把边界想清楚</h3><p>整理模块职责、接口约定与协作方式，让软件更容易维护和继续生长。</p></div><div className="note-foot"><span>2026.09.26　/　#工程实践</span><Icon name="arrow" size={17}/></div></a><a className="note-card" href="?view=detail&amp;id=performance"><span className="note-type">性能优化　·　5 分钟阅读</span><div><div className="note-icon violet-icon"><Icon name="play" size={22}/></div><h3>一次真实的页面性能优化复盘</h3><p>先测量，再优化：记录排查过程与关键指标变化。</p></div><div className="note-foot"><span>2026.09.14　/　#性能</span><Icon name="arrow" size={17}/></div></a></div></div></section>

    <section className="moments-section section-pad" id="moments"><div className="page-width"><div className="section-heading"><div><span className="section-kicker">04　/　生活随记</span><h2>生活里的灵感，<em>也值得记录。</em></h2></div><div className="heading-aside"><p>一段话、一张图、一次旅拍，或一条社交媒体动态。</p><a className="text-link" href="?view=list&amp;section=moments&amp;page=1">更多 <Icon name="arrow" size={15}/></a></div></div><div className="moments-grid"><a className="moment-card" href="?view=detail&amp;id=travel-street"><span className="moment-date">2026.10.16　/　旅拍</span><h3>把相机带上，去没走过的街区</h3><p>不设目的地地走一走，常常比计划好的路线更容易遇见惊喜。</p><span className="moment-tag">#城市漫游</span></a><a className="moment-card" href="?view=detail&amp;id=daily-time"><span className="moment-date">2026.10.08　/　生活</span><h3>给自己留一点不被安排的时间</h3><p>最近在练习慢下来，读几页书、剪一段视频，或者什么也不做。</p><span className="moment-tag">#日常观察</span></a><a className="moment-card" href="?view=detail&amp;id=short-video"><span className="moment-date">2026.09.30　/　影像</span><h3>短视频不一定要讲很多</h3><p>一个画面、一种声音、一段真实的感受，也可以是一条完整的记录。</p><span className="moment-tag">#视频创作</span></a></div></div></section>

    <section className="favorites-section section-pad" id="favorites"><div className="page-width"><div className="section-heading"><div><span className="section-kicker">05　/　收藏夹</span><h2>遇见的内容，<em>先放在这里。</em></h2></div><div className="heading-aside"><p>网站、账号、文章与工具的链接备忘。</p><a className="text-link" href="?view=list&amp;section=favorites&amp;page=1">更多 <Icon name="arrow" size={15}/></a></div></div><div className="favorite-filters">{['全部', '网站与工具', '社交媒体', '文章与灵感'].map(category => <button key={category} onClick={() => setBookmarkCategory(category)} className={bookmarkCategory === category ? 'filter-active' : ''}>{category}{category === '全部' && <span> {bookmarks.length}</span>}</button>)}</div><div className="favorites-grid">{visibleBookmarks.map(item => <a className="favorite-card" href={item.link} target="_blank" rel="noreferrer" key={item.title}><div className={`favorite-visual favorite-visual-${bookmarks.indexOf(item) + 1}`}><span className="favorite-symbol"><Icon name={item.icon} size={25}/></span><span className="favorite-open"><Icon name="external" size={15}/></span><span className="favorite-index">0{bookmarks.indexOf(item) + 1}</span></div><div className="favorite-info"><div className="favorite-meta"><span>{item.type}</span><b>{item.label}</b></div><h3>{item.title}</h3><p>{item.note}</p></div></a>)}</div></div></section>

    <section className="projects-section section-pad" id="projects"><div className="page-width"><div className="section-heading"><div><span className="section-kicker">06　/　正在进行</span><h2>项目与尝试，<em>阶段记录。</em></h2></div><div className="heading-aside"><p>正在尝试的内容与阶段状态，也顺手留档。</p><a className="text-link" href="?view=list&amp;section=projects&amp;page=1">更多 <Icon name="arrow" size={15}/></a></div></div><div className="project-grid"><article className="project-card project-main"><div className="project-art"><div className="project-window"><div className="window-bar"><i/><i/><i/><span>knowledge.base / dashboard</span></div><div className="window-body"><div className="window-sidebar"><b/><i/><i/><i/></div><div className="window-content"><span>MY KNOWLEDGE SPACE</span><b/><b/><div className="window-blocks"><i/><i/><i/></div></div></div></div><span className="project-orbit">✳</span></div><div className="project-info"><div><span className="project-status"><i/>记录中</span><h3>个人知识库</h3><p>一个让技术笔记、灵感链接和日常想法自然连接的个人空间。</p></div><a className="project-link" href="?view=detail&amp;id=knowledge-base" aria-label="打开个人知识库记录"><Icon name="arrow"/></a></div></article><article className="project-card project-secondary"><div className="project-art secondary-art"><div className="code-lines"><i/><i/><i/><i/><i/><i/><i/></div><span className="secondary-bracket">&lt;/&gt;</span></div><div className="project-info"><div><span className="project-status muted-status"><i/>探索中</span><h3>开发者工具箱</h3><p>把常用的小工具整理到一个轻量页面里。</p></div><a href="#" className="project-link" href="?view=detail&amp;id=toolbox" aria-label="打开开发者工具箱记录"><Icon name="arrow"/></a></div></article></div></div></section>

    </div></div>
    <section className="contact-section" id="contact"><div className="contact-grid-bg"/><div className="page-width contact-inner"><div className="contact-kicker"><span className="availability-dot"/> 联系方式</div><h2>如果需要联系，<br /><em>邮箱在这里。</em></h2><p>邮箱和常用平台入口，放在这里备忘。</p><a className="contact-cta" href="mailto:kairyqi@gmail.com">kairyqi@gmail.com <span><Icon name="arrow" size={19}/></span></a><div className="social-links"><a href="https://github.com/" target="_blank" rel="noreferrer"><Icon name="github" size={16}/> GitHub</a><a href="https://www.douyin.com/" target="_blank" rel="noreferrer"><Icon name="video" size={16}/> 抖音</a><a href="#"><Icon name="link" size={16}/> 即刻</a><a href="#"><Icon name="book" size={16}/> 掘金</a></div><footer className="site-footer"><a className="wordmark" href="#home"><span className="wordmark-icon"><Icon name="code" size={14}/></span> KairyQi<span className="wordmark-dot">.</span></a><span>© 2026 · KairyQi 的空间 · 记录所爱，保持好奇。</span><a href="#home">回到顶部 ↑</a></footer></div></section>
  </>
}

const root = window.__personalSiteRoot || createRoot(document.getElementById('root'))
window.__personalSiteRoot = root
root.render(<React.StrictMode><App /></React.StrictMode>)
