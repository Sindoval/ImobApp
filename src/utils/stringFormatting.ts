export function toUnderscored(str: string): string {
  const noAccents = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const underscored = noAccents
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');

  return underscored;
}