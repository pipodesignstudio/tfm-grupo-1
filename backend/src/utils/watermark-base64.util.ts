import fs from 'fs';
import path from 'path';

export const getWatermarkBase64 = ():string => {
    const watermarkPath = path.resolve(process.cwd(), 'src', 'assets', 'img', 'watermark.png');
    const base64 = fs.readFileSync(watermarkPath).toString('base64');
    return base64;
}