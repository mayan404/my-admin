import { requestClient } from '#/api/request3';

export namespace modelApi {
  /** 品牌车型列表接口参数 */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface modelListParams {}

  /** 单个车型信息 */
  export interface modelItem {
    CarModelId: number;
    BrandId: number;
    CarSeriesId: number;
    modelName: string;
    modelYear: number;
    seatNum: number;
    doorNum: number;
    fuelType: number;
    EmissionUnit: string;
    EmissionNum: string;
    carLevel: number;
    StructureType: number;
    GearType: number;
    SmallImagePath: string;
    LongMovieUrlFifteen: string;
  }

  /** 品牌列表接口返回值中的 data 部分 */
  export interface modelListResult {
    items: modelItem[];
  }

  export interface modelAddParams {
    CarModelId?: number;
    BrandId: number;
    CarSeriesId: number;
    modelName: string;
    modelYear: number;
    seatNum: number;
    doorNum: number;
    fuelType: number;
    EmissionUnit: string;
    EmissionNum: string;
    carLevel: number;
    StructureType: number;
    GearType: number;
    SmallImagePath: string;
    LongMovieUrlFifteen: string;
  }
  export interface modelDelParams {
    CarModelId: number;
  }
}

/**
 * 品牌列表
 */
export async function modelList(data: modelApi.modelListParams) {
  return requestClient.post<modelApi.modelListResult>(
    '/car/brand/modelList',
    data,
  );
}

/**
 * 品牌添加
 */
export async function modelAdd(data: modelApi.modelAddParams) {
  return requestClient.post('/car/brand/modelAdd', data);
}

/**
 * 品牌删除
 */
export async function modelDel(id: number) {
  const data: modelApi.modelDelParams = {
    CarModelId: id,
  };
  return requestClient.post('/car/brand/modelDel', data);
}
