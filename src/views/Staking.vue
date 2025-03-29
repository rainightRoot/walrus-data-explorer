<template>
  <div class="staking-page">
    <!-- Navigation and Address -->
    <div class="page-header">
      <div class="nav-tabs">
        <button class="tab-btn">Account</button>
        <button class="tab-btn active">Staking</button>
      </div>
      <div class="address-bar">
        <div class="address">celestia13z9ls9etquus00d6jusrt04z0qv2uw2gpf0l0r</div>
        <div class="address-actions">
          <button class="action-btn" title="Copy">
            <i class="fas fa-copy"></i>
          </button>
          <button class="action-btn" title="View in explorer">
            <i class="fas fa-external-link-alt"></i>
          </button>
          <button class="action-btn" title="Add to favorites">
            <i class="fas fa-star"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Staking Grid -->
    <div class="staking-grid">
      <!-- My TIA Staking Card -->
      <div class="staking-card">
        <h2>My TIA Staking</h2>
        <div class="staking-info">
          <div class="info-row">
            <div class="info-col">
              <div class="label">TOTAL STAKED</div>
              <div class="value">{{ formatNumber(totalStaked) }} TIA</div>
              <div class="usd-value">~${{ formatUSD(totalStaked * tiaPrice) }}</div>
            </div>
            <div class="info-col">
              <div class="label">AVAILABLE</div>
              <div class="value">{{ formatNumber(available) }} TIA</div>
              <div class="usd-value">~${{ formatUSD(available * tiaPrice) }}</div>
            </div>
          </div>
          <div class="rewards-section">
            <div class="rewards-header">
              <div class="label">
                REWARDS
                <span class="info-icon">ⓘ</span>
              </div>
              <button class="claim-btn" @click="claimRewards" :disabled="!canClaimRewards">Claim</button>
            </div>
            <div class="value">{{ formatNumber(rewards) }} TIA</div>
          </div>
          <button class="stake-btn">Stake</button>
        </div>
      </div>

      <!-- Calculator Card -->
      <div class="staking-card">
        <div class="card-header">
          <h2>Calculate your earnings</h2>
          <span class="info-icon">ⓘ</span>
        </div>
        <div class="calculator">
          <div class="slider-container">
            <input 
              type="range" 
              class="range-slider"
              v-model="stakingAmount"
              min="0"
              max="10000000"
              step="1000"
            />
          </div>
          <div class="amount-input">
            <input 
              type="number" 
              v-model="stakingAmount"
              class="amount-field"
            />
            <span class="currency">TIA</span>
          </div>
          <div class="usd-value">~${{ formatUSD(stakingAmount * tiaPrice) }}</div>
          
          <div class="earnings-table">
            <div class="earning-row">
              <span>Daily</span>
              <div class="earning-amount">
                <div>{{ formatTIA(dailyEarning) }} TIA</div>
                <div class="usd-value">~${{ formatUSD(dailyEarning * tiaPrice) }}</div>
              </div>
            </div>
            <div class="earning-row">
              <span>Monthly</span>
              <div class="earning-amount">
                <div>{{ formatTIA(monthlyEarning) }} TIA</div>
                <div class="usd-value">~${{ formatUSD(monthlyEarning * tiaPrice) }}</div>
              </div>
            </div>
            <div class="earning-row">
              <span>Yearly</span>
              <div class="earning-amount">
                <div>{{ formatTIA(yearlyEarning) }} TIA</div>
                <div class="usd-value">~${{ formatUSD(yearlyEarning * tiaPrice) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Card -->
      <div class="stats-card">
        <div class="stat-item">
          <div class="stat-header">
            <h3>Staking APR</h3>
            <span class="info-icon">ⓘ</span>
          </div>
          <div class="stat-value">{{ stakingAPR }}%</div>
          <div class="stat-change negative">1M -0.97%</div>
        </div>
        <div class="stat-item">
          <div class="stat-header">
            <h3>Unlock Period</h3>
            <span class="info-icon">ⓘ</span>
          </div>
          <div class="stat-value">{{ unlockPeriod }} days</div>
        </div>
        <div class="stat-item">
          <div class="stat-header">
            <h3>Avg. Commission</h3>
            <span class="info-icon">ⓘ</span>
          </div>
          <div class="stat-value">{{ avgCommission }}%</div>
        </div>
      </div>
    </div>

    <!-- Validators Section -->
    <div class="validators-section">
      <div class="section-header">
        <div class="tabs">
          <button class="tab active">Active</button>
          <button class="tab">Pending</button>
        </div>
        <div class="search">
          <input type="text" placeholder="Enter validator" />
        </div>
      </div>
      
      <div class="validators-table">
        <div class="table-header">
          <div class="col">Validator</div>
          <div class="col">Total Amount ↓</div>
          <div class="col">Pending Amount</div>
          <div class="col">Rewards</div>
          <div class="col">Validator Status</div>
        </div>
        <div class="table-body">
          <!-- Table content will be populated dynamically -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { formatNumber } from '@/utils/formatters'
export default {
  name: 'Staking',
  data() {
    return {
      totalStaked: 87654321,
      available: 7654321,
      rewards: 12345,
      tiaPrice: 3.667, // Mock TIA price
      stakingAPR: 11.45,
      unlockPeriod: 21,
      avgCommission: 10.49,
      stakingAmount: 1000000,
      dailyEarning: 0,
      monthlyEarning: 0,
      yearlyEarning: 0
    }
  },
  computed: {
    canClaimRewards() {
      return this.rewards > 0
    }
  },
  mounted() {
    this.calculateEarnings()
  },
  methods: {
    formatNumber,
    formatPercentage(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value / 100)
    },
    formatDate(date) {
      return format(new Date(date), 'MMM dd, yyyy', { locale: enUS })
    },
    formatTIA(amount) {
      return amount.toFixed(2)
    },
    formatUSD(amount) {
      return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    calculateEarnings() {
      this.dailyEarning = (this.stakingAmount * this.stakingAPR) / (365 * 100)
      this.monthlyEarning = this.dailyEarning * 30
      this.yearlyEarning = this.dailyEarning * 365
    },
    claimRewards() {
      // Implementation of claimRewards method
    }
  }
}
</script>

<style scoped>
/* Base styles */
.staking-page {
  padding: 20px;
}

/* Navigation and Address styles */
.page-header {
  margin-bottom: 30px;
}

.nav-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  background: transparent;
  cursor: pointer;
}

.tab-btn.active {
  background: var(--primary-color);
  color: white;
}

.address-bar {
  background: var(--card-bg);
  padding: 15px 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Staking Grid styles */
.staking-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.staking-card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 20px;
}

/* Calculator specific styles */
.range-slider {
  width: 100%;
  margin: 20px 0;
}

.amount-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.amount-field {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

/* Stats Card styles */
.stats-card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 20px;
}

.stat-item {
  margin-bottom: 20px;
}

/* Validators section styles */
.validators-section {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* Dark mode styles */
[data-theme="dark"] {
  /* Add dark mode specific styles */
  .staking-card,
  .stats-card,
  .validators-section {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
  }

  .amount-field {
    background: #2a2a2a;
    color: #fff;
    border-color: #444;
  }

  .tab-btn {
    color: #aaa;
  }

  .tab-btn.active {
    color: white;
  }

  .stat-value {
    color: #fff;
  }

  .usd-value {
    color: #aaa;
  }
}
</style> 