export function createDownloadUrlFromString (str) {
  const blob = new Blob([str], { type: 'text/plain' })
  return window.URL.createObjectURL(blob)
}

function startDownload (url, filename) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
}

export async function downloadString (str, filename) {
  const url = await createDownloadUrlFromString(str)
  startDownload(url, filename)
  window.URL.revokeObjectURL(url)
}
