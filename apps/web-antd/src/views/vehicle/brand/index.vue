<script lang="ts" setup>
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

// import { useRouter } from 'vue-router';
import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import FormModalDemo from './form-modal-demo.vue';
import { MOCK_TABLE_DATA } from './table-data';

// const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
});

interface RowType {
  address: string;
  age: number;
  id: number;
  name: string;
  nickname: string;
  role: string;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'name', title: 'Name' },
    { field: 'age', sortable: true, title: 'Age' },
    { field: 'nickname', title: 'Nickname' },
    { field: 'role', title: 'Role' },
    { field: 'address', showOverflow: true, title: 'Address' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 220,
    },
  ],
  data: MOCK_TABLE_DATA,
  pagerConfig: {
    enabled: false,
  },
  sortConfig: {
    multiple: true,
  },
  rowConfig: {
    isHover: true,
  },
  stripe: true,
  border: true,
};

const gridEvents: VxeGridListeners<RowType> = {
  cellClick: ({ row }) => {
    message.info(`cell-click: ${row.name}`);
  },
};

const [Grid] = useVbenVxeGrid({ gridEvents, gridOptions });
// const [Grid, gridApi] = useVbenVxeGrid({ gridEvents, gridOptions });

// function openTabWithParams() {
//   // 这里就是路由跳转，也可以用path
//   router.push({ name: 'FeatureTabDetailDemo' });
// }

function openFormModal() {
  formModalApi
    .setData({
      // 表单值
      values: { field1: 'abc', field2: '123' },
    })
    .open();
}
// function changeLoading() {
//   gridApi.setLoading(true);
//   setTimeout(() => {
//     gridApi.setLoading(false);
//   }, 2000);
// }
</script>

<template>
  <Page>
    <FormModal />
    <Grid>
      <!-- <template #toolbar-actions>
        <Button class="mr-2" type="primary">左侧插槽</Button>
      </template> -->
      <template #toolbar-tools>
        <!-- <Button class="mr-2" type="primary" @click="openTabWithParams">
          添加
        </Button> -->
        <Button type="primary" @click="openFormModal"> 添加品牌 </Button>
        <!-- <Button class="mr-2" type="primary" @click="changeLoading">
          显示loading
        </Button> -->
      </template>
      <template #action>
        <Button type="link" @click="openFormModal">编辑</Button>
        <Button type="link">删除</Button>
      </template>
    </Grid>
  </Page>
</template>
