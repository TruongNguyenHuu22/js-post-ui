import postApi from './api/postApi';
import { initPostForm } from './utils/post-form';

async function handlePostFormSubmit(formValues) {
  try {
    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);

    window.location.assign(`/post-detail.html?id=${savedPost.id}`);
  } catch (error) {
    console.log('failed to save post', error);
  }
}
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    const defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        };
    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    });
  } catch (error) {
    console.log('failed to fetch post details:', error);
  }
})();
