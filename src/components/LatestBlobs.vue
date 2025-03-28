<template>
  <div class="latest-blocks">
  
    
    <div class="blocks-list">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="blocks.length === 0" class="no-data">No data available</div>
      <div v-else class="block-item" v-for="block in blocks" :key="block.height">
        <div class="block-height">
          <router-link :to="`/blocks/${block.blobId}`">#{{ shortHash(block.blobId) }}</router-link>
          <div class="block-time">{{ formatTime(block.timestamp) }}</div>

        </div>
        <div class="block-info">
          <div class="block-details">
            <span>{{ formatBytes(block.size) }} </span>
            <span>{{ block.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format, formatDistance } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { shortHash,formatBytes } from '@/utils/formatters'
export default {
  name: 'LatestBlocks',
  data() {
    return {
      loading: true,
      blocks: []
    }
  },
  mounted() {
    this.fetchLatestBlocks()

    setInterval(() => {
    this.fetchLatestBlocks()
      
    }, 1000*5);
  },
  methods: {
    shortHash,
    formatBytes,
    async fetchLatestBlocks() {
      const response = await fetch('https://walruscan.com/api/walscan-backend/mainnet//api/blobs?page=0&sortBy=TIMESTAMP&orderBy=DESC&searchStr=&size=5')
      const data = await response.json()
      console.log(data)
      // 模拟API调用
      this.blocks = data.content
      this.loading = false
    },
    formatTime(time) {
      return formatDistance(
        new Date(time),
        new Date(),
        { addSuffix: true, locale: enUS }
      )
    }
  }
}
</script>

<style scoped>
.latest-blocks {
  background: white;
  padding: 20px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.section-header h2 {
  margin: 0;
  font-size: 1.2rem;
}
.view-all {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}
.blocks-list {
  border-top: 1px solid #eee;
}
.block-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.block-height {
  width: 200px;
  font-weight: bold;
}
.block-height a {
  color: #42b983;
  text-decoration: none;
}
.block-info {
  flex: 1;
}
.block-time {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}
.block-details {
  display: flex;
  gap: 15px;
}
.block-details span {
  color: #2c3e50;
  font-size: 0.9rem;
}
.loading, .no-data {
  padding: 20px;
  text-align: center;
  color: #666;
}

/* Add these styles to the component */
[data-theme="dark"] .latest-blocks {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}
/* Make sure the block list has proper background and borders in dark mode */
[data-theme="dark"] .latest-blocks-container {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] .block-header {
  background-color: var(--card-header-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] .block-item {
  border-color: var(--border-color);
  background-color: var(--card-bg);
}

[data-theme="dark"] .block-item:hover {
  background-color: var(--table-row-hover);
}

/* Fix text colors in dark mode */
[data-theme="dark"] .block-height {
  color: #a48aff; /* Lighter purple for better visibility */
}

[data-theme="dark"] .block-proposer {
  color: #eee;
}

[data-theme="dark"] .block-time {
  color: #aaa;
}

[data-theme="dark"] .block-txs {
  color: #eee;
}

[data-theme="dark"] .view-all-btn {
  background-color: #2a2a2a;
  color: #ddd;
  border-color: #444;
}

[data-theme="dark"] .view-all-btn:hover {
  background-color: #333;
  color: #fff;
}

/* Make sure the block icons are visible in dark mode */
[data-theme="dark"] .block-icon {
  background-color: #2a2a2a;
  color: var(--primary-color);
}

/* Status indicators in dark mode */
[data-theme="dark"] .status-dot.success {
  background-color: var(--success-color);
}

[data-theme="dark"] .status-dot.pending {
  background-color: var(--warning-color);
}

[data-theme="dark"] .status-dot.error {
  background-color: var(--danger-color);
}

/* Add these new text color styles */
[data-theme="dark"] .section-header h2 {
  color: #eee;
}

[data-theme="dark"] .view-all {
  color: #a48aff; /* Lighter purple for better contrast */
}

[data-theme="dark"] .block-details span {
  color: #ddd; /* Lighter text for better visibility */
}

[data-theme="dark"] .block-height a {
  color: #a48aff; /* Lighter purple for links */
}

[data-theme="dark"] .loading, 
[data-theme="dark"] .no-data {
  color: #aaa;
}
</style> 