# Spotify Account Export

This is a simply tool developed in JavaScript which is able to export *Music Library, Albums, Followed Artists and Playlists* from an account to another.

You **must** know each one of the *OAuth Tokens* of the accounts to be able to use the tool.

You can choose which item to export and which not. You can also *stop* the process if you want.

(Note: If the process gets stopped, the data that was already imported **will not get removed**)


# How to use

1. Connect to the [**Spotify Account Export**](http://sasopenna.github.io/spotify/) page.
2. Login into the **Spotify** account you want to export. [(here)](https://accounts.spotify.com/it-IT/login)
3. Go to [this](https://developer.spotify.com/web-api/console/get-current-user/token?scope=user-read-private&scope=user-read-birthdate&scope=user-read-email&scope=playlist-read-private&scope=playlist-read-collaborative&scope=playlist-modify-public&scope=playlist-modify-private&scope=user-library-read&scope=user-library-modify&scope=user-follow-read&scope=user-follow-modify&scope=user-top-read&scope=user-read-playback-state&scope=user-read-recently-played&scope=user-read-currently-playing&scope=user-modify-playback-state) link and copy the **OAuth Token**.
4. Paste the token into the field under **Get Infos from this Account** in the **Spotify Account Export** site.
5. Press *ENTER* or click <img src="https://raw.githubusercontent.com/sasopenna/spotify-account-export/master/img/search.png" width="14px"> to initialize the informations fetching process.
6. Once it's finished, disconnect from the previous account by clicking [here](https://www.spotify.com/it/logout/) and login into the new account by clicking [here](https://accounts.spotify.com/it-IT/login).
7. Go to [this](https://developer.spotify.com/web-api/console/get-current-user/token?scope=user-read-private&scope=user-read-birthdate&scope=user-read-email&scope=playlist-read-private&scope=playlist-read-collaborative&scope=playlist-modify-public&scope=playlist-modify-private&scope=user-library-read&scope=user-library-modify&scope=user-follow-read&scope=user-follow-modify&scope=user-top-read&scope=user-read-playback-state&scope=user-read-recently-played&scope=user-read-currently-playing&scope=user-modify-playback-state) link and copy the **OAuth Token**.
8. Paste the token into the field under **Send Infos to this Account** in the **Spotify Account Export** site.
9. Press *ENTER* or click <img src="https://raw.githubusercontent.com/sasopenna/spotify-account-export/master/img/search.png" width="14px"> to initialize the informations fetching process.
10. Click <img src="https://raw.githubusercontent.com/sasopenna/spotify-account-export/master/img/add.png" width="14px"> to add an item and click <img src="https://raw.githubusercontent.com/sasopenna/spotify-account-export/master/img/remove.png" width="14px"> to remove an item.
11. Click **Send Here** to initialize the process of exporting.

## JSON
- ### Export JSON
1. Login into the **Spotify** account you want to export. [(here)](https://accounts.spotify.com/it-IT/login)
2. Go to [this](https://developer.spotify.com/web-api/console/get-current-user/token?scope=user-read-private&scope=user-read-birthdate&scope=user-read-email&scope=playlist-read-private&scope=playlist-read-collaborative&scope=playlist-modify-public&scope=playlist-modify-private&scope=user-library-read&scope=user-library-modify&scope=user-follow-read&scope=user-follow-modify&scope=user-top-read&scope=user-read-playback-state&scope=user-read-recently-played&scope=user-read-currently-playing&scope=user-modify-playback-state) link and copy the **OAuth Token**.
3. Paste the token into the field under **Get Infos from this Account** in the **Spotify Account Export** site.
4. Press *ENTER* or click <img src="https://raw.githubusercontent.com/sasopenna/spotify-account-export/master/img/search.png" width="14px"> to initialize the informations fetching process.
5. Once it's finished, click **Export JSON** to save the JSON file of that account.
- ### Upload JSON
1. Click on **Upload JSON** and select the JSON file with the account informations.
2. If you want to export this JSON file into another account, go to [**How to use**](https://github.com/sasopenna/spotify-account-export/blob/master/README.md#how-to-use) and follow point number 6.
