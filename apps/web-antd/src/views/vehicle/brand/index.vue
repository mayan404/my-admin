<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { BrandApi } from '#/api/brand/brand'; // 修改为仅类型导入

import { onMounted } from 'vue';

// import { useRouter } from 'vue-router';
import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Image, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { brandDel, BrandList } from '#/api/brand/brand';
import { $t } from '#/locales';

import FormModalDemo from './form-modal-demo.vue';

// const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
  onOpenChange: openFormModal2,
});

interface RowType {
  BrandId: number;
  BrandName: string;
  BrandImgUrl: string;
}

const gridOptions: VxeTableGridOptions<RowType> = {
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
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'BrandName',
          nameTitle: '品牌',
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 130,
    },
    // {
    //   field: 'action',
    //   fixed: 'right',
    //   slots: { default: 'action' },
    //   title: '操作',
    //   width: 220,
    // },
  ],
  proxyConfig: {
    ajax: {
      query: async (_params) => {
        const result: BrandApi.BrandListResult = await BrandList({});
        return result.items;
      },
    },
  },
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

function onActionClick(e: OnActionClickParams<BrandApi.BrandItem>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      openFormModal(e.row);
      break;
    }
  }
}

function onDelete(row: BrandApi.BrandItem) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.BrandName]),
    duration: 0,
    key: 'action_process_msg',
  });
  brandDel({
    BrandId: row.BrandId,
  })
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.BrandName]),
        key: 'action_process_msg',
      });
      gridApi.reload();
    })
    .catch(() => {
      hideLoading();
    });
}

function openFormModal(row?: RowType) {
  formModalApi.setData({ values: row }).open();
}

function openFormModal2(isOpen: boolean) {
  if (isOpen) {
    console.warn('打开');
  } else {
    // 请求列表最新数据
    // loadBrandList();
    // 刷新列表
    gridApi.reload();
    console.warn('关闭');
  }
}
// async function loadBrandList() {
//   try {
//     const result: BrandApi.BrandListResult = await BrandList({});
//     const { items } = result;
//     console.warn('列表数据：', items);
//     gridApi.setGridOptions({ data: items });
//   } catch (error) {
//     console.error('获取品牌列表失败:', error);
//   }
// }

onMounted(() => {
  // loadBrandList();
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
        <!-- <Button type="primary" @click="() => gridApi.query()"> 刷新 </Button> -->
        <!-- <Button class="mr-2" type="primary">左侧插槽</Button> -->
      </template>
      <!-- <template #toolbar-tools>
        <Button class="mr-2" type="primary">插槽</Button>
      </template> -->
      <!-- 下面这个 template 的属性  #action 和上面  slots: { default: 'action' } 它相对应-->
      <!-- <template #action="{ row }">
        <Button type="link" @click="openFormModal(row)">编辑</Button>
        <Button type="link">删除</Button>
      </template> -->
    </Grid>
  </Page>
</template>
