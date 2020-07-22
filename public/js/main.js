// should work without JS, progressive enhancement only

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

async function postForm(formData) {
  const response = await fetch('/transcribe', {
    method: 'POST',
    body: formData,
  });

  if (response.status >= 200 && response.status < 300) return response;
  throw response;
}

async function downloadResponse(response) {
  const fileName = /.*; filename=(.*)$/.exec(response.headers.get('Content-Disposition'))[1];
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

// this is checked on the server as well but might take a long time
// Firefox throws a `NetworkError` when the BE connection is closed, re-using logic
function checkFileSize(fileInputEl) {
  const file = fileInputEl.files[0];
  const maxSize = fileInputEl.dataset.limit;

  const size = (file.size/1024/1024).toFixed(4); // MB

  if (size > Number.parseInt(maxSize, 10)) {
    throw new TypeError('NetworkError: File is too large');
  }
}

ready(() => {
  let originalText;

  const el = {
    form: document.querySelector('#transcribe-form'),
    submit: document.querySelector('#submit-btn'),
    spinner: document.querySelector('.spinner'),
    file: document.querySelector('#file'),
    fileLabel: document.querySelector('#file-label'),
    output: document.querySelector('.form-output'),
    outputError: document.querySelector('.form-output .error'),
  };

  if (!el.form) return;

  const resetOutput = () => {
    if (el.output.classList.contains('is-active')) {
      el.outputError.innerHTML = '';
      el.output.classList.remove('is-active');
    }
  };

  const resetPostState = () => {
    if (el.spinner.classList.contains('is-active')) {
      el.spinner.classList.remove('is-active');
    }

    if (el.submit.hasAttribute('disabled')) {
      el.submit.removeAttribute('disabled');
    }
  };

  const resetForm = () => {
    if (!el.submit.hasAttribute('disabled')) {
      el.submit.setAttribute('disabled', '');
    }

    if (originalText) {
      el.fileLabel.innerHTML = originalText;
    }

    el.form.reset();
  };

  // reset on refresh
  resetForm();

  el.file.addEventListener('change', (evt) => {
    originalText = el.fileLabel.innerHTML;
    el.fileLabel.innerHTML = evt.target.files[0].name;
    el.submit.removeAttribute('disabled');
    resetOutput();
  });

  el.form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    resetOutput();
    el.submit.setAttribute('disabled', '');
    el.spinner.classList.add('is-active');

    try {
      checkFileSize(el.file);
      const response = await postForm(new FormData(el.form));
      // TODO: this might fail, add manual way to download
      await downloadResponse(response);
      resetPostState();
      resetForm();
    } catch (err) {
      if (err.message && err.message.includes('NetworkError')) {
        el.outputError.innerHTML = `Error: File is too large`;
      } else if (err.json) {
        try {
          const body = await err.json();
          el.outputError.innerHTML = `Error: ${body.message}`;
        } catch (err) {
          el.outputError.innerHTML = `Error: Internal Server Error`;
        }
      } else {
        el.outputError.innerHTML = `Error: ${err.message}`;
      }

      el.output.classList.add('is-active');
    } finally {
      resetPostState();
    }

    return false;
  });
});
