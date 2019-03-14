import Vue from 'vue'
import Router from 'vue-router'

const index = () => import('../pages/index/index');
const sort = () => import('../pages/sort/sort');
const search = () => import('../pages/search/search');
const shopCart = () => import('../pages/shop-cart/shop-cart');
const goodDetail = () => import('../pages/good-detail/good-detail');
const createOrder = () => import('../pages/create-order/create-order');
const user = () => import('../pages/user/user');
const orderList = () => import('../pages/order/order-list');
const orderDetail = () => import('../pages/order/order-detail');
const addrList = () => import('../pages/addr/addr-list');
const addAddr = () => import('../pages/addr/add-addr');
const createOrderSuccess = () => import('../pages/create-order/create-order-success');
const searchOrder = () => import('../pages/order/search-order');
const secPage = () => import('../pages/activities/sec-page');
const shareImg = () => import('../pages/good-detail/share-img');
const commentOrder = () => import('../pages/order/comment-order');


Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        redirect: '/index'
      },
      {
        path: '/index',
        name: 'index',
        component: index,
      },
      {
        path: '/sort',
        name: 'sort',
        component: sort
      },
      {
        path: '/search',
        name: 'search',
        component: search
      },
      {
        path: '/shop-cart',
        name: 'shop-cart',
        component: shopCart
      },
      {
        path: "/user",
        name: 'user',
        component: user
      },
      {
        path: '/sec-page',
        name: 'sec-page',
        component: secPage
      },
      {
        path: '/good-detail',
        name: 'good-detail',
        component: goodDetail
      },
      {
        path: '/createOrder',
        name: 'create-order',
        component: createOrder
      },
      {
        path: '/create-order-success',
        name: 'create-order-success',
        component: createOrderSuccess
      },
      {
        path: '/addr-list',
        name: 'addr-list',
        component: addrList
      },
      {
        path: '/add-addr',
        name: 'add-addr',
        component: addAddr
      },
      {
        path: '/order-list',
        name: 'order-list',
        component: orderList
      },
      {
        path: '/search-order',
        name: 'search-order',
        component: searchOrder
      },
      {
        path: '/order-list/:orderId',
        name: 'order-detail',
        component: orderDetail
      },
      {
        path: '/share-img',
        name: 'share-img',
        component: shareImg
      },
      {
        path: '/comment-order',
        name: 'comment-order',
        component: commentOrder
      }
    ]
  }
);
// router.beforeEach((to,from,next)=>{
//   console.log('to',to);
//   console.log('from',from);
//   console.log('next',next);
// });
export default router
