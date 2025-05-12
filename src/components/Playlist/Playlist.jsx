import { useRef, useEffect, useState } from "react";
import useStore from "../../utils/store";
import audioController from "../../utils/AudioController";
import scene from "../../webgl/Scene";
import s from "./Playlist.module.scss";

const Playlist = () => {
  const [visible, setVisible] = useState(false);
  const {
    playlist,
    removeFromPlaylist,
    setCurrentTrack,
    currentTrackIndex,
    setCurrentTrackIndex,
  } = useStore();

  const audio = useRef(null);

  useEffect(() => {
    audio.current = audioController.audio;
  }, []);

  const playTrack = (track, index) => {
    if (!audio.current) return;
    audioController.play(track.preview);
    scene.cover.setCover(track.album.cover_small);
    setCurrentTrack(track);
    setCurrentTrackIndex(index);
  };

  useEffect(() => {
    if (!audio.current) return;

    const handleEnded = () => {
      const nextIndex = currentTrackIndex + 1;
      if (nextIndex < playlist.length) {
        playTrack(playlist[nextIndex], nextIndex);
      }
    };

    audio.current.addEventListener("ended", handleEnded);
    return () => {
      audio.current.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex, playlist]);

  return (
    <>
      <button className={s.toggleButton} onClick={() => setVisible(!visible)}>
        {visible ? "❌" : "📂"}
      </button>

      {visible && (
        <div className={s.playlist}>
          <h2 className={s.title}>🎵 Playlist</h2>

          {playlist.length === 0 ? (
            <p className={s.empty}>Aucune musique pour l’instant</p>
          ) : (
            <ul className={s.list}>
              {playlist.map((track, i) => (
                <li key={i} className={s.item}>
                  <img
                    src={track.album.cover_small}
                    alt=""
                    className={s.cover}
                  />
                  <div className={s.info}>
                    <strong>{track.title}</strong>
                    <small>{track.artist.name}</small>
                  </div>
                  <button onClick={() => playTrack(track, i)}>▶️</button>
                  <button onClick={() => removeFromPlaylist(i)}>❌</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default Playlist;