import {ICheckImageEnhanceResponse, IUploadImg, IUploadImgResponse} from "./types";

import axios from 'axios';

import * as mime from 'mime-types';

export class Autoenhance {
    private readonly baseUrl: string;

    constructor(apiKey: string) {
        this.baseUrl = 'https://api.autoenhance.ai/v2/';
        axios.defaults.headers.common['x-api-key'] = apiKey;
    }


    async checkImageEnhance(imageId: string): Promise<ICheckImageEnhanceResponse | string> {

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


    async uploadImg(
        props: IUploadImg
    ): Promise<object | string> {


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
                return {'imageId': imageId, status, orderId: props.orderId};
            }

            return {'error': 'image was not uploaded', 'status': status};

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

}

