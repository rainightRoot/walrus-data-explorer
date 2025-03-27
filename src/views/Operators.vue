<template>
  <div class="validators-page">
    <h1>Operators</h1>
    
    <div class="stats-cards">
      <div class="stat-card">
        <h3>Committee</h3>
        <div class="value">{{ activeValidators }}</div>
      </div>
      <div class="stat-card">
        <h3>Total Operators</h3>
        <div class="value">{{ totalValidators }}</div>
      </div>
      <div class="stat-card">
        <h3>Storage Capacity</h3>
        <div class="value">{{ formattedNodeCapacity }}</div>
      </div>
    </div>
    
    <div class="validators-container">
      <div class="filters">
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Search Operators..." 
            v-model="searchQuery"
            @input="debounceSearch"
          />
        </div>
        <!-- <div class="status-filter">
          <button 
            v-for="status in statusOptions" 
            :key="status.value"
            :class="{ active: selectedStatus === status.value }"
            @click="changeStatus(status.value)"
          >
            {{ status.label }}
          </button>
        </div> -->
      </div>
      
      <div class="table-container">
        <div class="validators-table">
          <div class="table-header">
            <div class="col-rank">#</div>
            <div class="col-name">Operator</div>
            <div class="col-status">State</div>
            <div class="col-voting-power">Stake</div>
            <div class="col-commission">Commission</div>
            <div class="col-delegators">Sui Object ID</div>
          </div>
          
          <div v-if="loading" class="loading">Loading...</div>
          <template v-else>
            <div 
              v-for="(validator, index) in filteredValidators" 
              :key="validator.address"
              class="validator-row"
            >
              <div class="col-rank">{{ currentPage * pageSize + index + 1 }}</div>
              <div class="col-name">
                <router-link :to="`/validators/${validator.address}`">
                  {{ validator.name }}
                  <img 
                    v-if="validator.operator" 
                    src="@/assets/images/official-badge.svg" 
                    alt="Official" 
                    class="official-badge"
                  >
                </router-link>
              </div>
              <div class="col-status">
                <span :class="['status-badge', validator.status]">
                  {{ validator.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="col-voting-power">
                {{ formatNumber(validator.stake) }} WAL
              </div>
              <div class="col-commission">{{ validator.commission }}%</div>
              <div class="col-delegators">{{ formatAddress(validator.address) }}</div>
            </div>
          </template>
        </div>
        
        <!-- 分页控件 -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            class="page-btn prev" 
            :disabled="currentPage === 0" 
            @click="changePage(currentPage - 1)"
          >
            &laquo; Previous
          </button>
          
          <div class="page-info">
            Page {{ currentPage + 1 }} of {{ totalPages }}
            ({{ totalElements }} records total)
          </div>
          
          <button 
            class="page-btn next" 
            :disabled="currentPage >= totalPages - 1" 
            @click="changePage(currentPage + 1)"
          >
          next &raquo;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export default {
  name: 'Validators',
  data() {
    return {
      loading: true,
      statsLoading: true,
      searchQuery: '',
      selectedStatus: 'all',
      statusOptions: [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ],
      validators: [],
      currentPage: 0,
      pageSize: 30,
      totalPages: 0,
      totalElements: 0,
      searchTimeout: null,
      stats: {
        totalValidators: 0,
        operatorCount: 0,
        totalNodeCapacity: {
          raw: 0,
          formatted: '0 B'
        },
        updatedAt: null
      }
    }
  },
  computed: {
    activeValidators() {
      return this.stats.operatorCount || 0
    },
    totalValidators() {
      return this.stats.totalValidators || 0
    },
    totalVotingPower() {
      return this.stats.totalNodeCapacity?.raw || 0
    },
    formattedNodeCapacity() {
      return this.stats.totalNodeCapacity?.formatted || '0 B'
    },
    filteredValidators() {
      // 直接返回 validators，因为搜索和过滤已经在后端实现
      return this.validators
    }
  },
  mounted() {
    this.fetchStats()
    this.fetchValidators()
  },
  methods: {
    // 获取统计数据
    async fetchStats() {
      this.statsLoading = true
      try {
        const response = await fetch('http://127.0.0.1:3000/api/walrus/operator_stats')
        if (!response.ok) {
          throw new Error(`API 请求失败: ${response.status}`)
        }
        
        const responseData = await response.json()
        console.log('统计数据:', responseData);
        
        if (responseData.success && responseData.data) {
          this.stats = responseData.data
        } else {
          throw new Error('API 返回数据格式不正确')
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
      } finally {
        this.statsLoading = false
      }
    },
    
    async fetchValidators(page = 0) {
      this.loading = true
      try {
        // 构建带分页和搜索参数的 URL
        let url = `http://127.0.0.1:3000/api/walrus/committee?page=${page}&size=${this.pageSize}`
        
        // 添加搜索参数
        if (this.searchQuery.trim()) {
          url += `&query=${encodeURIComponent(this.searchQuery.trim())}`
        }
        
        // 添加状态过滤参数
        if (this.selectedStatus !== 'all') {
          url += `&status=${encodeURIComponent(this.selectedStatus)}`
        }
        
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`API 请求失败: ${response.status}`)
        }
        
        const responseData = await response.json()
        console.log('API返回数据:', responseData);
        
        // 处理嵌套的 JSON 数据结构
        if (!responseData.success || !responseData.data || !responseData.data.content) {
          throw new Error('API 返回数据格式不正确')
        }
        
        const data = responseData.data.content;
        
        // 更新分页信息
        this.currentPage = responseData.data.number || 0
        this.totalPages = responseData.data.totalPages || 0
        this.totalElements = responseData.data.totalElements || 0
        
        // 处理API返回的数据
        const validators = data.map(item => ({
          address: item.validatorHash || '',
          name: item.validatorName || `Operator ${item.validatorHash?.substring(0, 8) || ''}`,
          status: item.state === 'Active' ? 'active' : 'inactive',
          stake: item.stake || 0,
          commission: item.commissionRate || 0,
          delegators: item.weight || 0,
          operator: item.operator || false
        }))
        
        // 按投票权排序
        this.validators = validators.sort((a, b) => b.votingPower - a.votingPower)
        console.log('处理后的数据:', validators);
      } catch (error) {
        console.error('获取 operators 数据失败:', error)
        this.validators = [] // 出错时清空数据
      } finally {
        this.loading = false
      }
    },
    
    // 切换页面
    changePage(page) {
      if (page >= 0 && page < this.totalPages) {
        this.fetchValidators(page)
      }
    },
    
    // 处理搜索输入，带防抖功能
    debounceSearch() {
      // 清除之前的定时器
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      // 设置新的定时器，300ms 后执行搜索
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 0 // 重置到第一页
        this.fetchValidators(0)
      }, 300)
    },
    
    // 切换状态过滤
    changeStatus(status) {
      this.selectedStatus = status
      this.currentPage = 0 // 重置到第一页
      this.fetchValidators(0)
    },
    
    getTotalStake(data) {
      // 计算总投票权
      return data.reduce((sum, item) => sum + (item.stake || 0), 0)
    },
    formatNumber(value) {
      return new Intl.NumberFormat('en-US').format(value)
    },
    formatTime(time) {
      return format(new Date(time), 'MMM dd, yyyy HH:mm', { locale: enUS })
    },
    
    formatAddress(address) {
      if (!address || address.length < 12) return address;
      return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
    }
  }
}
</script>

<style scoped>
.validators-page {
  padding-bottom: 40px;
}
.validators-page h1 {
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
.validators-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
/* 分页控件样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  margin-bottom: 20px;
}
.page-btn {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.2s;
}
.page-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #bbb;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-info {
  margin: 0 20px;
  font-size: 14px;
  color: #666;
}
.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}
.search-bar input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 1rem;
}
.status-filter button {
  background: #f5f5f5;
  border: none;
  padding: 10px 15px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
}
.status-filter button.active {
  background: #42b983;
  color: white;
}
.table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1rem;
}
.validators-table {
  width: 100%;
  border-top: 1px solid #eee;
}
.table-header {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  color: #666;
}
.validator-row {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.validator-row:hover {
  background: var(--table-row-hover);
}
.col-rank { width: 5%; padding-left: 10px;}
.col-name { width: 25%; }
.col-status { width: 15%; }
.col-voting-power { width: 20%; }
.col-commission { width: 15%; }
.col-delegators { width: 20%; }

.col-name a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}
.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}
.status-badge.active {
  background: var(--success-light);
  color: var(--success-color);
}
.status-badge.inactive {
  background: var(--danger-light);
  color: var(--danger-color);
}
.power-percentage {
  font-size: 0.8rem;
  color: #666;
  margin-top: 3px;
}
.loading {
  padding: 40px;
  text-align: center;
  color: #666;
}
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .filters {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .search-bar input {
    width: 100%;
    padding: 12px 15px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .status-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
  }
  
  .status-filter button {
    flex: 1;
    min-width: 80px;
    text-align: center;
    padding: 12px 8px;
    margin-right: 0;
  }
  
  /* Add a subtle shadow to help separate elements */
  .validators-container, .stat-card {
    box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  }
}

/* Update status badge colors to work with dark mode */
[data-theme="dark"] .status-badge.active {
  background: rgba(40, 167, 69, 0.2);
  color: #4cce5a;
}
[data-theme="dark"] .col-rank {
  color: #b0b3b8;
}
[data-theme="dark"] .validators-container {
  background: var(--card-bg);
}

[data-theme="dark"] .status-badge.inactive {
  background: rgba(220, 53, 69, 0.2);
  color: #ff6b6b;
}

/* Ensure tables have proper hover colors */
.validator-row:hover {
  background: var(--table-row-hover);
}

.official-badge {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-left: 4px;
  display: inline-block;
}
</style> 