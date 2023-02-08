import postApi from './api/postApi';

(async () => {
  console.log('add edit page');
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    const defaultValues = !!postId
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        };
  } catch (error) {
    console.log('failed to fetch post details:', error);
  }
})();
