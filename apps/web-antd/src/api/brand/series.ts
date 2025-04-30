import { requestClient } from '#/api/request3';

export namespace SeriesApi {
  /** 品牌列表接口参数 */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface SeriesListParams {}

  /** 单个品牌信息 */
  export interface SeriesItem {
    BrandId: number;
    CarSeriesId: number;
    CarSeriesName: string;
  }

  /** 品牌列表接口返回值中的 data 部分 */
  export interface seriesListResult {
    items: SeriesItem[];
  }

  export interface seriesAddParams {
    BrandId: number;
    CarSeriesId?: number;
    CarSeriesName: string;
  }
  export interface seriesDelParams {
    CarSeriesId: number;
  }
}

/**
 * 品牌列表
 */
export async function seriesList(data: SeriesApi.SeriesListParams) {
  return requestClient.post<SeriesApi.seriesListResult>(
    '/car/brand/seriesList',
    data,
  );
}

/**
 * 品牌添加
 */
export async function seriesAdd(data: SeriesApi.seriesAddParams) {
  return requestClient.post('/car/brand/seriesAdd', data);
}

/**
 * 品牌删除
 */
export async function seriesDel(data: SeriesApi.seriesDelParams) {
  return requestClient.post('/car/brand/seriesDel', data);
}
