const fileInput = document.querySelector('input[type=file]');
const checkMarkIcon = document.querySelector('.check-mark');

fileInput.addEventListener('change', (event) => {
  checkMarkIcon.classList[event.target.files.length > 0 ? 'add' : 'remove']('filled');
});