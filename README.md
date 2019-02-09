# yt-upload
A node package to upload videos on youtube from your terminal

# Install
```console
$ npm i -g yt-upload
```

# Getting Started
Follow the (Turn on the YouTube Data API, only a to g) steps shown here **https://developers.google.com/youtube/v3/quickstart/nodejs**

Move the downloaded file to (C:\Users\<yourpcusername>) and rename it **client_secret.json**.

# Usage
```console
$ yt-upload -u
```
**Path** path to the video you want to upload (path/to/video.mp4)

**Title** title of the video

**Description** Description of the video

**Visiblity** video visiblity (public/private/unlisted)


> If you are using this for the first time it will ask you to authorize your application, just follow the onscreen authorization flow.

# Commands
To upload videos
```console
$ yt-upload -u or --upload
```

To check version
```console
$ yt-upload -v or --version
```

For Help
```console
$ yt-upload -h or --help
```

# Features
✔️ upload video

# Upcoming Features
❌ update a video

❌ get videos from a channel

❌ get or comment on video

❌ like video

❌ change thumbnail of a video

❌ search for video

❌ get subscriptions

❌ subscribe or unsubscribe to a channel

❌ play video in terminal (only voice)
