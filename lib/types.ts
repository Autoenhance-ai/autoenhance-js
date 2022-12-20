export interface IUploadImg {
    imgName: string;
    orderId?: string | null;
    imageBuffer: object;
    enhanceType?: string;
    verticalCorrection?: boolean;
    skyReplacement?: boolean;
    skyType?: 'UK_SUMMER' | 'UK_WINTER' | 'USA_SUMMER';
    cloudType?: 'CLEAR' | 'LOW_CLOUD' | 'HIGH_CLOUD';
    contrastBoost?: 'LOW' | 'MEDIUM' | 'HIGH';
    threesixty?: boolean;
    hdr?: boolean;
}

export interface IUploadImgPromise {
    imageId?: string;
    status: number;
    orderId?: string | null;
    error?: string;
}

export interface IUploadImgResponse {
    image_id: string;
    image_type: string;
    s3PutObjectUrl: string
}


export interface ICheckImageEnhanceConfig {
    image_id: string;
    image_name: string;
    image_type: string;
    enhance_type: string;
    date_added: number;
    user_id: string;
    status: string;
    downloaded: boolean;
}

export interface ICheckImageEnhanceResponse {
    data: ICheckImageEnhanceConfig;
}


export interface ICheckOrderEnhance {
    data: ICheckOrderData
}


interface ICheckOrderData {
    images: ICheckOrderEnhanceConfig[];
    is_processing: boolean;
    order_id: string;
}

export interface ICheckOrderEnhanceConfig {
    image_id: string;
    image_name: string;
    image_type: string;
    enhance_type: string;
    date_added: number;
    user_id: string;
    status: string;
    downloaded: boolean;
    order_id: string;
    sky_replacement: boolean;
    vertical_correction: boolean;
    vibrant: boolean
}