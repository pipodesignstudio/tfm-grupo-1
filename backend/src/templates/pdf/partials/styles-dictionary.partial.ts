import { Content, StyleDictionary } from "pdfmake/interfaces";

export const stylesDictionary: StyleDictionary = {
    header: {
      fontSize: 16,
      bold: true,
      alignment: 'center',
      margin: [10, 40, 10, 20],
    },
    body: {
      alignment: 'justify',
      fontSize: 12,
      margin: [0, 0, 0, 0],
    },
      tableHeader: { bold: true, fontSize: 9, margin: [0, 5, 0, 5] },
      tableCell:   { fontSize: 9, margin: [2, 2, 2, 2] },
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
  
