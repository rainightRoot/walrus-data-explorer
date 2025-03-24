<template>
  <div class="home-page">
    <!-- Project overview and market data -->
    <div class="page-header">
      <div class="project-info">
        <h1>About Celestia</h1>
        <p class="project-description">
          Celestia is a modular data availability network that scales with the number of users, enabling anyone to easily deploy their own blockchain.
        </p>
        <div class="project-links">
          <a href="https://celestia.org" target="_blank" class="link-item">Website</a>
          <a href="https://docs.celestia.org" target="_blank" class="link-item">Docs</a>
          <a href="https://forum.celestia.org" target="_blank" class="link-item">Forum</a>
          <a href="https://www.coingecko.com/en/coins/celestia" target="_blank" class="link-item">CoinGecko</a>
        </div>
      </div>
      <div class="network-info">
        <div class="info-item">
          <span class="label">Market Cap</span>
          <span class="value">{{ marketCap }}</span>
        </div>
        <div class="info-item">
          <span class="label">24h Volume</span>
          <span class="value">{{ volume24h }}</span>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="content-left">
        <!-- TIA Chart -->
        <div class="card chart-card">
          <div class="card-header">
            <h2>TIA Chart</h2>
            <div class="chart-period">
              <button :class="['period-btn', chartPeriod === '24h' ? 'active' : '']" @click="chartPeriod = '24h'">24h</button>
              <button :class="['period-btn', chartPeriod === '1w' ? 'active' : '']" @click="chartPeriod = '1w'">1w</button>
              <button :class="['period-btn', chartPeriod === '1m' ? 'active' : '']" @click="chartPeriod = '1m'">1m</button>
              <button :class="['period-btn', chartPeriod === '3m' ? 'active' : '']" @click="chartPeriod = '3m'">3m</button>
              <button :class="['period-btn', chartPeriod === '1y' ? 'active' : '']" @click="chartPeriod = '1y'">1y</button>
              <button :class="['period-btn', chartPeriod === 'all' ? 'active' : '']" @click="chartPeriod = 'all'">All</button>
            </div>
          </div>
          <div class="card-body">
            <div class="tia-info">
              <div class="price-info">
                <div class="current-price">
                  <span>TIA</span>
                  <span class="price-value">{{ currentPrice }}</span>
                </div>
                <div :class="['price-change', priceChangePercentage >= 0 ? 'positive' : 'negative']">
                  {{ priceChangePercentage >= 0 ? '+' : '' }}{{ priceChangePercentage }}%
                  <span class="period">24h</span>
                </div>
              </div>
            </div>
            <div class="chart-placeholder">
              <img v-if="chartLoading" src="@/assets/loading.svg" alt="Loading" class="chart-loading">
              <div v-else class="chart-area" ref="chartContainer"></div>
            </div>
          </div>
        </div>

        <!-- GitHub Activity -->
        <div class="card">
          <div class="card-header">
            <h2>GitHub Activity</h2>
            <a href="https://github.com/celestiaorg" target="_blank" class="view-all-link">View All</a>
          </div>
          <div class="card-body">
            <div v-if="githubActivity.length === 0" class="no-data">No GitHub activity data available</div>
            <div v-else class="github-activity">
              <div v-for="(activity, index) in githubActivity" :key="index" class="activity-item">
                <div class="activity-repo">
                  <span class="repo-name">{{ activity.repo }}</span>
                  <span class="activity-time">{{ formatTime(activity.time) }}</span>
                </div>
                <div class="activity-message">{{ activity.message }}</div>
                <div class="activity-author">
                  <span>by</span>
                  <a :href="'https://github.com/' + activity.author" target="_blank">{{ activity.author }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Unlocks -->
        <div class="card">
          <div class="card-header">
            <h2>Upcoming Unlocks</h2>
          </div>
          <div class="card-body">
            <div v-if="upcomingUnlocks.length === 0" class="no-data">No upcoming token unlocks</div>
            <div v-else class="unlocks-list">
              <div v-for="(unlock, index) in upcomingUnlocks" :key="index" class="unlock-item">
                <div class="unlock-info">
                  <div class="unlock-date">{{ formatDate(unlock.date) }}</div>
                  <div class="unlock-amount">{{ formatNumber(unlock.amount) }} TIA</div>
                </div>
                <div class="unlock-percentage">
                  <div class="unlock-label">Percent of Total Supply</div>
                  <div class="unlock-value">{{ unlock.percentOfSupply }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-right">
        <!-- Latest Blocks -->
        <div class="card">
          <div class="card-header">
            <h2>Latest Blocks</h2>
            <router-link to="/blocks" class="view-all-link">View All</router-link>
          </div>
          <div class="card-body no-padding">
            <latest-blocks :limit="5" />
          </div>
        </div>

        <!-- Active Proposals -->
        <div class="card">
          <div class="card-header">
            <h2>Active Proposals</h2>
            <router-link to="/governance" class="view-all-link">View All</router-link>
          </div>
          <div class="card-body">
            <div v-if="activeProposals.length === 0" class="no-data">No active proposals</div>
            <div v-else class="proposals-list">
              <div v-for="proposal in activeProposals" :key="proposal.id" class="proposal-item">
                <router-link :to="`/governance/${proposal.id}`" class="proposal-title">
                  {{ proposal.title }}
                </router-link>
                <div class="proposal-meta">
                  <div :class="['proposal-status', proposal.status]">{{ getStatusLabel(proposal.status) }}</div>
                  <div class="proposal-time">
                    {{ proposal.status === 'voting' ? 'End time' : 'Start time' }}: {{ formatTime(proposal.endTime) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Investors -->
        <div class="card">
          <div class="card-header">
            <h2>Investors</h2>
          </div>
          <div class="card-body investors-section">
            <div class="investor-stats">
              <div class="investor-stat">
                <div class="stat-label">Raised</div>
                <div class="stat-value">$28.5M</div>
              </div>
              <div class="investor-stat">
                <div class="stat-label">Tokens Sold</div>
                <div class="stat-value">113M TIA</div>
              </div>
            </div>
            <div class="investors-list">
              <div v-for="(investor, index) in investors" :key="index" class="investor-item">
                <img :src="investor.logo" :alt="investor.name" class="investor-logo">
                <div class="investor-name">{{ investor.name }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tokenomics -->
        <div class="card">
          <div class="card-header">
            <h2>Tokenomics</h2>
          </div>
          <div class="card-body">
            <div class="tokenomics-chart">
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-color bonded"></span>
                  <span>Bonded</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color unbonded"></span>
                  <span>Unbonded</span>
                </div>
              </div>
              
              <div class="supply-chart">
                <div class="bonded-supply" :style="{ width: `${bondedPercent}%` }"></div>
                <div class="unbonded-supply" :style="{ width: `${100 - bondedPercent}%` }"></div>
              </div>
              
              <div class="supply-info">
                <div class="supply-item">
                  <div class="supply-label">Bonded</div>
                  <div class="supply-value">{{ formatNumber(bondedSupply) }} TIA</div>
                </div>
                <div class="supply-item">
                  <div class="supply-label">Unbonded</div>
                  <div class="supply-value">{{ formatNumber(unbondedSupply) }} TIA</div>
                </div>
                <div class="supply-item">
                  <div class="supply-label">Community Pool</div>
                  <div class="supply-value">{{ formatNumber(communityPool) }} TIA</div>
                </div>
                <div class="supply-item total">
                  <div class="supply-label">Total Supply</div>
                  <div class="supply-value">{{ formatNumber(totalSupply) }} TIA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LatestBlocks from '@/components/LatestBlocks.vue'
import { format, formatDistance } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export default {
  name: 'Home',
  components: {
    LatestBlocks
  },
  data() {
    return {
      chartPeriod: '24h',
      chartLoading: true,
      currentPrice: '$4.82',
      priceChangePercentage: -2.34,
      marketCap: '$673,824,589',
      volume24h: '$64,591,203',
      githubActivity: [
        {
          repo: 'celestiaorg/celestia-node',
          message: 'docs: update test command',
          author: 'Johny21',
          time: new Date(Date.now() - 3600000 * 3) // 3 小时前
        },
        {
          repo: 'celestiaorg/celestia-app',
          message: 'fix: resolve performance issue in state sync',
          author: 'devuser42',
          time: new Date(Date.now() - 3600000 * 8) // 8 小时前
        },
        {
          repo: 'celestiaorg/celestia-core',
          message: 'feat: implement new consensus optimizations',
          author: 'cosmicdev',
          time: new Date(Date.now() - 3600000 * 24) // 1 天前
        }
      ],
      upcomingUnlocks: [
        {
          date: new Date('2023-12-15'),
          amount: 15000000,
          percentOfSupply: 3.2
        },
        {
          date: new Date('2024-01-30'),
          amount: 25000000,
          percentOfSupply: 5.3
        }
      ],
      activeProposals: [
        {
          id: 12,
          title: '增加验证者最大数量提案',
          status: 'voting',
          endTime: new Date(Date.now() + 3600000 * 72) // 3 天后结束
        },
        {
          id: 11,
          title: '社区池资金分配方案',
          status: 'deposit',
          endTime: new Date(Date.now() + 3600000 * 24) // 1 天后开始
        }
      ],
      investors: [
        { name: 'Polychain Capital', logo: '/images/investors/polychain.png' },
        { name: 'Bain Capital Crypto', logo: '/images/investors/bain.png' },
        { name: 'Paradigm', logo: '/images/investors/paradigm.png' },
        { name: 'a16z', logo: '/images/investors/a16z.png' },
        { name: 'Binance Labs', logo: '/images/investors/binance.png' },
        { name: 'Coinbase Ventures', logo: '/images/investors/coinbase.png' }
      ],
      tokenomics: {
        bonded: 280000000,
        bondedPercentage: 38,
        unbonded: 452000000,
        unbondedPercentage: 62,
        totalSupply: 732000000
      }
    }
  },
  mounted() {
    // 模拟图表加载
    setTimeout(() => {
      this.chartLoading = false
      this.$nextTick(() => {
        this.initChart()
      })
    }, 1500)
  },
  methods: {
    formatTime(time) {
      return formatDistance(
        new Date(time),
        new Date(),
        { addSuffix: true, locale: enUS }
      )
    },
    formatDate(date) {
      return format(new Date(date), 'MMM dd, yyyy', { locale: enUS })
    },
    formatNumber(value) {
      return this.$formatNumber(value)
    },
    getStatusLabel(status) {
      const statusMap = {
        'voting': '投票中',
        'deposit': '存款期'
      }
      return statusMap[status] || status
    },
    initChart() {
      // 这里是图表初始化代码
      // 实际项目中应该使用Chart.js或ECharts等库
      const chartContainer = this.$refs.chartContainer
      if (!chartContainer) return
      
      // 创建简易图表
      const canvas = document.createElement('canvas')
      canvas.width = chartContainer.offsetWidth
      canvas.height = 250
      chartContainer.appendChild(canvas)
      
      const ctx = canvas.getContext('2d')
      ctx.strokeStyle = '#6A5ACD'
      ctx.lineWidth = 2
      
      // 绘制模拟价格曲线
      ctx.beginPath()
      ctx.moveTo(0, 180)
      for (let x = 0; x < canvas.width; x += 10) {
        const randomY = 100 + Math.random() * 100
        ctx.lineTo(x, randomY)
      }
      ctx.stroke()
      
      // 添加渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, 'rgba(106, 90, 205, 0.2)')
      gradient.addColorStop(1, 'rgba(106, 90, 205, 0)')
      
      ctx.fillStyle = gradient
      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()
      ctx.fill()
    }
  }
}
</script>

<style scoped>
.home-page {
  margin-bottom: 40px;
}

.page-header {
  background: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  border: 1px solid var(--border-color);
}

.project-info {
  flex: 2;
  min-width: 300px;
}

.project-info h1 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.project-description {
  margin-bottom: 15px;
  color: var(--text-light);
  line-height: 1.6;
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.link-item {
  padding: 5px 10px;
  background: var(--bg-color);
  border-radius: 4px;
  font-size: 0.85rem;
  color: var(--text-color);
  text-decoration: none;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.link-item:hover {
  background: var(--primary-light);
  color: var(--primary-color);
}

.network-info {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  color: var(--text-light);
  font-size: 0.9rem;
}

.info-item .value {
  font-weight: 600;
}

.main-content {
  display: flex;
  gap: 20px;
}

.content-left {
  flex: 3;
  min-width: 0;
}

.content-right {
  flex: 2;
  min-width: 0;
}

.card {
  background: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--card-header-bg);
  border-bottom: 1px solid var(--border-color);
}

.card-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.view-all-link {
  font-size: 0.85rem;
  color: var(--primary-color);
  text-decoration: none;
}

.card-body {
  padding: 20px;
}

.card-body.no-padding {
  padding: 0;
}

.chart-period {
  display: flex;
  gap: 5px;
}

.period-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  font-size: 0.85rem;
  color: var(--text-light);
  cursor: pointer;
  border-radius: 4px;
}

.period-btn.active {
  background: var(--primary-light);
  color: var(--primary-color);
  font-weight: 500;
}

.tia-info {
  margin-bottom: 15px;
}

.price-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.current-price {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.price-value {
  font-size: 1.5rem;
}

.price-change {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
}

.price-change.positive {
  background-color: var(--success-light);
  color: var(--success-color);
}

.price-change.negative {
  background-color: var(--danger-light);
  color: var(--danger-color);
}

.period {
  font-size: 0.8rem;
  opacity: 0.8;
}

.chart-placeholder {
  height: 250px;
  position: relative;
  background: #f9f9f9;
  border-radius: 4px;
  overflow: hidden;
}

.chart-area {
  width: 100%;
  height: 100%;
}

.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
}

.github-activity {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  padding: 12px;
  background: var(--bg-color);
  border-radius: 4px;
}

.activity-repo {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.repo-name {
  font-weight: 600;
  color: var(--primary-color);
}

.activity-time {
  font-size: 0.85rem;
  color: var(--text-light);
}

.activity-message {
  margin-bottom: 5px;
  font-size: 0.95rem;
}

.activity-author {
  font-size: 0.85rem;
  color: var(--text-light);
}

.activity-author a {
  color: var(--primary-color);
  font-weight: 500;
}

.unlocks-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.unlock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 4px;
}

.unlock-date {
  font-weight: 600;
  margin-bottom: 5px;
}

.unlock-amount {
  color: var(--text-light);
}

.unlock-percentage {
  text-align: right;
}

.unlock-label {
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 3px;
}

.unlock-value {
  font-weight: 600;
  color: var(--primary-color);
}

.proposals-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.proposal-item {
  padding: 12px;
  background: var(--bg-color);
  border-radius: 4px;
}

.proposal-title {
  display: block;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
  text-decoration: none;
}

.proposal-title:hover {
  color: var(--primary-color);
}

.proposal-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.proposal-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.proposal-status.voting {
  background: var(--info-light);
  color: var(--info-color);
}

.proposal-status.deposit {
  background: var(--warning-light);
  color: var(--warning-color);
}

.proposal-time {
  font-size: 0.85rem;
  color: var(--text-light);
}

.investors-section {
  padding: 15px;
}

.investor-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.investor-stat {
  text-align: center;
  padding: 10px;
  background: var(--bg-color);
  border-radius: 4px;
  flex: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 5px;
}

.stat-value {
  font-weight: 600;
  color: var(--secondary-color);
}

.investors-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.investor-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.investor-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 5px;
  object-fit: cover;
  background: #f0f0f0;
}

.investor-name {
  font-size: 0.85rem;
}

.tokenomics-chart {
  padding: 15px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.bonded {
  background-color: var(--primary-color);
}

.legend-color.unbonded {
  background-color: #e9ecef;
}

.supply-chart {
  height: 30px;
  display: flex;
  margin-bottom: 20px;
  border-radius: 15px;
  overflow: hidden;
}

.bonded-supply {
  height: 100%;
  background-color: var(--primary-color);
}

.unbonded-supply {
  height: 100%;
  background-color: #e9ecef;
}

.supply-info {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.supply-item {
  padding: 5px 0;
  min-width: 120px;
}

.supply-label {
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 3px;
}

.supply-value {
  font-weight: 600;
}

.supply-item.total {
  width: 100%;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.supply-item.total .supply-label {
  font-size: 0.9rem;
  color: var(--text-color);
  margin-bottom: 0;
}

.supply-item.total .supply-value {
  font-size: 1.1rem;
}

.no-data {
  padding: 30px 20px;
  text-align: center;
  color: var(--text-light);
  background: var(--bg-color);
  border-radius: 4px;
}

@media (max-width: 992px) {
  .main-content {
    flex-direction: column;
  }
  
  .content-left, .content-right {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .project-info, .network-info {
    width: 100%;
  }
  
  .investors-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .price-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .investor-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .investors-list {
    grid-template-columns: 1fr;
  }
}
</style> 