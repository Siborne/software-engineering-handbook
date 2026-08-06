<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import {
  Rocket,
  Compass,
  Code,
  Cog,
  Database,
  Building2,
  Bot,
  Triangle,
  Wrench,
  Laptop,
  Settings,
  TrendingUp,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from '@lucide/vue'

const { Layout } = DefaultTheme

const features = [
  { icon: Rocket, title: '开始入门', desc: '推荐学习路径、AI 时代学习方法、如何高效提问', link: '/getting-started/' },
  { icon: Compass, title: '学习路线图', desc: '从 Beginner 到 AI Agent 的完整技术成长路线', link: '/learning-roadmap/' },
  { icon: Code, title: '编程语言', desc: 'Java 核心：JVM、并发、集合、新特性', link: '/programming-language/java/' },
  { icon: Cog, title: '后端框架', desc: 'Spring Boot、Spring AI、Netty、RPC', link: '/backend/' },
  { icon: Database, title: '数据库', desc: 'MySQL、Redis、Elasticsearch、MongoDB', link: '/database/' },
  { icon: Building2, title: '软件工程', desc: '设计模式、DDD、测试、重构、CI/CD、可观测性', link: '/software-engineering/' },
  { icon: Bot, title: 'AI 工程', desc: 'Agent、MCP、RAG、Prompt Engineering、上下文工程', link: '/ai-engineering/' },
  { icon: Triangle, title: '系统设计', desc: '认证系统、缓存、消息队列、分布式锁、If I Were 系列', link: '/system-design/' },
  { icon: Wrench, title: '项目实战', desc: 'AI Agent、Blog、Delper — 从设计方案到 Demo', link: '/projects/' },
  { icon: Laptop, title: 'AI Coding', desc: 'Claude Code、Cursor、GitHub Copilot、Codex 使用指南', link: '/ai-coding/' },
  { icon: Settings, title: '工具链', desc: 'Linux、Git、Docker、Nginx、Cloudflare、VS Code', link: '/tools/' },
  { icon: TrendingUp, title: '职业发展', desc: '职业规划、面试指南、简历技巧、学习方法论', link: '/career/' },
]

const steps = [
  { icon: Code, tag: 'PHASE 01', title: '打牢 Java 基础', desc: 'JVM · 并发 · 集合 · Spring 全家桶' },
  { icon: Database, tag: 'PHASE 02', title: '深入后端工程', desc: '数据库 · 架构 · 分布式 · 系统设计' },
  { icon: Bot, tag: 'PHASE 03', title: '掌握 AI 工程', desc: 'Agent · RAG · MCP · 上下文工程' },
  { icon: TrendingUp, tag: 'PHASE 04', title: '成为 AI 工程师', desc: '用 AI 重新定义软件研发' },
]
</script>

<template>
  <Layout>
    <template #home-hero-info>
      <div class="hero">
        <div class="hero-badge">
          <Sparkles :size="14" :stroke-width="2.2" />
          <span>AI 时代软件工程师成长手册</span>
        </div>
        <h1 class="hero-title">软件工程手册</h1>
        <p class="hero-subtitle">从 Java Developer 到 AI Software Engineer</p>
        <p class="hero-desc">
          一套系统化的软件工程知识体系，涵盖 AI 工程、后端架构、系统设计、编程语言等核心领域，
          帮助开发者在 AI 时代构建完整的工程能力。
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/getting-started/">
            开始阅读
            <ArrowRight :size="16" :stroke-width="2.4" />
          </a>
          <a class="btn btn-ghost" href="/learning-roadmap/">查看学习路线</a>
        </div>
        <div class="hero-meta">
          <span><b>13</b> 大知识板块</span>
          <span class="dot">·</span>
          <span><b>100+</b> 技术主题</span>
          <span class="dot">·</span>
          <span>覆盖 <b>AI 工程</b> 全链路</span>
        </div>
      </div>
    </template>

    <template #home-hero-image>
      <div class="hero-image-wrap">
        <img class="hero-image" src="/logo.svg" alt="Software Engineering Handbook" />
      </div>
    </template>

    <template #home-hero-after>
      <!-- ===== Features ===== -->
      <section class="section features">
        <div class="section-head">
          <p class="section-eyebrow">Knowledge Base</p>
          <h2>系统化知识库</h2>
          <p class="sub">13 个板块 · 从基础到 AI 工程，构建完整知识体系</p>
        </div>
        <div class="features-grid">
          <a v-for="f in features" :key="f.title" :href="f.link" class="card">
            <div class="card-icon">
              <component :is="f.icon" :size="22" :stroke-width="2" />
            </div>
            <div class="card-body">
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
            </div>
            <ArrowRight class="card-arrow" :size="16" :stroke-width="2.4" />
          </a>
        </div>
      </section>

      <!-- ===== Roadmap ===== -->
      <section class="section roadmap">
        <div class="section-head">
          <p class="section-eyebrow">Growth Path</p>
          <h2>你的成长路线</h2>
          <p class="sub">四个阶段，从工程师到 AI 工程师</p>
        </div>
        <div class="roadmap-track">
          <div v-for="s in steps" :key="s.tag" class="roadmap-step">
            <div class="step-icon">
              <component :is="s.icon" :size="20" :stroke-width="2" />
            </div>
            <span class="step-tag">{{ s.tag }}</span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </section>

      <!-- ===== CTA ===== -->
      <section class="section cta">
        <div class="cta-card">
          <GraduationCap :size="30" :stroke-width="1.8" class="cta-icon" />
          <h2>准备好开始了吗？</h2>
          <p>从第一篇开始，系统构建你的软件工程知识体系</p>
          <a class="btn btn-primary" href="/getting-started/">
            开始阅读
            <ArrowRight :size="16" :stroke-width="2.4" />
          </a>
        </div>
      </section>
    </template>
  </Layout>
</template>

<style scoped>
/* ==========================================================
   Shared
========================================================== */
.section {
  max-width: 1152px;
  margin: 0 auto;
  padding: 96px 24px 0;
}

.section-head {
  text-align: center;
  margin-bottom: 48px;
}

.section-eyebrow {
  margin: 0 0 12px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.section-head h2 {
  margin: 0 0 12px;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--vp-c-text-1);
}

.section-head .sub {
  margin: 0;
  font-size: 1rem;
  color: var(--vp-c-text-2);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  box-shadow: 0 8px 28px rgba(139, 92, 246, 0.45), 0 4px 12px rgba(236, 72, 153, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(139, 92, 246, 0.6), 0 6px 16px rgba(236, 72, 153, 0.45);
}

.btn-ghost {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  backdrop-filter: blur(8px);
}

.btn-ghost:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-mute);
  transform: translateY(-2px);
}

/* ==========================================================
   Hero
========================================================== */
.hero {
  max-width: 640px;
  padding: 16px 0 24px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  margin-bottom: 24px;
  border-radius: 999px;
  border: 1px solid var(--home-badge-border);
  background: var(--home-badge-bg);
  backdrop-filter: blur(8px);
  color: var(--home-badge-text);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  animation: fade-up 0.6s ease both;
}

.hero-title {
  margin: 0 0 16px;
  font-size: clamp(2.6rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: 2px;
  background: var(--home-title-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: fade-up 0.6s 0.06s ease both;
}

.hero-subtitle {
  margin: 0 0 16px;
  font-size: clamp(1.15rem, 2.5vw, 1.5rem);
  font-weight: 700;
  color: var(--vp-c-text-1);
  animation: fade-up 0.6s 0.12s ease both;
}

.hero-desc {
  margin: 0 0 32px;
  max-width: 560px;
  font-size: 1.05rem;
  line-height: 1.85;
  color: var(--vp-c-text-2);
  animation: fade-up 0.6s 0.18s ease both;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 40px;
  animation: fade-up 0.6s 0.24s ease both;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  animation: fade-up 0.6s 0.3s ease both;
}

.hero-meta b {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.hero-meta .dot {
  opacity: 0.5;
}

/* ===== Hero image ===== */
.hero-image-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image-wrap::before {
  content: '';
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: var(--home-logo-glow);
  filter: blur(52px);
  opacity: 0.5;
  animation: spin 12s linear infinite;
}

.hero-image {
  position: relative;
  width: 300px;
  max-width: 100%;
  height: auto;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(var(--home-logo-shadow));
}

/* ==========================================================
   Features
========================================================== */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.card {
  position: relative;
  display: flex;
  gap: 14px;
  padding: 22px;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  backdrop-filter: blur(12px);
  text-decoration: none;
  color: var(--vp-c-text-1);
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  box-shadow: var(--home-card-hover-shadow);
}

.card-icon {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--home-icon-border);
  background: var(--home-icon-bg);
  color: var(--vp-c-brand-1);
  transition: color 0.25s ease, box-shadow 0.25s ease;
}

.card:hover .card-icon {
  color: var(--vp-c-brand-2);
  box-shadow: var(--home-icon-glow);
}

.card-body h3 {
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.card-body p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.card-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-brand-1);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.card:hover .card-arrow {
  opacity: 1;
  transform: translateY(-50%) translateX(2px);
}

/* ==========================================================
   Roadmap
========================================================== */
.roadmap-track {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.roadmap-step {
  position: relative;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--home-step-bg);
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.roadmap-step:hover {
  transform: translateY(-4px);
  border-color: var(--home-step-hover-border);
}

.roadmap-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 40px;
  left: calc(100% + 4px);
  width: 8px;
  height: 1px;
  background: linear-gradient(90deg, var(--home-badge-border), var(--home-badge-border));
}

.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  border-radius: 50%;
  border: 1px solid var(--home-step-icon-border);
  background: var(--home-step-icon-bg);
  color: #fff;
  box-shadow: 0 0 24px var(--home-badge-border);
}

.step-tag {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--home-badge-text);
}

.roadmap-step h3 {
  margin: 6px 0 8px;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.roadmap-step p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* ==========================================================
   CTA
========================================================== */
.cta {
  padding-bottom: 96px;
}

.cta-card {
  position: relative;
  overflow: hidden;
  padding: 56px 32px;
  text-align: center;
  border-radius: 24px;
  border: 1px solid var(--vp-c-divider);
  background: var(--home-cta-bg);
  backdrop-filter: blur(16px);
}

.cta-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(600px 200px at 50% 0%, var(--home-cta-glow), transparent 70%);
}

.cta-icon {
  margin-bottom: 16px;
  color: var(--vp-c-brand-1);
}

.cta-card h2 {
  position: relative;
  margin: 0 0 12px;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.cta-card p {
  position: relative;
  margin: 0 0 28px;
  color: var(--vp-c-text-2);
}

.cta-card .btn {
  position: relative;
}

/* ==========================================================
   Animations
========================================================== */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-badge,
  .hero-title,
  .hero-subtitle,
  .hero-desc,
  .hero-actions,
  .hero-meta,
  .hero-image-wrap::before,
  .hero-image {
    animation: none !important;
  }
}

/* ==========================================================
   Responsive
========================================================== */
@media (max-width: 960px) {
  .hero {
    padding: 0 0 16px;
    text-align: center;
  }

  .hero-badge {
    margin-bottom: 20px;
  }

  .hero-desc {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions,
  .hero-meta {
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .roadmap-track {
    grid-template-columns: repeat(2, 1fr);
  }

  .roadmap-step:not(:last-child)::after {
    display: none;
  }
}

@media (max-width: 640px) {
  .section {
    padding: 72px 20px 0;
  }

  .features-grid,
  .roadmap-track {
    grid-template-columns: 1fr;
  }

  .cta {
    padding-bottom: 72px;
  }
}
</style>
