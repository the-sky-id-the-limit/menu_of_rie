const Indexs = { template: '<indexs></indexs>' }
const Lists = { template: '<lists></lists>' }
const Regists = { template: '<regists></regists>' }
const Prepare = { template: '<prepares></prepares>' }

const routes = [
  // { path: '/', component: Indexs },
  { path: '/list', component: Lists },
  { path: '/regist', component: Regists },
  { path: '/prepare', component: Prepare },

  { path: '/', redirect: '/list' }
]

const router = new VueRouter({
  routes
})