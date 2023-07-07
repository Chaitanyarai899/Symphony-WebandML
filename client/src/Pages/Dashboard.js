import React, { useEffect, useRef } from 'react';

const Dashboard = () => {
  const ref = useRef(null);
  const url = "https://public.tableau.com/views/Spotify-EDA-Dashboard/SpotifyPopularityByGenre?:language=en-US&:display_count=n&:origin=viz_share_link";

  useEffect(() => {
    const initViz = () => {
      const options = {
        device: "desktop"
      };
      new window.tableau.Viz(ref.current, url, options);
    };
    initViz();
  }, []);

  return <div ref={ref} style={{ width: '100%', margin: 'auto' }}></div>;
};

export default Dashboard;