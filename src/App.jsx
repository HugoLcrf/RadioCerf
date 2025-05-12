import Canvas from "./components/Canvas/Canvas";
import Landing from "./components/Landing/Landing";
import Dropzone from "./components/Dropzone/Dropzone";
import Tracks from "./components/Tracks/Tracks";
import Picker from "./components/Picker/Picker";
import PlayerControls from "./components/PlayerControls/PlayerControls";
import Playlist from "./components/Playlist/Playlist";

function App() {
  return (
    <>
      <Landing />
      <Dropzone />
      <Picker />
      <Tracks />
      <Playlist />
      <PlayerControls/>
      <Canvas />
    </>
  );
}

export default App;
