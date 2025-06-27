import { differenceInMinutes, format } from 'date-fns';
import { Content, ContentTable, TableCell } from 'pdfmake/interfaces';
import { IActividadPdf } from '../../../interfaces';

const fmtDate  = (d: Date | null) => (d ? format(d, 'dd/MM/yyyy') : '');
const duration = (ini: Date | null, fin: Date | null) =>
  ini && fin ? `${differenceInMinutes(fin, ini)}min` : '';

export const buildActivitiesTable = (activities: IActividadPdf[]): Content => {
  const body: TableCell[][] = [
    [
      { text: 'Fecha',        style: 'tableHeader' },
      { text: 'Título',       style: 'tableHeader' },
      { text: 'Descripción',  style: 'tableHeader' },
      { text: 'Tipo',         style: 'tableHeader' },
      { text: 'Duración',     style: 'tableHeader' },
      { text: 'Responsable',  style: 'tableHeader' },
      { text: 'Niño',         style: 'tableHeader' },
      { text: 'Estado',       style: 'tableHeader' },
    ],
    ...activities.map(a => [
        { text: fmtDate(a.fecha_realizacion), style: 'tableCell' },
        { text: a.title,                      style: 'tableCell' },
        { text: a.description,                style: 'tableCell' },
        { text: a.tipo,                       style: 'tableCell' },
        { text: duration(a.hora_inicio, a.hora_fin), style: 'tableCell' },
        { text: a.responsable,                style: 'tableCell' },
        { text: a.nino,                       style: 'tableCell' },
        { text: a.hora_fin ? 'Completado' : 'Pendiente', style: 'tableCell' },
      ]),
    ] as const;

  return {
    table:  { widths: ['auto', '*', '*', 'auto', 'auto', '*', 'auto', 'auto'], body },
    layout: {
        fillColor: (
          rowIndex: number,
          _node: ContentTable,
          _col: number,
        ): string | null => (rowIndex === 0 ? '#eeeeee' : null),  
      },
      
  };
};
