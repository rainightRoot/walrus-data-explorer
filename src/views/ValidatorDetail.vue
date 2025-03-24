<template>
  <div class="validator-detail-page">
    <div class="back-link">
      <router-link to="/validators">
        <span class="back-arrow">←</span> 返回验证者列表
      </router-link>
    </div>
    
    <div v-if="loading" class="loading">加载验证者数据中...</div>
    <div v-else-if="!validator" class="error">验证者未找到</div>
    <template v-else>
      <div class="validator-header">
        <div class="validator-logo">
          <img :src="validator.logo || '/images/default-validator.png'" :alt="validator.name">
        </div>
        <div class="validator-info">
          <h1>{{ validator.name }}</h1>
          <div class="validator-status">
            <span :class="['status-badge', validator.status]">
              {{ validator.status === 'active' ? '活跃' : '非活跃' }}
            </span>
            <span class="rank">#{{ validator.rank }}</span>
          </div>
        </div>
      </div>
      
      <div class="stats-cards">
        <div class="stat-card">
          <h3>投票权</h3>
          <div class="value">{{ formatNumber(validator.votingPower) }} TIA</div>
          <div class="sub-value">{{ validator.votingPowerPercentage }}% 网络占比</div>
        </div>
        <div class="stat-card">
          <h3>委托总量</h3>
          <div class="value">{{ formatNumber(validator.totalDelegated) }} TIA</div>
          <div class="sub-value">来自 {{ validator.delegatorsCount }} 委托人</div>
        </div>
        <div class="stat-card">
          <h3>佣金比例</h3>
          <div class="value">{{ validator.commission }}%</div>
          <div class="sub-value">最大变化率: {{ validator.maxChangeRate }}%</div>
        </div>
      </div>
      
      <div class="detail-card">
        <h2>验证者详情</h2>
        <div class="detail-grid">
          <div class="detail-row">
            <div class="label">地址</div>
            <div class="value monospace">{{ validator.address }}</div>
          </div>
          <div class="detail-row">
            <div class="label">操作员地址</div>
            <div class="value monospace">{{ validator.operatorAddress }}</div>
          </div>
          <div class="detail-row">
            <div class="label">网站</div>
            <div class="value">
              <a :href="validator.website" target="_blank" v-if="validator.website">{{ validator.website }}</a>
              <span v-else>未提供</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="label">自我质押</div>
            <div class="value">{{ formatNumber(validator.selfDelegated) }} TIA</div>
          </div>
          <div class="detail-row">
            <div class="label">身份</div>
            <div class="value">{{ validator.identity || '未提供' }}</div>
          </div>
          <div class="detail-row">
            <div class="label">安全联系方式</div>
            <div class="value">{{ validator.securityContact || '未提供' }}</div>
          </div>
          <div class="detail-row">
            <div class="label">已完成区块数</div>
            <div class="value">{{ formatNumber(validator.blocksProposed) }}</div>
          </div>
          <div class="detail-row">
            <div class="label">年化收益率</div>
            <div class="value">{{ validator.apr }}%</div>
          </div>
        </div>
      </div>
      
      <div class="detail-card">
        <h2>描述</h2>
        <div class="description">
          {{ validator.description || '该验证者未提供描述' }}
        </div>
      </div>
      
      <div class="tabbed-section">
        <div class="tabs">
          <button 
            :class="{ active: activeTab === 'delegators' }" 
            @click="activeTab = 'delegators'"
          >
            委托人
          </button>
          <button 
            :class="{ active: activeTab === 'blocks' }" 
            @click="activeTab = 'blocks'"
          >
            提议的区块
          </button>
          <button 
            :class="{ active: activeTab === 'uptime' }" 
            @click="activeTab = 'uptime'"
          >
            在线率
          </button>
        </div>
        
        <div class="tab-content">
          <div v-if="activeTab === 'delegators'" class="delegators-tab">
            <div class="tab-header">
              <h3>委托人 ({{ validator.delegatorsCount }})</h3>
            </div>
            <div v-if="delegators.length === 0" class="no-data">暂无委托人数据</div>
            <div v-else class="delegators-list">
              <div v-for="delegator in delegators" :key="delegator.address" class="delegator-item">
                <div class="delegator-address">
                  <router-link :to="`/accounts/${delegator.address}`">
                    {{ shortAddress(delegator.address) }}
                  </router-link>
                </div>
                <div class="delegator-amount">{{ formatNumber(delegator.amount) }} TIA</div>
              </div>
              <div class="view-more" v-if="delegators.length < validator.delegatorsCount">
                <button @click="loadMoreDelegators">加载更多</button>
              </div>
            </div>
          </div>
          
          <div v-if="activeTab === 'blocks'" class="blocks-tab">
            <div class="tab-header">
              <h3>提议的区块</h3>
            </div>
            <div v-if="blocks.length === 0" class="no-data">暂无区块数据</div>
            <div v-else class="blocks-list">
              <div v-for="block in blocks" :key="block.height" class="block-item">
                <div class="block-height">
                  <router-link :to="`/blocks/${block.height}`">
                    #{{ block.height }}
                  </router-link>
                </div>
                <div class="block-time">{{ formatTime(block.time) }}</div>
                <div class="block-txs">{{ block.txCount }} 交易</div>
              </div>
              <div class="view-more" v-if="hasMoreBlocks">
                <button @click="loadMoreBlocks">加载更多</button>
              </div>
            </div>
          </div>
          
          <div v-if="activeTab === 'uptime'" class="uptime-tab">
            <div class="tab-header">
              <h3>最近在线率</h3>
            </div>
            <div class="uptime-stats">
              <div class="uptime-value">{{ validator.uptime }}%</div>
              <div class="uptime-bar">
                <div class="uptime-fill" :style="{ width: validator.uptime + '%' }"></div>
              </div>
              <div class="uptime-info">
                最近 {{ validator.uptimeBlocks }} 区块中缺席 {{ validator.missedBlocks }} 个
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { format, formatDistance } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'

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
      hasMoreBlocks: true
    }
  },
  mounted() {
    this.fetchValidatorData()
  },
  methods: {
    fetchValidatorData() {
      this.loading = true
      
      // 模拟API调用
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
          identity: Math.random() > 0.5 ? '验证者身份' : '',
          securityContact: Math.random() > 0.5 ? 'security@example.com' : '',
          website: Math.random() > 0.5 ? 'https://example.com' : '',
          blocksProposed: Math.floor(Math.random() * 10000) + 1000,
          apr: (Math.random() * 5 + 10).toFixed(2),
          description: '该验证者是Celestia网络的活跃贡献者，提供高可用性和安全的验证服务。我们有丰富的区块链验证经验，并致力于网络的稳定和发展。',
          uptime: (Math.random() * 5 + 95).toFixed(2),
          uptimeBlocks: 10000,
          missedBlocks: Math.floor(Math.random() * 100)
        }
        
        this.loadDelegators()
        this.loadBlocks()
        
        this.loading = false
      }, 1500)
    },
    loadDelegators() {
      // 模拟加载委托人数据
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
      // 模拟加载区块数据
      setTimeout(() => {
        const newBlocks = []
        for (let i = 0; i < 10; i++) {
          newBlocks.push({
            height: Math.floor(Math.random() * 1000000) + 1000000,
            time: new Date(Date.now() - Math.random() * 86400000 * 7), // 过去7天内
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
        this.hasMoreBlocks = false // 模拟数据加载完毕
      }
    },
    formatTime(time) {
      return format(time, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })
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