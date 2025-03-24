<template>
  <div class="blockchain-stats">
    <div class="stat-card">
      <h3>最新区块</h3>
      <p class="value">{{ latestBlock }}</p>
    </div>
    <div class="stat-card">
      <h3>市值</h3>
      <p class="value">${{ marketCap }}</p>
    </div>
    <div class="stat-card">
      <h3>24小时交易量</h3>
      <p class="value">${{ volume24h }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlockchainStats',
  data() {
    return {
      latestBlock: '-',
      marketCap: '-',
      volume24h: '-'
    }
  },
  mounted() {
    // 这里可以添加API调用来获取实时数据
    this.fetchBlockchainData();
  },
  methods: {
    fetchBlockchainData() {
      // 模拟API调用
      setTimeout(() => {
        this.latestBlock = '1,234,567';
        this.marketCap = '1,234,567,890';
        this.volume24h = '123,456,789';
      }, 1000);
    }
  }
}
</script>

<style scoped>
.blockchain-stats {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}
.stat-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  width: 30%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #666;
}
.value {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
}
</style> 