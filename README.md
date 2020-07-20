# moneypenny

## Using from the command-line

You can use `curl` to pipe any media stream to your instance and have it transcribed.

### Usage with curl

``` sh
input_stream | curl -X POST -F "file=@-;" -F "language_code=en-US" -F "speaker_count=1" -F "interaction_type=PROFESSIONALLY_PRODUCED" http://localhost:3000/transcribe > output.srt
```

### Usage with youtube-dl

``` sh
youtube-dl -f 'bestaudio[ext=m4a]' -q --no-warning "https://www.youtube.com/watch?v={id}" -o - | curl -X POST -F "file=@-;" -F "language_code=en-US" -F "speaker_count=1" -F "interaction_type=PROFESSIONALLY_PRODUCED" http://localhost:3000/transcribe > {id}.srt
```

## Testing

### Mocking Google responses

``` js
// transcribe.js
await fsPromises.readFile(
  path.join(
    process.cwd(),
    '__recordings__',
    `sample-response${shouldDiarize ? '-diarize': ''}.json`
  )
)
.then((file) => JSON.parse(file))

// gcsStream
if (process.env.NODE_ENV !== 'production') {
  return { writeStream: new PassThrough(), promise: Promise.resolve() };
}
```
