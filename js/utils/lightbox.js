function showModal(modalElement) {
  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
}

export function registerLightbox({ modalId, imageSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  //check if the modal id registered or not
  if (Boolean(modalElement.dataset.registered)) return;

  //selectors
  const imageElement = modalElement.querySelector(imageSelector);
  const prevButton = modalElement.querySelector(prevSelector);
  const nextButton = modalElement.querySelector(nextSelector);
  if (!imageElement || !prevButton || !nextButton) return;

  let imgList = [];
  let currentIndex = 0;

  function showImgAtIndex(index) {
    imageElement.src = imgList[index].src;
  }
  //handle click for all imgs
  //img click -> find all imgs with the same album / gallery
  //determine index of selected  img
  //handle prev / next click

  document.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);

    showImgAtIndex(currentIndex);
    showModal(modalElement);
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImgAtIndex(currentIndex);
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length;
    showImgAtIndex(currentIndex);
  });

  //mark this modal is already registered
  modalElement.dataset.registered = 'true';
}
