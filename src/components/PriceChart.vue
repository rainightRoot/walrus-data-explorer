<template>
  <div class="price-chart">
    <h2>TIA 价格图表</h2>
    <div class="chart-controls">
      <button 
        v-for="period in periods" 
        :key="period"
        :class="{ active: selectedPeriod === period }"
        @click="selectedPeriod = period"
      >
        {{ period }}
      </button>
    </div>
    <div class="chart-container">
      <!-- 这里可以集成 Chart.js 或其他图表库 -->
      <p v-if="loading">加载图表数据...</p>
      <div v-else class="chart-placeholder">
        图表将显示在这里 (需要集成图表库)
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PriceChart',
  data() {
    return {
      loading: true,
      selectedPeriod: '24H',
      periods: ['24H', '1W', '1M', '3M', '1Y', 'All']
    }
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }
}
</script>

<style scoped>
.price-chart {
  margin: 30px 0;
  padding: 20px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.chart-controls {
  display: flex;
  margin-bottom: 15px;
}
button {
  background: #f5f5f5;
  border: none;
  padding: 8px 15px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
}
button.active {
  background: #42b983;
  color: white;
}
.chart-container {
  height: 300px;
  background: #f9f9f9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chart-placeholder {
  color: #999;
}
</style> 