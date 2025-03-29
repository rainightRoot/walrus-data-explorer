<template>
  <div class="account-detail-page">
    <div class="back-link">
      <router-link to="/">
        <span class="back-arrow">←</span> Back to Home
      </router-link>
    </div>
    
    <h1>Account Details</h1>
    
    <div v-if="loading" class="loading">Loading account data...</div>
    <div v-else-if="!account" class="error">Account not found</div>
    <template v-else>
      <div class="address-card">
        <div class="address-header">
          <h2>Address</h2>
          <div class="address-actions">
            <button class="action-btn" @click="copyToClipboard(account.address)">
              <span class="icon">📋</span> Copy
            </button>
          </div>
        </div>
        <div class="address-value monospace">{{ account.address }}</div>
      </div>
      
      <div class="stats-cards">
        <div class="stat-card">
          <h3>Available Balance</h3>
          <div class="value">{{ formatNumber(account.availableBalance) }} TIA</div>
        </div>
        <div class="stat-card">
          <h3>Staked</h3>
          <div class="value">{{ formatNumber(account.stakedBalance) }} TIA</div>
        </div>
        <div class="stat-card">
          <h3>Total Balance</h3>
          <div class="value">{{ formatNumber(account.totalBalance) }} TIA</div>
        </div>
      </div>
      
      <div class="tabbed-section">
        <div class="tabs">
          <button 
            :class="{ active: activeTab === 'transactions' }" 
            @click="activeTab = 'transactions'"
          >
            Transactions
          </button>
          <button 
            :class="{ active: activeTab === 'delegations' }" 
            @click="activeTab = 'delegations'"
          >
            Delegations
          </button>
          <button 
            :class="{ active: activeTab === 'rewards' }" 
            @click="activeTab = 'rewards'"
          >
            Rewards
          </button>
        </div>
        
        <div class="tab-content">
          <div v-if="activeTab === 'transactions'" class="transactions-tab">
            <div class="tab-header">
              <h3>Transactions</h3>
            </div>
            <div v-if="transactions.length === 0" class="no-data">No transactions found</div>
            <div v-else class="transactions-list">
              <div class="table-header">
                <div class="col-hash">Transaction Hash</div>
                <div class="col-type">Type</div>
                <div class="col-time">Time</div>
                <div class="col-amount">Amount</div>
                <div class="col-status">Status</div>
              </div>
              <div v-for="tx in transactions" :key="tx.hash" class="transaction-row">
                <div class="col-hash">
                  <router-link :to="`/transactions/${tx.hash}`">
                    {{ shortHash(tx.hash) }}
                  </router-link>
                </div>
                <div class="col-type">
                  <span class="tx-type">{{ tx.type }}</span>
                </div>
                <div class="col-time">{{ formatTime(tx.time) }}</div>
                <div class="col-amount" :class="{ 'amount-out': tx.direction === 'out', 'amount-in': tx.direction === 'in' }">
                  {{ tx.direction === 'out' ? '-' : '+' }} {{ tx.amount }} TIA
                </div>
                <div class="col-status">
                  <span :class="['status-badge', tx.status]">
                    {{ tx.status === 'success' ? 'Success' : 'Failed' }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="transactions.length > 0 && hasMoreTransactions" class="view-more">
              <button @click="loadMoreTransactions">Load More</button>
            </div>
          </div>
          
          <div v-if="activeTab === 'delegations'" class="delegations-tab">
            <div class="tab-header">
              <h3>Delegations</h3>
            </div>
            <div v-if="delegations.length === 0" class="no-data">No delegations found</div>
            <div v-else class="delegations-list">
              <div class="table-header">
                <div class="col-validator">Validator</div>
                <div class="col-amount">Staked Amount</div>
                <div class="col-reward">Estimated Reward</div>
                <div class="col-status">Status</div>
              </div>
              <div v-for="delegation in delegations" :key="delegation.validatorAddress" class="delegation-row">
                <div class="col-validator">
                  <router-link :to="`/validators/${delegation.validatorAddress}`">
                    {{ delegation.validatorName }}
                  </router-link>
                </div>
                <div class="col-amount">{{ formatNumber(delegation.amount) }} TIA</div>
                <div class="col-reward">{{ delegation.estimatedReward }} TIA / Day</div>
                <div class="col-status">
                  <span :class="['status-badge', delegation.status]">
                    {{ delegation.status === 'active' ? 'Active' : 'Unbonding' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="activeTab === 'rewards'" class="rewards-tab">
            <div class="tab-header">
              <h3>Rewards</h3>
            </div>
            <div class="rewards-summary">
              <div class="reward-card">
                <h4>Total Unclaimed Rewards</h4>
                <div class="reward-value">{{ formatNumber(totalRewards) }} TIA</div>
                <button class="claim-btn" @click="claimAllRewards">Claim All</button>
              </div>
              <div class="reward-info">
                <p>Reward accrues over time, you can claim them at any time. Claiming rewards incurs a small fee.</p>
              </div>
            </div>
            <div v-if="rewards.length === 0" class="no-data">No rewards found</div>
            <div v-else class="rewards-list">
              <div class="table-header">
                <div class="col-validator">Validator</div>
                <div class="col-amount">Claimable Rewards</div>
                <div class="col-action">Action</div>
              </div>
              <div v-for="reward in rewards" :key="reward.validatorAddress" class="reward-row">
                <div class="col-validator">
                  <router-link :to="`/validators/${reward.validatorAddress}`">
                    {{ reward.validatorName }}
                  </router-link>
                </div>
                <div class="col-amount">{{ formatNumber(reward.amount) }} TIA</div>
                <div class="col-action">
                  <button class="claim-reward-btn" @click="claimReward(reward)">Claim</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { format, formatDistance, formatRelative } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import { shortHash, formatBytes,formatNumber } from '@/utils/formatters'
export default {
  name: 'AccountDetail',
  data() {
    return {
      loading: true,
      account: null,
      activeTab: 'transactions',
      transactions: [],
      delegations: [],
      rewards: [],
      totalRewards: 0,
      hasMoreTransactions: false,
      transactionsPage: 1
    }
  },
  computed: {
    accountAddress() {
      return this.$route.params.address
    }
  },
  mounted() {
    this.fetchAccountData()
  },
  methods: {
    fetchAccountData() {
      // 模拟API调用
      setTimeout(() => {
        this.account = {
          address: this.accountAddress || 'celestia1abc...xyz',
          availableBalance: 12345.67,
          stakedBalance: 5000,
          totalBalance: 17345.67
        }
        
        this.fetchTransactions()
        this.fetchDelegations()
        this.fetchRewards()
        
        this.loading = false
      }, 1000)
    },
    fetchTransactions() {
      // 模拟API调用
      setTimeout(() => {
        this.transactions = [
          { hash: '0x1234567890abcdef1234567890abcdef12345678', type: 'Transfer', time: new Date(Date.now() - 1 * 60 * 60 * 1000), amount: 100, direction: 'out', status: 'success' },
          { hash: '0xabcdef1234567890abcdef1234567890abcdef12', type: 'Delegate', time: new Date(Date.now() - 5 * 60 * 60 * 1000), amount: 500, direction: 'out', status: 'success' },
          { hash: '0x7890abcdef1234567890abcdef1234567890abcd', type: 'Claim Reward', time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), amount: 25, direction: 'in', status: 'success' },
          { hash: '0xef1234567890abcdef1234567890abcdef123456', type: 'Transfer', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), amount: 200, direction: 'in', status: 'success' },
          { hash: '0x567890abcdef1234567890abcdef1234567890ab', type: 'Undelegate', time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 300, direction: 'in', status: 'success' }
        ]
        this.hasMoreTransactions = true
      }, 1200)
    },
    fetchDelegations() {
      // 模拟API调用
      setTimeout(() => {
        this.delegations = [
          { validatorAddress: 'celestiavaloper1abc...xyz', validatorName: 'Validator Alpha', amount: 2000, estimatedReward: 5.2, status: 'active' },
          { validatorAddress: 'celestiavaloper2def...uvw', validatorName: 'Validator Beta', amount: 1500, estimatedReward: 3.9, status: 'active' },
          { validatorAddress: 'celestiavaloper3ghi...rst', validatorName: 'Validator Gamma', amount: 1000, estimatedReward: 2.6, status: 'active' },
          { validatorAddress: 'celestiavaloper4jkl...opq', validatorName: 'Validator Delta', amount: 500, estimatedReward: 1.3, status: 'unbonding' }
        ]
      }, 1500)
    },
    fetchRewards() {
      // 模拟API调用
      setTimeout(() => {
        this.rewards = [
          { validatorAddress: 'celestiavaloper1abc...xyz', validatorName: 'Validator Alpha', amount: 45.2 },
          { validatorAddress: 'celestiavaloper2def...uvw', validatorName: 'Validator Beta', amount: 32.8 },
          { validatorAddress: 'celestiavaloper3ghi...rst', validatorName: 'Validator Gamma', amount: 18.5 }
        ]
        this.totalRewards = this.rewards.reduce((sum, reward) => sum + reward.amount, 0)
      }, 1700)
    },
    loadMoreTransactions() {
      // 模拟加载更多交易
      this.transactionsPage++
      if (this.transactionsPage > 2) {
        this.hasMoreTransactions = false
      } else {
        setTimeout(() => {
          this.transactions.push(
            { hash: '0xabcde12345abcde12345abcde12345abcde12345', type: 'Transfer', time: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), amount: 50, direction: 'out', status: 'success' },
            { hash: '0x12345abcde12345abcde12345abcde12345abcde', type: 'Delegate', time: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), amount: 200, direction: 'out', status: 'success' },
            { hash: '0x54321edcba54321edcba54321edcba54321edcba', type: 'Transfer', time: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), amount: 75, direction: 'in', status: 'success' }
          )
        }, 800)
      }
    },
    claimAllRewards() {
      alert(`Claiming all ${this.totalRewards} TIA rewards`)
    },
    claimReward(reward) {
      alert(`Claiming ${reward.amount} TIA from ${reward.validatorName}`)
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Address copied to clipboard')
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err)
      })
    },
    formatNumber,
    formatTime(time) {
      return formatDistance(time, new Date(), { addSuffix: true, locale: zhCN })
    },
    shortHash(hash) {
      return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`
    },
    shortAddress(address) {
      if (!address) return ''
      return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`
    }
  }
}
</script>

<style scoped>
.account-detail-page {
  padding-bottom: 40px;
}
.back-link {
  margin-bottom: 20px;
}
.back-link a {
  display: inline-flex;
  align-items: center;
  color: #666;
  text-decoration: none;
}
.back-arrow {
  margin-right: 5px;
}
.address-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}
.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.address-header h2 {
  margin: 0;
  font-size: 1.2rem;
}
.address-actions {
  display: flex;
  gap: 10px;
}
.action-btn {
  background: #f5f5f5;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
.action-btn:hover {
  background: #eee;
}
.icon {
  font-size: 0.9rem;
}
.address-value {
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
  word-break: break-all;
}
.monospace {
  font-family: monospace;
  font-size: 0.9rem;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  color: #666;
}
.stat-card .value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}
.tabbed-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}
.tabs button {
  padding: 15px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
}
.tabs button.active {
  color: #42b983;
  border-bottom-color: #42b983;
}
.tab-content {
  padding: 20px;
}
.tab-header {
  margin-bottom: 20px;
}
.tab-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

/* 交易记录Tab */
.transactions-list, .delegations-list, .rewards-list {
  border-top: 1px solid #eee;
}
.table-header {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  color: #666;
}
.transaction-row, .delegation-row, .reward-row {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.transaction-row:hover, .delegation-row:hover, .reward-row:hover {
  background: #f9f9f9;
}

.col-hash { width: 20%; }
.col-type { width: 20%; }
.col-time { width: 20%; }
.col-amount { width: 20%; }
.col-status { width: 20%; }

.col-validator { width: 40%; }
.col-amount { width: 20%; }
.col-reward { width: 20%; }
.col-status, .col-action { width: 20%; }

.col-hash a, .col-validator a {
  color: #42b983;
  text-decoration: none;
}
.tx-type {
  display: inline-block;
  background: #f0f8ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}
.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}
.status-badge.success {
  background: #e6f7ee;
  color: #42b983;
}
.status-badge.failed {
  background: #fee;
  color: #e53e3e;
}
.status-badge.active {
  background: #e6f7ee;
  color: #42b983;
}
.status-badge.unbonding {
  background: #fff5e6;
  color: #f39c12;
}
.amount-in {
  color: #42b983;
}
.amount-out {
  color: #e53e3e;
}

/* 奖励Tab */
.rewards-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.reward-card {
  background: #f9f9f9;
  border-radius: 4px;
  padding: 15px;
  width: 250px;
}
.reward-card h4 {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  color: #666;
}
.reward-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b983;
  margin-bottom: 15px;
}
.claim-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
}
.claim-btn:hover {
  background: #3ba876;
}
.reward-info {
  flex: 1;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
}
.reward-info p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}
.claim-reward-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
}
.claim-reward-btn:hover {
  background: #3ba876;
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
  .stats-cards {
    grid-template-columns: 1fr;
  }
  .rewards-summary {
    flex-direction: column;
  }
  .reward-card {
    width: auto;
  }
  .tabs {
    flex-direction: column;
  }
  .tabs button {
    text-align: left;
  }
  .transaction-row, .delegation-row, .reward-row, .table-header {
    font-size: 0.85rem;
  }
}
</style> 