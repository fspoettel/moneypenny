export function ready (fn) {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

export function isFileTooLarge (file, limitMb) {
  if (!file || !file.size) return false
  const size = (file.size / 1024 / 1024).toFixed(4) // MB
  return size > Number.parseInt(limitMb, 10)
}
