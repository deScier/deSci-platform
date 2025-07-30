import slug from 'slug';

export const slugfy_options = {
  replacement: '-',
  symbols: true,
  remove: null,
  lower: true,
  charmap: slug.charmap,
  multicharmap: slug.multicharmap,
};

export function slugfy(text: string): string {
  return slug(text, slugfy_options);
}
