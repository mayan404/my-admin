import COS from 'cos-js-sdk-v5';

import { requestClient } from '#/api/request2';

export namespace CosApi {
  /** 登录接口参数 */
  export interface GetTokenParams {
    bucket?: string;
  }

  /** 登录接口返回值 */
  export interface GetTokenResult {
    Credentials: {
      TmpSecretId: string;
      TmpSecretKey: string;
      Token: string;
    };
    ExpiredTime: number;
    Expiration: string;
    StartTime: number;
    RequestId: string;
  }
}

/**
 * 获取cos临时秘钥
 */
export async function GetToken(data: CosApi.GetTokenParams) {
  return requestClient.post<CosApi.GetTokenResult>(
    '/sys/tencent-GetCOSToken',
    data,
  );
}

const cos = new COS({
  async getAuthorization(options, callback) {
    const data = await GetToken({ bucket: '9beats-old-1252905615' }); // 需自行实现获取临时密钥逻辑

    callback({
      TmpSecretId: data.Credentials.TmpSecretId,
      TmpSecretKey: data.Credentials.TmpSecretKey,
      SecurityToken: data.Credentials.Token,
      // 建议返回服务器时间作为签名的开始时间，避免客户端本地时间偏差过大导致签名错误
      StartTime: data.StartTime, // 时间戳，单位秒，如：1580000000
      ExpiredTime: data.ExpiredTime, // 时间戳，单位秒，如：1580000000
      ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
    });
  },
});

export default cos;
