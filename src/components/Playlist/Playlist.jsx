import { useEffect, useState } from "react";
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

  const playTrack = (track, index) => {
    if (!track || !track.preview) return;

    // Met à jour le store
    setCurrentTrack(track);
    setCurrentTrackIndex(index);

    // Joue le son immédiatement
    audioController.audio.src = track.preview;
    audioController.audio.play();

    // Affiche la cover dans la scène
    scene.cover.setCover(track.album.cover_small);
  };

  // Gère la lecture automatique à la fin de piste
  useEffect(() => {
    const el = audioController.audio;
    if (!el) return;

    const handleEnded = () => {
      const nextIndex = currentTrackIndex + 1;
      if (nextIndex < playlist.length) {
        playTrack(playlist[nextIndex], nextIndex);
      }
    };

    el.addEventListener("ended", handleEnded);
    return () => {
      el.removeEventListener("ended", handleEnded);
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