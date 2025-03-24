<template>
  <div class="governance-page">
    <h1>治理</h1>
    
    <div class="stats-cards">
      <div class="stat-card">
        <h3>总提案数</h3>
        <div class="value">{{ totalProposals }}</div>
      </div>
      <div class="stat-card">
        <h3>投票中的提案</h3>
        <div class="value">{{ votingProposals }}</div>
      </div>
      <div class="stat-card">
        <h3>总投票人数</h3>
        <div class="value">{{ formatNumber(totalVoters) }}</div>
      </div>
    </div>
    
    <div class="proposals-container">
      <div class="filter-tabs">
        <button 
          v-for="status in proposalStatuses" 
          :key="status.value"
          :class="{ active: selectedStatus === status.value }"
          @click="selectedStatus = status.value"
        >
          {{ status.label }} ({{ getStatusCount(status.value) }})
        </button>
      </div>
      
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="filteredProposals.length === 0" class="no-data">没有提案</div>
      <template v-else>
        <div 
          v-for="proposal in filteredProposals" 
          :key="proposal.id"
          class="proposal-card"
        >
          <div class="proposal-header">
            <div class="proposal-id"># {{ proposal.id }}</div>
            <div :class="['proposal-status', proposal.status]">{{ getStatusLabel(proposal.status) }}</div>
          </div>
          <h3 class="proposal-title">
            <router-link :to="`/governance/${proposal.id}`">
              {{ proposal.title }}
            </router-link>
          </h3>
          <div class="proposal-details">
            <div class="proposal-submitter">
              提交者: <router-link :to="`/accounts/${proposal.submitter}`">{{ shortAddress(proposal.submitter) }}</router-link>
            </div>
            <div class="proposal-time">提交时间: {{ formatTime(proposal.submitTime) }}</div>
            <div class="proposal-time">投票结束时间: {{ formatEndTime(proposal.votingEndTime) }}</div>
          </div>
          <div class="proposal-votes">
            <div class="progress-bar">
              <div class="yes" :style="{ width: proposal.yesPercentage + '%' }"></div>
              <div class="no" :style="{ width: proposal.noPercentage + '%' }"></div>
              <div class="abstain" :style="{ width: proposal.abstainPercentage + '%' }"></div>
              <div class="veto" :style="{ width: proposal.vetoPercentage + '%' }"></div>
            </div>
            <div class="votes-legend">
              <div class="vote-type yes">
                <span class="dot"></span>
                <span>是 ({{ proposal.yesPercentage }}%)</span>
              </div>
              <div class="vote-type no">
                <span class="dot"></span>
                <span>否 ({{ proposal.noPercentage }}%)</span>
              </div>
              <div class="vote-type abstain">
                <span class="dot"></span>
                <span>弃权 ({{ proposal.abstainPercentage }}%)</span>
              </div>
              <div class="vote-type veto">
                <span class="dot"></span>
                <span>否决 ({{ proposal.vetoPercentage }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { format, formatDistance } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'

export default {
  name: 'Governance',
  data() {
    return {
      loading: true,
      proposals: [],
      selectedStatus: 'all',
      proposalStatuses: [
        { label: '全部', value: 'all' },
        { label: '投票中', value: 'voting' },
        { label: '已通过', value: 'passed' },
        { label: '已拒绝', value: 'rejected' },
        { label: '已否决', value: 'vetoed' }
      ]
    }
  },
  computed: {
    filteredProposals() {
      if (this.selectedStatus === 'all') {
        return this.proposals
      }
      return this.proposals.filter(p => p.status === this.selectedStatus)
    },
    totalProposals() {
      return this.proposals.length
    },
    votingProposals() {
      return this.proposals.filter(p => p.status === 'voting').length
    },
    totalVoters() {
      return 12568 // 模拟数据
    }
  },
  mounted() {
    this.fetchProposals()
  },
  methods: {
    fetchProposals() {
      this.loading = true
      
      // 模拟API调用
      setTimeout(() => {
        const mockProposals = []
        const statuses = ['voting', 'passed', 'rejected', 'vetoed']
        const titles = [
          '增加验证者数量上限',
          '调整网络交易费用',
          '更新质押奖励机制',
          '升级区块链核心协议',
          '引入社区资金池'
        ]
        
        for (let i = 1; i <= 15; i++) {
          const status = statuses[Math.floor(Math.random() * statuses.length)]
          
          // 根据状态生成不同的投票分布
          let yesPercentage, noPercentage, abstainPercentage, vetoPercentage
          
          if (status === 'passed') {
            yesPercentage = Math.floor(Math.random() * 30) + 65 // 65-95
            noPercentage = Math.floor(Math.random() * 20)
            abstainPercentage = Math.floor(Math.random() * 10)
            vetoPercentage = Math.max(0, 100 - yesPercentage - noPercentage - abstainPercentage)
          } else if (status === 'rejected') {
            noPercentage = Math.floor(Math.random() * 30) + 50 // 50-80
            yesPercentage = Math.floor(Math.random() * 30)
            abstainPercentage = Math.floor(Math.random() * 10)
            vetoPercentage = Math.max(0, 100 - yesPercentage - noPercentage - abstainPercentage)
          } else if (status === 'vetoed') {
            vetoPercentage = Math.floor(Math.random() * 30) + 30 // 30-60
            yesPercentage = Math.floor(Math.random() * 20)
            noPercentage = Math.floor(Math.random() * 20)
            abstainPercentage = Math.max(0, 100 - yesPercentage - noPercentage - vetoPercentage)
          } else { // voting
            yesPercentage = Math.floor(Math.random() * 70)
            noPercentage = Math.floor(Math.random() * (100 - yesPercentage))
            abstainPercentage = Math.floor(Math.random() * (100 - yesPercentage - noPercentage))
            vetoPercentage = 100 - yesPercentage - noPercentage - abstainPercentage
          }
          
          mockProposals.push({
            id: i,
            title: titles[Math.floor(Math.random() * titles.length)] + ` #${i}`,
            status,
            submitter: `celestia1${Math.random().toString(36).substring(2, 15)}`,
            submitTime: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)), // 0-30天前
            votingEndTime: new Date(Date.now() + (status === 'voting' ? 1 : -1) * Math.random() * 14 * 24 * 60 * 60 * 1000), // ±14天
            yesPercentage,
            noPercentage,
            abstainPercentage,
            vetoPercentage
          })
        }
        
        this.proposals = mockProposals
        this.loading = false
      }, 1500)
    },
    getStatusCount(status) {
      if (status === 'all') {
        return this.proposals.length
      }
      return this.proposals.filter(p => p.status === status).length
    },
    getStatusLabel(status) {
      const map = {
        'voting': '投票中',
        'passed': '已通过',
        'rejected': '已拒绝',
        'vetoed': '已否决'
      }
      return map[status] || status
    },
    formatTime(time) {
      return format(time, 'yyyy-MM-dd HH:mm', { locale: zhCN })
    },
    formatEndTime(time) {
      const now = new Date()
      if (time > now) {
        return `${formatDistance(time, now, { locale: zhCN })}后结束`
      } else {
        return `${formatDistance(time, now, { locale: zhCN })}前结束`
      }
    },
    shortAddress(address) {
      if (!address) return ''
      return `${address.substring(0, 8)}...${address.substring(address.length - 5)}`
    },
    formatNumber(num) {
      return new Intl.NumberFormat().format(num)
    }
  }
}
</script>

<style scoped>
.governance-page {
  padding-bottom: 40px;
}
.governance-page h1 {
  margin-bottom: 30px;
}
.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}
.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.stat-card h3 {
  margin-top: 0;
  color: #666;
  font-size: 0.9rem;
  font-weight: normal;
}
.stat-card .value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
}
.proposals-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.filter-tabs button {
  padding: 8px 15px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.filter-tabs button.active {
  background: #42b983;
  color: white;
}
.proposal-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}
.proposal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.proposal-id {
  color: #666;
  font-weight: 500;
}
.proposal-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}
.proposal-status.voting {
  background: #e6f7ee;
  color: #42b983;
}
.proposal-status.passed {
  background: #e6f7ee;
  color: #42b983;
}
.proposal-status.rejected {
  background: #fee;
  color: #e53e3e;
}
.proposal-status.vetoed {
  background: #fef;
  color: #9b59b6;
}
.proposal-title {
  margin: 10px 0;
  font-size: 1.2rem;
}
.proposal-title a {
  color: #2c3e50;
  text-decoration: none;
}
.proposal-title a:hover {
  color: #42b983;
}
.proposal-details {
  margin-bottom: 15px;
  color: #666;
  font-size: 0.9rem;
}
.proposal-details a {
  color: #42b983;
  text-decoration: none;
}
.proposal-votes {
  margin-top: 20px;
}
.progress-bar {
  height: 8px;
  display: flex;
  border-radius: 4px;
  overflow: hidden;
}
.progress-bar .yes {
  background: #42b983;
  height: 100%;
}
.progress-bar .no {
  background: #e53e3e;
  height: 100%;
}
.progress-bar .abstain {
  background: #f39c12;
  height: 100%;
}
.progress-bar .veto {
  background: #9b59b6;
  height: 100%;
}
.votes-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}
.vote-type {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.vote-type.yes .dot {
  background: #42b983;
}
.vote-type.no .dot {
  background: #e53e3e;
}
.vote-type.abstain .dot {
  background: #f39c12;
}
.vote-type.veto .dot {
  background: #9b59b6;
}
.loading, .no-data {
  padding: 40px;
  text-align: center;
  color: #666;
}
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  .votes-legend {
    flex-direction: column;
    gap: 8px;
  }
}
</style> 