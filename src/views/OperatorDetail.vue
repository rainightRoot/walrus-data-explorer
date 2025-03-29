<template>
  <div class="validator-detail-page">
    <div class="back-link">
      <router-link to="/operators">
        <span class="back-arrow">←</span> Back to Operators
      </router-link>
    </div>
    
    <div v-if="loading" class="loading">Loading operator data...</div>
    <div v-else-if="!validator" class="error">Operator not found or data could not be loaded</div>
    <template v-else>
      <div class="validator-header">
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
          <h3>Stake</h3>
          <div class="value">{{ formatNumber(validator.votingPower) }} WAL</div>
          <div class="sub-value">{{ validator.votingPowerPercentage }}% Network Share</div>
        </div>
        <div class="stat-card">
          <h3>Total Delegated</h3>
          <div class="value">{{ formatNumber(validator.totalDelegated) }} WAL</div>
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
            <div class="value">{{ formatNumber(validator.selfDelegated) }} WAL</div>
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
      
      <!-- 选项卡部分 -->
      <div class="tabbed-section">
        <div class="tabs">
          <button 
            :class="['tab', activeTab === 'delegators' ? 'active' : '']" 
            @click="activeTab = 'delegators'"
          >
            Delegators
          </button>
          <button 
            :class="['tab', activeTab === 'stakingHistory' ? 'active' : '']" 
            @click="activeTab = 'stakingHistory'"
          >
            Staking History
          </button>
        </div>
        
        <!-- 质押人列表选项卡 -->
        <div v-if="activeTab === 'delegators'" class="tab-content">
          <div class="tab-header">
            <h3>Delegators</h3>
          </div>
          
          <div v-if="delegatorsLoading && delegators.length === 0" class="loading-indicator">
            Loading delegators data...
          </div>
          <div v-else-if="delegators.length === 0" class="no-data">
            No delegators found
          </div>
          <div v-else>
            <div class="delegators-table">
              <div class="table-header">
                <div class="col-address">Address</div>
                <div class="col-amount">Amount</div>
              </div>
              <div v-for="delegator in delegators" :key="delegator.address" class="delegator-row">
                <div class="col-address monospace">
                  <router-link :to="`/accounts/${delegator.address}`">
                    {{ shortAddress(delegator.address) }}
                  </router-link>
                </div>
                <div class="col-amount">{{ formatNumber(delegator.amount) }} WAL</div>
              </div>
            </div>
            
            <div v-if="delegatorsHasMore && !delegatorsLoading" class="load-more">
              <button @click="loadMoreDelegators" class="load-more-btn">Load More Delegators</button>
            </div>
            <div v-if="delegatorsLoading && delegators.length > 0" class="loading-more">
              Loading more delegators...
            </div>
          </div>
        </div>
        
        <!-- 质押历史记录选项卡 -->
        <div v-if="activeTab === 'stakingHistory'" class="tab-content">
          <div class="tab-header">
            <h3>Staking History</h3>
          </div>
          
          <div v-if="stakingHistoryLoading && stakingHistory.length === 0" class="loading-indicator">
            Loading staking history...
          </div>
          <div v-else-if="stakingHistory.length === 0" class="no-data">
            No staking history found
          </div>
          <div v-else>
            <div class="staking-history-table">
              <div class="table-header">
                <div class="col-tx">ObjectID</div>
                <div class="col-time">Time</div>
                <div class="col-amount">Amount</div>
                <div class="col-type">State</div>
              </div>
              <div v-for="(record, index) in stakingHistory" :key="index" class="staking-history-row">
                <div class="col-tx monospace">
                  <router-link :to="`/events/${record.txHash}`">
                    {{ shortAddress(record.txHash) }}
                  </router-link>
                </div>
                <div class="col-time">{{ formatTime(new Date(record.timestamp)) }}</div>
                <div class="col-amount">{{ formatNumber(record.amount) }} WAL</div>
                <div class="col-type" :class="record.state">
                  {{ record.state }}
                </div>
              </div>
            </div>
            
            <div v-if="hasMoreStakingHistory && !stakingHistoryLoading" class="load-more">
              <button @click="loadMoreStakingHistory" class="load-more-btn">Load More History</button>
            </div>
            <div v-if="stakingHistoryLoading && stakingHistory.length > 0" class="loading-more">
              Loading more history...
            </div>
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
  name: 'OperatorDetail',
  data() {
    return {
      loading: true,
      validatorAddress: this.$route.params.validatorHash,
      validator: null,
      activeTab: 'delegators',
      delegators: [],
      stakingHistory: [],
      delegatorsPage: 1,
      delegatorsLoading: false,
      delegatorsHasMore: true,
      stakingHistoryPage: 1,
      stakingHistoryLoading: false,
      hasMoreStakingHistory: true,
      recentBlocks: [],
      error: null
    }
  },
  mounted() {
    this.fetchValidatorData()
    this.loadDelegators(1)
    this.loadStakingHistory(1)
  },
  methods: {
    async fetchValidatorData() {
      this.loading = true
      
      try {
        // 调用API获取运营商基本信息
        const validatorHash = this.validatorAddress
        console.log('使用validatorHash获取运营商信息:', validatorHash)
        const response = await fetch(`https://walrus-api.equinoxdao.xyz/api/walrus/operator_basic_info/${validatorHash}`)
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`)
        }
        
        const responseData = await response.json()
        console.log('运营商基本信息:', responseData)
        
        if (responseData.success && responseData.data) {
          const operatorData = responseData.data
          
          // 将API返回的数据映射到组件数据结构
          this.validator = {
            address: this.validatorAddress,
            operatorAddress: operatorData.operatorAddress || this.validatorAddress,
            name: operatorData.validatorName || 'Unknown Operator',
            status: operatorData.state === 'Active' ? 'active' : 'inactive',
            rank: operatorData.weight || 0,
            votingPower: operatorData.stake || 0,
            votingPowerPercentage: operatorData.stakePercentage || '0.00',
            totalDelegated: operatorData.totalDelegated || 0,
            delegatorsCount: operatorData.delegatorsCount || 0,
            commission: operatorData.commissionRate || '0.00',
            maxChangeRate: operatorData.maxChangeRate || '0.00',
            selfDelegated: operatorData.selfDelegated || 0,
            identity: operatorData.identity || '',
            securityContact: operatorData.securityContact || '',
            website: operatorData.website || '',
            blocksProposed: operatorData.blocksProposed || 0,
            apr: operatorData.apr || '0.00',
            description: operatorData.description || 'No description provided',
            uptime: operatorData.uptime || '0.00',
            uptimeBlocks: operatorData.uptimeBlocks || 0,
            missedBlocks: operatorData.missedBlocks || 0,
            logo: operatorData.logo || '/images/default-validator.png'
          }
          
          // 加载相关数据
          this.loadDelegators(1)
          this.loadStakingHistory(1)
          this.fetchRecentBlocks()
        } else {
          console.error('API返回数据格式不正确:', responseData)
          this.validator = null
        }
      } catch (error) {
        console.error('获取运营商数据失败:', error)
        this.validator = null
      } finally {
        this.loading = false
      }
    },
    async loadDelegators(page = 1) {
      this.delegatorsLoading = true
      
      try {
        // 使用API获取质押人列表
        const validatorHash = this.validatorAddress
        const pageSize = 10
        const url = `https://walrus-api.equinoxdao.xyz/api/walrus/operator_delegators/${validatorHash}?page=${page}&size=${pageSize}`
        
        console.log('获取质押人列表:', url)
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`)
        }
        
        const responseData = await response.json()
        console.log('质押人数据:', responseData)
        
        if (responseData.success && responseData.data) {
          const newDelegators = responseData.data.content.map(delegator => ({
            address: delegator.owner || delegator.delegatorAddress,
            amount: delegator.amount || delegator.stake || 0
          }))
          
          // 如果是第一页，替换列表，否则添加到列表中
          if (page === 1) {
            this.delegators = newDelegators
          } else {
            this.delegators = [...this.delegators, ...newDelegators]
          }
          
          // 检查是否还有更多数据
          this.delegatorsHasMore = newDelegators.length === pageSize
        } else {
          console.error('API返回数据格式不正确:', responseData)
          if (page === 1) {
            this.delegators = []
          }
        }
      } catch (error) {
        console.error('获取质押人数据失败:', error)
        if (page === 1) {
          this.delegators = []
        }
      } finally {
        this.delegatorsLoading = false
      }
    },
    loadMoreDelegators() {
      this.delegatorsPage++
      this.loadDelegators(this.delegatorsPage)
    },
    async loadStakingHistory(page = 1) {
      this.stakingHistoryLoading = true
      
      try {
        // 使用API获取质押历史记录
        const validatorHash = this.validatorAddress
        const pageSize = 10
        const url = `https://walrus-api.equinoxdao.xyz/api/walrus/operator_staking_history/${validatorHash}?page=${page}&size=${pageSize}`
        
        console.log('获取质押历史记录:', url)
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`)
        }
        
        const responseData = await response.json()
        console.log('质押历史记录数据:', responseData)
        
        if (responseData.success && responseData.data) {
          // 处理分页数据
          const records = responseData.data.content || []
          const newStakingHistory = records.map(record => ({
            txHash: record.objectId || record.transactionHash || '',
            timestamp: record.timestamp || new Date().toISOString(),
            amount: record.amount || 0,
            state: record.state || 'Unknown'
          }))
          
          // 如果是第一页，替换列表，否则添加到列表中
          if (page === 1) {
            this.stakingHistory = newStakingHistory
          } else {
            this.stakingHistory = [...this.stakingHistory, ...newStakingHistory]
          }
          
          // 检查是否还有更多数据
          this.hasMoreStakingHistory = !responseData.data.last
        } else {
          console.error('API返回数据格式不正确:', responseData)
          if (page === 1) {
            this.stakingHistory = []
          }
        }
      } catch (error) {
        console.error('获取质押历史记录失败:', error)
        if (page === 1) {
          this.stakingHistory = []
        }
      } finally {
        this.stakingHistoryLoading = false
      }
    },
    
    loadMoreStakingHistory() {
      this.stakingHistoryPage++
      this.loadStakingHistory(this.stakingHistoryPage)
    },
    fetchRecentBlocks() {
      // TODO: 在未来替换为实际API调用，例如：
      // GET http://localhost:3000/api/walrus/operator_recent_blocks/{validatorHash}
      
      // 模拟获取最近的区块
      setTimeout(() => {
        const blocks = []
        for (let i = 0; i < 5; i++) {
          blocks.push({
            height: 1000000 + Math.floor(Math.random() * 10000),
            time: new Date(Date.now() - (i * Math.random() * 600000)), // 过去几小时内的随机时间
            txs: Math.floor(Math.random() * 50)
          })
        }
        this.recentBlocks = blocks.sort((a, b) => b.height - a.height)
      }, 1500)
    },
    
    fetchTopContributors(page = 1) {
      this.contributorsLoading = true;
      
      // 构建API URL，包含页码和每页数量
      const url = `http://localhost:3000/api/github/contributors?page=${page}&size=${this.contributorsPerPage}`;
      
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
          }
          return response.json();
        })
        .then(responseData => {
          console.log('贡献者数据:', responseData);
          
          if (responseData.success && responseData.data) {
            // 处理贡献者数据
            const contributors = responseData.data || [];
            
            // 设置总数量（用于分页）
            this.totalContributors = responseData.total || contributors.length;
            
            // 格式化贡献者数据
            this.topContributors = contributors.map(contributor => ({
              name: contributor.name || contributor.login || 'Anonymous',
              avatar: contributor.avatar_url || 'https://avatars.githubusercontent.com/u/0',
              commits: contributor.commits || 0,
              additions: this.formatNumber(contributor.additions || 0),
              deletions: this.formatNumber(contributor.deletions || 0)
            }));
          } else {
            console.error('API返回数据格式不正确:', responseData);
            this.topContributors = [];
          }
        })
        .catch(error => {
          console.error('获取贡献者数据失败:', error);
          this.topContributors = [];
        })
        .finally(() => {
          this.contributorsLoading = false;
        });
    },
    
    loadMoreContributors() {
      this.contributorsPage++;
      this.fetchTopContributors(this.contributorsPage);
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
.tab {
  padding: 15px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
}
.tab.active {
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
.delegator-row, .block-row {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.col-address a, .col-height a {
  color: #42b983;
  text-decoration: none;
}

.delegators-table, .blocks-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  display: flex;
  padding: 10px 0;
  border-bottom: 2px solid #eee;
  font-weight: bold;
  color: #666;
}

.col-address, .col-height {
  flex: 2;
}

.col-amount, .col-time, .col-txs {
  flex: 1;
  text-align: right;
}

.loading-indicator, .loading-more {
  text-align: center;
  padding: 20px;
  color: #666;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}

.load-more-btn {
  background: #f5f5f5;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.load-more-btn:hover {
  background: #e0e0e0;
}

/* 质押历史记录类型样式 */
.col-type {
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.col-type.stake,
.col-type.add {
  color: #2f855a;
  background: #e6f7ee;
}

.col-type.unstake,
.col-type.remove {
  color: #c53030;
  background: #fee;
}

.col-type.restake,
.col-type.reward {
  color: #805ad5;
  background: #f3ebff;
}

.staking-history-row {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.col-tx {
  flex: 2;
}

.col-type {
  flex: 1;
  text-align: center;
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