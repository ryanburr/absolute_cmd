# Absolute Cmd

This project serves a NodeJS REST API for searching for and downloading audio files.

## Pre-reqs

To build and run this app locally you will need a few things:

1. Install [Node.js](https://nodejs.org/en/).
1. Install [VS Code](https://code.visualstudio.com/) or use an editor of your choice.
1. Install the [GitHub CLI](https://cli.github.com/).
1. Authenticate with GitHub with the following command.
    ```
    gh auth login
    ```
1. Fork the repository with the following command.
    ```
    gh repo fork ryanburr/absolute_cmd --clone=true --remote=true
    ```
1. Navigate to the project root.
    ```
    cd absolute_cmd
    ```
1. Install npm dependencies.
    ```
    npm install
    ```
1. Create a `.env` file in the root directory of this repository and add the following environment variables.
    ```
    FFMPEG_PATH="absolute/path/to/ffmpeg.exe"
    DOWNLOAD_PATH="absolute/path/to/download_folder"
    SPOTIFY_CLIENT_ID=<your-spotify-client-id>
    SPOTIFY_CLIENT_SECRET=<your-spotify-client-secret>
    SOUNDCLOUD_CLIENT_ID=<your-soundcloud-client-id>
    ```
    **FFMPEG_PATH** - the absolute path to the location of the ffmpeg executable or binary. If you don't have this, download it from [here](https://ffmpeg.org/), place it somewhere on your file system, and specify the path.
    **DOWNLOAD_PATH** - the absolute path to the location to place the downloaded files to.
    **SPOTIFY_CLIENT_ID** - the client id of a Spotify app. If you do not have one, you can create one [here](https://developer.spotify.com/dashboard/applications)
    **SPOTIFY_CLIENT_SECRET** - the client secret of the Spotify app mentioned above.
    **SOUNDCLOUD_CLIENT_ID** - 

## Running the Server

```
npm run build
npm start
```
