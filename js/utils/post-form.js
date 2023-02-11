import { setBackgroundImage, setFieldValue, setTextContent } from './common';

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  //hidden field

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl);
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValue(form) {
  const formValues = {};
  //s1: query each input abd add to formValues object
  //   ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //     const field = form.querySelector(`[name=${name}]`);
  //     if (field) formValues[name] = field.value;
  //   });

  //s2: using form data;
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }
  return formValues;
}

function getTitleError(form) {
  const titleElement = form.querySelector('[name="title"]');

  if (!titleElement) return;

  //required
  if (titleElement.validity.valueMissing) {
    return 'Please enter tittle';
  }
  //at least two word
  if (titleElement.value.split(' ').filter((x) => !!x && x.length >= 3).length < 2) {
    return 'Please enter at least 2 words of 3 character';
  }

  return '';
}
function getAuthorError(form) {
  const authorElement = form.querySelector('[name="author"]');

  if (!authorElement) return;

  //required
  if (authorElement.validity.valueMissing) {
    return 'Please enter author';
  }
  return '';
}
function validateForm(form, formValues) {
  //get error
  const errors = {
    title: getTitleError(form),
    author: getAuthorError(form),
  };
  //set error
  for (const key in errors) {
    const element = form.querySelector(`[name="${key}"]`);
    if (element) {
      element.setCustomValidity(errors[key]);
      setTextContent(element.parentElement, '.invalid-feedback', errors[key]);
    }
  }
  //add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}
export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValues(form, defaultValues);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    //get form value
    const formValues = getFormValue(form);
    console.log('formValue', formValues);
    //validation
    //trigger submit callback
    //otherwise show error
    if (!validateForm(form, formValues)) return;
  });
}
