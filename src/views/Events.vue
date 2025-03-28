<template>
  <div class="transactions-page">
    <h1>Transactions</h1>
    
    <div class="stats-cards">
      <div class="stat-card">
        <h3>Total Transactions</h3>
        <div class="value">{{ formatNumber(totalTx) }}</div>
      </div>
      <div class="stat-card">
        <h3>Average Fee</h3>
        <div class="value">{{ avgFee }} TIA</div>
      </div>
      <div class="stat-card">
        <h3>24h Volume</h3>
        <div class="value">{{ formatNumber(txVolume24h) }} TIA</div>
      </div>
    </div>
    
    <div class="transactions-container">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Search transaction hash..." 
          v-model="searchQuery"
          @keyup.enter="searchTransaction"
        />
        <button @click="searchTransaction">Search</button>
      </div>
      
      <div class="table-container">
        <div class="transactions-table">
          <div class="table-header">
            <div class="col-hash">Tx Hash</div>
            <div class="col-type">Type</div>
            <div class="col-time">Time</div>
            <div class="col-amount">Amount</div>
            <div class="col-fee">Fee</div>
          </div>
          
          <div v-if="loading" class="loading">Loading...</div>
          <template v-else>
            <div 
              v-for="tx in transactions" 
              :key="tx.hash"
              class="transaction-row"
            >
              <div class="col-hash">
                <router-link :to="`/transactions/${tx.hash}`">
                  {{ shortHash(tx.hash) }}
                </router-link>
              </div>
              <div class="col-type">
                <span class="tx-type">{{ tx.type }}</span>
              </div>
              <div class="col-time">{{ formatTime(tx.time) }}</div>
              <div class="col-amount">{{ tx.amount }} TIA</div>
              <div class="col-fee">{{ tx.fee }} TIA</div>
            </div>
          </template>
        </div>
      </div>
      
      <div class="pagination">
        <button 
          :disabled="currentPage === 1" 
          @click="currentPage--"
        >
          Previous
        </button>
        <span>Page {{ currentPage }}</span>
        <button 
          :disabled="currentPage === totalPages" 
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { format, formatDistance } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export default {
  name: 'Transactions',
  data() {
    return {
      loading: true,
      searchQuery: '',
      transactions: [],
      currentPage: 1,
      totalPages: 100,
      totalTx: 4567890,
      avgFee: '0.0025',
      txVolume24h: 125680
    }
  },
  watch: {
    currentPage() {
      this.fetchTransactions()
    }
  },
  mounted() {
    this.fetchTransactions()
  },
  methods: {
    fetchTransactions() {
      this.loading = true
      
      // Simulate API call
      setTimeout(() => {
        const mockTransactions = []
        const txTypes = ['Transfer', 'Delegate', 'Undelegate', 'MsgSend', 'MsgDelegate']
        
        for (let i = 0; i < 25; i++) {
          mockTransactions.push({
            hash: `0x${Math.random().toString(16).substring(2, 42)}`,
            type: txTypes[Math.floor(Math.random() * txTypes.length)],
            time: new Date(Date.now() - (i * 30 + Math.random() * 60) * 1000),
            amount: (Math.random() * 1000).toFixed(2),
            fee: (Math.random() * 0.1).toFixed(4)
          })
        }
        
        this.transactions = mockTransactions
        this.loading = false
      }, 1000)
    },
    searchTransaction() {
      if (!this.searchQuery) {
        return
      }
      
      this.$router.push(`/events/${this.searchQuery}`)
    },
    formatTime(time) {
      return formatDistance(
        new Date(time),
        new Date(),
        { addSuffix: true, locale: enUS }
      )
    },
    shortHash(hash) {
      return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`
    },
    formatNumber(num) {
      return new Intl.NumberFormat().format(num)
    }
  }
}
</script>

<style scoped>
.transactions-page {
  padding-bottom: 40px;
}
.transactions-page h1 {
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
.transactions-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
[data-theme="dark"] .transactions-container{
  background: var(--card-bg);
  border-color: var(--border-color);
}
.search-bar {
  display: flex;
  margin-bottom: 20px;
}
.search-bar input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
}
.search-bar button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}
.transactions-table {
  width: 100%;
}
.table-header {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  color: #666;
}
.transaction-row {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.transaction-row:hover {
  background: #f9f9f9;
}
[data-theme="dark"] .transaction-row:hover {
  background: #878787;
}
.col-hash { width: 30%; }
.col-type { width: 20%; }
.col-time { width: 20%; }
.col-amount { width: 15%; }
.col-fee { width: 15%; }
[data-theme="dark"] .col-amount {
  color: #b0b3b8;
}


.col-hash a {
  color: #42b983;
  text-decoration: none;
  font-family: monospace;
  font-weight: 500;
}
.tx-type {
  display: inline-block;
  background: #f0f8ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}
.loading {
  padding: 40px;
  text-align: center;
  color: #666;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 15px;
  align-items: center;
}
.pagination button {
  padding: 8px 15px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .search-bar {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-bar input {
    width: 100%;
    padding: 12px 15px;
    font-size: 16px;
    border-radius: 4px;
  }
  
  .search-bar button {
    width: 100%;
    padding: 12px 15px;
    border-radius: 4px;
  }
  
  .tx-type {
    padding: 4px 8px;
    font-size: 0.8rem;
  }
  
  .pagination {
    padding-top: 15px;
  }
  
  /* Soft shadow for cards */
  .transactions-container, .stat-card {
    box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  }
}
</style> 