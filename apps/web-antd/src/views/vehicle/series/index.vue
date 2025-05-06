<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SeriesApi } from '#/api/brand/series'; // 修改为仅类型导入

import { onMounted, ref } from 'vue';

// import { useRouter } from 'vue-router';
import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { BrandList } from '#/api/brand/brand';
import { seriesDel, seriesList } from '#/api/brand/series';
import { $t } from '#/locales';

import FormModalDemo from './form-modal.vue';

// const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
  onOpenChange: openFormModal2,
});

const brandOptions = ref<{ label: string; value: number }[]>([]); // 定义品牌选项

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: brandOptions,
        placeholder: '请选择',
      },
      fieldName: 'BrandId',
      label: '品牌',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeTableGridOptions<SeriesApi.SeriesItem> = {
  columns: [
    { field: 'CarSeriesId', title: 'id', width: 130 },
    { field: 'BrandName', title: '品牌', width: 200 },
    { field: 'CarSeriesName', title: '系列名称', width: 200 },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'CarSeriesName',
          nameTitle: '系列',
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 130,
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        console.warn(`Query params: ${JSON.stringify(formValues)}`);
        console.warn(page);

        try {
          const brandRes = await BrandList({}); // 调用接口获取品牌列表
          brandOptions.value = brandRes.items.map((item) => ({
            label: item.BrandName,
            value: item.BrandId,
          })); // 假设接口返回的数据结构包含 name 和 id
          const result: SeriesApi.seriesListResult =
            await seriesList(formValues);
          // 给列表的品牌列进行赋值
          const itemsWithBrandName = result.items.map((item) => {
            const brand = brandOptions.value.find((option) => {
              return option.value === item.BrandId;
            });
            return {
              ...item,
              BrandName: brand ? brand.label : '未知品牌',
            };
          });
          return itemsWithBrandName;
        } catch (error) {
          console.error('获取系列列表失败:', error);
          message.error('获取系列列表失败，请稍后重试');
          return [];
        }
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

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

function onActionClick(e: OnActionClickParams<SeriesApi.SeriesItem>) {
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

function onDelete(row: SeriesApi.SeriesItem) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.CarSeriesName]),
    duration: 0,
    key: 'action_process_msg',
  });
  seriesDel({
    CarSeriesId: row.CarSeriesId,
  })
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.CarSeriesName]),
        key: 'action_process_msg',
      });
      gridApi.reload();
    })
    .catch(() => {
      hideLoading();
    });
}

function openFormModal(row?: SeriesApi.SeriesItem) {
  formModalApi
    .setData({ values: row, brandOptions: brandOptions.value })
    .open();
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

onMounted(async () => {
  // try {
  //   const result = await BrandList({}); // 调用接口获取品牌列表
  //   brandOptions.value = result.items.map((item) => ({
  //     label: item.BrandName,
  //     value: item.BrandId,
  //   })); // 假设接口返回的数据结构包含 name 和 id
  //   console.warn('brandOptions1 :', brandOptions);
  //   console.warn('brandOptions2 :', brandOptions.value);
  // } catch (error) {
  //   console.error('获取品牌列表失败:', error);
  // }
});
</script>

<template>
  <Page auto-content-height>
    <!-- FormModal 是表单弹框 -->
    <FormModal />
    <Grid>
      <template #toolbar-actions>
        <Button type="primary" @click="openFormModal()"> 添加系列 </Button>
      </template>
    </Grid>
  </Page>
</template>
