import postApi from './api/postApi';
import { ImageSource } from './constants';
import { toast } from './utils';
import { initPostForm } from './utils/post-form';

function removeUnusedField(formValues) {
  const payload = { ...formValues };

  //imageSrc = 'picsum' ->  remove image
  //imageSrc = 'upload' ->  remove imageUrl

  if (payload.imageSource === ImageSource.PICSUM) {
    delete payload.image;
  } else {
    delete payload.imageUrl;
  }

  //remove  imageSource
  delete payload.imageSource;

  //remove id if it's add mode
  if (!payload.id) delete payload.id;
  return payload;
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handlePostFormSubmit(formValues) {
  try {
    const payload = removeUnusedField(formValues);
    const formData = jsonToFormData(payload);

    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);
    toast.success('Save post successfully!');
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 1000);
  } catch (error) {
    console.log('failed to save post', error);
    toast.error(`Error: ${error.message}`);
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
