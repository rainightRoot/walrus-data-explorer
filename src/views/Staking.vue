<template>
  <div class="staking-page">
    <h1>质押</h1>
    
    <div class="stats-cards">
      <div class="stat-card">
        <h3>总质押量</h3>
        <div class="value">{{ formatNumber(totalStaked) }} TIA</div>
      </div>
      <div class="stat-card">
        <h3>质押比例</h3>
        <div class="value">{{ stakingRatio }}%</div>
      </div>
      <div class="stat-card">
        <h3>质押年化收益率</h3>
        <div class="value">{{ stakingAPR }}%</div>
      </div>
    </div>
    
    <div class="staking-sections">
      <div class="section validators-summary">
        <h2>验证者概要</h2>
        <div class="summary-stats">
          <div class="stat-item">
            <span class="label">活跃验证者</span>
            <span class="value">{{ activeValidators }}</span>
          </div>
          <div class="stat-item">
            <span class="label">总验证者</span>
            <span class="value">{{ totalValidators }}</span>
          </div>
          <div class="stat-item">
            <span class="label">最大验证者数量</span>
            <span class="value">{{ maxValidators }}</span>
          </div>
        </div>
        <div class="validator-table">
          <div class="table-header">
            <div class="col">验证者</div>
            <div class="col">自我质押</div>
            <div class="col">总质押</div>
          </div>
          <div v-for="(validator, index) in topValidators" :key="validator.address" class="table-row">
            <div class="col validator-name">
              <div class="rank">{{ index + 1 }}</div>
              <router-link :to="`/validators/${validator.address}`">
                {{ validator.name }}
              </router-link>
            </div>
            <div class="col">{{ formatNumber(validator.selfStake) }} TIA</div>
            <div class="col">{{ formatNumber(validator.totalStake) }} TIA</div>
          </div>
        </div>
        <div class="view-all-link">
          <router-link to="/validators">查看所有验证者</router-link>
        </div>
      </div>
      
      <div class="section staking-calculator">
        <h2>质押计算器</h2>
        <div class="calculator">
          <div class="input-group">
            <label for="stake-amount">质押金额 (TIA)</label>
            <input 
              type="number" 
              id="stake-amount" 
              v-model.number="calculatorAmount" 
              min="1"
            />
          </div>
          <div class="calculator-results">
            <div class="result-item">
              <span class="label">每日收益</span>
              <span class="value">{{ calculateDailyReward() }} TIA</span>
            </div>
            <div class="result-item">
              <span class="label">每周收益</span>
              <span class="value">{{ calculateWeeklyReward() }} TIA</span>
            </div>
            <div class="result-item">
              <span class="label">每月收益</span>
              <span class="value">{{ calculateMonthlyReward() }} TIA</span>
            </div>
            <div class="result-item">
              <span class="label">每年收益</span>
              <span class="value">{{ calculateYearlyReward() }} TIA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Staking',
  data() {
    return {
      totalStaked: 87654321,
      stakingRatio: 62.5,
      stakingAPR: 12.8,
      activeValidators: 80,
      totalValidators: 95,
      maxValidators: 100,
      topValidators: [],
      calculatorAmount: 1000
    }
  },
  mounted() {
    this.fetchStakingData()
  },
  methods: {
    fetchStakingData() {
      // 模拟API调用
      setTimeout(() => {
        this.topValidators = Array.from({ length: 5 }, (_, i) => ({
          address: `celestiavaloper${(i+1).toString().padStart(6, '0')}`,
          name: `Validator ${i+1}`,
          selfStake: Math.floor(Math.random() * 500000) + 100000,
          totalStake: Math.floor(Math.random() * 5000000) + 1000000
        }))
        // 按总质押排序
        this.topValidators.sort((a, b) => b.totalStake - a.totalStake)
      }, 1000)
    },
    formatNumber(num) {
      return new Intl.NumberFormat().format(num)
    },
    calculateDailyReward() {
      const dailyRate = this.stakingAPR / 365 / 100
      return (this.calculatorAmount * dailyRate).toFixed(4)
    },
    calculateWeeklyReward() {
      return (this.calculateDailyReward() * 7).toFixed(4)
    },
    calculateMonthlyReward() {
      return (this.calculateDailyReward() * 30).toFixed(4)
    },
    calculateYearlyReward() {
      return (this.calculatorAmount * this.stakingAPR / 100).toFixed(4)
    }
  }
}
</script>

<style scoped>
.staking-page {
  padding-bottom: 40px;
}
.staking-page h1 {
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
.staking-sections {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}
.section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.section h2 {
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
}
.summary-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.stat-item {
  text-align: center;
  padding: 10px;
}
.stat-item .label {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}
.stat-item .value {
  font-size: 1.4rem;
  font-weight: bold;
  color: #2c3e50;
}
.validator-table {
  border-top: 1px solid #eee;
  margin-bottom: 15px;
}
.table-header {
  display: flex;
  padding: 15px 0;
  font-weight: bold;
  color: #666;
  border-bottom: 1px solid #eee;
}
.table-row {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.col {
  flex: 1;
}
.validator-name {
  display: flex;
  align-items: center;
}
.rank {
  background: #f5f5f5;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  margin-right: 10px;
}
.validator-name a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}
.view-all-link {
  text-align: center;
  margin-top: 15px;
}
.view-all-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}
.calculator {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
}
.input-group {
  margin-bottom: 20px;
}
.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}
.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.calculator-results {
  border-top: 1px solid #eee;
  padding-top: 15px;
}
.result-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}
.result-item .label {
  color: #666;
}
.result-item .value {
  font-weight: 500;
  color: #2c3e50;
}
@media (max-width: 768px) {
  .stats-cards, .staking-sections {
    grid-template-columns: 1fr;
  }
}
</style> 