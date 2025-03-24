<template>
  <div class="latest-transactions">
    <div class="section-header">
      <h2>最新交易</h2>
      <router-link to="/transactions" class="view-all">查看全部</router-link>
    </div>
    
    <div class="transactions-list">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="transactions.length === 0" class="no-data">暂无数据</div>
      <div v-else class="transaction-item" v-for="tx in transactions" :key="tx.hash">
        <div class="tx-hash">
          <router-link :to="`/transactions/${tx.hash}`">{{ shortHash(tx.hash) }}</router-link>
        </div>
        <div class="tx-info">
          <div class="tx-time">{{ formatTime(tx.time) }}</div>
          <div class="tx-details">
            <span class="tx-type">{{ tx.type }}</span>
            <span>{{ tx.amount }} TIA</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDistance } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'

export default {
  name: 'LatestTransactions',
  data() {
    return {
      loading: true,
      transactions: []
    }
  },
  mounted() {
    this.fetchLatestTransactions()
  },
  methods: {
    fetchLatestTransactions() {
      // 模拟API调用
      setTimeout(() => {
        this.transactions = [
          { hash: '0x1234567890abcdef1234567890abcdef12345678', time: new Date(Date.now() - 1 * 60 * 1000), type: '转账', amount: 100.5 },
          { hash: '0xabcdef1234567890abcdef1234567890abcdef12', time: new Date(Date.now() - 3 * 60 * 1000), type: '委托', amount: 500 },
          { hash: '0x7890abcdef1234567890abcdef1234567890abcd', time: new Date(Date.now() - 5 * 60 * 1000), type: '赎回', amount: 200 },
          { hash: '0xef1234567890abcdef1234567890abcdef123456', time: new Date(Date.now() - 7 * 60 * 1000), type: '转账', amount: 50.25 },
          { hash: '0x567890abcdef1234567890abcdef1234567890ab', time: new Date(Date.now() - 9 * 60 * 1000), type: '转账', amount: 75 }
        ]
        this.loading = false
      }, 1200)
    },
    formatTime(time) {
      return formatDistance(time, new Date(), { addSuffix: true, locale: zhCN })
    },
    shortHash(hash) {
      return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`
    }
  }
}
</script>

<style scoped>
.latest-transactions {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.section-header h2 {
  margin: 0;
  font-size: 1.2rem;
}
.view-all {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}
.transactions-list {
  border-top: 1px solid #eee;
}
.transaction-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.tx-hash {
  width: 150px;
  font-family: monospace;
}
.tx-hash a {
  color: #42b983;
  text-decoration: none;
}
.tx-info {
  flex: 1;
}
.tx-time {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}
.tx-details {
  display: flex;
  gap: 15px;
}
.tx-type {
  background: #f0f8ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}
.loading, .no-data {
  padding: 20px;
  text-align: center;
  color: #666;
}
</style> 