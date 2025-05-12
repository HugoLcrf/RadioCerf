import { useState, useEffect } from "react";
import useStore from "../../utils/store";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaRandom,
  FaRedo,
} from "react-icons/fa";
import audioController from "../../utils/AudioController";
import s from "./PlayerControls.module.scss";

const PlayerControls = () => {
  const { currentTrack, tracks, setCurrentTrack } = useStore();

  // États audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false); 

  //Gérer le temps et fin de piste
  useEffect(() => {
    const audio = audioController.audio;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (!audio.loop) playNextTrack();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack]);

  //Lecture automatique quand une nouvelle track est définie
  useEffect(() => {
    const audio = audioController.audio;
    if (!audio || !currentTrack?.preview) return;

    audio.src = currentTrack.preview;
    audio.loop = isLooping;
    audio.play();
    setIsPlaying(true);
  }, [currentTrack, isLooping]);

  //Activer/désactiver la boucle
  useEffect(() => {
    const audio = audioController.audio;
    if (audio) audio.loop = isLooping;
  }, [isLooping]);

  //Lecture / pause
  const togglePlay = () => {
    const audio = audioController.audio;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  //Navigation dans la timeline
  const handleSeek = (e) => {
    const audio = audioController.audio;
    audio.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  //Musique précédente
  const playPreviousTrack = () => {
    if (!tracks || !currentTrack) return;
    const index = tracks.findIndex((t) => t.title === currentTrack.title);
    const prevIndex = (index - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
  };

  //Musique suivante
  const playNextTrack = () => {
    if (!tracks || !currentTrack) return;
    let nextIndex;
    if (isShuffling) {
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (tracks[nextIndex].title === currentTrack.title);
    } else {
      const index = tracks.findIndex((t) => t.title === currentTrack.title);
      nextIndex = (index + 1) % tracks.length;
    }
    setCurrentTrack(tracks[nextIndex]);
  };

  const formatTime = (t) => {
    if (!t) return "0:00";
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (!currentTrack) return null;

  return (
    <div className={s.controls}>
      {/*Infos musique */}
      <div className={s.nowPlaying}>
        <img
          src={currentTrack.album.cover_small}
          alt="cover"
          className={s.cover}
        />
        <div className={s.info}>
          <div className={s.title}>{currentTrack.title}</div>
          <div className={s.artist}>{currentTrack.artist.name}</div>
        </div>
      </div>

      {}
      <button onClick={playPreviousTrack}><FaBackward /></button>
      <button onClick={togglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <button onClick={playNextTrack}><FaForward /></button>
      <button
        onClick={() => setIsShuffling(!isShuffling)}
        className={isShuffling ? s.active : ""}
      >
        <FaRandom />
      </button>
      <button
        onClick={() => setIsLooping(!isLooping)}
        className={isLooping ? s.active : ""}
      >
        <FaRedo />
      </button>

      {/* Timeline */}
      <div className={s.timeline}>
        <span className={s.time}>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className={s.slider}
        />
        <span className={s.time}>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default PlayerControls;
