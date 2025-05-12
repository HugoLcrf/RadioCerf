import { create } from "zustand";
import TRACKS from "./TRACKS";

const useStore = create((set) => ({
  playlist: [],
  addToPlaylist: (track) =>
    set((state) => ({
      playlist: [...state.playlist, track],
    })),
  removeFromPlaylist: (index) =>
    set((state) => {
      const copy = [...state.playlist];
      copy.splice(index, 1);
      return { playlist: copy };
    }),
  clearPlaylist: () => set({ playlist: [] }),

  currentTrackIndex: 0,
  setCurrentTrackIndex: (index) => set({ currentTrackIndex: index }),

  tracks: [],
  setTracks: (_tracks) =>
    set(() => ({
      tracks: _tracks,
    })),

  currentTrack: null,
  setCurrentTrack: (track) => set(() => ({ currentTrack: track })),
}));

export default useStore;