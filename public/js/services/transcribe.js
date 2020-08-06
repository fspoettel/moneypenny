
export async function postTranscribe (formData) {
  const response = await fetch('/transcribe', {
    method: 'POST',
    body: formData
  })

  if (response.status >= 200 && response.status < 300) return response
  throw response
}
