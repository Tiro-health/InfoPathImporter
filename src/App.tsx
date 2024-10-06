import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [directoryNames, setDirectoryNames] = useState<string[]>([]);

  useEffect(() => {
    if (window.launchQueue) {
      const launchHandler = (launchParams: LaunchParams) => {
        const files = launchParams.files.filter(
          (params) => params.kind == "file",
        );
        const fileNames = files.map((params) => params.name);
        setFileNames(fileNames);

        const directories = launchParams.files.filter(
          (params) => params.kind == "directory",
        );
        const directoryNames = directories.map((params) => params.name);
        setDirectoryNames(directoryNames);
      };
      window.launchQueue.setConsumer(launchHandler);
    }
  });

  return (
    <div>
      <h1>Files</h1>
      <p>Found {fileNames.length} files</p>
      <ul>
        {fileNames.map((fileName) => (
          <li key={fileName}>{fileName}</li>
        ))}
      </ul>
      <h1>Directories</h1>
      <p>Found {directoryNames.length} directories</p>
      <ul>
        {directoryNames.map((directoryName) => (
          <li key={directoryName}>{directoryName}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
