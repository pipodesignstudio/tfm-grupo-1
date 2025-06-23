import { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { stylesDictionary, logo } from "./partials";
import { ExportActivitiesDto } from "../../dtos/actividades";
import { IActividadPdf } from "../../interfaces";


export const activitiesPdfGenerator = (activities:IActividadPdf[]):TDocumentDefinitions => {
  const styles: StyleDictionary = stylesDictionary;
  const nidoLogo: Content = logo;

  const document: TDocumentDefinitions = {
    content: [
      nidoLogo,
      {
        text: 'Listado de actividades',
        style: 'header',
      },
    ],
    styles,
    pageMargins: [40, 60, 40, 40],
  };

  return document;
}
