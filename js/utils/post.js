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

  //attach events
  //go to post detail when click
  const divElement = liElement.firstElementChild;
  if (divElement) {
    divElement.addEventListener('click', (event) => {
      const menu = liElement.querySelector('[data-id="menu"]');
      if (menu && menu.contains(event.target)) return;

      window.location.assign(`/post-detail.html?id=${post.id}`);
    });
  }

  //add click event fort edit button
  const editButton = liElement.querySelector('[data-id="edit"]');
  if (editButton) {
    editButton.addEventListener('click', () => {
      //prevent event bubbling to parent
      window.location.assign(`/add-edit-post.html?id=${post.id}`);
    });
  }
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
