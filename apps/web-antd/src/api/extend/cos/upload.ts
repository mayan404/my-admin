import cos from '#/api/extend/cos/file';

interface UploadFileParams {
  file: File;
  onError?: (error: Error) => void;
  onProgress?: (progress: { percent: number }) => void;
  onSuccess?: (data: any, file: File) => void;
}
export async function upload_file({
  file,
  onError,
  onProgress,
  onSuccess,
}: UploadFileParams) {
  try {
    onProgress?.({ percent: 0 });
    console.warn('文件file', file.name);

    const fileName = `my/${Date.now()}.${getFileExtension(file.name)}`;
    const data = await cos.uploadFile({
      Bucket: '9beats-old-1252905615', // 填写自己的 bucket，必须字段
      Region: 'ap-beijing', // 存储桶所在地域，必须字段
      Key: fileName, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
      Body: file, // 上传文件对象
      SliceSize: 1024 * 1024 * 5, // 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须
      onProgress(progressData) {
        console.warn('上传进度：', progressData);
      },
      // onTaskReady: function(id) { // 非必须
      //   taskId = id;
      // },
    });
    console.warn('上传成功', data);

    onProgress?.({ percent: 100 });
    onSuccess?.(
      {
        url: `https://cdn9beatsold.wedomusic.cn/${fileName}`,
      },
      file,
    );
  } catch (error) {
    console.error('上传失败', error);
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }
}

// 定义获取文件扩展名的函数
function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return '';
  }
  return fileName.slice(lastDotIndex + 1);
}
