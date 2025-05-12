import { useEffect, useState } from "react";
import Track from "../Track/Track";
import useStore from "../../utils/store";
import { fetchMetadata } from "../../utils/utils";
import TRACKS from "../../utils/TRACKS";
import fetchJsonp from "fetch-jsonp";
import s from "./Tracks.module.scss";

const Tracks = () => {
  const [showTracks, setShowTracks] = useState(false);
  const [input, setInput] = useState("");
  const { tracks, setTracks } = useStore();

  useEffect(() => {
    if (tracks.length > TRACKS.length) {
      setShowTracks(true);
    }
  }, [tracks]);

  useEffect(() => {
    fetchMetadata(TRACKS, tracks, setTracks);
  }, []);

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && input !== "") {
      getSongs(input);
    }
  };

  const getSongs = async (userInput) => {
    let response = await fetchJsonp(
      `https://api.deezer.com/search?q=${userInput}&output=jsonp`
    );

    if (response.ok) {
      response = await response.json();
      const _tracks = [...tracks];
      response.data.forEach((result) => {
        _tracks.push(result);
      });
      setTracks(_tracks);
      console.log(_tracks);
    }
  };

  return (
    <>
      <div className={s.toggleTracks} onClick={() => setShowTracks(!showTracks)}>
        tracklist
      </div>

      <section className={`${s.wrapper} ${showTracks ? s.wrapper_visible : ""}`}>
        <div className={s.tracks}>
          <div className={s.header}>
            <span className={s.order}>#</span>
            <span className={s.title}>Titre</span>
            <span className={s.duration}>Durée</span>
          </div>

          {tracks.map((track, i) => (
            <Track
              key={track.title + i}
              title={track.title}
              duration={track.duration}
              cover={track.album.cover_xl}
              src={track.preview}
              index={i}
            />
          ))}
        </div>

        <div className={s.searchRow}>
          <input
            type="text"
            placeholder="Chercher un artiste"
            className={s.searchInput}
            onKeyDown={onKeyDown}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className={s.resetButton}
            onClick={() => {
              setInput("");
              setTracks([]);
            }}
            title="Réinitialiser"
          >
            ↻
          </button>
        </div>
      </section>
    </>
  );
};

export default Tracks;
