import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//extend use fromNow func
dayjs.extend(relativeTime);

export function initPagination({ elementId, defaultValue, onChange }) {
  //bind click event for previous and next link
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  //add click event for previous link
  const previousLink = ulPagination.firstElementChild?.firstElementChild;
  if (previousLink) {
    previousLink.addEventListener('click', (e) => {
      e.preventDefault();
      const page = Number.parseInt(ulPagination.dataset.page) || 1;

      if (page >= 2) onChange?.(page - 1);
    });
  }

  //add click event for last link
  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();

      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      const totalPage = Number.parseInt(ulPagination.dataset.totalPage);
      if (page < totalPage) onChange?.(page + 1);
    });
  }
}

export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!pagination || !ulPagination) return;

  const { _page, _limit, _totalRows } = pagination;
  const totalPage = Math.ceil(_totalRows / _limit);

  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPage = totalPage;

  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  if (_page >= totalPage) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}
