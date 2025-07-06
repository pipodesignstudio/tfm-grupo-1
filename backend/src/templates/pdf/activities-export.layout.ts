import { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { stylesDictionary, logo, watermarkBackground } from "./partials";
import { IActividadPdf } from "../../interfaces";
import { getWatermarkBase64 } from "../../utils";
import { buildActivitiesTable } from "./partials/content.partial";

export const activitiesPdfGenerator = (activities: IActividadPdf[]): TDocumentDefinitions => {
  const styles: StyleDictionary = stylesDictionary;
  const nidoLogo: Content = logo;
  const watermarkBase64 = getWatermarkBase64();
  console.log(activities);
  const document: TDocumentDefinitions = {

    content: [
      nidoLogo,
      {
        text: 'Listado de actividades',
        style: 'header'
      },
      buildActivitiesTable(activities),
    ],
    styles,
    background: watermarkBackground(0.08, watermarkBase64),
    pageMargins: [40, 40, 40, 40],
  };
  return document;
}
