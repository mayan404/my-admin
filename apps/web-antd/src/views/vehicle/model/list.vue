<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { modelApi } from '#/api/brand/model';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { BrandList } from '#/api/brand/brand';
import { modelDel, modelList } from '#/api/brand/model';
import { seriesList } from '#/api/brand/series';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
// import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  // connectedComponent: Form,
  destroyOnClose: true,
});
const brandOptions = ref<{ label: string; value: number }[]>([]); // 定义品牌选项
const seriesOptions = ref<{ label: string; value: number }[]>([]); // 定义品牌选项

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(brandOptions, seriesOptions),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const brandRes = await BrandList({}); // 调用接口获取品牌列表
          brandOptions.value = brandRes.items.map((item) => ({
            label: item.BrandName,
            value: item.BrandId,
          }));
          const seriesRes = await seriesList(formValues);
          seriesOptions.value = seriesRes.items.map((item) => ({
            label: item.CarSeriesName,
            value: item.CarSeriesId,
          }));
          return await modelList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },

    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<modelApi.modelItem>,
});

function onActionClick(e: OnActionClickParams<modelApi.modelItem>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
  }
}

/**
 * 将Antd的Modal.confirm封装为promise，方便在异步函数中调用。
 * @param content 提示内容
 * @param title 提示标题
 */
function confirm(content: string, title: string) {
  return new Promise((reslove, reject) => {
    Modal.confirm({
      content,
      onCancel() {
        reject(new Error('已取消'));
      },
      onOk() {
        reslove(true);
      },
      title,
    });
  });
}

/**
 * 状态开关即将改变
 * @param newStatus 期望改变的状态值
 * @param row 行数据
 * @returns 返回false则中止改变，返回其他值（undefined、true）则允许改变
 */
async function onStatusChange(newStatus: number, row: modelApi.modelItem) {
  const status: Recordable<string> = {
    0: '禁用',
    1: '启用',
  };
  try {
    await confirm(
      `你要将${row.modelName}的状态切换为 【${status[newStatus.toString()]}】 吗？`,
      `切换状态`,
    );
    // await updateRole(row.id, { status: newStatus });
    return true;
  } catch {
    return false;
  }
}

function onEdit(row: modelApi.modelItem) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: modelApi.modelItem) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.modelName]),
    duration: 0,
    key: 'action_process_msg',
  });
  modelDel(row.CarModelId)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.modelName]),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({}).open();
}
</script>
<template>
  <Page auto-content-height>
    <FormDrawer />
    <Grid :table-title="$t('system.role.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.role.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
