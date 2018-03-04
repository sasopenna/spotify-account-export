# Spotify Account Export

This is a simply tool developed in JavaScript which is able to export *Music Library, Albums, Followed Artists and Playlists* from an account to another.

You **must** know each one of the *OAuth Tokens* of the accounts to be able to use the tool.

You can choose which item to export and which not. You can also *stop* the process if you want.

(Note: If the process gets stopped, the data that was already imported **will not get removed**)


# How to use

1. Connect to the [**Spotify Account Export**](http://sasopenna.github.io/spotify/) page.
2. Login into the **Spotify** account you want to export. [(here)](https://accounts.spotify.com/it-IT/login)
3. Go to [this](https://developer.spotify.com/web-api/console/get-current-user/) link and click **GET OAUTH TOKEN**, allow **everything** and copy the token.
4. Paste the token into the field under **Get Infos from this Account** in the **Spotify Account Export** site.
5. Press *ENTER* to initialize the informations fetching process.
6. Once it's finished, disconnect from the previous account by clicking [here](https://www.spotify.com/it/logout/) and login into the new account by clicking [here](https://accounts.spotify.com/it-IT/login).
7. Go to [this](https://developer.spotify.com/web-api/console/get-current-user/) link and click **GET OAUTH TOKEN**, allow **everything** and copy the token.
8. Paste the token into the field under **Send Infos to this Account** in the **Spotify Account Export** site.
9. Press *ENTER* to initialize the informations fetching process.
10. Click <img src="https://raw.githubusercontent.com/sasopenna/spotify-account-export/master/spotify/img/add.png" width="10px"> to add an item and click <img src="https://raw.githubusercontent.com/sasopenna/spotify-account-export/master/spotify/img/remove.png" width="10px"> to remove an item.
11. Click **Send Here** to initialize the process of exporting.
