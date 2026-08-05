// frontend/src/components/Toast.jsx
import Swal from 'sweetalert2';

const ToastMixin = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const toast = {
  success: (title, text = '') => {
    ToastMixin.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#4f46e5'
    });
  },
  error: (title, text = '') => {
    ToastMixin.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#db2777'
    });
  },
  warning: (title, text = '') => {
    ToastMixin.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonColor: '#7e57c2'
    });
  },
  info: (title, text = '') => {
    ToastMixin.fire({
      icon: 'info',
      title: title,
      text: text,
      confirmButtonColor: '#4f46e5'
    });
  }
};

export default toast;
