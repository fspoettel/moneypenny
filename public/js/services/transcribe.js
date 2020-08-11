export async function postTranscribe (formData) {
  const response = await fetch('/transcribe', {
    method: 'POST',
    body: formData
  })

  if (response.status >= 200 && response.status < 300) return response
  // Errors are sent as JSON responses
  const error = await response.json()
  throw error
}
