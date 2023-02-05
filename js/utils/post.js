import dayjs from 'dayjs';
import { setTextContent, truncateText } from './common';
import relativeTime from 'dayjs/plugin/relativeTime';

//extend use fromNow func
dayjs.extend(relativeTime);

export function createPostElement(post) {
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

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  //clear current list to render after paginating
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
