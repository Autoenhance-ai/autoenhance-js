# The library of Autoenhance.

### Installation

```
npm install Autoenhance

```

### Basic usage

```typescript

import {Autoenhance} from 'autoenhance'

const API_KEY = 'ERDgxPujNZFr3jIgv1CkVdsaqWDSAHn2';

const autoenhance = new Autoenhance(API_KEY);


const checkImage = async () => {
    const data = await autoenhance.checkImageEnhance('151e39d8-b774-47e1-sdeq-ewqe12ewq');
    return data
};

const uploadImage = async (imageBuffer: object) => {
    const data = await autoenhance.uploadImg({imgName: 'image.png', imageBuffer})
}


```
