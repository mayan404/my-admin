<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SeriesApi } from '#/api/brand/series'; // 修改为仅类型导入

import { onMounted } from 'vue';

// import { useRouter } from 'vue-router';
import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { seriesDel, seriesList } from '#/api/brand/series';
import { $t } from '#/locales';

import FormModalDemo from './form-modal.vue';

// const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
  onOpenChange: openFormModal2,
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: 'Color1',
            value: '1',
          },
          {
            label: 'Color2',
            value: '2',
          },
        ],
        placeholder: '请选择',
      },
      fieldName: 'color',
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
        message.success(`Query params: ${JSON.stringify(formValues)}`);
        console.error(page);

        const result: SeriesApi.seriesListResult = await seriesList({});
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
    CarSeriesId: row.BrandId,
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

onMounted(() => {
  // loadBrandList();
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
