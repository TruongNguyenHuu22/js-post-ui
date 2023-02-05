import debounce from 'lodash.debounce';

export function initSearch({ elementId, defaultValue, onChange }) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;

  //set default values from query params
  //title like
  if (defaultValue && defaultValue.get('title_like')) {
    searchInput.value = defaultValue.get('title_like');
  }

  const debounceSearch = debounce((event) => {
    onChange?.(event.target.value);
  }, 500);

  searchInput.addEventListener('input', debounceSearch);
}
