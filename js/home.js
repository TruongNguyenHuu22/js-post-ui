import dayjs from 'dayjs';
import postApi from './api/postApi';
import { initPagination, initSearch, renderPostList, renderPagination, toast } from './utils';

export async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location);

    if (filterName) url.searchParams.set(filterName, filterValue);

    if (filterName === 'title_like') url.searchParams.set('_page', 1);
    history.pushState({}, '', url);

    //fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('failed:', error);
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (e) => {
    try {
      const post = e.detail;
      const message = `Are you sure to remove post "${post.title}"?`;

      const deleteConfirmModal = document.getElementById('exampleModal');

      if (!deleteConfirmModal) return;
      const deleConfirmModalBody = deleteConfirmModal.querySelector('.modal-body');
      deleConfirmModalBody.textContent = message;

      const deleteButton = deleteConfirmModal.querySelector('#delete_button');
      if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
          await postApi.remove(post.id);

          deleteConfirmModal.classList.remove('show');
          await handleFilterChange();

          toast.success('Remove post successfully');
        });
      }
    } catch (error) {
      console.log('failed to remove post', error);
      toast.error(error.message);
    }
  });
}

//main
(async () => {
  try {
    const url = new URL(window.location);

    //update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    registerPostDeleteEvent();

    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    handleFilterChange();
  } catch (error) {
    console.log('get all failed', error);
  }
})();
