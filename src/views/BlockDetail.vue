<template>
  <div class="block-detail-page">
    <div class="back-link">
      <router-link to="/blocks">
        <span class="back-arrow">←</span> Back to Blocks
      </router-link>
    </div>
    
    <h1>Block #{{ blockHeight }}</h1>
    
    <div v-if="loading" class="loading">Loading block data...</div>
    <div v-else-if="!block" class="error">Block not found</div>
    <template v-else>
      <div class="detail-card">
        <h2>Block Information</h2>
        <div class="detail-grid">
          <div class="detail-row">
            <div class="label">Block Height</div>
            <div class="value">{{ block.height }}</div>
          </div>
          <div class="detail-row">
            <div class="label">Hash</div>
            <div class="value monospace">{{ block.hash }}</div>
          </div>
          <div class="detail-row">
            <div class="label">Time</div>
            <div class="value">{{ formatTime(block.time) }}</div>
          </div>
          <div class="detail-row">
            <div class="label">Transaction Count</div>
            <div class="value">{{ block.txCount }}</div>
          </div>
          <div class="detail-row">
            <div class="label">Proposer</div>
            <div class="value">
              <router-link :to="`/validators/${block.proposerAddress}`">
                {{ block.proposer }}
              </router-link>
            </div>
          </div>
          <div class="detail-row">
            <div class="label">Block Size</div>
            <div class="value">{{ block.size }} bytes</div>
          </div>
          <div class="detail-row">
            <div class="label">Gas Used</div>
            <div class="value">{{ block.gasUsed }} / {{ block.gasLimit }}</div>
          </div>
        </div>
      </div>
      
      <div class="detail-card">
        <h2>Transaction List ({{ block.txCount }})</h2>
        <div v-if="block.txCount === 0" class="no-data">Block has no transactions</div>
        <div v-else class="transactions-list">
          <div v-for="tx in block.transactions" :key="tx.hash" class="transaction-item">
            <div class="tx-hash">
              <router-link :to="`/transactions/${tx.hash}`">
                {{ shortHash(tx.hash) }}
              </router-link>
            </div>
            <div class="tx-info">
              <div class="tx-type">{{ tx.type }}</div>
              <div class="tx-details">
                <span>{{ tx.amount }} TIA</span>
                <span>Fee: {{ tx.fee }} TIA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { format } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export default {
  name: 'BlockDetail',
  data() {
    return {
      loading: true,
      blockHeight: this.$route.params.height,
      block: null
    }
  },
  mounted() {
    this.fetchBlockData()
  },
  methods: {
    fetchBlockData() {
      this.loading = true
      
      // Simulate API call
      setTimeout(() => {
        // Generate random block hash
        const hash = Array.from({ length: 64 }, () => 
          '0123456789abcdef'[Math.floor(Math.random() * 16)]
        ).join('')
        
        // Generate random transactions
        const transactions = []
        const txCount = Math.floor(Math.random() * 10) + 5
        const txTypes = ['Transfer', 'Delegate', 'Undelegate', 'MsgSend', 'MsgDelegate']
        
        for (let i = 0; i < txCount; i++) {
          transactions.push({
            hash: `0x${Math.random().toString(16).substring(2, 42)}`,
            type: txTypes[Math.floor(Math.random() * txTypes.length)],
            amount: (Math.random() * 1000).toFixed(2),
            fee: (Math.random() * 0.1).toFixed(4)
          })
        }
        
        this.block = {
          height: this.blockHeight,
          hash: `0x${hash}`,
          time: new Date(Date.now() - Math.random() * 86400000), // Past 24 hours
          txCount,
          proposer: `Validator ${Math.floor(Math.random() * 10) + 1}`,
          proposerAddress: `celestiavaloper${Math.random().toString(36).substring(2, 10)}`,
          size: Math.floor(Math.random() * 50000) + 10000,
          gasUsed: Math.floor(Math.random() * 500000) + 100000,
          gasLimit: 1000000,
          transactions
        }
        
        this.loading = false
      }, 1500)
    },
    formatTime(time) {
      return format(time, 'yyyy-MM-dd HH:mm:ss', { locale: enUS })
    },
    shortHash(hash) {
      return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`
    }
  }
}
</script>

<style scoped>
.block-detail-page {
  padding-bottom: 40px;
}
.back-link {
  margin-bottom: 20px;
}
.back-link a {
  color: #42b983;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.back-arrow {
  margin-right: 5px;
}
h1 {
  margin-bottom: 30px;
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
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}
.detail-row {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
}
.detail-row .label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}
.detail-row .value {
  font-weight: 500;
  overflow-wrap: break-word;
  word-break: break-all;
}
.monospace {
  font-family: monospace;
  font-size: 0.9rem;
}
.transactions-list {
  border-top: 1px solid #eee;
}
.transaction-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  display: flex;
}
.tx-hash {
  width: 200px;
  font-family: monospace;
}
.tx-hash a {
  color: #42b983;
  text-decoration: none;
}
.tx-info {
  flex: 1;
}
.tx-type {
  display: inline-block;
  padding: 2px 8px;
  background: #f0f8ff;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-bottom: 5px;
}
.tx-details {
  color: #666;
  font-size: 0.9rem;
  display: flex;
  gap: 15px;
}
.loading, .error, .no-data {
  padding: 40px;
  text-align: center;
  color: #666;
}
.error {
  color: #e53e3e;
}
</style> 