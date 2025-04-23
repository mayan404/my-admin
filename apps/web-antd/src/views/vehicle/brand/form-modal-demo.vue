<script lang="ts" setup>
import type { UploadFile } from 'ant-design-vue';

import { toRaw } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { upload_file } from '#/api/extend/cos/upload';

defineOptions({
  name: 'FormModelDemo',
});

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'field1',
      label: '品牌名称',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'field2',
      label: '品牌拼音',
      rules: 'required',
    },
    {
      component: 'Upload',
      componentProps: {
        // 更多属性见：https://ant.design/components/upload-cn
        accept: '.png,.jpg,.jpeg',
        // 自动携带认证信息
        customRequest: upload_file,
        disabled: false,
        maxCount: 1,
        multiple: false,
        showUploadList: true,
        // 上传列表的内建样式，支持四种基本样式 text, picture, picture-card 和 picture-circle
        listType: 'picture-card',
      },
      fieldName: 'files',
      label: '品牌图标',
      renderComponentContent: () => {
        return {
          default: () => '点击上传图片',
        };
      },
      rules: 'required',
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
      const { values } = modalApi.getData<Record<string, any>>();
      // 这里写个详情接口
      if (values) {
        formApi.setValues(values);
      }
    }
  },
  title: '基本信息',
});

async function onSubmit(values: Record<string, any>) {
  const files = toRaw(values.files) as UploadFile[];
  const doneFiles = files.filter((file) => file.status === 'done');

  try {
    // 显示加载提示
    message.loading({
      content: '正在提交中...',
      duration: 0,
      key: 'is-form-submitting',
    });

    // 锁定模态框
    modalApi.lock();

    values.files = doneFiles.map((file) => file.response?.url || file.url);
    values.files = values.files[0];
    // 调用实际的提交接口
    // const response = await uploadFormData(formData);
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
