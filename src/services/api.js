import axios from 'axios';

// 注意：您需要安装axios: npm install axios

// 以下是模拟的API端点，实际使用时需要替换为真实的区块链API
const API_BASE_URL = 'https://fullnode.testnet.sui.io/';

export default {
  // 获取区块链统计数据
  getBlockchainStats() {
    return axios.get(`${API_BASE_URL}/stats`);
  },
  
  // 获取最新区块
  getLatestBlocks(limit = 10) {
    return axios.get(`${API_BASE_URL}/blocks?limit=${limit}`);
  },
  
  // 获取指定区块
  getBlock(height) {
    return axios.get(`${API_BASE_URL}/blocks/${height}`);
  },
  
  // 获取最新交易
  getLatestTransactions(limit = 20) {
    return axios.get(`${API_BASE_URL}/txs?limit=${limit}`);
  },
  
  // 获取验证者列表
  getValidators() {
    return axios.get(`${API_BASE_URL}/validators`);
  },
  
  // 获取代币价格历史
  getPriceHistory(period = '24h') {
    return axios.get(`${API_BASE_URL}/market/price-history?period=${period}`);
  }
}; 