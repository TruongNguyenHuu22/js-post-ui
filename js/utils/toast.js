import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#42a5f5',
      },
    }).showToast();
  },
  success(message) {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#4caf50',
      },
    }).showToast();
  },
  error(message) {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#ef5350',
      },
    }).showToast();
  },
};
