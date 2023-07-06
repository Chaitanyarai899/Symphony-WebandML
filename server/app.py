from flask import Flask, request, jsonify
from flask_cors import CORS
from webControllers import recommend_songs, recommend_playlist
import pandas as pd

app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app)

data = pd.read_csv("./data/data.csv")

@app.route('/start', methods=['GET'])
def start():
    print("Server starting")
    return "srver started"

@app.route('/recommend', methods=['POST'])
def recommend():
    input = request.get_json()
    song_name = input['name']
    song_year = input['year']

    print(song_year)

    recommendations = recommend_songs([{'name': song_name, 'year':song_year}], data, n_songs=10)
    return jsonify(recommendations)

@app.route('/recommend_playlist', methods=['POST'])
def recommend_playlist_route():
    input = request.get_json()
    playlist_link = input["playlist_link"]
    print(playlist_link, "Here")

    if not playlist_link:
        return jsonify({'error': 'Invalid request. Playlist link not provided.'}), 400
    

    recommendations = recommend_playlist(playlist_link, data,n_songs=20)

    return jsonify(recommendations)


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
