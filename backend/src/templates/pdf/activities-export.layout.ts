import { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { stylesDictionary, logo } from "./partials";
import { IActividadPdf } from "../../interfaces";
import path from "path";
import fs from "fs";

export const activitiesPdfGenerator = (activities: IActividadPdf[]): TDocumentDefinitions => {
  const styles: StyleDictionary = stylesDictionary;
  const nidoLogo: Content = logo;
  const document: TDocumentDefinitions = {
    content: [
      nidoLogo,
      {
        text: 'Listado de actividades',
        style: 'header',
      },
      activities.map((activity) => ({
        text: activity.title,
        style: 'body',
      })),
    ],
    styles,
    pageMargins: [40, 40, 40, 40],
  };

  return document;
}
