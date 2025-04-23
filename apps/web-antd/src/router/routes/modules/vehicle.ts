import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '品牌车型',
    },
    name: 'vehicle',
    path: '/vehicle',
    children: [
      {
        meta: {
          title: '品牌管理',
        },
        name: 'vehicleBrand',
        path: '/vehicle/brand',
        component: () => import('#/views/vehicle/brand/index.vue'),
      },
      {
        meta: {
          title: '车系管理',
        },
        name: 'vehicleSeries',
        path: '/vehicle/series',
        component: () => import('#/views/vehicle/series/index.vue'),
      },
      {
        meta: {
          title: '车型年款',
        },
        name: 'vehicleModel',
        path: '/vehicle/Model',
        component: () => import('#/views/vehicle/model/index.vue'),
      },
    ],
  },
];

export default routes;
