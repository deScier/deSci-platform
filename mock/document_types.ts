export type DocumentTypes = {
  id: number;
  label: string;
  value: string;
};

export const document_types: DocumentTypes[] = [
  {
    id: 1,
    label: 'Manuscript',
    value: 'manuscript',
  },
  {
    id: 2,
    label: 'Paper',
    value: 'paper',
  },
  {
    id: 3,
    label: 'Report',
    value: 'report',
  },
  {
    id: 4,
    label: 'Review',
    value: 'review',
  },
  {
    id: 5,
    label: 'Conference abstract',
    value: 'conference_abstract',
  },
  {
    id: 6,
    label: 'Other',
    value: 'other',
  },
];
