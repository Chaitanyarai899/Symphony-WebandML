import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from collections import defaultdict
import numpy as np
import pandas as pd
import seaborn as sns
import plotly.express as px
import pickle

client_credentials_manager = SpotifyClientCredentials(client_id="87ea1436a0fb4ae89509f65aaca931e6", client_secret="ea90fa0ed9f94ac1a93d3b76d001be36")
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

data = pd.read_csv("./data/data.csv")

def find_song(name, year):
    song_data = defaultdict()
    results = sp.search(q= 'track: {} year: {}'.format(name,year), limit=1)
    if results['tracks']['items'] == []:
        return None

    results = results['tracks']['items'][0]
    track_id = results['id']
    audio_features = sp.audio_features(track_id)[0]

    song_data['name'] = [name]
    song_data['year'] = [year]
    song_data['explicit'] = [int(results['explicit'])]
    song_data['duration_ms'] = [results['duration_ms']]
    song_data['popularity'] = [results['popularity']]

    for key, value in audio_features.items():
        song_data[key] = value

    return pd.DataFrame(song_data)

from collections import defaultdict
from scipy.spatial.distance import cdist

number_cols = ['valence', 'year', 'acousticness', 'danceability', 'duration_ms', 'energy', 'explicit',
 'instrumentalness', 'key', 'liveness', 'loudness', 'mode', 'popularity', 'speechiness', 'tempo']


def get_song_data(song, spotify_data):
    
    try:
       song_data = spotify_data[(spotify_data['name'] == song['name']) & (spotify_data['year'] == song['year'])].iloc[0]
       return song_data
    
    except IndexError:
        return find_song(song['name'], song['year'])
        

def get_mean_vector(song_list, spotify_data):
    song_vectors = []
    invalid_songs = []

    for song in song_list:
        song_data = get_song_data(song, spotify_data)
        if song_data is None:
            print('Warning: {} does not exist in Spotify or in the database'.format(song['name']))
            invalid_songs.append(song['name'])
            continue

        song_vector = song_data[number_cols].values
        if song_vector.shape != (len(number_cols),):
            print('Warning: Invalid data for song {}'.format(song['name']))
            invalid_songs.append(song['name'])
            continue

        song_vectors.append(song_vector)

    if len(song_vectors) == 0:
        print('Error: None of the songs have valid data')
        return None

    song_matrix = np.array(list(song_vectors))
    return np.mean(song_matrix, axis=0)



def flatten_dict_list(dict_list):
    
    flattened_dict = defaultdict()
    for key in dict_list[0].keys():
        flattened_dict[key] = []
    
    for dictionary in dict_list:
        for key, value in dictionary.items():
            flattened_dict[key].append(value)
            
    return flattened_dict

with open('song_cluster_pipeline.pkl', 'rb') as file:
    song_cluster_pipeline = pickle.load(file)

with open('pca_pipeline.pkl', 'rb') as file:
    pca_pipeline = pickle.load(file)


def recommend_songs(song_list, spotify_data, n_songs=3):
    metadata_cols = ['name', 'year', 'artists', 'cover_image']
    song_dict = flatten_dict_list(song_list)

    song_center = get_mean_vector(song_list, spotify_data)
    if song_center is None:
        return []

    scaler = song_cluster_pipeline.steps[0][1]
    scaled_data = scaler.transform(spotify_data[number_cols])
    scaled_song_center = scaler.transform(song_center.reshape(1, -1))
    distances = cdist(scaled_song_center, scaled_data, 'cosine')
    index = list(np.argsort(distances)[:, :n_songs][0])

    rec_songs = spotify_data.iloc[index]
    rec_songs = rec_songs[~rec_songs['name'].isin(song_dict['name'])]

    cover_images = []
    for _, song in rec_songs.iterrows():
        cover_images.append(get_cover_image(song['id']))

    rec_songs['cover_image'] = cover_images

    return rec_songs[metadata_cols].to_dict(orient='records')



def get_cover_image(track_id):
    track_info = sp.track(track_id)
    images = track_info['album']['images']
    if len(images) > 0:
        return images[0]['url']
    else:
        return None
    
def recommend_playlist(playlist_link, spotify_data, n_songs=15):
    # Extract playlist ID from the link
    playlist_id = playlist_link.split('/')[-1]

    # Get the playlist tracks using the Spotify API
    playlist_tracks = sp.playlist_tracks(playlist_id)

    # Extract the track names and years from the playlist
    song_list = []
    for track in playlist_tracks['items']:
        song_name = track['track']['name']
        song_year = track['track']['album']['release_date'][:4]  # Extract year from the release date
        song_list.append({'name': song_name, 'year': int(song_year)})

    # Call the recommend_songs function with the extracted song list
    recommendations = recommend_songs(song_list, spotify_data, n_songs)
    return recommendations


