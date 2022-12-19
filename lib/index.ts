import {ICheckImageEnhanceResponse, IUploadImg, IUploadImgPromise, IUploadImgResponse} from "./types";

import axios from 'axios';

import * as mime from 'mime-types';

export class Autoenhance {
    private readonly baseUrl: string;

    constructor(apiKey: string) {
        this.baseUrl = 'https://api.autoenhance.ai/v2/';
        axios.defaults.headers.common['x-api-key'] = apiKey;
    }

    /**
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

            const {data, status} = await axios.post<IUploadImgResponse>(`${this.baseUrl}image`,
                body
            );

            const imageId = data.image_id;
            const s3PutObjectUrl = data.s3PutObjectUrl;

            if (status === 200) {
                const {status} = await axios.put(
                    s3PutObjectUrl,
                    props.imageBuffer,
                    {
                        headers: {
                            'Content-Type': contentType,
                        },
                    }
                );
                return {imageId: imageId, status: status, orderId: props.orderId};
            }

            return {error: 'image was not uploaded', status: status};

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                return error.message;
            } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    };


    /**
     * Returns image properties.
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

    async checkImageEnhance(imageId: string): Promise<ICheckImageEnhanceResponse | string> {


        try {
            const {data} = await axios.get<ICheckImageEnhanceResponse>(`${this.baseUrl}image/${imageId}`);
            return data;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                return error.message;
            } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }


}
