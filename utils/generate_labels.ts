import { articles_categories } from '@/mock/articles_categories';
import { article_types_submit_article } from '@/mock/articles_types';

export function getArticleCategoryLabel(value: string): string {
  let find_label = '';
  articles_categories?.forEach((category) => {
    if (category.value === value) {
      find_label = category.label;
    }
  });
  return find_label;
}

export function getArticleTypeLabel(value: string): string {
  let find_label = '';
  article_types_submit_article?.forEach((category) => {
    if (category.value === value) {
      find_label = category.label;
    }
  });
  return find_label;
}
