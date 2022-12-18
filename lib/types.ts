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

export interface IUploadImg {
    imgName: string;
    orderId?: string;
    imageBuffer: object;
    enhanceType?: string;
    verticalCorrection?: boolean;
    skyReplacement?: boolean;
    skyType?: string;
    cloudType?: string;
    contrastBoost?: string;
    threesixty?: boolean;
    hdr?: boolean;


}
