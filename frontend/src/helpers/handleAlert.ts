import Swal from 'sweetalert2';

const handleAlert = (success: boolean, message: string) => {
  Swal.fire({
    icon: success ? 'success' : 'error',
    title: success ? 'Success' : 'Error',
    text: message,

    customClass: {
      popup: 'my-swal-popup',
      title: 'my-swal-title',
      confirmButton: 'my-swal-button',
    },

    confirmButtonText: success ? 'Ok' : 'Try Again',
    confirmButtonColor: success ? '#00A645' : '#ef4444',
  });
};
export default handleAlert;
