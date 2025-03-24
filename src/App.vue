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
           <!-- Mobile menu toggle button -->
          <button class="mobile-menu-toggle" :class="{ 'active': mobileMenuOpen }" @click="toggleMobileMenu">
            <svg aria-hidden="true" fill="currentColor" focusable="false" height="20" role="presentation" viewBox="0 0 20 14" width="20" class="text-common"><path d="M5 1C5 0.447734 5.44773 0 6 0H19C19.5523 0 20 0.447734 20 1C20 1.55227 19.5523 2 19 2H6C5.44773 2 5 1.55223 5 1ZM19 6H1C0.447734 6 0 6.44777 0 7C0 7.55226 0.447734 8 1 8H19C19.5523 8 20 7.55226 20 7C20 6.44777 19.5523 6 19 6ZM19 12H10C9.44777 12 9 12.4477 9 13C9 13.5522 9.44777 14 10 14H19C19.5523 14 20 13.5522 20 13C20 12.4477 19.5523 12 19 12Z"></path></svg>
          </button>
        </div>
        
       
        
        <nav class="main-nav" :class="{ 'mobile-open': mobileMenuOpen }">
          <router-link to="/" exact @click="closeMobileMenu">Home</router-link>
          <router-link to="/validators" @click="closeMobileMenu">Validators</router-link>
          <router-link to="/blocks" @click="closeMobileMenu">Blocks</router-link>
          <router-link to="/transactions" @click="closeMobileMenu">Transactions</router-link>
          <router-link to="/governance" @click="closeMobileMenu">Governance</router-link>
          <router-link to="/staking" @click="closeMobileMenu">Staking</router-link>
        </nav>
        
        <div class="search-section">
          <input type="text" placeholder="Search blocks/transactions/addresses..." @keyup.enter="search" v-model="searchQuery" />
          <button @click="search" class="search-btn">
            🔍
          </button>
        </div>
      </div>
    </header>
    
    <!-- Overlay for mobile menu -->
    <div class="mobile-overlay" v-if="mobileMenuOpen" @click="closeMobileMenu"></div>
    
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
      searchQuery: '',
      mobileMenuOpen: false
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
      this.closeMobileMenu()
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
      
      // Prevent body scrolling when menu is open
      if (this.mobileMenuOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    closeMobileMenu() {
      if (this.mobileMenuOpen) {
        this.mobileMenuOpen = false
        document.body.style.overflow = ''
      }
    }
  },
  // Close menu when route changes
  watch: {
    '$route'() {
      this.closeMobileMenu()
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
  flex-wrap: wrap;
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
  text-decoration: none;
  margin-right: 15px;
}

.logo-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-color);
}

.explorer-text {
  font-size: 1.3rem;
  font-weight: 300;
  color: var(--text-color);
  margin-left: 4px;
}

.network-tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: #e6f7ee;
  color: #42b983;
  border-radius: 4px;
  font-size: 0.8rem;
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
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s;
}

.main-nav a:hover:after {
  width: 100%;
}

.main-nav a.router-link-active:after {
  background-color: var(--primary-color);
}

.search-section {
  display: flex;
  max-width: 300px;
  margin-left: auto;
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

/* Mobile menu toggle button */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 24px;
}

.mobile-menu-toggle .bar {
  width: 100%;
  height: 3px;
  background-color: var(--text-color);
  border-radius: 2px;
  transition: all 0.3s;
}

/* Mobile overlay */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 90;
}

/* 响应式设计 - Mobile Menu */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 16px;
  }
  
  .logo-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0;
  }
  
  .mobile-menu-toggle {
    display: flex;
    z-index: 101;
  }
  
  .mobile-overlay {
    display: block;
  }
  
  .main-nav {
    display: none;
    flex-direction: column;
    width: 100%;
    margin-top: 15px;
    border-top: 1px solid var(--border-color);
    padding-top: 10px;
  }
  
  .main-nav.mobile-open {
    display: flex;
  }
  
  .main-nav a {
    padding: 12px 0;
    margin: 0;
    border-bottom: 1px solid var(--border-color);
  }
  
  .search-section {
    max-width: none;
    width: 100%;
    margin-top: 15px;
  }
  
  /* Animation for hamburger to X */
  .mobile-menu-toggle.active .bar:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }
  
  .mobile-menu-toggle.active .bar:nth-child(2) {
    opacity: 0;
  }
  
  .mobile-menu-toggle.active .bar:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
  
  .explorer-text {
    font-size: 1.2rem;
  }
  
  .network-tag {
    font-size: 0.7rem;
    padding: 1px 6px;
  }
  
  .main-nav {
    padding-top: 5px;
  }
  
  .main-nav a {
    padding: 15px 0;
    font-size: 1.1rem;
  }
  
  .search-section {
    display: flex;
    margin-top: 10px;
  }
  
  .search-section input {
    flex: 1;
    min-width: 0;
    padding: 12px;
    font-size: 16px; /* Prevent iOS zoom on focus */
    border-radius: 4px 0 0 4px;
  }
  
  .search-btn {
    border-radius: 0 4px 4px 0;
    padding: 0 15px;
  }
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
</style> 