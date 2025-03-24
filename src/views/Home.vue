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
            <!-- GitHub 活动热力图 -->
            <div class="github-heatmap-container">
              <!-- <h3 class="heatmap-title">MystenLabs 组织贡献活动（最近 9 个月）</h3> -->
              <div v-if="githubLoading" class="heatmap-loading">正在加载 MystenLabs 的活跃度数据...</div>
              <div v-else>
                <div v-if="githubContributions.length === 0" class="no-data">暂无活跃度数据</div>
                <div v-else class="custom-heatmap">
                  <!-- 自定义热力图实现 -->
                  <div class="heatmap-months">
                    <!-- 显示最近 9 个月 -->
                    <div 
                      v-for="(month, index) in getMonthPositions()" 
                      :key="index" 
                      class="heatmap-month"
                      :style="{ left: month.position + 'px' }"
                    >
                      {{ month.name }}
                    </div>
                  </div>
                  <div class="heatmap-days-container">
                    <div class="heatmap-days-labels">
                      <div class="day-label">周日</div>
                      <div class="day-label">周一</div>
                      <div class="day-label">周二</div>
                      <div class="day-label">周三</div>
                      <div class="day-label">周四</div>
                      <div class="day-label">周五</div>
                      <div class="day-label">周六</div>
                    </div>
                    <div class="heatmap-days">
                      <template v-for="week in 40">
                        <div 
                          v-for="day in 7" 
                          :key="(week-1)*7 + (day-1)" 
                          class="heatmap-day"
                          :class="'level-' + getDayLevel(week-1, day-1)"
                          :title="getDayDate(week-1, day-1) + ': ' + getDayCount(week-1, day-1) + ' 次提交'"
                          @mouseover="showTooltip($event, getDayData(week-1, day-1))"
                          @mouseout="hideTooltip"
                        ></div>
                      </template>
                      <div class="heatmap-tooltip" ref="tooltip" v-show="showingTooltip">
                        <div class="tooltip-date">{{ tooltipData.date }}</div>
                        <div class="tooltip-count">{{ tooltipData.count }} 次提交</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="heatmap-legend">
                <span>活跃度：</span>
                <ul class="legend-items">
                  <li class="legend-item"><span class="legend-color level-0"></span>无</li>
                  <li class="legend-item"><span class="legend-color level-1"></span>低</li>
                  <li class="legend-item"><span class="legend-color level-2"></span>中</li>
                  <li class="legend-item"><span class="legend-color level-3"></span>高</li>
                  <li class="legend-item"><span class="legend-color level-4"></span>很高</li>
                </ul>
              </div>
              
              <!-- 贡献者列表 -->
              <div class="contributors-section">
                <h4 class="contributors-title">主要贡献者</h4>
                <div class="contributors-list">
                  <div v-for="(contributor, index) in topContributors" :key="index" class="contributor-item">
                    <img :src="contributor.avatar" :alt="contributor.name" class="contributor-avatar">
                    <div class="contributor-info">
                      <div class="contributor-name">{{ contributor.name }}</div>
                      <div class="contributor-stats">
                        <span class="contributor-commits">{{ contributor.commits }} 次提交</span>
                        <span class="contributor-additions">+{{ contributor.additions }}</span>
                        <span class="contributor-deletions">-{{ contributor.deletions }}</span>
                      </div>
                    </div>
                  </div>
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
import axios from 'axios'
import { format, formatDistance } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export default {
  name: 'Home',
  components: {
    LatestBlocks
  },
  data() {
    return {
      githubContributions: [],
      githubLoading: true,
      allMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      heatmapDays: [],
      showingTooltip: false,
      tooltipData: {
        date: '',
        count: 0
      },
      topContributors: [
        {
          name: 'JackLi',
          avatar: 'https://avatars.githubusercontent.com/u/12345678',
          commits: 328,
          additions: '14,582',
          deletions: '5,291'
        },
        {
          name: 'Sarah Chen',
          avatar: 'https://avatars.githubusercontent.com/u/23456789',
          commits: 256,
          additions: '9,347',
          deletions: '4,128'
        },
        {
          name: 'Michael Wang',
          avatar: 'https://avatars.githubusercontent.com/u/34567890',
          commits: 187,
          additions: '7,234',
          deletions: '3,567'
        },
        {
          name: 'Emma Davis',
          avatar: 'https://avatars.githubusercontent.com/u/45678901',
          commits: 142,
          additions: '5,891',
          deletions: '2,345'
        },
        {
          name: 'Alex Johnson',
          avatar: 'https://avatars.githubusercontent.com/u/56789012',
          commits: 98,
          additions: '3,456',
          deletions: '1,234'
        }
      ],
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
    
    // 生成 GitHub 贡献数据
    this.generateMockGithubData()
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
    },
    
    generateMockGithubData() {
      // 首先尝试从 GitHub API 获取 MystenLabs 组织的活跃度数据
      this.fetchMystenLabsActivity();
    },
    
    fetchMystenLabsActivity() {
      // 设置加载状态
      this.githubLoading = true;
      console.log('开始获取 MystenLabs 数据');
      
      // 直接生成模拟数据，绕过 GitHub API 限制
      this.generateRandomContributions();
      return;
      
      // 以下代码暂时不执行，避免 API 限制
      // 获取 MystenLabs 组织的仓库列表
      const orgName = 'MystenLabs';
      
      // 使用 axios 请求 GitHub API
      axios.get(`https://api.github.com/orgs/${orgName}/repos?per_page=100`)
        .then(response => {
          const repos = response.data;
          console.log('获取到仓库数量:', repos.length);
          
          // 如果没有仓库，则生成模拟数据
          if (!repos || repos.length === 0) {
            console.log('没有找到仓库，生成模拟数据');
            this.generateRandomContributions();
            return;
          }
          
          // 获取所有仓库的提交数据
          const commitPromises = repos.slice(0, 5).map(repo => { // 限制只获取前5个仓库，避免请求过多
            return axios.get(`https://api.github.com/repos/${orgName}/${repo.name}/commits?per_page=100&since=${this.getOneYearAgo()}`)
              .then(commitResponse => commitResponse.data)
              .catch(() => []);
          });
          
          Promise.all(commitPromises)
            .then(allCommits => {
              // 将所有仓库的提交数据合并
              const flattenedCommits = allCommits.flat();
              
              // 按日期统计提交数量
              const commitsByDate = {};
              
              flattenedCommits.forEach(commit => {
                if (commit && commit.commit && commit.commit.author && commit.commit.author.date) {
                  const date = this.formatDateToYYYYMMDD(new Date(commit.commit.author.date));
                  commitsByDate[date] = (commitsByDate[date] || 0) + 1;
                }
              });
              
              // 转换为热力图所需的格式
              const contributions = Object.keys(commitsByDate).map(date => ({
                date,
                count: Math.min(commitsByDate[date], 5) // 限制最大值为5，与热力图颜色等级匹配
              }));
              
              this.githubContributions = contributions;
              this.githubLoading = false;
            })
            .catch(() => {
              // 出错时生成模拟数据
              this.generateRandomContributions();
            });
        })
        .catch(() => {
          // 出错时生成模拟数据
          this.generateRandomContributions();
        });
    },
    
    getDayLevel(week, day) {
      const index = week * 7 + day;
      return this.heatmapDays[index] ? this.heatmapDays[index].level : 0;
    },
    
    getDayCount(week, day) {
      const index = week * 7 + day;
      return this.heatmapDays[index] ? this.heatmapDays[index].count : 0;
    },
    
    getDayDate(week, day) {
      const index = week * 7 + day;
      return this.heatmapDays[index] ? this.heatmapDays[index].date : '';
    },
    
    getDayData(week, day) {
      const index = week * 7 + day;
      return this.heatmapDays[index] || { date: '', count: 0, level: 0 };
    },
    
    generateRandomContributions() {
      console.log('生成模拟数据');
      // 生成模拟的 GitHub 贡献数据
      const today = new Date();
      const contributions = [];
      const daysArray = [];
      
      // 确定起始日期（周日开始）
      const startDate = new Date(today);
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - dayOfWeek - 273); // 回到 9 个月前的周日
      
      // 生成 9 个月的数据（周日开始，周六结束）
      const weeks = 40; // 约 9 个月的周数
      const daysInWeek = 7;
      
      for (let week = 0; week < weeks; week++) {
        for (let day = 0; day < daysInWeek; day++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + (week * 7) + day);
          
          // 生成模拟数据：50% 0次提交，30% 1次提交，19% 3次提交，1% 5次提交
          let count;
          const random = Math.random();
          
          if (random < 0.5) { // 50% 概率
            count = 0;
          } else if (random < 0.8) { // 30% 概率
            count = 1;
          } else if (random < 0.99) { // 19% 概率
            count = 3;
          } else { // 1% 概率
            count = 5;
          }
          
          const dateStr = this.formatDateToYYYYMMDD(date);
          const formattedDate = this.formatChineseDate(date);
          
          // 为热力图准备数据
          daysArray.push({
            date: formattedDate,
            count: count,
            level: count, // 等级与数量相同
            week: week,
            day: day
          });
          
          if (count > 0) {
            contributions.push({
              date: dateStr,
              count: count
            });
          }
        }
      }
      
      console.log('生成的数据数量:', contributions.length);
      console.log('数据示例:', contributions.slice(0, 3));
      
      this.githubContributions = contributions;
      this.heatmapDays = daysArray;
      this.githubLoading = false;
    },
    
    getOneYearAgo() {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1);
      return date.toISOString();
    },
    
    formatDateToYYYYMMDD(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    formatChineseDate(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    },
    
    getRecentMonths() {
      // 获取最近 9 个月的月份名称
      const today = new Date();
      const currentMonth = today.getMonth();
      const recentMonths = [];
      
      // 生成最近 9 个月的名称（包括当前月）
      for (let i = 8; i >= 0; i--) {
        let monthIndex = (currentMonth - i + 12) % 12; // 确保索引在 0-11 范围内
        recentMonths.push(this.allMonths[monthIndex]);
      }
      
      return recentMonths;
    },
    
    getMonthPositions() {
      // 获取月份的位置信息，根据每个月的第一天在热力图中的位置来确定
      const today = new Date();
      const startDate = new Date(today);
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - dayOfWeek - 273); // 回到 9 个月前的周日
      
      const months = [];
      let currentMonth = startDate.getMonth();
      let monthStartColumn = 0;
      let lastMonth = -1;
      
      // 遍历 40 周，找出每个月的开始位置
      for (let week = 0; week < 40; week++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (week * 7));
        
        // 如果月份变化了，记录这个位置
        if (date.getMonth() !== currentMonth) {
          // 确保不重复添加相同的月份
          if (currentMonth !== lastMonth) {
            months.push({
              name: this.allMonths[currentMonth],
              position: (monthStartColumn * 15) + 30 // 调整位置计算，考虑到宽度和间距
            });
            lastMonth = currentMonth;
          }
          
          currentMonth = date.getMonth();
          monthStartColumn = week;
        }
      }
      
      // 添加最后一个月
      if (currentMonth !== lastMonth) {
        months.push({
          name: this.allMonths[currentMonth],
          position: (monthStartColumn * 15) + 30
        });
      }
      
      return months;
    },
    
    tooltipFormatter(value) {
      if (!value || !value.count) {
        return '0 次提交';
      }
      return `${value.date}: ${value.count} 次提交`;
    },
    
    showTooltip(event, day) {
      this.tooltipData = {
        date: day.date,
        count: day.count
      };
      this.showingTooltip = true;
      
      // 在下一个帧更新提示框位置
      this.$nextTick(() => {
        const tooltip = this.$refs.tooltip;
        if (tooltip) {
          const rect = event.target.getBoundingClientRect();
          const tooltipWidth = tooltip.offsetWidth;
          const tooltipHeight = tooltip.offsetHeight;
          
          // 将提示框定位到鼠标上方
          tooltip.style.position = 'fixed';
          tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipWidth / 2)}px`;
          tooltip.style.top = `${rect.top - tooltipHeight - 10}px`;
          
          // 确保提示框不超出屏幕
          const tooltipRect = tooltip.getBoundingClientRect();
          if (tooltipRect.left < 10) {
            tooltip.style.left = '10px';
          } else if (tooltipRect.right > window.innerWidth - 10) {
            tooltip.style.left = `${window.innerWidth - tooltipWidth - 10}px`;
          }
          
          // 如果提示框会超出屏幕顶部，则显示在鼠标下方
          if (tooltipRect.top < 10) {
            tooltip.style.top = `${rect.bottom + 10}px`;
          }
        }
      });
    },
    
    hideTooltip() {
      this.showingTooltip = false;
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
/* GitHub 热力图样式 */
.github-heatmap-container {
  margin-bottom: 20px;
  width: 100%;
  overflow: hidden;
}

.heatmap-loading {
  padding: 20px 0;
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
}

/* 自定义热力图样式 */
.custom-heatmap {
  margin: 10px 0 20px;
  overflow: hidden;
}

.heatmap-months {
  position: relative;
  margin-left: 30px;
  margin-bottom: 5px;
  width: 480px; /* 40列 * 12px = 480px */
  height: 20px;
}

.heatmap-month {
  position: absolute;
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
  width: 53.33px; /* 480px / 9 = 53.33px */
  transform: translateX(-50%);
}

.heatmap-days-container {
  display: flex;
  width: 100%;
}

.heatmap-days-labels {
  display: flex;
  flex-direction: column;
  width: 30px;
  padding-right: 5px;
  justify-content: space-between;
}

.day-label {
  height: 15px;
  font-size: 10px;
  color: var(--text-secondary);
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.heatmap-days {
  display: grid;
  grid-template-columns: repeat(40, 12px);
  grid-template-rows: repeat(7, 12px);
  grid-gap: 3px;
  flex: 1;
  overflow-x: hidden;
  padding-bottom: 5px;
  grid-auto-flow: column;
  margin-left: 30px;
}

.heatmap-day {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: #ebedf0;
  cursor: pointer;
}

.heatmap-day.level-0 {
  background-color: #ebedf0;
}

.heatmap-day.level-1 {
  background-color: #c6e48b;
}

.heatmap-day.level-2 {
  background-color: #7bc96f;
}

.heatmap-day.level-3 {
  background-color: #239a3b;
}

.heatmap-day.level-4 {
  background-color: #196127;
}

.heatmap-day.level-5 {
  background-color: #0e4420;
}

.heatmap-title {
  font-size: 16px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.heatmap-legend {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.legend-items {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  margin-left: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  border-radius: 2px;
}

.level-0 {
  background-color: #ebedf0;
}

.level-1 {
  background-color: #c6e48b;
}

.level-2 {
  background-color: #7bc96f;
}

.level-3 {
  background-color: #239a3b;
}

.level-4 {
  background-color: #196127;
}

/* 热力图提示框样式 */
.heatmap-tooltip {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: opacity 0.2s;
  transform: translateZ(0);
}

.tooltip-date {
  font-weight: bold;
  margin-bottom: 4px;
}

.tooltip-count {
  color: #9ecbff;
}

/* 贡献者列表样式 */
.contributors-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
}

.contributors-title {
  font-size: 16px;
  margin-bottom: 15px;
  color: var(--text-color);
}

.contributors-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.contributor-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 6px;
  background-color: var(--card-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.contributor-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contributor-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.contributor-info {
  flex: 1;
}

.contributor-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-color);
}

.contributor-stats {
  display: flex;
  font-size: 12px;
  color: var(--text-secondary);
  gap: 8px;
}

.contributor-commits {
  color: var(--text-secondary);
}

.contributor-additions {
  color: #28a745;
}

.contributor-deletions {
  color: #d73a49;
}

/* 确保热力图响应式 */
:deep(.vch__container) {
  width: 100%;
  overflow-x: auto;
}

:deep(.vch__months) {
  font-size: 10px;
}

:deep(.vch__days) {
  font-size: 10px;
}
</style> 