<template>
  <div id="app">
    <header class="main-header">
      <div class="header-container">
        <div class="logo-section">
          <router-link to="/" class="logo">
            <span class="logo-text">Celestia</span>
            <span class="explorer-text">Explorer</span>
          </router-link>
          <div class="network-tag">mainnet</div>
        </div>
        
        <nav class="main-nav">
          <router-link to="/" exact>Home</router-link>
          <router-link to="/validators">Validators</router-link>
          <router-link to="/blocks">Blocks</router-link>
          <router-link to="/transactions">Transactions</router-link>
          <router-link to="/governance">Governance</router-link>
          <router-link to="/staking">Staking</router-link>
        </nav>
        
        <div class="search-section">
          <input type="text" placeholder="Search blocks/transactions/addresses..." @keyup.enter="search" v-model="searchQuery" />
          <button @click="search" class="search-btn">
            🔍
          </button>
        </div>
      </div>
    </header>
    
    <div class="main-content">
      <div class="container">
        <router-view/>
      </div>
    </div>
    
    <footer class="main-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>About Celestia</h3>
            <p>Celestia is a modular data availability network that scales with the number of users, enabling anyone to easily deploy their own blockchain.</p>
          </div>
          
          <div class="footer-section">
            <h3>Official Links</h3>
            <div class="footer-links">
              <a href="https://celestia.org" target="_blank">Website</a>
              <a href="https://docs.celestia.org" target="_blank">Documentation</a>
              <a href="https://discord.gg/celestiacommunity" target="_blank">Discord</a>
              <a href="https://twitter.com/CelestiaOrg" target="_blank">Twitter</a>
            </div>
          </div>
        </div>
        <div class="copyright">
          © 2023 Celestia Explorer. This website is for educational purposes only.
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    search() {
      if (!this.searchQuery) return
      
      const query = this.searchQuery.trim()
      
      // Simple search logic based on input format
      if (/^\d+$/.test(query)) {
        // Pure numbers are treated as block heights
        this.$router.push(`/blocks/${query}`)
      } else if (query.startsWith('0x') || query.length === 64) {
        // 0x prefix or 64 characters length treated as transaction hash
        this.$router.push(`/transactions/${query}`)
      } else {
        // Otherwise treated as an address
        this.$router.push(`/accounts/${query}`)
      }
      
      this.searchQuery = ''
    }
  }
}
</script>

<style>
/* 导入全局样式 */
@import './assets/styles/global.css';

/* 头部导航 */
.main-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
}

.logo-text {
  color: var(--primary-color);
}

.explorer-text {
  color: var(--secondary-color);
  margin-left: 4px;
}

.network-tag {
  margin-left: 10px;
  padding: 2px 8px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.main-nav {
  display: flex;
  align-items: center;
}

.main-nav a {
  margin: 0 12px;
  color: var(--text-color);
  font-weight: 500;
  text-decoration: none;
  padding: 6px 0;
  position: relative;
}

.main-nav a:after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--primary-color);
  transition: width 0.2s;
}

.main-nav a:hover,
.main-nav a.router-link-active {
  color: var(--primary-color);
}

.main-nav a.router-link-active:after {
  background-color: var(--primary-color);
}

.search-section {
  display: flex;
  max-width: 300px;
}

.search-section input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 0.9rem;
}

.search-btn {
  padding: 8px 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
}

.search-btn:hover {
  background: var(--primary-dark);
}

/* 主内容区 */
.main-content {
  min-height: calc(100vh - 200px);
  padding: 20px 0;
}

/* 页脚 */
.main-footer {
  background: #343a40;
  color: #fff;
  padding: 40px 0 20px;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 30px;
}

.footer-section {
  flex: 1;
  min-width: 250px;
}

.footer-section h3 {
  color: #fff;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.footer-section p {
  color: #adb5bd;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-links a {
  color: #adb5bd;
  text-decoration: none;
}

.footer-links a:hover {
  color: #fff;
}

.copyright {
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
  padding-top: 20px;
  border-top: 1px solid #495057;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .logo-section {
    margin-bottom: 10px;
  }
  
  .main-nav {
    order: 3;
    margin-top: 15px;
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 5px;
  }
  
  .main-nav a {
    font-size: 0.9rem;
    white-space: nowrap;
  }
  
  .search-section {
    max-width: none;
    width: 100%;
  }
}
</style> 