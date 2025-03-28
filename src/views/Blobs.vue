<template>
  <div class="blocks-page">
    <h1>Blobs</h1>

 

    <div class="blocks-container">
      <div class="search-bar">
        <input type="text" placeholder="Search blob id..." v-model="searchQuery" @keyup.enter="searchBlock" />
        <button @click="searchBlock">Search</button>
      </div>

      <div class="table-container">
        <div class="blocks-table">
          <div class="table-header">
            <div class="col-height">Blob ID</div>
            <div class="col-time">Sui Object ID</div>
            <div class="col-txs">Start Epoch</div>
            <div class="col-proposer">End Epoch</div>
            <div class="col-proposer">
              Size</div>
            <div class="col-proposer">Create Time</div>
          </div>

          <div v-if="loading" class="loading">Loading...</div>
          <template v-else>
            <div v-for="block in blocks" :key="block.blobIdBase64" class="block-row">
              <div class="col-height">
                <router-link :to="`/blobs/${block.blobIdBase64}`">
                  {{ shortHash(block.blobIdBase64) }}
                </router-link>
                <img 
                  src="@/assets/images/copy-icon.svg" 
                  alt="Copy" 
                  class="copy-icon"
                  @click.prevent="copyToClipboard(block.blobIdBase64)"
                  title="Copy address"
                >
              </div>
              <div class="col-time" :title="block.objectId">
                <a 
                  :href="'https://suiscan.xyz/mainnet/object/'+block.objectId" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="external-link"
                >
                  <img 
                    src="@/assets/images/external-link.svg" 
                    alt="Visit website"
                    class="external-link-icon"
                  >
                </a>
                {{ shortHash(block.objectId) }}<img 
                  src="@/assets/images/copy-icon.svg" 
                  alt="Copy" 
                  class="copy-icon"
                  @click.prevent="copyToClipboard(block.blobId)"
                  title="Copy address"
                ></div>
              <div class="col-txs">{{ block.startEpoch }}</div>
              <div class="col-proposer">
                {{ block.endEpoch }}
              </div>
              <div class="col-proposer">
                {{ formatBytes(block.size) }}
              </div>
              <div class="col-proposer">
                {{ formatTime(block.timestamp) }}
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
    <Toast 
      :message="toastMessage"
      :visible="showToast"
      :type="toastType"
    />
  </div>
</template>

<script>
import { format, formatDistance } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { shortHash, formatBytes } from '@/utils/formatters'
import Toast from '@/components/Toast.vue'

export default {
  name: 'Blocks',
  components: {
    Toast
  },
  data() {
    return {
      shortHash, formatBytes,
      loading: true,
      searchQuery: '',
      blocks: [],
      currentPage: 1,
      totalPages: 100,
      latestBlock: 0,
      blockTime: 6.5,
      totalTx: 12345678,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
    }
  },
  watch: {
    currentPage() {
      this.fetchBlocks()
    }
  },
  mounted() {
    this.fetchBlocks()
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
      this.showToastMessage('Address copied to clipboard!', 'success');

    },
    async fetchBlocks() {
      this.loading = true
      const response = await fetch(`https://walruscan.com/api/walscan-backend/mainnet//api/blobs?page=${this.currentPage}&sortBy=TIMESTAMP&orderBy=DESC&searchStr=${this.searchQuery}&size=20`)
      const data = await response.json()
      console.log(data)
      // 模拟API调用
      this.blocks = data.content
      this.loading = false
      

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
    searchBlock() {
      if (!this.searchQuery || this.searchQuery.length < 17) {
        return
      }

      this.$router.push(`/blobs/${this.searchQuery}`)
    },
    formatTime(time) {
      return formatDistance(
        new Date(time),
        new Date(),
        { addSuffix: true, locale: enUS }
      )
    },
    formatNumber(num) {
      return new Intl.NumberFormat().format(num)
    }
  }
}
</script>

<style scoped>
.blocks-page {
  padding-bottom: 40px;
}

.blocks-page h1 {
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

.blocks-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .blocks-container {
  background-color: var(--card-bg);
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

.blocks-table {
  width: 100%;
}

.table-header {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  color: #666;
}

.block-row {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.block-row:hover {
  background: #f9f9f9;
}

.col-height {
  padding-left: 10px;
  width: 25%;
}

.col-time {
  width: 30%;
}

.col-txs {
  width: 20%;
}

.col-proposer {
  width: 20%;
}

[data-theme="dark"] .col-txs {
  color: #b0b3b8;
}
[data-theme="dark"] .col-proposer {
  color: #b0b3b8;
}
[data-theme="dark"] .col-time {
  color: #b0b3b8;
}
[data-theme="dark"] .col-txs {
  color: #b0b3b8;
}
[data-theme="dark"] .col-txs {
  color: #b0b3b8;
}

[data-theme="dark"] .block-row:hover {
  background: #878787;
}

.col-height a,
.col-proposer a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
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
.copy-icon{
  cursor: pointer;
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

  .pagination {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }

  .pagination button {
    min-width: 100px;
    padding: 12px 15px;
    font-size: 1rem;
  }

  /* Soft shadow for cards */
  .blocks-container,
  .stat-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  }
}
</style>