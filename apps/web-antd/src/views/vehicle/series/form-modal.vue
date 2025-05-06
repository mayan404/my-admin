<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { seriesAdd } from '#/api/brand/series';

defineOptions({
  name: 'FormModelDemo',
});
const brandOptions2 = ref<{ label: string; value: number }[]>([]); // 定义品牌选项

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  commonConfig: {
    // 在label后显示一个冒号
    colon: true,
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'CarSeriesName',
      label: '系列名称',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: brandOptions2,
        placeholder: '请选择品牌',
      },
      fieldName: 'BrandId',
      label: '品牌',
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    // 关闭弹框模版
    modalApi.close();
  },
  onConfirm: async () => {
    // 验证参数并提交表单
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values, brandOptions } = modalApi.getData<Record<string, any>>();
      // 这里写个详情接口
      console.warn('brandOptions：', brandOptions);
      brandOptions2.value = brandOptions;
      if (values) {
        CarSeriesId.value = values.CarSeriesId; // 获取并保存传递过来的 id
        formApi.setValues(values);
      }
    }
  },
  title: '基本信息',
});
const CarSeriesId = ref<number | undefined>(undefined);

async function onSubmit(values: Record<string, any>) {
  try {
    // 显示加载提示
    message.loading({
      content: '正在提交中...',
      duration: 0,
      key: 'is-form-submitting',
    });

    // 锁定模态框
    modalApi.lock();

    // 调用实际的提交接口
    await seriesAdd({
      CarSeriesId: CarSeriesId.value,
      BrandId: values.BrandId,
      CarSeriesName: values.CarSeriesName,
    });
    console.warn('提交成功，响应数据：', values);

    // 关闭模态框
    modalApi.close();

    // 显示成功提示
    message.success({
      content: `提交成功`,
      // content: `提交成功：${JSON.stringify(values)}`,
      duration: 2,
      key: 'is-form-submitting',
    });
  } catch (error) {
    console.error('提交失败：', error);
    // 显示错误提示
    message.error({
      content: '提交失败，请稍后重试',
      duration: 2,
      key: 'is-form-submitting',
    });
  } finally {
    // 解锁模态框
    modalApi.unlock();
  }
}
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
