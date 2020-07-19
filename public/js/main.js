function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(() => {
  const formEl = document.querySelector('#transcribe-form');
  if (!formEl) return;

  formEl.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const response = await fetch('/transcribe', {
      'Accept': 'text/plain',
      'Content-Type': 'multipart/form-data',
      method: 'POST',
      body: new FormData(formEl),
    });

    const blob = await response.blob();
    const file = window.URL.createObjectURL(blob);
    window.location.assign(file);

    console.log(response);

    formEl.reset();
  });
});
