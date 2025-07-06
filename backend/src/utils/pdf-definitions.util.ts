import { Content, StyleDictionary } from "pdfmake/interfaces";

export const styles: StyleDictionary = {
  header: {
    fontSize: 14,
    bold: true,
    alignment: 'center',
    margin: [10, 40, 10, 20],
  },
  body: {
    alignment: 'justify',
    fontSize: 10,
    margin: [0, 0, 0, 0],
  },
  clausula: {
    fontSize: 12,
    bold: true,
    margin: [0, 0, 0, 20],
  },
  list: {
    margin: [30, 0, 0, 0],
    alignment: 'justify',
    fontSize: 10,
  },
  footer: {
    fontSize: 10,
    italics: true,
    alignment: 'center',
    margin: [0, 0, 20, 0],
  },
};

export const logo: Content = {
  image: 'src/assets/img/logo.png',
  width: 120,
  margin: [0, 10, 0, 10],
};