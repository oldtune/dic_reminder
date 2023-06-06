import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import "./App.css";


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    setInterval(async () => {
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }

      if (permissionGranted) {
        let word: string = await invoke("get_some_word", {});
        // sendNotification('Tauri is awesome!');
        sendNotification({ title: 'Reminder', body: word });
      }
    }, 5000);
    // const showNoti = async () => {
    //   let permissionGranted = await isPermissionGranted();
    //   if (!permissionGranted) {
    //     const permission = await requestPermission();
    //     permissionGranted = permission === 'granted';
    //   }
    //   if (permissionGranted) {
    //     // sendNotification('Tauri is awesome!');
    //     sendNotification({ title: 'TAURI', body: 'Tauri is awesome!' });
    //   }
    // };

    // showNoti();

  }, []);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  async function get_some_word() {
    setGreetMsg(await invoke("get_some_word", {}))
  }

  return (
    <div className="container">
      <h1>Welcome to Dic Reminder!</h1>

      <div className="row">
        {/* <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>

      <p>Let me remind you some new word</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          // greet();
          get_some_word();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Submit</button>
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
