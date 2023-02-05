export function setTextContent(parent, selector, text) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function truncateText(text, maxlength) {
  if (text <= maxlength) return text;

  return `${text.slice(0, maxlength - 1)}…`;
}
