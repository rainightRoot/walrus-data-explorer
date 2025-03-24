<template>
  <div class="proposal-detail-page">
    <div class="back-link">
      <router-link to="/governance">
        <span class="back-arrow">←</span> 返回提案列表
      </router-link>
    </div>
    
    <div v-if="loading" class="loading">加载提案数据中...</div>
    <div v-else-if="!proposal" class="error">提案未找到</div>
    <template v-else>
      <div class="proposal-header">
        <div class="proposal-id"># {{ proposal.id }}</div>
        <div :class="['proposal-status', proposal.status]">{{ getStatusLabel(proposal.status) }}</div>
      </div>
      
      <h1 class="proposal-title">{{ proposal.title }}</h1>
      
      <div class="proposal-meta">
        <div class="meta-item">
          <span class="label">提交者:</span>
          <router-link :to="`/accounts/${proposal.submitter}`">
            {{ shortAddress(proposal.submitter) }}
          </router-link>
        </div>
        <div class="meta-item">
          <span class="label">提交时间:</span>
          <span>{{ formatTime(proposal.submitTime) }}</span>
        </div>
        <div class="meta-item">
          <span class="label">投票结束时间:</span>
          <span>{{ formatTime(proposal.votingEndTime) }}</span>
        </div>
        <div class="meta-item">
          <span class="label">提案类型:</span>
          <span>{{ proposal.type }}</span>
        </div>
      </div>
      
      <div class="detail-card">
        <h2>提案详情</h2>
        <div class="proposal-description">
          <div class="section">
            <h3>摘要</h3>
            <p>{{ proposal.summary }}</p>
          </div>
          <div class="section">
            <h3>动机</h3>
            <p>{{ proposal.motivation }}</p>
          </div>
          <div class="section">
            <h3>提案内容</h3>
            <div class="proposal-content">
              {{ proposal.content }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-card">
        <h2>投票情况</h2>
        <div v-if="proposal.status === 'deposit_period'" class="deposit-status">
          <div class="deposit-info">
            <div class="deposit-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: (proposal.depositAmount / proposal.depositThreshold * 100) + '%' }"></div>
              </div>
              <div class="progress-labels">
                <span>{{ formatNumber(proposal.depositAmount) }} TIA</span>
                <span>目标: {{ formatNumber(proposal.depositThreshold) }} TIA</span>
              </div>
            </div>
            <div class="time-remaining">
              <span class="label">存款期剩余时间:</span>
              <span>{{ formatTimeRemaining(proposal.depositEndTime) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="voting-results">
          <div class="votes-summary">
            <div class="votes-percentage">
              <div class="progress-bar">
                <div class="yes" :style="{ width: proposal.yesPercentage + '%' }"></div>
                <div class="no" :style="{ width: proposal.noPercentage + '%' }"></div>
                <div class="abstain" :style="{ width: proposal.abstainPercentage + '%' }"></div>
                <div class="veto" :style="{ width: proposal.vetoPercentage + '%' }"></div>
              </div>
              <div class="votes-legend">
                <div class="vote-type yes">
                  <span class="dot"></span>
                  <span>同意 ({{ proposal.yesPercentage }}%)</span>
                </div>
                <div class="vote-type no">
                  <span class="dot"></span>
                  <span>反对 ({{ proposal.noPercentage }}%)</span>
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
            <div class="votes-count">
              <div class="vote-item">
                <div class="label">总投票:</div>
                <div class="value">{{ formatNumber(proposal.totalVotes) }} TIA</div>
              </div>
              <div class="vote-item">
                <div class="label">投票率:</div>
                <div class="value">{{ proposal.turnout }}%</div>
              </div>
              <div class="vote-item">
                <div class="label">投票人数:</div>
                <div class="value">{{ proposal.votersCount }}</div>
              </div>
              <div v-if="proposal.status === 'voting_period'" class="vote-item">
                <div class="label">剩余时间:</div>
                <div class="value">{{ formatTimeRemaining(proposal.votingEndTime) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-card">
        <h2>投票列表</h2>
        <div v-if="votes.length === 0" class="no-data">暂无投票</div>
        <div v-else class="votes-list">
          <div class="table-header">
            <div class="col-voter">投票者</div>
            <div class="col-option">投票选项</div>
            <div class="col-amount">投票权重</div>
            <div class="col-time">投票时间</div>
          </div>
          <div v-for="vote in votes" :key="vote.id" class="vote-row">
            <div class="col-voter">
              <router-link :to="`/accounts/${vote.voter}`">
                {{ shortAddress(vote.voter) }}
              </router-link>
            </div>
            <div class="col-option">
              <span :class="['vote-option', vote.option]">{{ getVoteOptionLabel(vote.option) }}</span>
            </div>
            <div class="col-amount">{{ formatNumber(vote.amount) }} TIA</div>
            <div class="col-time">{{ formatTime(vote.time) }}</div>
          </div>
        </div>
        <div v-if="votes.length > 0 && hasMoreVotes" class="view-more">
          <button @click="loadMoreVotes">加载更多</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { format, formatDistance, formatDistanceToNow } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'

export default {
  name: 'ProposalDetail',
  data() {
    return {
      loading: true,
      proposal: null,
      votes: [],
      votesPage: 1,
      hasMoreVotes: false
    }
  },
  computed: {
    proposalId() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.fetchProposalDetails()
  },
  methods: {
    fetchProposalDetails() {
      // 模拟API调用
      setTimeout(() => {
        this.proposal = {
          id: this.proposalId,
          title: '提案 #' + this.proposalId + ': 提高验证者每区块奖励',
          status: ['deposit_period', 'voting_period', 'passed', 'rejected'][Math.floor(Math.random() * 4)],
          submitter: '0xabcdef1234567890abcdef1234567890abcdef12',
          submitTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          votingEndTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          type: '参数变更',
          summary: '该提案旨在提高验证者的每区块奖励，以增加网络的安全性和去中心化程度。',
          motivation: '当前的区块奖励对于较小的验证者来说不足以维持运营成本，导致中心化趋势增强。增加奖励将鼓励更多的验证者加入网络，提高整体安全性。',
          content: '提议将参数 "BlocksReward" 从 1.0 TIA 调整为 1.5 TIA，此更改将立即生效。\n\n此外，对于较小的验证者（在投票权中排名50以后的），额外增加10%的奖励，以鼓励网络去中心化。',
          depositAmount: 10000,
          depositThreshold: 50000,
          depositEndTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          yesPercentage: 65,
          noPercentage: 15,
          abstainPercentage: 10,
          vetoPercentage: 10,
          totalVotes: 1500000,
          turnout: 35,
          votersCount: 187
        }
        
        this.fetchVotes()
        this.loading = false
      }, 1000)
    },
    fetchVotes() {
      // 模拟API调用获取投票列表
      setTimeout(() => {
        const newVotes = Array(10).fill().map((_, i) => ({
          id: 'vote' + (this.votes.length + i + 1),
          voter: '0x' + Math.random().toString(16).substring(2, 42),
          option: ['yes', 'no', 'abstain', 'veto'][Math.floor(Math.random() * 4)],
          amount: Math.floor(Math.random() * 100000),
          time: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000))
        }))
        
        this.votes = [...this.votes, ...newVotes]
        this.hasMoreVotes = this.votes.length < 50
      }, 500)
    },
    loadMoreVotes() {
      this.votesPage++
      this.fetchVotes()
    },
    getStatusLabel(status) {
      const labels = {
        'deposit_period': '存款期',
        'voting_period': '投票期',
        'passed': '已通过',
        'rejected': '已拒绝',
        'failed': '已失败'
      }
      return labels[status] || status
    },
    getVoteOptionLabel(option) {
      const labels = {
        'yes': '同意',
        'no': '反对',
        'abstain': '弃权',
        'veto': '否决'
      }
      return labels[option] || option
    },
    formatTime(time) {
      return format(time, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })
    },
    formatTimeRemaining(time) {
      return formatDistanceToNow(time, { addSuffix: true, locale: zhCN })
    },
    shortAddress(address) {
      if (!address) return ''
      return address.substring(0, 8) + '...' + address.substring(address.length - 6)
    },
    formatNumber(num) {
      return new Intl.NumberFormat().format(num)
    }
  }
}
</script>

<style scoped>
.proposal-detail-page {
  margin-bottom: 50px;
}
.back-link {
  margin-bottom: 20px;
}
.back-link a {
  color: #666;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.back-arrow {
  margin-right: 5px;
}
.proposal-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}
.proposal-id {
  color: #666;
  margin-right: 10px;
  font-weight: bold;
}
.proposal-status {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
}
.proposal-status.deposit_period {
  background: #f0f8ff;
  color: #3498db;
}
.proposal-status.voting_period {
  background: #f0f8ff;
  color: #9b59b6;
}
.proposal-status.passed {
  background: #e6f7ee;
  color: #42b983;
}
.proposal-status.rejected, .proposal-status.failed {
  background: #fee;
  color: #e53e3e;
}
.proposal-title {
  margin-bottom: 20px;
}
.proposal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}
.meta-item {
  font-size: 0.9rem;
}
.meta-item .label {
  color: #666;
  margin-right: 5px;
}
.meta-item a {
  color: #42b983;
  text-decoration: none;
}
.detail-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}
.detail-card h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
}
.proposal-description .section {
  margin-bottom: 20px;
}
.proposal-description h3 {
  margin-top: 0;
  font-size: 1rem;
  margin-bottom: 10px;
}
.proposal-content {
  background: #f9f9f9;
  border-radius: 4px;
  padding: 15px;
  white-space: pre-line;
  line-height: 1.6;
}
.deposit-info {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
}
.deposit-progress {
  margin-bottom: 15px;
}
.progress-bar {
  height: 20px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 5px;
}
.progress-fill {
  height: 100%;
  background: #42b983;
  border-radius: 10px;
}
.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
}
.time-remaining {
  font-size: 0.9rem;
}
.time-remaining .label {
  color: #666;
  margin-right: 5px;
}
.votes-percentage {
  margin-bottom: 20px;
}
.progress-bar .yes {
  height: 100%;
  background: #42b983;
  float: left;
}
.progress-bar .no {
  height: 100%;
  background: #e53e3e;
  float: left;
}
.progress-bar .abstain {
  height: 100%;
  background: #f39c12;
  float: left;
}
.progress-bar .veto {
  height: 100%;
  background: #9b59b6;
  float: left;
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
.votes-count {
  background: #f9f9f9;
  border-radius: 4px;
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}
.vote-item {
  display: flex;
  flex-direction: column;
}
.vote-item .label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}
.vote-item .value {
  font-weight: 500;
}
.votes-list {
  border-top: 1px solid #eee;
}
.table-header {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  color: #666;
}
.vote-row {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.vote-row:hover {
  background: #f9f9f9;
}
.col-voter { width: 25%; }
.col-option { width: 25%; }
.col-amount { width: 25%; }
.col-time { width: 25%; }

.col-voter a {
  color: #42b983;
  text-decoration: none;
  font-family: monospace;
}
.vote-option {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}
.vote-option.yes {
  background: #e6f7ee;
  color: #42b983;
}
.vote-option.no {
  background: #fee;
  color: #e53e3e;
}
.vote-option.abstain {
  background: #fff5e6;
  color: #f39c12;
}
.vote-option.veto {
  background: #f5e6ff;
  color: #9b59b6;
}
.view-more {
  text-align: center;
  margin-top: 20px;
}
.view-more button {
  background: #f5f5f5;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  color: #666;
  font-weight: 500;
  cursor: pointer;
}
.view-more button:hover {
  background: #eee;
}
.loading, .error, .no-data {
  padding: 40px;
  text-align: center;
  color: #666;
}
.error {
  color: #e53e3e;
}
@media (max-width: 768px) {
  .proposal-meta {
    flex-direction: column;
    gap: 10px;
  }
  .votes-count {
    grid-template-columns: 1fr;
  }
}
</style> 