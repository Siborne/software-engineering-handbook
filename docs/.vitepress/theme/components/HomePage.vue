<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

const features = [
  { title: 'Why 系列', desc: '深入理解技术决策背后的原因', link: '/getting-started/why-this-handbook' },
  { title: 'If I Were', desc: '「如果让我重新设计」系列思考', link: '/system-design/if-i-were-github' },
  { title: 'AI × SE', desc: 'AI 工程与软件工程的交叉实践', link: '/ai-engineering/' },
  { title: 'Project Evolution', desc: '项目从 Day 1 到 Day N 的真实演进', link: '/projects/' },
]

const roadmapSteps = [
  'Beginner', 'Java', 'Spring', 'Database', 'Redis',
  'Linux', 'Docker', 'MQ', 'Architecture', 'AI', 'Agent'
]
</script>

<template>
  <Layout>
    <template #home-hero-info>
      <div class="home-hero">
        <h1 class="hero-title">
          <span class="hero-title-main">Software Engineering Handbook</span>
          <span class="hero-title-sub">软件工程手册</span>
        </h1>
        <p class="hero-tagline">
          Learn the principles. Build real systems. Think like an engineer.
        </p>
        <p class="hero-tagline-cn">
          学习原理，构建系统，像工程师一样思考。
        </p>
        <div class="hero-actions">
          <a class="vp-button brand" href="/getting-started/">Getting Started</a>
          <a class="vp-button alt" href="/learning-roadmap/">Learning Roadmap</a>
        </div>
      </div>
    </template>

    <template #home-hero-image>
      <div class="hero-features">
        <div v-for="f in features" :key="f.title" class="feature-card">
          <a :href="f.link">
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </a>
        </div>
      </div>
    </template>

    <template #home-features-after>
      <div class="roadmap-section">
        <h2>Learning Roadmap</h2>
        <div class="roadmap-steps">
          <span v-for="(step, i) in roadmapSteps" :key="step" class="roadmap-step">
            {{ step }}
            <span v-if="i < roadmapSteps.length - 1" class="roadmap-arrow">→</span>
          </span>
        </div>
      </div>
      <div class="recent-updates">
        <h2>最近更新</h2>
        <p class="placeholder">内容正在建设中，敬请期待...</p>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.home-hero {
  text-align: center;
  padding: 48px 24px 24px;
}
.hero-title-main {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
}
.hero-title-sub {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-top: 8px;
}
.hero-tagline {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  margin-top: 16px;
}
.hero-tagline-cn {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  margin-top: 4px;
}
.hero-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
.hero-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 640px;
  margin: 0 auto;
  padding: 0 24px;
}
.feature-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 20px;
  transition: border-color 0.3s;
}
.feature-card:hover {
  border-color: var(--vp-c-brand-1);
}
.feature-card h3 {
  font-size: 1.1rem;
  margin-bottom: 4px;
}
.feature-card p {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.roadmap-section {
  text-align: center;
  padding: 48px 24px;
}
.roadmap-section h2 {
  margin-bottom: 20px;
}
.roadmap-steps {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
}
.roadmap-step {
  font-weight: 500;
}
.roadmap-arrow {
  margin: 0 6px;
  color: var(--vp-c-brand-1);
}
.recent-updates {
  text-align: center;
  padding: 24px 24px 48px;
}
.recent-updates h2 {
  margin-bottom: 12px;
}
.placeholder {
  color: var(--vp-c-text-3);
  font-style: italic;
}

@media (max-width: 640px) {
  .hero-features {
    grid-template-columns: 1fr;
  }
  .hero-title-main {
    font-size: 1.8rem;
  }
}
</style>
