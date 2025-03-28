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
    path: '/blobs',
    name: 'Blobs',
    component: () => import('../views/Blobs.vue')
  },
  {
    path: '/blobs/:height',
    name: 'BlobDetail',
    component: () => import('../views/BlobDetail.vue')
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('../views/Events.vue')
  },
  {
    path: '/events/:hash',
    name: 'TransactionDetail',
    component: () => import('../views/EventDetail.vue')
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