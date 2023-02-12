import { randomNumber, setBackgroundImage, setFieldValue, setTextContent } from './common';
import * as yup from 'yup';

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
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }
  return formValues;
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least 2 words of 3 character',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageUrl: yup
      .string()
      .required('Please random a background image')
      .url('Please enter a valid URL'),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function validatePostForm(form, formValues) {
  try {
    //reset previous error
    ['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''));

    //start validating
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    const errorLog = {};
    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        //ignore if the field id already logged
        if (errorLog[name]) continue;

        //set field error and mark as logged
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }
  //add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving';
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.textContent = 'Save';
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage');
  if (!randomButton) return;
  randomButton.addEventListener('click', () => {
    const imgUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;
    //set image usl input, background
    setFieldValue(form, '[name="imageUrl"]', imgUrl);
    setBackgroundImage(document, '#postHeroImage', imgUrl);
  });
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id=imageSource]');

  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}

function initRadioImage(form) {
  const radioList = form.querySelectorAll('[name=imageSource]');

  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value));
  });
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  let submitting = false;
  setFormValues(form, defaultValues);

  //init event
  initRandomImage(form);

  //init event
  initRadioImage(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    //show loading/ disabled btn
    showLoading(form);
    submitting = true;

    //get form value
    const formValues = getFormValue(form);
    formValues.id = defaultValues.id;
    const isValid = await validatePostForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);

    hideLoading(form);
    submitting = false;
  });
}
