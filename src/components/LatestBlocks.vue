<template>
  <div class="latest-blocks">
  
    
    <div class="blocks-list">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="blocks.length === 0" class="no-data">No data available</div>
      <div v-else class="block-item" v-for="block in blocks" :key="block.height">
        <div class="block-height">
          <router-link :to="`/blocks/${block.height}`">#{{ block.height }}</router-link>
        </div>
        <div class="block-info">
          <div class="block-time">{{ formatTime(block.time) }}</div>
          <div class="block-details">
            <span>{{ block.txCount }} txs</span>
            <span>{{ block.proposer }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format, formatDistance } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

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
  },
  methods: {
    fetchLatestBlocks() {
      // 模拟API调用
      setTimeout(() => {
        this.blocks = [
          { height: 1234567, time: new Date(Date.now() - 2 * 60 * 1000), txCount: 12, proposer: 'Validator1' },
          { height: 1234566, time: new Date(Date.now() - 4 * 60 * 1000), txCount: 8, proposer: 'Validator2' },
          { height: 1234565, time: new Date(Date.now() - 6 * 60 * 1000), txCount: 15, proposer: 'Validator3' },
          { height: 1234564, time: new Date(Date.now() - 8 * 60 * 1000), txCount: 5, proposer: 'Validator4' },
          { height: 1234563, time: new Date(Date.now() - 10 * 60 * 1000), txCount: 20, proposer: 'Validator5' }
        ]
        this.loading = false
      }, 1000)
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
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  width: 100px;
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