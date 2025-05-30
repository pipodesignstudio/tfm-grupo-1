import PdfPrinter from 'pdfmake';
import { BufferOptions, TDocumentDefinitions } from 'pdfmake/interfaces';
import path from 'path'; 


const FONTS_BASE_PATH = path.join(process.cwd(), 'src', 'assets', 'fonts'); 
// TODO: Ajustar a la fuentes que usemos ppalmente en el front
const fonts = {
  Roboto: {
    normal: path.join(FONTS_BASE_PATH, 'Roboto-Regular.ttf'),
    bold: path.join(FONTS_BASE_PATH, 'Roboto-Bold.ttf'),
  },
};

export class PdfGeneratorService {
  private printer: PdfPrinter;

  constructor() {
    this.printer = new PdfPrinter(fonts);
  }

  /**
   * Crea un documento PDFKit a partir de la definición.
   * @param docDefinition La definición del documento PDF.
   * @param options Opciones adicionales para la creación del PDF.
   * @returns Un objeto PDFKit.PDFDocument (stream).
   */
  createPdf(docDefinition: TDocumentDefinitions, options: BufferOptions = {}): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition, options);
  }
}

// Opcional: exportar una instancia única para uso global (singleton)
export const pdfGenerator = new PdfGeneratorService();