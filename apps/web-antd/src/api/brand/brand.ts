import { requestClient } from '#/api/request3';

export namespace BrandApi {
  /** 品牌列表接口参数 */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface BrandListParams {}

  /** 单个品牌信息 */
  export interface BrandItem {
    BrandId: number;
    BrandImgUrl: string;
    BrandName: string;
    BrandPy: string;
  }

  /** 品牌列表接口返回值中的 data 部分 */
  export interface BrandListResult {
    BrandId: number;
    items: BrandItem[];
  }

  export interface BrandAddParams {
    BrandId?: number;
    BrandImgUrl: string;
    BrandName: string;
    BrandPy: string;
  }
  export interface BrandDelParams {
    BrandId: number;
  }
}

/**
 * 品牌列表
 */
export async function BrandList(data: BrandApi.BrandListParams) {
  return requestClient.post<BrandApi.BrandListResult>(
    '/car/brand/brandList',
    data,
  );
}

/**
 * 品牌添加
 */
export async function brandAdd(data: BrandApi.BrandAddParams) {
  return requestClient.post('/car/brand/brandAdd', data);
}

/**
 * 品牌删除
 */
export async function brandDel(data: BrandApi.BrandDelParams) {
  return requestClient.post('/car/brand/brandDel', data);
}
