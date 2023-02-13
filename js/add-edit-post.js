import postApi from './api/postApi';
import { toast } from './utils';
import { initPostForm } from './utils/post-form';

async function handlePostFormSubmit(formValues) {
  console.log('🚀 ~ file: add-edit-post.js:6 ~ handlePostFormSubmit ~ formValues', formValues);
  // try {
  //   const savedPost = formValues.id
  //     ? await postApi.update(formValues)
  //     : await postApi.add(formValues);
  //   toast.success('Save post successfully!');
  //   setTimeout(() => {
  //     window.location.assign(`/post-detail.html?id=${savedPost.id}`);
  //   }, 2000);
  // } catch (error) {
  //   console.log('failed to save post', error);
  //   toast.error(`Error: ${error.message}`);
  // }
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
