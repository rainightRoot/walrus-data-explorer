<template>
  <div class="transactions-page">
    <h1>Events</h1>
    <!--     
    <div class="stats-cards">
      <div class="stat-card">
        <h3>Total Events</h3>
        <div class="value">{{ formatNumber(totalElements) }}</div>
      </div>
      <div class="stat-card">
        <h3>Average Fee</h3>
        <div class="value">{{ avgFee }} TIA</div>
      </div>
      <div class="stat-card">
        <h3>24h Volume</h3>
        <div class="value">{{ formatNumber(txVolume24h) }} TIA</div>
      </div>
    </div> -->

    <div class="transactions-container">
      <div class="search-bar">
        <input type="text" placeholder="Search Sender Address, Blob ID or Sui Object ID ..." v-model="searchQuery"
          @keyup.enter="searchTransaction" />
        <button @click="searchTransaction">Search</button>
      </div>

      <div class="table-container">
        <div class="transactions-table">
          <div class="table-header">
            <div class="col-type">Type</div>
            <div class="col-hash">Blob Id</div>
            <div class="col-amount">Tx</div>
            <div class="col-time">Time</div>
            <div class="col-amount">Sender</div>
            <div class="col-fee">Sui ObjectId</div>
          </div>

          <div v-if="loading" class="loading">Loading...</div>
          <template v-else>
            <div v-for="tx in transactions" :key="tx.hash" class="transaction-row">
              <div class="col-type">
                <span class="tx-type">{{ tx.type }}</span>
              </div>
              <div class="col-hash">
                <router-link :to="`/blobs/${tx.blobIdBase64}`" target="_blank">
                  {{ shortHash(tx.blobIdBase64) }}
                </router-link>
                <img src="@/assets/images/copy-icon.svg" alt="Copy" class="copy-icon"
                  @click.prevent="copyToClipboard(tx.blobIdBase64)" title="Copy Text">
              </div>
              <div class="col-amount">
                <a :href="`https://suiscan.xyz/mainnet/tx/${tx.digest}`" target="_blank">
                  {{ shortHash(tx.digest) }}
                </a>
                <img src="@/assets/images/copy-icon.svg" alt="Copy" class="copy-icon"
                  @click.prevent="copyToClipboard(tx.digest)" title="Copy Text">
              </div>


              <div class="col-time">{{ formatTime(tx.timestamp) }}</div>
              <div class="col-amount">
                <a :href="`https://suiscan.xyz/mainnet/account/${tx.senderAddress}`" target="_blank">
                  {{ shortHash(tx.senderAddress) }}
                </a>
                <img src="@/assets/images/copy-icon.svg" alt="Copy" class="copy-icon"
                  @click.prevent="copyToClipboard(tx.senderAddress)" title="Copy Text">
              </div>
              <div class="col-fee">
                <a :href="`https://suiscan.xyz/mainnet/object/${tx.objectId}`" target="_blank">
                  {{ shortHash(tx.objectId) }}
                </a>
                <img src="@/assets/images/copy-icon.svg" alt="Copy" class="copy-icon"
                  @click.prevent="copyToClipboard(tx.objectId)" title="Copy Text">
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--">
          Previous
        </button>
        <span>Page {{ currentPage }}</span>
        <button :disabled="currentPage === totalPages" @click="currentPage++">
          Next
        </button>
      </div>
    </div>
    <Toast :message="toastMessage" :visible="showToast" :type="toastType" />

  </div>
</template>

<script>
import { format, formatDistance } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import Toast from '@/components/Toast.vue'

export default {
  name: 'Transactions',
  components: {
    Toast
  },
  data() {
    return {
      loading: true,
      searchQuery: '',
      transactions: [],
      currentPage: 1,
      totalPages: 100,
      totalElements: 0,
      avgFee: '0.0025',
      txVolume24h: 125680,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
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
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
      this.showToastMessage('Address copied to clipboard!', 'success');

    },
    showToastMessage(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;

      // Hide toast after 3 seconds
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },
    async fetchTransactions() {
      this.loading = true

      this.loading = true
      const response = await fetch(`https://walruscan.com/api/walscan-backend/mainnet//api/blobs/transactions?page=${this.currentPage - 1}&sortBy=TIMESTAMP&orderBy=DESC&searchStr=${this.searchQuery}&size=20`)
      const data = await response.json()
      console.log(data)
      // 模拟API调用
      this.transactions = data.content
      this.loading = false
      this.totalElements = data.totalElements

    },
    searchTransaction() {
      this.fetchTransactions()
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .transactions-container {
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

.col-hash {
  width: 20%;
}

.col-type {
  width: 15%;
  padding-left: 10px;
}

.col-time {
  width: 20%;
}

.col-amount {
  width: 15%;
}

.col-fee {
  width: 15%;
}

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
    width: calc(100% - 30px);

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
  .transactions-container,
  .stat-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  }
}
</style>