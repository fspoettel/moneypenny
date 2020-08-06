# moneypenny

> Automatic transcription tool built around the Google Speech-To-Text API

![Screenshot_2020-08-06 Moneypenny](https://user-images.githubusercontent.com/1682504/89548385-7f8b8c80-d7f6-11ea-9ada-e05fa23ee3b6.png)

## Self-Hosting

This service is self-hostable via [dokku](http://dokku.viewdocs.io/dokku/).

It requires the following addons to be present and linked to the app:

 * [redis](https://github.com/dokku/dokku-redis)
 * [postgres](https://github.com/dokku/dokku-postgres)

You will also have to add the content of `nginx.example.conf` to `/home/dokku/moneypenny/nginx.conf.d/upload.conf` to increase NGINX upload timeouts if you want to allow uploading larger files.

After that, you can connect to your container and run `yarn add-user --email {an_email} --password {password_will_be_hashed}` to add the first user to the service. (**TODO:** Not implemented yet)

## Setting up Google Cloud

This service uses the _Google Cloud Speech-To-Text_ API to transcribe media files. This API requires you to upload media files to _Google Cloud Storage_ before being able to transcribe them. In order to setup your _Google Cloud_ account, you'll need to:

 * Activate the `Speech-To-Text API` for the Google Cloud project you are using for this service (env: `GOOGLE_PROJECT_ID`)
 * Create a private Google Cloud Storage bucket (env: `GOOGLE_BUCKET`)
 * Create a service user  with at least the following set of permissions: (env `GOOGLE_CLIENT_EMAIL` & `GOOGLE_PRIVATE_KEY`)
  - `storage.objects.create`
  - `storage.objects.delete`
  - `storage.objects.get`
  - `storage.objects.list`

After setting the credentials as environment variables via `dokku config:set` (see above and `.env.example`), you should be able yo use the service.

## Development

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
