export const parseHTML = (html: string): HTMLElement => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild as HTMLElement;
};
