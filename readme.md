# The library of Autoenhance.

### Installation

```
npm install Autoenhance

```

### Basic usage

```typescript
import {Autoenhance} from './autoenhance'
import * as fs from "fs";
import * as path from "path";

const API_KEY = 'dsaeewqrt34241241214';

const autoenhance = new Autoenhance(API_KEY);

const orderId = 'dsasda12eoi09sadi821'

const checkImage = async () => {
    const data = await autoenhance.checkImageEnhance('324324-2ac6-4fba-9f5b-81110085fc83');
    console.log(data)
    return data
};

checkImage()

const uploadImage = async (imageBuffer: object) => {
    const data = await autoenhance.uploadImg({imgName: 'image.png', imageBuffer})
    console.log(data)
}

const promise = fs.promises.readFile(path.join('test_image.jpg'));

Promise.resolve(promise).then(function (buffer) {
    uploadImage(buffer)

});


const checkImageByOrderId = async () => {
    const data = await autoenhance.checkOrderEnhance(orderId);
    console.log(data)
    return data
};

checkImageByOrderId()


const previewImg = async () => {
    const response = await autoenhance.previewEnhancedImg('343-896f-43-bfb1-b49af6da8fa3')

    fs.writeFileSync("new1.jpg", Buffer.from(response));
}

previewImg()


const webOptimisedImg = async () => {
    const data = await autoenhance.webOptimisedImg('34543534-896f-4-bfb1-b49af6da8fa3')
    fs.writeFileSync("new2.jpg", Buffer.from(data));
}

webOptimisedImg()

const fullResolEnhancedImg = async () => {
    const data = await autoenhance.fullResolEnhancedImg('3435-896f-43-bfb1-b49af6da8fa3')
    console.log(data)

    fs.writeFileSync("new3.jpg", Buffer.from(data));
}

fullResolEnhancedImg()

const editEnhancedImg = async () => {
    const response = await autoenhance.editEnhancedImg({
        imageId: '345-896f-34-bfb1-b49af6da8fa3', threesixty: true, contrastBoost: "HIGH"
    })
    console.log(response)

}

editEnhancedImg()


const reportEnhancement = async () => {
    return await autoenhance.reportEnhancement({
        imageId: '4345-896f-43fa-34-b49af6da8fa3',
        category: ["download", "lens_correction", "hdr"],
        comment: 'test olim new h '
    })
};


console.log(reportEnhancement())

```
