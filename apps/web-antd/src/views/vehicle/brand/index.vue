<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted } from 'vue';

// import { useRouter } from 'vue-router';
import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Image } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import FormModalDemo from './form-modal-demo.vue';
import { MOCK_TABLE_DATA } from './table-data';

// const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
});

interface RowType {
  id: number;
  name: string;
  imageUrl: string;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 130 },
    { field: 'name', title: '品牌名称', width: 200 },
    {
      field: 'imageUrl',
      slots: { default: 'image-url' },
      title: 'Image',
      width: 100,
    },
    // {
    //   cellRender: { name: 'CellImage' },
    //   field: 'imageUrl',
    //   title: 'image',
    //   width: 130,
    // },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 220,
    },
  ],
  // data: MOCK_TABLE_DATA,
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
  showOverflow: false,
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
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

onMounted(() => {
  gridApi.setGridOptions({ data: MOCK_TABLE_DATA });
});
</script>

<template>
  <Page auto-content-height>
    <!-- FormModal 是表单弹框 -->
    <FormModal />
    <Grid>
      <template #image-url="{ row }">
        <Image :src="row.imageUrl" height="30" width="30" />
      </template>
      <template #toolbar-actions>
        <Button type="primary" @click="openFormModal"> 添加品牌 </Button>
        <!-- <Button class="mr-2" type="primary">左侧插槽</Button> -->
      </template>
      <!-- <template #toolbar-tools>
        <Button class="mr-2" type="primary">插槽</Button>
      </template> -->
      <template #action>
        <Button type="link" @click="openFormModal">编辑</Button>
        <Button type="link">删除</Button>
      </template>
    </Grid>
  </Page>
</template>
