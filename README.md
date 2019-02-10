# yt-upload
A node package to upload videos on youtube from your terminal

# Install
```console
$ npm i -g yt-upload
```

# Getting Started
Follow the (Turn on the YouTube Data API, only a to g) steps shown here **https://developers.google.com/youtube/v3/quickstart/nodejs**

Move the downloaded file to **(C:\Users\<*yourpcusername*>)** and rename it **client_secret.json**.

# Usage
```console
$ yt-upload <command>
```

> If you are using this for the first time it will ask you to authorize your application, just follow the onscreen authorization flow.

# Commands
To upload videos
```console
$ yt-upload -u or --upload
```

To update video
```console
$ yt-upload -c or --change
```

To get subscriber count
```console
$ yt-upload -s or --subscribers
```

To search for a video
```console
$ yt-upload -q or --searchvideo
```

To check version
```console
$ yt-upload -v or --version
```

Help
```console
$ yt-upload -h or --help
```

# Features
✔️ upload video

✔️ update a video

✔️ get subscribers

✔️ search for video

# Upcoming Features 

❌ get or comment on video

❌ like video

❌ change thumbnail of a video

❌ subscribe or unsubscribe to a channel

❌ play video in terminal (maybe)
