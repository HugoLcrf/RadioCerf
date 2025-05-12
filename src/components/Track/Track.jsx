import audioController from "../../utils/AudioController";
import scene from "../../webgl/Scene";
import s from "./Track.module.scss";
import useStore from "../../utils/store";

const Track = ({ title, cover, src, duration, artists, index }) => {
  const { setCurrentTrack, addToPlaylist } = useStore();

  const getSeconds = () => {
    const minutes = Math.floor(duration / 60);
    let seconds = Math.round(duration - minutes * 60);
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
  };

  const onClick = () => {
    scene.cover.setCover(cover);

    setCurrentTrack({
      title,
      album: { cover_small: cover },
      artist: { name: artists?.[0] || "Artiste inconnu" },
      preview: src,
    });
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation(); // pour éviter de lancer la lecture
    addToPlaylist({
      title,
      album: { cover_small: cover },
      artist: { name: artists?.[0] || "Artiste inconnu" },
      preview: src,
    });
  };

  return (
    <div className={s.track} onClick={onClick}>
      <span className={s.order}>{index + 1}</span>
      <div className={s.title}>
        <img src={cover} alt="" className={s.cover} />
        <div className={s.details}>
          <span className={s.trackName}>{title}</span>
        </div>
      </div>
      <span className={s.duration}>{getSeconds()}</span>
      <button className={s.addButton} onClick={handleAddToPlaylist}>➕</button>
    </div>
  );
};

export default Track;