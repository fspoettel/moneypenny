async function createDownloadUrl(response) {
  const blob = await response.blob();
  return window.URL.createObjectURL(blob);
}

function parseFilename(response) {
  const contentDisposition = response.headers.get('Content-Disposition');
  const parsedFileName = /.*;filename\*=utf-8''(.*)$/.exec(contentDisposition);
  const fileName = (parsedFileName && parsedFileName[1]) || 'transcript.txt';
  return decodeURIComponent(fileName);
}

function startDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
}

export async function download(response) {
  const url = await createDownloadUrl(response);
  startDownload(url, parseFilename(response));
  window.URL.revokeObjectURL(url);
}
