import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '车辆及价格',
    },
    name: 'carPrice',
    path: '/demos',
    children: [
      {
        meta: {
          title: '车辆管理',
        },
        name: 'carList',
        path: '/car/carList',
        component: () => import('#/views/car/carList/index.vue'),
      },
      {
        meta: {
          title: '价格管理',
        },
        name: 'priceList',
        path: '/car/priceList',
        component: () => import('#/views/car/priceList/index.vue'),
      },
    ],
  },
];

export default routes;
