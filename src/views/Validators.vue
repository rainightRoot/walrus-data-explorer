<template>
  <div class="validators-page">
    <h1>验证者</h1>
    
    <div class="stats-cards">
      <div class="stat-card">
        <h3>活跃验证者</h3>
        <div class="value">{{ activeValidators }}</div>
      </div>
      <div class="stat-card">
        <h3>总验证者</h3>
        <div class="value">{{ totalValidators }}</div>
      </div>
      <div class="stat-card">
        <h3>投票权</h3>
        <div class="value">{{ formatNumber(totalVotingPower) }} TIA</div>
      </div>
    </div>
    
    <div class="validators-container">
      <div class="filters">
        <div class="search-bar">
          <input type="text" placeholder="搜索验证者..." v-model="searchQuery" />
        </div>
        <div class="status-filter">
          <button 
            v-for="status in statusOptions" 
            :key="status.value"
            :class="{ active: selectedStatus === status.value }"
            @click="selectedStatus = status.value"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
      
      <div class="validators-table">
        <div class="table-header">
          <div class="col-rank">#</div>
          <div class="col-name">验证者</div>
          <div class="col-status">状态</div>
          <div class="col-voting-power">投票权</div>
          <div class="col-commission">佣金</div>
          <div class="col-delegators">委托人</div>
        </div>
        
        <div v-if="loading" class="loading">加载中...</div>
        <template v-else>
          <div 
            v-for="(validator, index) in filteredValidators" 
            :key="validator.address"
            class="validator-row"
          >
            <div class="col-rank">{{ index + 1 }}</div>
            <div class="col-name">
              <router-link :to="`/validators/${validator.address}`">
                {{ validator.name }}
              </router-link>
            </div>
            <div class="col-status">
              <span :class="['status-badge', validator.status]">
                {{ validator.status === 'active' ? '活跃' : '不活跃' }}
              </span>
            </div>
            <div class="col-voting-power">
              {{ formatNumber(validator.votingPower) }} TIA
              <div class="power-percentage">{{ validator.votingPercentage }}%</div>
            </div>
            <div class="col-commission">{{ validator.commission }}%</div>
            <div class="col-delegators">{{ validator.delegators }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Validators',
  data() {
    return {
      loading: true,
      searchQuery: '',
      selectedStatus: 'all',
      statusOptions: [
        { label: '全部', value: 'all' },
        { label: '活跃', value: 'active' },
        { label: '不活跃', value: 'inactive' }
      ],
      validators: []
    }
  },
  computed: {
    activeValidators() {
      return this.validators.filter(v => v.status === 'active').length
    },
    totalValidators() {
      return this.validators.length
    },
    totalVotingPower() {
      return this.validators.reduce((sum, v) => sum + v.votingPower, 0)
    },
    filteredValidators() {
      let result = this.validators
      
      if (this.selectedStatus !== 'all') {
        result = result.filter(v => v.status === this.selectedStatus)
      }
      
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(v => 
          v.name.toLowerCase().includes(query) || 
          v.address.toLowerCase().includes(query)
        )
      }
      
      return result
    }
  },
  mounted() {
    this.fetchValidators()
  },
  methods: {
    fetchValidators() {
      // 模拟API调用
      setTimeout(() => {
        const mockValidators = []
        for (let i = 1; i <= 100; i++) {
          const votingPower = Math.floor(Math.random() * 1000000) + 10000
          mockValidators.push({
            address: `celestiavaloper${i.toString().padStart(6, '0')}`,
            name: `Validator ${i}`,
            status: Math.random() > 0.2 ? 'active' : 'inactive',
            votingPower,
            votingPercentage: ((votingPower / 100000000) * 100).toFixed(2),
            commission: (Math.random() * 20).toFixed(2),
            delegators: Math.floor(Math.random() * 1000) + 1
          })
        }
        
        // 按投票权排序
        this.validators = mockValidators.sort((a, b) => b.votingPower - a.votingPower)
        this.loading = false
      }, 1500)
    },
    formatNumber(num) {
      return new Intl.NumberFormat().format(num)
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
  background: #f9f9f9;
}
.col-rank { width: 5%; }
.col-name { width: 30%; }
.col-status { width: 15%; }
.col-voting-power { width: 20%; }
.col-commission { width: 15%; }
.col-delegators { width: 15%; }

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
  background: #e6f7ee;
  color: #42b983;
}
.status-badge.inactive {
  background: #fee;
  color: #e53e3e;
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
  }
  .filters {
    flex-direction: column;
  }
  .search-bar input {
    width: 100%;
  }
}
</style> 