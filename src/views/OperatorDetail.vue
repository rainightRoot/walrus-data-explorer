<template>
  <div class="validator-detail-page">
    <div class="back-link">
      <router-link to="/validators">
        <span class="back-arrow">←</span> Back to Validators
      </router-link>
    </div>
    
    <div v-if="loading" class="loading">Loading validator data...</div>
    <div v-else-if="!validator" class="error">Validator not found</div>
    <template v-else>
      <div class="validator-header">
        <div class="validator-logo">
          <img :src="validator.logo || '/images/default-validator.png'" :alt="validator.name">
        </div>
        <div class="validator-info">
          <h1>{{ validator.name }}</h1>
          <div class="validator-status">
            <span :class="['status-badge', validator.status]">
              {{ validator.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
            <span class="rank">#{{ validator.rank }}</span>
          </div>
        </div>
      </div>
      
      <div class="stats-cards">
        <div class="stat-card">
          <h3>Voting Power</h3>
          <div class="value">{{ formatNumber(validator.votingPower) }} TIA</div>
          <div class="sub-value">{{ validator.votingPowerPercentage }}% Network Share</div>
        </div>
        <div class="stat-card">
          <h3>Total Delegated</h3>
          <div class="value">{{ formatNumber(validator.totalDelegated) }} TIA</div>
          <div class="sub-value">from {{ validator.delegatorsCount }} delegators</div>
        </div>
        <div class="stat-card">
          <h3>Commission</h3>
          <div class="value">{{ validator.commission }}%</div>
          <div class="sub-value">Max Change Rate: {{ validator.maxChangeRate }}%</div>
        </div>
      </div>
      
      <div class="detail-card">
        <h2>Validator Details</h2>
        <div class="detail-grid">
          <div class="detail-row">
            <div class="label">Address</div>
            <div class="value monospace">{{ validator.address }}</div>
          </div>
          <div class="detail-row">
            <div class="label">Operator Address</div>
            <div class="value monospace">{{ validator.operatorAddress }}</div>
          </div>
          <div class="detail-row">
            <div class="label">Website</div>
            <div class="value">
              <a :href="validator.website" target="_blank" v-if="validator.website">{{ validator.website }}</a>
              <span v-else>Not provided</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="label">Self-Delegated</div>
            <div class="value">{{ formatNumber(validator.selfDelegated) }} TIA</div>
          </div>
          <div class="detail-row">
            <div class="label">Identity</div>
            <div class="value">{{ validator.identity || 'Not provided' }}</div>
          </div>
          <div class="detail-row">
            <div class="label">Security Contact</div>
            <div class="value">{{ validator.securityContact || 'Not provided' }}</div>
          </div>
          <div class="detail-row">
            <div class="label">Description</div>
            <div class="value description">{{ validator.description || 'Not provided' }}</div>
          </div>
        </div>
      </div>
      
      <div class="detail-card">
        <h2>Performance</h2>
        <div class="detail-grid">
          <div class="detail-row">
            <div class="label">Uptime</div>
            <div class="value">{{ validator.uptime }}%</div>
          </div>
          <div class="detail-row">
            <div class="label">Missed Blocks (30d)</div>
            <div class="value">{{ validator.missedBlocks }}</div>
          </div>
        </div>
      </div>
      
      <div class="detail-card">
        <h2>Recent Blocks</h2>
        <div v-if="recentBlocks.length === 0" class="no-data">No recent blocks found</div>
        <div v-else class="blocks-list">
          <div class="table-header">
            <div class="col-height">Height</div>
            <div class="col-time">Time</div>
            <div class="col-txs">Txs</div>
          </div>
          <div v-for="block in recentBlocks" :key="block.height" class="block-row">
            <div class="col-height">
              <router-link :to="`/blocks/${block.height}`">
                {{ block.height }}
              </router-link>
            </div>
            <div class="col-time">{{ formatTime(block.time) }}</div>
            <div class="col-txs">{{ block.txs }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { format, formatDistance } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export default {
  name: 'ValidatorDetail',
  data() {
    return {
      loading: true,
      validatorAddress: this.$route.params.address,
      validator: null,
      activeTab: 'delegators',
      delegators: [],
      blocks: [],
      delegatorsPage: 1,
      blocksPage: 1,
      hasMoreBlocks: true,
      recentBlocks: []
    }
  },
  mounted() {
    this.fetchValidatorData()
  },
  methods: {
    fetchValidatorData() {
      this.loading = true
      
      // Simulate API call
      setTimeout(() => {
        this.validator = {
          address: this.validatorAddress,
          operatorAddress: `celestiavaloper${this.validatorAddress.substring(8)}`,
          name: `Validator ${Math.floor(Math.random() * 100)}`,
          status: Math.random() > 0.2 ? 'active' : 'inactive',
          rank: Math.floor(Math.random() * 100) + 1,
          votingPower: Math.floor(Math.random() * 10000000) + 100000,
          votingPowerPercentage: (Math.random() * 10).toFixed(2),
          totalDelegated: Math.floor(Math.random() * 10000000) + 100000,
          delegatorsCount: Math.floor(Math.random() * 1000) + 10,
          commission: (Math.random() * 10).toFixed(2),
          maxChangeRate: (Math.random() * 2).toFixed(2),
          selfDelegated: Math.floor(Math.random() * 1000000) + 10000,
          identity: Math.random() > 0.5 ? 'Validator Identity' : '',
          securityContact: Math.random() > 0.5 ? 'security@example.com' : '',
          website: Math.random() > 0.5 ? 'https://example.com' : '',
          blocksProposed: Math.floor(Math.random() * 10000) + 1000,
          apr: (Math.random() * 5 + 10).toFixed(2),
          description: 'This validator is an active contributor to the Celestia network, providing high availability and secure validation services. We have extensive experience in blockchain validation and are committed to the stability and development of the network.',
          uptime: (Math.random() * 5 + 95).toFixed(2),
          uptimeBlocks: 10000,
          missedBlocks: Math.floor(Math.random() * 100)
        }
        
        this.loadDelegators()
        this.loadBlocks()
        this.fetchRecentBlocks()
        
        this.loading = false
      }, 1500)
    },
    loadDelegators() {
      // Simulate loading delegator data
      setTimeout(() => {
        const newDelegators = []
        for (let i = 0; i < 10; i++) {
          newDelegators.push({
            address: `celestia1${Math.random().toString(36).substring(2, 15)}`,
            amount: Math.floor(Math.random() * 100000) + 1000
          })
        }
        this.delegators = [...this.delegators, ...newDelegators]
      }, 500)
    },
    loadMoreDelegators() {
      this.delegatorsPage++
      this.loadDelegators()
    },
    loadBlocks() {
      // Simulate loading block data
      setTimeout(() => {
        const newBlocks = []
        for (let i = 0; i < 10; i++) {
          newBlocks.push({
            height: Math.floor(Math.random() * 1000000) + 1000000,
            time: new Date(Date.now() - Math.random() * 86400000 * 7), // Past 7 days
            txCount: Math.floor(Math.random() * 100)
          })
        }
        this.blocks = [...this.blocks, ...newBlocks]
      }, 500)
    },
    loadMoreBlocks() {
      this.blocksPage++
      this.loadBlocks()
      if (this.blocksPage >= 5) {
        this.hasMoreBlocks = false // Simulate data loading completion
      }
    },
    fetchRecentBlocks() {
      // Simulate API call for recent blocks
      setTimeout(() => {
        const blocks = []
        for (let i = 0; i < 5; i++) {
          blocks.push({
            height: 1000000 + Math.floor(Math.random() * 10000),
            time: new Date(Date.now() - (i * Math.random() * 600000)), // Random times within last few hours
            txs: Math.floor(Math.random() * 50)
          })
        }
        this.recentBlocks = blocks.sort((a, b) => b.height - a.height)
      }, 1500)
    },
    formatTime(time) {
      return format(time, 'yyyy-MM-dd HH:mm:ss', { locale: enUS })
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
    shortAddress(address) {
      return `${address.substring(0, 10)}...${address.substring(address.length - 6)}`
    }
  }
}
</script>

<style scoped>
.validator-detail-page {
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
.validator-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.validator-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.validator-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.validator-info h1 {
  margin: 0 0 10px 0;
}
.validator-status {
  display: flex;
  align-items: center;
}
.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-right: 10px;
}
.status-badge.active {
  background: #e6f7ee;
  color: #42b983;
}
.status-badge.inactive {
  background: #fee;
  color: #e53e3e;
}
.rank {
  color: #666;
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
  font-size: 0.9rem;
  color: #666;
}
.stat-card .value {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}
.stat-card .sub-value {
  font-size: 0.8rem;
  color: #666;
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
.detail-row a {
  color: #42b983;
  text-decoration: none;
}
.monospace {
  font-family: monospace;
  font-size: 0.9rem;
}
.description {
  background: #f9f9f9;
  border-radius: 4px;
  padding: 15px;
  line-height: 1.6;
}
.tabbed-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 30px;
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
.delegators-list, .blocks-list {
  border-top: 1px solid #eee;
}
.delegator-item, .block-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.delegator-address a, .block-height a {
  color: #42b983;
  text-decoration: none;
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
.uptime-stats {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
}
.uptime-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #42b983;
}
.uptime-bar {
  height: 20px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}
.uptime-fill {
  height: 100%;
  background: #42b983;
  border-radius: 10px;
}
.uptime-info {
  color: #666;
  font-size: 0.9rem;
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
  .tabs {
    flex-direction: column;
  }
  .tabs button {
    text-align: left;
  }
}
</style> 