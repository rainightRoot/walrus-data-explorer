<template>
  <div class="home-page">
    <!-- Project overview and market data -->
    <div class="page-header">
      <div class="project-info">
        <h1>About Walrus</h1>
        <p class="project-description">
          Walrus is a decentralized storage and data availability protocol designed specifically for large binary files, or "blobs". Walrus focuses on providing a robust but affordable solution for storing unstructured content on decentralized storage nodes while ensuring high availability and reliability even in the presence of Byzantine faults.
        </p>
        <div class="project-links">
          <a href="https://www.walrus.xyz/" target="_blank" class="link-item">Website</a>
          <a href="https://docs.walrus.site/" target="_blank" class="link-item">Docs</a>
          <a href="https://x.com/walrusprotocol" target="_blank" class="link-item">X</a>
          <a href="https://discord.com/invite/walrusprotocol" target="_blank" class="link-item">Discord</a>
          <!-- <a href="https://www.coingecko.com/en/coins/celestia" target="_blank" class="link-item">CoinGecko</a> -->
        </div>
      </div>
      <!-- <div class="network-info">
        <div class="info-item">
          <span class="label">Market Cap</span>
          <span class="value">{{ marketCap }}</span>
        </div>
        <div class="info-item">
          <span class="label">24h Volume</span>
          <span class="value">{{ volume24h }}</span>
        </div>
      </div> -->
    </div>

    <div class="main-content">
      <div class="content-left">
        <!-- TIA Chart -->
        <div class="card chart-card">
          <div class="card-header">
            <h2>Walrus Chart</h2>
          </div>
          <div class="card-body">
            <iframe src="https://s.tradingview.com/widgetembed/?hideideas=1&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en#%7B%22symbol%22%3A%22BYBIT%3AWALUSDT%22%2C%22frameElementId%22%3A%22tradingview_4d082%22%2C%22interval%22%3A%2260%22%2C%22hide_side_toolbar%22%3A%220%22%2C%22allow_symbol_change%22%3A%221%22%2C%22save_image%22%3A%221%22%2C%22studies%22%3A%22%5B%5D%22%2C%22theme%22%3A%22light%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22withdateranges%22%3A%221%22%2C%22studies_overrides%22%3A%22%7B%7D%22%2C%22utm_source%22%3A%22cryptorank.io%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22chart%22%2C%22utm_term%22%3A%22BYBIT%3AWALUSDT%22%2C%22page-uri%22%3A%22cryptorank.io%2Fprice%2Fwalrus-protocol%22%7D" frameborder="0" width="100%" height="400px"></iframe>
          </div>
        </div>

        <!-- GitHub Activity -->
        <div class="card">
          <div class="card-header">
            <h2>GitHub Activity</h2>
            <a href="https://github.com/MystenLabs" target="_blank" class="view-all-link">View All</a>
          </div>
          <div class="card-body">
            <!-- GitHub activity heatmap section -->
            <div class="github-heatmap-container">
              <!-- <h3 class="heatmap-title">MystenLabs Organization Contribution Activity (Last 9 Months)</h3> -->
              <div v-if="githubLoading" class="heatmap-loading">Loading MystenLabs activity data...</div>
              <div v-else>
                <div v-if="githubContributions.length === 0" class="no-data">No activity data available</div>
                <div v-else class="custom-heatmap">
                  <!-- Custom heatmap implementation -->
                  <div class="heatmap-months">
                    <!-- Display last 9 months -->
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
                      <div class="day-label"></div>
                      <div class="day-label">Mon</div>
                      <div class="day-label"></div>
                      <div class="day-label">Wed</div>
                      <div class="day-label"></div>
                      <div class="day-label">Fri</div>
                      <div class="day-label"></div>
                    </div>
                    <div class="heatmap-days">
                      <template v-for="week in 40">
                        <div 
                          v-for="day in 7" 
                          :key="(week-1)*7 + (day-1)" 
                          class="heatmap-day"
                          :class="'level-' + getDayLevel(week-1, day-1)"
                          :title="formatTooltipDate(getDayData(week-1, day-1))"
                          @mouseover="showTooltip($event, getDayData(week-1, day-1))"
                          @mouseout="hideTooltip"
                        ></div>
                      </template>
                      <div class="heatmap-tooltip" ref="tooltip" v-show="showingTooltip">
                        <div class="tooltip-date">{{ formatTooltipDate(tooltipData) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="heatmap-legend" style="justify-content: flex-end;">
                <span class="legend-text">Less</span>
                <ul class="legend-items">
                  <li class="legend-item"><span class="legend-color level-0"></span></li>
                  <li class="legend-item"><span class="legend-color level-1"></span></li>
                  <li class="legend-item"><span class="legend-color level-2"></span></li>
                  <li class="legend-item"><span class="legend-color level-3"></span></li>
                  <li class="legend-item"><span class="legend-color level-4"></span></li>
                </ul>
                <span class="legend-text">More</span>
              </div>
              
              <!-- Contributors list -->
              <div class="contributors-section">
                <h4 class="contributors-title">Top Contributors</h4>
                <div v-if="contributorsLoading" class="contributors-loading">
                  Loading contributors data...
                </div>
                <div v-else-if="topContributors.length === 0" class="no-contributors">
                  No contributors data available
                </div>
                <div v-else class="contributors-list">
                  <div v-for="(contributor, index) in topContributors" :key="index" class="contributor-item">
                    <img :src="contributor.avatar" :alt="contributor.name" class="contributor-avatar">
                    <div class="contributor-info">
                      <div class="contributor-name">{{ contributor.name }}</div>
                      <div class="contributor-stats">
                        <span class="contributor-commits">{{ contributor.commits }} commits</span>
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
            <h2>Vesting Schedule
            </h2>
          </div>
          <div class="card-body">
            <img src="~@/assets/walrus_token_release_schedule.png" width="100%" alt="">            

          </div>
        </div>
      </div>

      <div class="content-right">
        <!-- Latest Blocks -->
        <div class="card">
          <div class="card-header">
            <h2>Latest Blobs</h2>
            <router-link to="/blobs" class="view-all-link">View All</router-link>
          </div>
          <div class="card-body no-padding">
            <LatestBlobs :data-theme="theme" />
          </div>
        </div>

        <!-- Active Proposals -->
        <div class="card">
            <iframe width="100%" height="400px" src="https://syndication.twitter.com/srv/timeline-profile/screen-name/walrusprotocol?dnt=false&embedId=twitter-widget-0&features=eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOltdLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2ZvbGxvd2VyX2NvdW50X3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9iYWNrZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19yZWZzcmNfc2Vzc2lvbiI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfZm9zbnJfc29mdF9pbnRlcnZlbnRpb25zX2VuYWJsZWQiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X21peGVkX21lZGlhXzE1ODk3Ijp7ImJ1Y2tldCI6InRyZWF0bWVudCIsInZlcnNpb24iOm51bGx9LCJ0ZndfZXhwZXJpbWVudHNfY29va2llX2V4cGlyYXRpb24iOnsiYnVja2V0IjoxMjA5NjAwLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3Nob3dfYmlyZHdhdGNoX3Bpdm90c19lbmFibGVkIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19kdXBsaWNhdGVfc2NyaWJlc190b19zZXR0aW5ncyI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdXNlX3Byb2ZpbGVfaW1hZ2Vfc2hhcGVfZW5hYmxlZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdmlkZW9faGxzX2R5bmFtaWNfbWFuaWZlc3RzXzE1MDgyIjp7ImJ1Y2tldCI6InRydWVfYml0cmF0ZSIsInZlcnNpb24iOm51bGx9LCJ0ZndfbGVnYWN5X3RpbWVsaW5lX3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9mcm9udGVuZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9fQ%3D%3D&frame=false&hideBorder=false&hideFooter=true&hideHeader=false&hideScrollBar=false&lang=en&maxHeight=480px&origin=https%3A%2F%2Fdropstab.com%2Fcoins%2Fwalrus-protocol&sessionId=7b10ee2a8ec5056862e91b1096fde8a025677f23&showHeader=true&showReplies=false&theme=light&transparent=false&widgetsVersion=2615f7e52b7e0%3A1702314776716" frameborder="0"></iframe>
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
                <div class="stat-value">$140M</div>
              </div>
              <div class="investor-stat">
                <div class="stat-label">Tokens Sold</div>
                <div class="stat-value">0 WAL</div>
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
            <img src="~@/assets/walrus_token_omics.png" width="100%" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LatestBlobs from '@/components/LatestBlobs.vue'
import axios from 'axios'
import { format, formatDistance } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export default {
  name: 'Home',
  components: {
    LatestBlobs
  },
  data() {
    return {
      githubContributions: [],
      githubLoading: true,
      allMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      heatmapDays: [],
      showingTooltip: false,
      tooltipData: {
        date: '',
        count: 0
      },
      topContributors: [],
      contributorsLoading: false,
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
          time: new Date(Date.now() - 3600000 * 3) // 3 hours ago
        },
        {
          repo: 'celestiaorg/celestia-app',
          message: 'fix: resolve performance issue in state sync',
          author: 'devuser42',
          time: new Date(Date.now() - 3600000 * 8) // 8 hours ago
        },
        {
          repo: 'celestiaorg/celestia-core',
          message: 'feat: implement new consensus optimizations',
          author: 'cosmicdev',
          time: new Date(Date.now() - 3600000 * 24) // 1 day ago
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
          title: 'Proposal to Increase Maximum Validator Count',
          status: 'voting',
          endTime: new Date(Date.now() + 3600000 * 72) // Ends in 3 days
        },
        {
          id: 11,
          title: 'Community Pool Fund Allocation Proposal',
          status: 'deposit',
          endTime: new Date(Date.now() + 3600000 * 24) // Starts in 1 day
        }
      ],
      investors: [
        { name: 'Andreessen Horowitz (a16z)', logo: '/images/investors/a16z.webp' },
        { name: 'Electric Capital', logo: '/images/investors/electric-capital.webp' },
        { name: 'Standard Crypto',lead:true, logo: '/images/investors/standard-crypto.webp' },
        { name: 'Franklin Templeton', logo: '/images/investors/franklin-templeton.webp' },
        { name: 'Lvna Capital', logo: '/images/investors/lvna-capital.webp' },
        { name: 'Protagonist', logo: '/images/investors/protagonist.webp' },
        { name: 'Comma3 Ventures', logo: '/images/investors/comma3-ventures.webp' },
        { name: 'Karatage', logo: '/images/investors/karatage.webp' },
        { name: 'RW3 Ventures', logo: '/images/investors/rw3-ventures.webp' },
        { name: 'Raptor Group', logo: '/images/investors/raptor-group.webp' },
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
    
    // 获取 GitHub 贡献数据
    this.fetchGithubContributions()
    
    // 获取顶级贡献者列表
    this.fetchTopContributors()
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
      if (!this.heatmapDays || !this.heatmapDays[index]) return 0;
      const count = this.heatmapDays[index].count || 0;
      // 确保当count为0时，级别也为0
      return count === 0 ? 0 : (this.heatmapDays[index].level || 0);
    },
    
    getDayCount(week, day) {
      const index = week * 7 + day;
      if (!this.heatmapDays || !this.heatmapDays[index]) return 0;
      return this.heatmapDays[index].count || 0;
    },
    
    getDayDate(week, day) {
      const index = week * 7 + day;
      if (!this.heatmapDays || !this.heatmapDays[index]) return '';
      return this.heatmapDays[index].date || '';
    },
    
    getDayData(week, day) {
      const index = week * 7 + day;
      if (!this.heatmapDays || index >= this.heatmapDays.length) return { date: '', count: 0, level: 0 };
      return this.heatmapDays[index] || { date: '', count: 0, level: 0 };
    },
    
    fetchGithubContributions() {
      console.log('从API获取GitHub贡献数据');
      this.githubLoading = true;
      
      // 获取当前日期
      const today = new Date();
      const dayOfWeek = today.getDay();
      
      // 计算起始日期（9个月前的周日）
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - dayOfWeek - 273); // 回到 9 个月前的周日
      
      // 计算结束日期（今天）
      const endDate = new Date(today);
      
      console.log('热力图时间范围:', this.formatDateToYYYYMMDD(startDate), '到', this.formatDateToYYYYMMDD(endDate));
      
      // 创建一个空的贡献数据数组
      const daysArray = [];
      
      // 初始化 40 周 x 7 天的空数据结构
      for (let week = 0; week < 40; week++) {
        for (let day = 0; day < 7; day++) {
          // 计算当前日期
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + (week * 7) + day);
          
          // 如果日期超过今天，则设置为空
          if (date > today) {
            daysArray.push({
              date: null,
              count: 0,
              level: 0,
              week: week,
              day: day
            });
            continue;
          }
          
          const dateStr = this.formatDateToYYYYMMDD(date);
          const formattedDate = this.formatChineseDate(date);
          
          daysArray.push({
            date: formattedDate,
            rawDate: dateStr,
            count: 0,
            level: 0,
            week: week,
            day: day
          });
        }
      }
      
      // 从API获取数据
      axios.get('https://walrus-api.equinoxdao.xyz/api/github/commits/heatmap')
        .then(response => {
          const allContributions = response.data.data || [];
          console.log('API返回的原始数据数量:', allContributions.length);
          
          // 过滤出最近9个月的数据
          const nineMonthsAgoStr = this.formatDateToYYYYMMDD(startDate);
          const contributions = allContributions.filter(item => {
            return item.date >= nineMonthsAgoStr && item.date <= this.formatDateToYYYYMMDD(endDate);
          });
          
          console.log('最近9个月的数据数量:', contributions.length);
          
          if (contributions.length > 0) {
            console.log('数据示例:', contributions.slice(0, 3));
            
            // 更新heatmapDays中的贡献数据
            contributions.forEach(contribution => {
              const date = contribution.date;
              const count = contribution.count || 0;
              
              // 计算活跃度级别（0-4）
              let level = 0;
              if (count === 0) level = 0;
              else if (count > 0 && count <= 2) level = 1;
              else if (count <= 5) level = 2;
              else if (count <= 9) level = 3;
              else if (count > 9) level = 4;
              
              // 更新对应日期的数据
              const dayIndex = daysArray.findIndex(day => day.rawDate === date);
              if (dayIndex !== -1) {
                daysArray[dayIndex].count = count;
                daysArray[dayIndex].level = level;
              }
            });
            
            // 打印热力图数据设置情况
            console.log('热力图数据设置完成，有数据的天数:', daysArray.filter(day => day.count > 0).length);
          }
          
          this.githubContributions = contributions;
          this.heatmapDays = daysArray;
          this.githubLoading = false;
        })
        .catch(error => {
          console.error('获取GitHub贡献数据失败:', error);
          this.githubContributions = [];
          this.heatmapDays = daysArray;
          this.githubLoading = false;
        });
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
      return format(date, 'MMM d, yyyy', { locale: enUS });
    },
    
    formatTooltipDate(day) {
      if (!day || !day.date) return 'No data available';
      
      const formattedDate = this.formatChineseDate(new Date(day.date));
      
      if (day.count === 0) {
        return `No contributions on ${formattedDate}`;
      } else if (day.count === 1) {
        return `1 contribution on ${formattedDate}`;
      } else {
        return `${day.count} contributions on ${formattedDate}`;
      }
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
    
    fetchTopContributors() {
      console.log('从API获取顶级贡献者数据');
      this.contributorsLoading = true;
      
      axios.get('https://walrus-api.equinoxdao.xyz/api/github/contributors')
        .then(response => {
          const contributors = response.data.data || [];
          console.log('获取到的贡献者数量:', contributors.length);
          
          if (contributors.length > 0) {
            // 处理贡献者数据
            this.topContributors = contributors.map(contributor => ({
              name: contributor.name || contributor.login || 'Anonymous',
              avatar: contributor.avatar_url || 'https://avatars.githubusercontent.com/u/0',
              commits: contributor.commits || 0,
              additions: this.formatNumber(contributor.additions || 0),
              deletions: this.formatNumber(contributor.deletions || 0)
            }));
            
            console.log('处理后的贡献者数据:', this.topContributors.slice(0, 2));
          } else {
            this.topContributors = [];
          }
          
          this.contributorsLoading = false;
        })
        .catch(error => {
          console.error('获取贡献者数据失败:', error);
          this.topContributors = [];
          this.contributorsLoading = false;
        });
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
        return '0 commits';
      }
      return `${value.date}: ${value.count} commits`;
    },
    
    showTooltip(event, day) {
      this.tooltipData = day;
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
  },
  computed: {
    theme() {
      return document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    }
  }
}
</script>

<style scoped>
.home-page {
  margin-bottom: 40px;
  background-color: var(--bg-color);
}

.page-header {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  border: 1px solid var(--border-color);
}

[data-theme="dark"] .page-header {
  background-color: #1e1e1e;
  border-color: #333;
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

[data-theme="dark"] .project-description {
  color: #ddd;
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

[data-theme="dark"] .project-links a {
  background-color: #333;
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
/* GitHub activity heatmap section */
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

/* Custom heatmap implementation */
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
[data-theme="dark"] .heatmap-months {
  position: relative;
  margin-left: 30px;
  margin-bottom: 5px;
  width: 480px; /* 40列 * 12px = 480px */
  height: 20px;
  color: #b0b3b8;
}

[data-theme="dark"] .heatmap-day.level-0 {
  background-color: #161b22;
}

[data-theme="dark"] .level-0 {
  background-color: #161b22;
}

[data-theme="dark"] .heatmap-days-labels{
  color: #b0b3b8;

}
[data-theme="dark"] .contributor-commits{
  color: #b0b3b8;

}
[data-theme="dark"] .unlock-date{
  color: #b0b3b8;

}
[data-theme="dark"] .investor-name{
  color: #b0b3b8;

}
[data-theme="dark"] .supply-value{
  color: #b0b3b8;

}
[data-theme="dark"] .legend-item{
  color: #b0b3b8;

}
[data-theme="dark"] .current-price{
  color: #b0b3b8;

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
  background-color: #9be9a8;
}

.heatmap-day.level-2 {
  background-color: #40c463;
}

.heatmap-day.level-3 {
  background-color: #30a14e;
}

.heatmap-day.level-4 {
  background-color: #216e39;
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
  margin: 0 1px;
}

.legend-color {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.level-0 {
  background-color: #ebedf0;
}

.level-1 {
  background-color: #9be9a8;
}

.level-2 {
  background-color: #40c463;
}

.level-3 {
  background-color: #30a14e;
}

.level-4 {
  background-color: #216e39;
}

/* Heatmap tooltip styles */
.heatmap-tooltip {
  position: fixed;
  background-color: rgba(36, 41, 46, 0.95);
  color: white;
  padding: 8px 10px;
  border-radius: 3px;
  font-size: 12px;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: opacity 0.2s;
  transform: translateZ(0);
  border: 1px solid rgba(27, 31, 35, 0.2);
}

.tooltip-date {
  font-weight: bold;
  margin-bottom: 4px;
}

.tooltip-count {
  color: #9ecbff;
}

/* Contributors section styles */
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

.contributors-loading,
.no-contributors {
  padding: 15px;
  text-align: center;
  color: var(--text-light);
  font-size: 14px;
  background-color: var(--card-bg);
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .contributors-loading,
[data-theme="dark"] .no-contributors {
  color: #b0b3b8;
  background-color: #252525;
  border-color: #333;
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

/* Ensure heatmap responsiveness */
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

/* Dark mode adjustments for heatmap and charts */
[data-theme="dark"] .level-0 {
  background-color: #333;
}

[data-theme="dark"] .level-1 {
  background-color: #4a5d3f;
}

[data-theme="dark"] .level-2 {
  background-color: #5c8a4c;
}

[data-theme="dark"] .level-3 {
  background-color: #6bc64a;
}

[data-theme="dark"] .level-4 {
  background-color: #7fef52;
}

/* Make activity cards and contributors more visible in dark mode */
[data-theme="dark"] .activity-item,
[data-theme="dark"] .contributor-item {
  background-color: #252525;
  border-color: #333;
}

[data-theme="dark"] .unlock-item,
[data-theme="dark"] .stats-item {
  background-color: #222;
  border-color: #333;
}

/* Enhance chart card for dark mode */
[data-theme="dark"] .chart-card {
  background: var(--card-bg);
}

[data-theme="dark"] .period-btn {
  background: #2a2a2a;
  color: #ddd;
  border-color: #444;
}

[data-theme="dark"] .period-btn.active {
  background: var(--primary-color);
  color: white;
}

/* Activity timeline for dark mode */
[data-theme="dark"] .activity-time {
  color: #888;
}

[data-theme="dark"] .activity-message {
  color: #eee;
}

[data-theme="dark"] .view-all-link {
  color: #a48aff;
}

[data-theme="dark"] .heatmap-tooltip {
  background-color: rgba(40, 40, 40, 0.95);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}
</style> 