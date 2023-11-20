import React, { useState, useEffect } from "react";
import "../App.css";
import SearchIcon from "../search.svg";
import MovieCard from "../MovieCard";
import "../index.css";
import Dashboard from "./Dashboard";

const API_URL = "https://symphonyserver-13q2.onrender.com/recommend";
const API_URL_PLAYLIST = "https://symphonyserver-13q2.onrender.com/recommend_playlist";

const Webapp = () => {
  const [searchTerm, setSearchTerm] = useState("Gravity");
  const [year, setYear] = useState(2006);
  const [movies, setMovies] = useState([]);
  const [playlistLink, setPlaylistLink] = useState("");
  const [isSongRecommendation, setIsSongRecommendation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false); // New state

  useEffect(() => {
    searchMovies("Gravity");
  }, []);

  const searchMovies = async (title) => {
    // Close the dashboard
    setIsDashboardOpen(false);
  
    const capitalizedTitle = title
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  
    const body = {
      name: capitalizedTitle,
      year: parseInt(year),
    };
  
    setIsLoading(true);
  
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  
    const data = await response.json();
  
    setMovies(data);
    setIsLoading(false);
  };
  
  const searchPlaylist = async (link) => {
    // Close the dashboard
    setIsDashboardOpen(false);
  
    const body = {
      playlist_link: link,
    };
  
    setIsLoading(true);
  
    const response = await fetch(API_URL_PLAYLIST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  
    const data = await response.json();
  
    setMovies(data);
    setIsLoading(false);
  };
  

  const handleSongRecommendation = () => {
    setIsSongRecommendation(true);
  };

  const handlePlaylistRecommendation = () => {
    setIsSongRecommendation(false);
  };

  const toggleDashboard = () => {
    setIsDashboardOpen((prevState) => !prevState);
  };

  return (
    <div className="app">
      <div className="empty">
        <h1 className="mb-4 text-2xl">Spotify Recommendations for You</h1>
      </div>

      <div className="flex gap-4">
  <button
    onClick={handleSongRecommendation}
    className="group relative h-12 w-48 overflow-hidden rounded-lg bg-white text-lg shadow"
  >
    <div className="absolute inset-0 w-3 bg-green-600 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
    <span className="relative text-black group-hover:text-black font-bold">Recommend Songs</span>
  </button>
  <button
    onClick={handlePlaylistRecommendation}
    className="group relative h-12 w-48 overflow-hidden rounded-lg bg-white text-lg shadow"
  >
    <div className="absolute inset-0 w-3 bg-green-600 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
    <span className="relative text-black group-hover:text-black font-bold">Recommend Playlist</span>
  </button>
  <button
    onClick={toggleDashboard}
    className="group relative h-12 w-48 overflow-hidden rounded-lg bg-white text-lg shadow"
  >
    <div className="absolute inset-0 w-3 bg-green-600 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
    <span className="relative text-black group-hover:text-black font-bold"> {isDashboardOpen ? "Close Dashboard" : "View Dashboard"}</span>
  </button>
</div>


      

      {isSongRecommendation ? (
        <div className="search">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter song name"
            className="mr-2"
          />
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year of Release"
            className="mr-2"
          />
          <img
            src={SearchIcon}
            alt="search"
            onClick={() => searchMovies(searchTerm)}
            className="cursor-pointer"
          />
        </div>
      ) : (
        <div className="search">
          <input
            value={playlistLink}
            onChange={(e) => setPlaylistLink(e.target.value)}
            placeholder="Enter playlist link"
          />
          <img
            src={SearchIcon}
            alt="search"
            onClick={() => searchPlaylist(playlistLink)}
            className="cursor-pointer"
          />
        </div>
      )}
        {isDashboardOpen && <Dashboard />}
      {isLoading ? (
        <div className="loader">
          <div className="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-8 h-64 w-64"></div>
        </div>
      ) : movies?.length > 0 ? (
        <div className="container">
          <div className="empty">
            <h2>Here are the recommendations for you!</h2>
          </div>
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No Such Song in Database! Please try another one! We recommend English One's.</h2>
        </div>
      )}
      
    </div>
  );
};

export default Webapp;
