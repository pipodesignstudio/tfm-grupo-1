
import { DynamicBackground } from 'pdfmake/interfaces';


/** Watermark reutilizable para pdfmake */
export function watermarkBackground(opacity = 0.08, image:string): DynamicBackground {
  return (_page, size) => ({
    image: `data:image/png;base64,${image}`,
    width: size.width * 0.6,
    absolutePosition: { x: size.width * 0.2, y: size.height * 0.3 },
    opacity,
  });
}
