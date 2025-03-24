<template>
  <div class="blocks-page">
    <h1>区块</h1>
    
    <div class="stats-cards">
      <div class="stat-card">
        <h3>区块高度</h3>
        <div class="value">{{ latestBlock }}</div>
      </div>
      <div class="stat-card">
        <h3>平均区块时间</h3>
        <div class="value">{{ blockTime }} 秒</div>
      </div>
      <div class="stat-card">
        <h3>交易总数</h3>
        <div class="value">{{ formatNumber(totalTx) }}</div>
      </div>
    </div>
    
    <div class="blocks-container">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="搜索区块高度..." 
          v-model="searchQuery"
          @keyup.enter="searchBlock"
        />
        <button @click="searchBlock">搜索</button>
      </div>
      
      <div class="blocks-table">
        <div class="table-header">
          <div class="col-height">高度</div>
          <div class="col-time">时间</div>
          <div class="col-txs">交易数</div>
          <div class="col-proposer">提议者</div>
        </div>
        
        <div v-if="loading" class="loading">加载中...</div>
        <template v-else>
          <div 
            v-for="block in blocks" 
            :key="block.height"
            class="block-row"
          >
            <div class="col-height">
              <router-link :to="`/blocks/${block.height}`">
                {{ block.height }}
              </router-link>
            </div>
            <div class="col-time">{{ formatTime(block.time) }}</div>
            <div class="col-txs">{{ block.txCount }}</div>
            <div class="col-proposer">
              <router-link :to="`/validators/${block.proposerAddress}`">
                {{ block.proposer }}
              </router-link>
            </div>
          </div>
        </template>
      </div>
      
      <div class="pagination">
        <button 
          :disabled="currentPage === 1" 
          @click="currentPage--"
        >
          上一页
        </button>
        <span>第 {{ currentPage }} 页</span>
        <button 
          :disabled="currentPage === totalPages" 
          @click="currentPage++"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { format, formatDistance } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'

export default {
  name: 'Blocks',
  data() {
    return {
      loading: true,
      searchQuery: '',
      blocks: [],
      currentPage: 1,
      totalPages: 100,
      latestBlock: 0,
      blockTime: 6.5,
      totalTx: 12345678
    }
  },
  watch: {
    currentPage() {
      this.fetchBlocks()
    }
  },
  mounted() {
    this.fetchBlocks()
  },
  methods: {
    fetchBlocks() {
      this.loading = true
      
      // 模拟API调用
      setTimeout(() => {
        const mockBlocks = []
        // 假设最新区块是1234567
        const latestBlock = 1234567
        this.latestBlock = latestBlock
        
        // 每页显示25个区块
        const startBlock = latestBlock - ((this.currentPage - 1) * 25)
        
        for (let i = 0; i < 25; i++) {
          const height = startBlock - i
          if (height <= 0) break
          
          mockBlocks.push({
            height,
            time: new Date(Date.now() - (i * 6.5 + Math.random() * 2) * 1000),
            txCount: Math.floor(Math.random() * 30),
            proposer: `Validator ${Math.floor(Math.random() * 100) + 1}`,
            proposerAddress: `celestiavaloper${Math.floor(Math.random() * 100).toString().padStart(6, '0')}`
          })
        }
        
        this.blocks = mockBlocks
        this.loading = false
      }, 1000)
    },
    searchBlock() {
      if (!this.searchQuery || isNaN(parseInt(this.searchQuery))) {
        return
      }
      
      const height = parseInt(this.searchQuery)
      this.$router.push(`/blocks/${height}`)
    },
    formatTime(time) {
      return formatDistance(time, new Date(), { addSuffix: true, locale: zhCN })
    },
    formatNumber(num) {
      return new Intl.NumberFormat().format(num)
    }
  }
}
</script>

<style scoped>
.blocks-page {
  padding-bottom: 40px;
}
.blocks-page h1 {
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
.blocks-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.search-bar {
  display: flex;
  margin-bottom: 20px;
}
.search-bar input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
}
.search-bar button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}
.blocks-table {
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
.block-row {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.block-row:hover {
  background: #f9f9f9;
}
.col-height { width: 20%; }
.col-time { width: 30%; }
.col-txs { width: 20%; }
.col-proposer { width: 30%; }

.col-height a, .col-proposer a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}
.loading {
  padding: 40px;
  text-align: center;
  color: #666;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 15px;
  align-items: center;
}
.pagination button {
  padding: 8px 15px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style> 