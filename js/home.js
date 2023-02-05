import dayjs from 'dayjs';
import postApi from './api/postApi';
import { setTextContent, truncateText } from './utils/common';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getPaginationElement } from './utils';
import debounce from 'lodash.debounce';

//extend use fromNow func
dayjs.extend(relativeTime);

function createPostElement(post) {
  if (!post) return;
  const postTemplate = document.getElementById('postItemTemplate');
  if (!postTemplate) return;
  const liElement = postTemplate.content.firstElementChild.cloneNode(true);

  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
  setTextContent(liElement, '[data-id="author"]', post.author);
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`);

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) thumbnailElement.src = post.imageUrl;
  thumbnailElement.addEventListener('error', () => {
    thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=Thumbnail';
  });

  return liElement;
}

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

    if (filterName === 'title_like') url.searchParams.set('_page', 1);
    history.pushState({}, '', url);

    //fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('failed:', error);
  }
}

function handlePreviousClick(e) {
  e.preventDefault();

  const ulPagination = getPaginationElement();
  if (!ulPagination) return;
  const page = Number.parseInt(ulPagination.dataset.page) || 1;

  if (page <= 1) return;
  handleFilterChange('_page', page - 1);
}

function handleNextClick(e) {
  e.preventDefault();

  const ulPagination = getPaginationElement();
  if (!ulPagination) return;
  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  const totalPage = Number.parseInt(ulPagination.dataset.totalPage);
  if (page >= totalPage) return;

  handleFilterChange('_page', page + 1);
}

function initPagination() {
  //bind click event for previous and next link
  const ulPagination = getPaginationElement();
  if (!ulPagination) return;

  //add click event for previous link
  const previousLink = ulPagination.firstElementChild?.firstElementChild;
  if (previousLink) {
    previousLink.addEventListener('click', handlePreviousClick);
  }

  //add click event for last link
  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick);
  }
}

function renderPostList(postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  //clear current list to render after paginating
  ulElement.textContent = '';

  postList.forEach((post, index) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

function renderPagination(pagination) {
  const ulPagination = getPaginationElement();
  if (!pagination || !ulPagination) return;

  const { _page, _limit, _totalRows } = pagination;
  const totalPage = Math.ceil(_totalRows / _limit);

  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPage = totalPage;

  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  if (_page >= totalPage) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');

  //check if enable/disabled prev/next link
}

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  //set default values from query params
  //title like
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like');
  }

  const debounceSearch = debounce((event) => {
    handleFilterChange('title_like', event.target.value);
  }, 500);

  searchInput.addEventListener('input', debounceSearch);
}

(async () => {
  try {
    const url = new URL(window.location);

    //update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    initPagination(queryParams);
    initSearch(queryParams);

    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
