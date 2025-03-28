<template>
  <div class="block-detail-page">
    <div class="back-link">
      <router-link to="/blobs">
        <span class="back-arrow">←</span> Back to Blobs
      </router-link>
    </div>

    <h1>Blob ID #{{ blockHeight }}</h1>

    <div v-if="loading" class="loading">Loading blob data...</div>
    <div v-else-if="!block" class="error">blob not found</div>
    <template v-else>
      <div class="detail-card">
        <h2>Blob Information</h2>
        <div class="detail-grid">
          <div class="detail-row">
            <div class="label">Blob Id</div>
            <div class="value">{{ block.blobIdBase64 }}</div>
          </div>
          <div class="detail-row">
            <div class="label">senderAddress</div>
            <div class="value monospace">
              <a :href="`https://suiscan.xyz/mainnet/account/${block.senderAddress}`" target="_blank">
                {{ shortHash(block.senderAddress) }}
              </a>
              <img src="@/assets/images/copy-icon.svg" alt="Copy" class="copy-icon"
                      @click.prevent="copyToClipboard(block.senderAddress)" title="Copy Text">
            </div>
          </div>
          <div class="detail-row">
            <div class="label">suiObjectId</div>
            <div class="value">
              <a :href="`https://suiscan.xyz/mainnet/object/${block.suiObjectId}`" target="_blank">
                {{ shortHash(block.suiObjectId) }}

              </a>
              <img src="@/assets/images/copy-icon.svg" alt="Copy" class="copy-icon"
              @click.prevent="copyToClipboard(block.suiObjectId)" title="Copy Text">
            </div>
          </div>
          <div class="detail-row">
            <div class="label">suiPackageId</div>
            <div class="value">
              <a :href="`https://suiscan.xyz/mainnet/object/${block.suiPackageId}`" target="_blank">
                {{ shortHash(block.suiPackageId) }}
              </a>
              <img src="@/assets/images/copy-icon.svg" alt="Copy" class="copy-icon"
              @click.prevent="copyToClipboard(block.suiPackageId)" title="Copy Text">
            </div>
          </div>

          <div class="detail-row">
            <div class="label">Size</div>
            <div class="value">{{ formatBytes(block.size) }} </div>
          </div>
          <div class="detail-row">
            <div class="label">Epoch</div>
            <div class="value">{{ block.startEpoch }} ~ {{ block.endEpoch }}</div>
          </div>
        </div>
      </div>

      <div class="detail-card">
        <h2 class="transaction-list-title">Transaction List
          <!-- 加一个div切换objectSourceType -->
          <div class="transaction-list-title-switch">
            <div @click="objectSourceType = 'INPUT_OBJECT'" :class="{ 'active': objectSourceType === 'INPUT_OBJECT' }">
              Input Object</div>
            <div @click="objectSourceType = 'CHANGED_OBJECT'"
              :class="{ 'active': objectSourceType === 'CHANGED_OBJECT' }">Updated Object</div>
          </div>
        </h2>
        <div v-if="block.txCount === 0" class="no-data">Block has no transactions</div>
        <div v-else class="transactions-list">
          <div class="table-container">
            <div class="blocks-table">
              <div class="table-header">
                <div class="col-height">TX</div>
                <div class="col-time">Type / Func</div>
                <div class="col-txs">Sender</div>
                <div class="col-proposer">Transactions</div>
                <div class="col-proposer">Gas</div>
                <div class="col-proposer">Create Time</div>
              </div>

              <div v-if="loading" class="loading">Loading...</div>
              <template v-else>
                <div v-for="tx in transactions" :key="tx.hash" class="block-row">
                  <div class="col-height">
                    <a :href="`https://suiscan.xyz/mainnet/tx/${tx.hash}`" target="_blank">
                      {{ shortHash(tx.hash) }}
                    </a>
                    <img src="@/assets/images/copy-icon.svg" alt="Copy" class="copy-icon"
                      @click.prevent="copyToClipboard(tx.hash)" title="Copy Text">
                  </div>
                  <div class="col-time" :title="block.objectId">
                    {{ tx.type }}<br>{{ tx.functions.join(', ') }}
                  </div>
                  <div class="col-txs">

                    <a :href="`https://suiscan.xyz/mainnet/account/${tx.senderAddress}`" target="_blank">
                      {{ shortHash(tx.senderAddress) }}
                    </a>
                    <img src="@/assets/images/copy-icon.svg" alt="Copy" class="copy-icon"
                      @click.prevent="copyToClipboard(tx.senderAddress)" title="Copy Text">
                  </div>
                  <div class="col-proposer">
                    {{ tx.txNumber }}
                  </div>
                  <div class="col-proposer">
                    {{ (tx.fee) }}
                  </div>
                  <div class="col-proposer">
                    {{ formatTime(tx.timestamp) }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
    <Toast :message="toastMessage" :visible="showToast" :type="toastType" />
  </div>
</template>

<script>
import { format } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { shortHash, formatBytes } from '@/utils/formatters'
import Toast from '@/components/Toast.vue'

export default {
  name: 'BlockDetail',
  components: {
    Toast,
  },
  data() {
    return {
      loading: true,
      blockHeight: this.$route.params.height,
      block: null,
      objectSourceType: 'INPUT_OBJECT',//INPUT_OBJECT,CHANGED_OBJECT
      transactions: [],
      showToast: false,
      toastMessage: '',
      toastType: 'success',
    }
  },
  watch: {
    objectSourceType: {
      handler() {
        this.fetchTxData()
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchBlockData()
  },
  methods: {
    formatBytes,
    shortHash,
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
      this.showToastMessage('copied to clipboard!', 'success');

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
    async fetchBlockData() {
      this.loading = true
      await fetch(`https://walruscan.com/api/walscan-backend/mainnet/api/blobs/${this.blockHeight}`)
        .then(response => response.json())
        .then(data => {
          this.block = data
          this.loading = false
          this.fetchTxData()
        })

    },
    async fetchTxData() {
      if (!this.block || !this.block.suiObjectId) return
      await fetch(`https://suiscan.xyz/api/sui-backend/mainnet/api/objects/${this.block.suiObjectId}/transactions?orderBy=DESC&size=20&objectSourceType=${this.objectSourceType}`)
        .then(response => response.json())
        .then(data => {
          this.transactions = data.content
        })
    },
    formatTime(time) {
      return format(time, 'yyyy-MM-dd HH:mm:ss', { locale: enUS })
    },

  }
}
</script>

<style scoped>
/* dark */
[data-theme="dark"] .detail-card {
  background: var(--card-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] .back-link a {
  color: var(--primary-color);
}

[data-theme="dark"] .detail-row {
  background: var(--card-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] .detail-row .label {
  color: var(--text-color);
}

[data-theme="dark"] .detail-row .value {
  color: var(--text-color);
}

[data-theme="dark"] .transaction-list-title-switch {
  background: var(--card-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] .transaction-list-title-switch div {
  background: var(--card-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] .transaction-list-title-switch div.active {
  background: var(--primary-color);
  color: var(--text-color);
}

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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.loading,
.error,
.no-data {
  padding: 40px;
  text-align: center;
  color: #666;
}

.error {
  color: #e53e3e;
}

.transaction-list-title {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.transaction-list-title div {
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  background: #f0f8ff;
}

.transaction-list-title div.active {
  color: var(--primary-color);
  background: #e0f0ff;
}

.transaction-list-title-switch {
  display: flex;
  font-size: 14px;
  gap: 10px;
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

.copy-icon {
  cursor: pointer;
}
</style>