import { Option } from '@/components/common/Input/Typing';
import { random } from 'lodash';

export interface ArticlesTypesFilter extends Option {
  type?: string;
  related?: string[];
}

export interface ArticlesTypes extends Option {
  id: number;
  value: string;
  label: string;
}

export const articles_types: ArticlesTypesFilter[] = [
  {
    id: random(1, 1000 * 9999),
    label: 'Research article',
    value: 'research-article',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Review article',
    value: 'review-article',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Capstone work (TCC)',
    value: 'capstone-work',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Short communication',
    value: 'short-communication',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Case report',
    value: 'case-report',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Case series',
    value: 'case-series',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Technical note',
    value: 'technical-note',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Technical report',
    value: 'technical-report',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Systematic review',
    value: 'systematic-review',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Pictorial essay',
    value: 'pictorial-essay',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Letter to the Editor',
    value: 'letter-to-the-editor',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Correspondence',
    value: 'correspondence',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Commentary',
    value: 'commentary',
    type: 'item',
  },
  {
    id: random(1, 1000 * 9999),
    label: 'Conference Abstract',
    value: 'conference-abstract',
    type: 'item',
  },

  {
    id: random(1, 1000 * 9999),
    label: 'Other',
    value: 'other',
    type: 'item',
  },
];

export const all = [{ id: random(1, 1000 * 9999), label: 'All articles', value: 'all', type: 'item' }];
export const research_article = articles_types.slice(0, 4) as ArticlesTypes[];
export const cases_and_notes = articles_types.slice(5, 8) as ArticlesTypes[];
export const reviews = articles_types.slice(8, 10) as ArticlesTypes[];
export const communications = articles_types.slice(10, 13) as ArticlesTypes[];
export const others = articles_types.slice(13, 15) as ArticlesTypes[];

export const article_types_submit_article: ArticlesTypesFilter[] = [
  {
    id: random(1, 1000 * 9999),
    label: 'Research article',
    value: 'research-article',
    type: 'label',
    related: research_article.map((item) => item.value).filter((value) => value != null) as string[],
  },
  ...research_article,
  {
    id: random(1, 1000 * 9999),
    label: 'Cases and notes',
    value: 'cases-and-notes',
    type: 'label',
    related: cases_and_notes.filter((item) => item.value != null).map((item) => item.value) as string[],
  },
  ...cases_and_notes,
  {
    id: random(1, 1000 * 9999),
    label: 'Reviews',
    value: 'reviews',
    type: 'label',
    related: reviews.filter((item) => item.value != null).map((item) => item.value) as string[],
  },
  ...reviews,
  {
    id: random(1, 1000 * 9999),
    label: 'Communications',
    value: 'communications',
    type: 'label',
    related: communications.filter((item) => item.value != null).map((item) => item.value) as string[],
  },
  ...communications,
  {
    id: random(1, 1000 * 9999),
    label: 'Others',
    value: 'others',
    type: 'label',
    related: others.filter((item) => item.value != null).map((item) => item.value) as string[],
  },
  ...others,
];

export const articles_types_filter: ArticlesTypesFilter[] = [
  ...all,
  {
    id: random(1, 1000 * 9999),
    label: 'Research article',
    value: 'research-article',
    type: 'label',
  },
  ...research_article,
  {
    id: random(1, 1000 * 9999),
    label: 'Cases and notes',
    value: 'cases-and-notes',
    type: 'label',
  },
  ...cases_and_notes,
  {
    id: random(1, 1000 * 9999),
    label: 'Reviews',
    value: 'reviews',
    type: 'label',
  },
  ...reviews,
  {
    id: random(1, 1000 * 9999),
    label: 'Communications',
    value: 'communications',
    type: 'label',
  },
  ...communications,
  {
    id: random(1, 1000 * 9999),
    label: 'Others',
    value: 'others',
    type: 'label',
  },
  ...others,
];
