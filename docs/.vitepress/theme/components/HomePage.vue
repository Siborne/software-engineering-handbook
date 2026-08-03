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
  TrendingUp
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
</script>

<template>
  <Layout>
    <template #home-hero-info>
      <div class="hero-left">
        <h1 class="hero-title">软件工程手册</h1>
        <p class="hero-tagline">从 Java Developer 到 AI Software Engineer 的成长路线</p>
        <p class="hero-desc">
          一套系统化的软件工程知识体系，涵盖 AI 工程、后端架构、系统设计、编程语言等核心领域，
          帮助开发者在 AI 时代构建完整的工程能力。
        </p>
        <div class="hero-actions">
          <a class="vp-button brand" href="/getting-started/">开始阅读</a>
          <a class="vp-button alt" href="/learning-roadmap/">学习路线</a>
        </div>
      </div>
    </template>

    <template #home-hero-image>
      <div class="hero-right">
        <img class="hero-image" src="/logo.svg" alt="Software Engineering Handbook" />
      </div>
    </template>

    <template #home-features-after>
      <div class="features-section">
        <div class="features-header">
          <h2>知识库</h2>
          <p>系统化学习，逐步构建软件工程知识体系</p>
        </div>
        <div class="features-grid">
          <a v-for="f in features" :key="f.title" :href="f.link" class="feature-card">
            <div class="feature-icon">
              <component :is="f.icon" :size="32" :stroke-width="2" />
            </div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </a>
        </div>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
/* ===== Hero Section ===== */
.hero-left {
  padding: 64px 0 64px 64px;
  max-width: 600px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.hero-tagline {
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 12px;
}

.hero-desc {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.8;
  margin-bottom: 32px;
  max-width: 520px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-actions .vp-button {
  padding: 10px 28px;
  font-size: 1rem;
  border-radius: 20px;
}

/* ===== Hero Image ===== */
.hero-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px;
}

.hero-image {
  max-width: 320px;
  max-height: 320px;
  width: 100%;
  height: auto;
}

/* ===== Features Section ===== */
.features-section {
  padding: 64px 64px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: 48px;
}

.features-header h2 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--vp-c-text-1);
}

.features-header p {
  font-size: 1.05rem;
  color: var(--vp-c-text-2);
  margin-top: 12px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.feature-card {
  display: block;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 28px 24px;
  transition: border-color 0.25s, box-shadow 0.25s;
  text-decoration: none;
  color: inherit;
}

.feature-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.feature-icon {
  margin-bottom: 12px;
  display: inline-flex;
  color: var(--vp-c-brand-1);
}

.feature-card h3 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.feature-card p {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

/* ===== Responsive ===== */
@media (max-width: 960px) {
  .hero-left {
    padding: 48px 32px 0;
    text-align: center;
    max-width: 100%;
  }
  .hero-desc {
    max-width: 100%;
  }
  .hero-actions {
    justify-content: center;
  }
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-right {
    padding: 32px;
  }
  .hero-image {
    max-width: 200px;
    max-height: 200px;
  }
  .features-section {
    padding: 48px 32px 64px;
  }
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hero-left {
    padding: 40px 24px 0;
  }
  .hero-title {
    font-size: 1.8rem;
  }
  .hero-tagline {
    font-size: 1.15rem;
  }
  .hero-right {
    padding: 24px;
  }
  .hero-image {
    max-width: 160px;
    max-height: 160px;
  }
  .features-section {
    padding: 40px 20px 56px;
  }
  .features-header h2 {
    font-size: 1.5rem;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>

