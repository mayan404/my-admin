<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { BrandApi } from '#/api/brand/brand'; // 修改为仅类型导入

import { onMounted } from 'vue';

// import { useRouter } from 'vue-router';
import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Image } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { BrandList } from '#/api/brand/brand';

import FormModalDemo from './form-modal-demo.vue';

// const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
  onOpenChange: openFormModal2,
});

function openFormModal2(isOpen: boolean) {
  if (isOpen) {
    console.warn('打开');
  } else {
    loadBrandList();
    console.warn('关闭');
  }
}

interface RowType {
  BrandId: number;
  BrandName: string;
  BrandImgUrl: string;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { title: '序号', type: 'seq', width: 130 },
    { field: 'BrandId', title: 'id', width: 130 },
    { field: 'BrandName', title: '品牌名称', width: 200 },
    {
      field: 'BrandImgUrl',
      slots: { default: 'image-url' },
      title: '图标',
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

function openFormModal(row?: RowType) {
  formModalApi.setData({ values: row }).open();
}
// function changeLoading() {
//   gridApi.setLoading(true);
//   setTimeout(() => {
//     gridApi.setLoading(false);
//   }, 2000);
// }

async function loadBrandList() {
  try {
    const result: BrandApi.BrandListResult = await BrandList({});
    const { items } = result;
    console.warn('上传进度：', items);
    gridApi.setGridOptions({ data: items });
  } catch (error) {
    console.error('获取品牌列表失败:', error);
  }
}

onMounted(() => {
  loadBrandList();
});
</script>

<template>
  <Page auto-content-height>
    <!-- FormModal 是表单弹框 -->
    <FormModal />
    <Grid>
      <template #image-url="{ row }">
        <Image :src="row.BrandImgUrl" height="30" width="30" />
      </template>
      <template #toolbar-actions>
        <Button type="primary" @click="openFormModal()"> 添加品牌 </Button>
        <!-- <Button class="mr-2" type="primary">左侧插槽</Button> -->
      </template>
      <!-- <template #toolbar-tools>
        <Button class="mr-2" type="primary">插槽</Button>
      </template> -->
      <template #action="{ row }">
        <Button type="link" @click="openFormModal(row)">编辑</Button>
        <Button type="link">删除</Button>
      </template>
    </Grid>
  </Page>
</template>
