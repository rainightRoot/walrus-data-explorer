<template>
  <div class="transaction-detail-page">
    <div class="back-link">
      <router-link to="/transactions">
        <span class="back-arrow">←</span> Back to Transactions
      </router-link>
    </div>
    
    <h1>Transaction Details</h1>
    
    <div v-if="loading" class="loading">Loading transaction data...</div>
    <div v-else-if="!transaction" class="error">Transaction not found</div>
    <template v-else>
      <div class="detail-card">
        <h2>Basic Information</h2>
        <div class="detail-grid">
          <div class="detail-row">
            <div class="label">Transaction Hash</div>
            <div class="value monospace">{{ transaction.hash }}</div>
          </div>
          <div class="detail-row">
            <div class="label">Status</div>
            <div class="value">
              <span :class="['status-badge', transaction.status]">
                {{ transaction.status === 'success' ? 'Success' : 'Failed' }}
              </span>
            </div>
          </div>
          <div class="detail-row">
            <div class="label">Block</div>
            <div class="value">
              <router-link :to="`/blocks/${transaction.blockHeight}`">
                {{ transaction.blockHeight }}
              </router-link>
            </div>
          </div>
          <div class="detail-row">
            <div class="label">Time</div>
            <div class="value">{{ formatTime(transaction.time) }}</div>
          </div>
          <div class="detail-row">
            <div class="label">Transaction Type</div>
            <div class="value">{{ transaction.type }}</div>
          </div>
          <div class="detail-row">
            <div class="label">Fee</div>
            <div class="value">{{ transaction.fee }} TIA</div>
          </div>
          <div class="detail-row">
            <div class="label">Gas Used</div>
            <div class="value">{{ transaction.gasUsed }} / {{ transaction.gasWanted }}</div>
          </div>
          <div class="detail-row">
            <div class="label">Memo</div>
            <div class="value">{{ transaction.memo || 'None' }}</div>
          </div>
        </div>
      </div>
      
      <div class="detail-card">
        <h2>Transfer Details</h2>
        <div class="transfer-info">
          <div class="transfer-row">
            <div class="label">From</div>
            <div class="value monospace">
              <router-link :to="`/accounts/${transaction.from}`">
                {{ transaction.from }}
              </router-link>
            </div>
          </div>
          <div class="transfer-direction">
            <span class="arrow">↓</span>
          </div>
          <div class="transfer-row">
            <div class="label">To</div>
            <div class="value monospace">
              <router-link :to="`/accounts/${transaction.to}`">
                {{ transaction.to }}
              </router-link>
            </div>
          </div>
          <div class="transfer-amount">
            <div class="amount-value">{{ transaction.amount }} TIA</div>
          </div>
        </div>
      </div>
      
      <div class="detail-card">
        <h2>Raw Data</h2>
        <div class="raw-data">
          <pre>{{ JSON.stringify(transaction.rawData, null, 2) }}</pre>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { format } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export default {
  name: 'TransactionDetail',
  data() {
    return {
      loading: true,
      txHash: this.$route.params.hash,
      transaction: null
    }
  },
  mounted() {
    this.fetchTransactionData()
  },
  methods: {
    fetchTransactionData() {
      this.loading = true
      
      // Simulate API call
      setTimeout(() => {
        this.transaction = {
          hash: this.txHash,
          status: Math.random() > 0.2 ? 'success' : 'failed',
          blockHeight: Math.floor(Math.random() * 1000000) + 1000000,
          time: new Date(Date.now() - Math.random() * 86400000 * 7), // Past 7 days
          type: ['Transfer', 'Delegate', 'Undelegate', 'MsgSend', 'MsgDelegate'][Math.floor(Math.random() * 5)],
          fee: (Math.random() * 0.1).toFixed(4),
          gasUsed: Math.floor(Math.random() * 100000),
          gasWanted: 100000,
          memo: Math.random() > 0.7 ? 'Transaction memo' : '',
          from: `celestia1${Math.random().toString(36).substring(2, 15)}`,
          to: `celestia1${Math.random().toString(36).substring(2, 15)}`,
          amount: (Math.random() * 1000).toFixed(4),
          rawData: {
            type: 'cosmos-sdk/StdTx',
            value: {
              msg: [
                {
                  type: 'cosmos-sdk/MsgSend',
                  value: {
                    from_address: `celestia1${Math.random().toString(36).substring(2, 15)}`,
                    to_address: `celestia1${Math.random().toString(36).substring(2, 15)}`,
                    amount: [
                      {
                        denom: 'utia',
                        amount: Math.floor(Math.random() * 1000000000).toString()
                      }
                    ]
                  }
                }
              ],
              fee: {
                amount: [
                  {
                    denom: 'utia',
                    amount: Math.floor(Math.random() * 10000).toString()
                  }
                ],
                gas: '100000'
              },
              signatures: [
                {
                  pub_key: {
                    type: 'tendermint/PubKeySecp256k1',
                    value: Math.random().toString(36).substring(2, 30)
                  },
                  signature: Math.random().toString(36).substring(2, 100)
                }
              ],
              memo: Math.random() > 0.7 ? 'Transaction memo' : ''
            }
          }
        }
        
        this.loading = false
      }, 1500)
    },
    formatTime(time) {
      return format(time, 'yyyy-MM-dd HH:mm:ss', { locale: enUS })
    }
  }
}
</script>

<style scoped>
.transaction-detail-page {
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
.monospace {
  font-family: monospace;
  font-size: 0.9rem;
}
.transfer-info {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
}
.transfer-row {
  margin-bottom: 5px;
}
.transfer-row .label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}
.transfer-row .value {
  padding: 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid #eee;
}
.transfer-row a {
  color: #42b983;
  text-decoration: none;
}
.transfer-direction {
  text-align: center;
  padding: 15px 0;
}
.transfer-direction .arrow {
  font-size: 24px;
  color: #42b983;
}
.transfer-amount {
  margin-top: 15px;
  text-align: center;
}
.amount-value {
  display: inline-block;
  padding: 10px 20px;
  background: #e6f7ee;
  border-radius: 20px;
  color: #42b983;
  font-weight: bold;
  font-size: 1.2rem;
}
.code-block {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 15px;
  overflow-x: auto;
}
.code-block pre {
  margin: 0;
  font-family: monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
}
.loading, .error {
  padding: 40px;
  text-align: center;
  color: #666;
}
.error {
  color: #e53e3e;
}
</style> 