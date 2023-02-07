import postApi from './api/postApi';
import { setTextContent } from './utils';
import dayjs from 'dayjs';
import { registerLightbox } from './utils/lightbox';

function renderPostDetail(post) {
  if (!post) return;
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format(' - DD/MM/YYYY HH:mm')
  );

  //render hero image
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;
    heroImage.addEventListener('error', () => {
      heroImage.style.backgroundImage = `url("https://via.placeholder.com/1368x400?text=Thumbnail")`;
    });
  }

  //render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit post';
  }
}

(async () => {
  registerLightbox({
    modalId: 'lightbox',
    imageSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });

  try {
    //get post id from URl
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    if (!postId) {
      console.log('post not found');
      return;
    }

    //fetch post detail API
    const post = await postApi.getById(postId);

    //render post detail
    renderPostDetail(post);
  } catch (error) {
    console.log('fail to fetch post detail', error);
  }
})();
