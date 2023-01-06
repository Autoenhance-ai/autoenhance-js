import {
    ICheckImageEnhanceConfig,
    ICheckOrderEnhance,
    IEditEnhancedImg,
    IEditEnhancedImgPromise,
    IReportEnhancement,
    IUploadImg,
    IUploadImgPromise,
} from "./types";

import * as mime from 'mime-types';

const importDynamic = new Function('modulePath', 'return import(modulePath)');

const fetch = async (...args: any[]) => {
    const module = await importDynamic('node-fetch');
    return module.default(...args);
};

export class Autoenhance {
    private readonly baseUrl: string;
    public apiKey: string;

    constructor(apiKey: string) {
        this.baseUrl = 'https://api.autoenhance.ai/v2/';
        this.apiKey = apiKey;
    }


    /**
     * https://api.autoenhance.ai/v2/image
     *
     * Returns uploaded image properties.
     *
     * @remarks
     *  Upload image.
     *
     * @param props.imgName - name of the image house.jpg or house.png.
     *
     * @param props.orderId - pass image as a buffer.
     *
     * @param props.imageBuffer - UUID string to link a group of images under one order (e.g. b1aa3999-7908-45c9-9a99-82e25cf5de8e).
     *
     * @param props.enhanceType - Type of image you want enhanced (e.g. property or food).
     *
     * @param props.verticalCorrection - Enable/Disable vertical correction. By default, this is true.
     *
     * @param props.skyReplacement - Enable/Disable sky replacement. By default, this is true.
     *
     * @param props.skyType - Set specific sky type. (Options: UK_SUMMER, UK_WINTER or USA_SUMMER). Default is UK_SUMMER.
     *
     * @param props.cloudType - Set specific cloud type. (Options: CLEAR, LOW_CLOUD or HIGH_CLOUD). Default is HIGH_CLOUD.
     *
     * @param props.contrastBoost - Set contrast boost level. (Options: NONE, LOW, MEDIUM or HIGH). Default is LOW.
     *
     * @param props.threesixty - Enable/Disable 360 enhancement. By default, this is false. 360 enhancement requires a 360 panorama.
     *
     * @param props.hdr -  Enable/Disable HDR. By default, this is false.
     *
     * HDR will require multiple brackets, and an additional API call. Read more on how to enhance HDR.
     *
     * @returns {
     *   imageId: 'e2c7-7a942e07fe1f',
     *   status: 200,
     *   orderId: '3dasdy324F342'
     * }
     * @beta
     */

    async uploadImg(props: IUploadImg): Promise<IUploadImgPromise | string> {

        const isItBufferImg = Buffer.isBuffer(props.imageBuffer);
        if (!isItBufferImg) throw new Error('image uploaded must be image buffer');

        const contentType = mime.lookup(props.imgName);
        if (!contentType) throw new Error('Incorrect value in image name');

        const body = {
            image_name: props.imgName,
            content_type: contentType,
            order_id: props.orderId,
            enhance_type: props.enhanceType,
            vertical_correction: props.verticalCorrection,
            sky_replacement: props.skyReplacement,
            sky_type: props.skyType,
            cloud_type: props.cloudType,
            contrast_boost: props.contrastBoost,
            threesixty: props.threesixty,
            hdr: props.hdr
        };

        try {
            const post = await fetch(`${this.baseUrl}image`, {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    'x-api-key': this.apiKey
                }
            });
            if (post.ok) {
                const data = await post.json()
                const put = await fetch(data.s3PutObjectUrl, {
                        method: 'put',
                        body: props.imageBuffer,
                        headers: {
                            'Content-Type': contentType,
                        }
                    }
                )
                return {imageId: data.image_id, status: put.status, orderId: props.orderId};

            }
            return {error: 'image was not uploaded', status: post.status};

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
        return 'An unexpected error occurred'

    }


    /**
     * https://api.autoenhance.ai/v2/image/:image_id
     *
     * Returns image status properties.
     *
     * @remarks
     *  Check image status by image id.
     *
     * @param imageId - Id of the image.
     * @returns {
     *   image_id: '0c35b440-e9ae70cce6ff',
     *   image_name: 'image.jpg',
     *   image_type: 'jpeg',
     *   enhance_type: 'property',
     *   date_added: 1670391883226,
     *   user_id: 'auth0|6363dbcb77f7e50',
     *   status: 'processing',
     *   downloaded: false
     * }
     *
     * @beta
     */

    async checkImageEnhance(imageId: string): Promise<ICheckImageEnhanceConfig | string> {
        try {
            const response = await fetch(`${this.baseUrl}image/${imageId}`, {
                method: 'get',
            });
            return await response.json()

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
        return 'An unexpected error occurred'

    }

    /**
     * https://api.autoenhance.ai/v2/order/:order_id
     *
     * Returns multiple images status properties.
     *
     * @remarks
     * Check images status by order id.
     *
     * @param orderId - Id of the order.
     *
     * @returns {{
     * 'images': [
     * {'image_id': '098c8f40-b3bd-4301-98eb-2a51be989dac', 'order_id': '3212310-dfs-fdsg0',
     *  'image_name': 'image.jpg', 'image_type': 'jpeg', 'enhance_type': 'property', 'date_added': 1669056195000,
     *  'user_id': 'auth0|6363dbcb77f7e74122ea6350', 'status': 'processed', 'sky_replacement': true,
     *  'vertical_correction': true, 'vibrant': false},
     *
     *  {'image_id': 'd19d9cfa-dccf-466c-a2cf-8df761317db3', 'order_id': '3212310-dfs-fdsg0',
     *    'image_name': 'image.jpg', 'image_type': 'jpeg', 'enhance_type': 'property', 'date_added': 1669056341000,
     *    'user_id': 'auth0|6363dbcb77f7e74122ea6350', 'status': 'processed', 'sky_replacement': true,
     *    'vertical_correction': true, 'vibrant': false}
     *     ], 'is_processing': false, 'order_id': '3212310-dfs-fdsg0'
     *    }}
     *
     * @beta
     */

    async checkOrderEnhance(orderId: string): Promise<ICheckOrderEnhance | string> {

        try {
            const response = await fetch(`${this.baseUrl}order/${orderId}`, {
                method: 'get',
            });
            return await response.json()

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
        return 'An unexpected error occurred'
    };


    /**
     * https://api.autoenhance.ai/v2/image/:image_id/preview
     *
     * Returns image buffer.
     *
     * @remarks
     * Receive an image buffer by providing img id.
     *
     * @param imageId - Id of the uploaded img.
     *
     * @returns
     * ArrayBuffer {
     *   [Uint8Contents]: <ff d8 ff e00 01 0 03 00 00 00 01 00 02 00 00 ... 52861 more bytes>,
     *   byteLength: 52961
     * }
     * @beta
     */

    async previewEnhancedImg(imageId: string): Promise<Buffer | string> {

        try {
            const response = await fetch(`${this.baseUrl}image/${imageId}/preview`, {
                method: 'get',
            });
            return await response.arrayBuffer()

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
        return 'An unexpected error occurred'
    };

    /**
     * https://api.autoenhance.ai/v2/image/:image_id/enhanced
     *
     * Returns image buffer.
     *
     * @remarks
     * Receive an enhanced image buffer by providing img id.
     *
     * @param imageId - Id of the uploaded img.
     *
     * @returns
     * ArrayBuffer {
     *   [Uint8Contents]: <ff d8 ff e00 01 0 03 00 00 00 01 00 02 00 00 ... 52861 more bytes>,
     *   byteLength: 52961
     * }
     * @beta
     */

    async webOptimisedImg(imageId: string): Promise<Buffer | string> {

        try {
            const response = await fetch(`${this.baseUrl}image/${imageId}/enhanced`, {
                method: 'get',
                params: {'size': 'small'},
            });
            return await response.arrayBuffer()

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
        return 'An unexpected error occurred'
    };


    /**
     * https://api.autoenhance.ai/v2/image/:image_id/enhanced
     *
     * Returns image buffer.
     *
     * @remarks
     * Receive a full resol enhanced image buffer by providing img id.
     *
     * @param imageId - Id of the uploaded img.
     *
     * @returns
     * ArrayBuffer {
     *   [Uint8Contents]: <ff d8 ff e00 01 0 03 00 00 00 01 00 02 00 00 ... 52861 more bytes>,
     *   byteLength: 52961
     * }
     *
     * @beta
     */

    async fullResolEnhancedImg(imageId: string): Promise<Buffer | string> {

        try {
            const response = await fetch(`${this.baseUrl}image/${imageId}/enhanced`, {
                method: 'get',
            });
            return await response.arrayBuffer()

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
        return 'An unexpected error occurred'
    };


    /**
     * https://api.autoenhance.ai/v2/image/:process
     *
     * Return edited image status properties.
     *
     * @remarks
     *
     *         If the image should have a sky replacement,
     *         and it hasn’t been achieved by the AI,
     *         then you can set sky_replacement: true,
     *         and the AI will apply a sky replacement to the image.
     *         If the image shouldn’t have a sky
     *         replacement, but the AI has applied one,
     *         then you can set sky_replacement: false,
     *         to disable the sky replacement.
     *
     * @param props.orderId - Id of the img.
     *
     * @param props.verticalCorrection - boolean True to enable perspective correction and false to disable.
     *
     * @param props.skyReplacement - boolean When true the AI will try to replace the sky if it detects a sky in the image.
     *                                 When false the AI will not try to detect or replace the sky in the image.
     * @param props.skyType - string Set specific sky type. (Options: UK_SUMMER, UK_WINTER or USA_SUMMER). Default is UK_SUMMER.
     *
     * @param props.cloudType - string Set specific cloud type. (Options: CLEAR, LOW_CLOUD or HIGH_CLOUD). Default is HIGH_CLOUD.
     *
     * @param props.contrastBoost string Set contrast boost level. (Options: NONE, LOW, MEDIUM or HIGH). Default is LOW.
     *
     * @param props.threesixty -boolean Enable/Disable 360 enhancement. By default, this is false. 360 enhancement requires a 360 panorama.
     *
     *
     * @returns {
     *   image_id: '7c7e666b-896f-43fa-bfb1-b49af6da8fa3',
     *   image_name: 'image.jpg',
     *   image_type: 'jpeg',
     *   enhance_type: 'property',
     *   date_added: 1671724962598,
     *   user_id: 'auth0|6363dbcb77f7e74122ea6350',
     *   status: 'processing',
     *   downloaded: true
     * }
     *
     * @beta
     */



    async editEnhancedImg(props: IEditEnhancedImg): Promise<IEditEnhancedImgPromise | string> {


        const body = {
            vertical_correction: props.verticalCorrection,
            sky_replacement: props.skyReplacement,
            sky_type: props.skyType,
            cloud_type: props.cloudType,
            contrast_boost: props.contrastBoost,
            threesixty: props.threesixty,
        };

        try {
            const response = await fetch(`${this.baseUrl}image/${props.imageId}/process`, {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    'x-api-key': this.apiKey
                }
            });
            return await response.json()

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
        return 'An unexpected error occurred'

    };


    /**
     * https://api.autoenhance.ai/v2/image/:image_id/report
     *
     * Returns  successfully reported image message.
     *
     * @remarks
     * Report the img by providing img id.
     *
     * @param props.imageId - Id of the reporting img.
     *
     *
     * @param props.category - An array of items that the image failed at. e.g. skyreplacement, lenscorrection etc.
     *                          ["skyreplacement","lenscorrection"]
     *
     * @param props.comment - An optional text comment to provide more infomation about why the image failed.
     *                                 When false the AI will not try to detect or replace the sky in the image.
     *                                 e.g. Sky was not replaced in image and the len has not been corrected.
     *
     *
     * @returns
     *  { message: 'successfully reported image' }
     *
     * @beta
     */

    async reportEnhancement(props: IReportEnhancement): Promise<string> {

        const body = {
            'category': props.category,
            'comment': props.comment,

        };

        try {
            const response = await fetch(`${this.baseUrl}image/${props.imageId}/report`, {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    'x-api-key': this.apiKey
                }
            });
            return await response.json()

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
        return 'An unexpected error occurred'
    };


}
