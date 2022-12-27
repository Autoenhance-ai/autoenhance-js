# The library of Autoenhance.

### Installation

```
npm install Autoenhance

```

### Basic usage

```typescript
import {Autoenhance} from './lib'

import * as fs from "fs";

import * as path from "path";

const API_KEY = 'dsadasdewqe';

const autoenhance = new Autoenhance(API_KEY);

const orderId = 'dsasda12eoi09sadi821'

const checkImage = async () => {
    const data = await autoenhance.checkImageEnhance('9bf141c8-ewqeqw-4fba-9f5b-81110085fc83');
    return data
};

checkImage()

const uploadImage = async (imageBuffer: object) => {
    const data = await autoenhance.uploadImg({imgName: 'image.png', imageBuffer, orderId})
}

const promise = fs.promises.readFile(path.join('/test_image.jpg'));

Promise.resolve(promise).then(function (buffer) {
    uploadImage(buffer)

});


const checkImageByOrderId = async () => {
    const data = await autoenhance.checkOrderEnhance(orderId);
    return data
};

checkImageByOrderId()


const previewImg = async () => {
    const response = await autoenhance.previewEnhancedImg('w-896f-43fa-bfb1-b49af6da8fa3')

    if (response.data) {
        fs.writeFileSync("new1.jpg", response.data);
    }
}

previewImg()


const reportEnhancement = async () => {
    return await autoenhance.reportEnhancement({
        imageId: '7c7e666b-896f-43fa-sd-b49af6da8fa3',
        category: ["download", "lens_correction", "hdr"],
        comment: 'test olim'
    })
};

reportEnhancement()


const webOptimisedImg = async () => {
    const {data} = await autoenhance.webOptimisedImg('wf-896f-43fa-bfb1-b49af6da8fa3')
    if (data) {
        fs.writeFileSync("new1.jpg", data);
    }
}

webOptimisedImg()

const fullResolEnhancedImg = async () => {
    const {data} = await autoenhance.fullResolEnhancedImg('dg-896f-g-bfb1-b49af6da8fa3')
    if (data) {
        fs.writeFileSync("new21.jpg", data);
    }
}

fullResolEnhancedImg()

const editEnhancedImg = async () => {
    const response = await autoenhance.editEnhancedImg({
        imageId: '7c7e666b-896f-43fa-bfb1-sd', threesixty: true, contrastBoost: "HIGH"
    })
    console.log(response)

}

editEnhancedImg()


```
