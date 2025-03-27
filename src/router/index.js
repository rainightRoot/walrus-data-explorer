import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/operators',
    name: 'Operators',
    component: () => import('../views/Operators.vue')
  },
  {
    path: '/operators/:address',
    name: 'OperatorDetail',
    component: () => import('../views/OperatorDetail.vue')
  },
  {
    path: '/blocks',
    name: 'Blocks',
    component: () => import('../views/Blocks.vue')
  },
  {
    path: '/blocks/:height',
    name: 'BlockDetail',
    component: () => import('../views/BlockDetail.vue')
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../views/Transactions.vue')
  },
  {
    path: '/transactions/:hash',
    name: 'TransactionDetail',
    component: () => import('../views/TransactionDetail.vue')
  },
  {
    path: '/governance',
    name: 'Governance',
    component: () => import('../views/Governance.vue')
  },
  {
    path: '/governance/:id',
    name: 'ProposalDetail',
    component: () => import('../views/ProposalDetail.vue')
  },
  {
    path: '/staking',
    name: 'Staking',
    component: () => import('../views/Staking.vue')
  },
  {
    path: '/accounts/:address',
    name: 'AccountDetail',
    component: () => import('../views/AccountDetail.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router 