import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileSizes, setFileSizes] = useState<number[]>([]);


  useEffect(() => {
    // Set environment variables
    if (window.launchQueue) {
      const launchHandler = async (launchParams: LaunchParams) => {
        const files = launchParams.files.filter(
          (params) => params.kind === "file"
        );
        const fileNames = files.map((params) => params.name);
        setFileNames(fileNames);

        const fileDetails = await Promise.all(
          files.map(async (fileHandle) => {
            const file = await (fileHandle as FileSystemFileHandle).getFile();
            return { name: file.name, size: file.size, file: file };
          })
        );

        const fileSizes = fileDetails.map((file) => file.size);
        setFileSizes(fileSizes);
        console.log("Doing POST to:")
        console.log(`${import.meta.env.VITE_SERVER_URL}/kws/upload-xsnITE_SERVER_URL/kws/upload-xsn`);

        // Make the REST call
        fileDetails.forEach((file) => {
          const formData = new FormData();
          formData.append("file", file.file, file.name);

          fetch(`${import.meta.env.VITE_SERVER_URL}/kws/upload-xsn`, {
            method: "POST",
            headers: {
              Authorization: "Basic " + btoa(`${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`),
              "x-user-id": "271"
            },
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error("Error:", error));
        });
      };
      window.launchQueue.setConsumer(launchHandler);
    }
  }, []);

  return (
    <div>
      <h1>Infopath Importer v0.0.0</h1>
      <p>Found {fileNames.length} file(s)</p>
      <ul>
        {fileNames.map((fileName, index) => (
          <li key={fileName}>name={fileName}, size={fileSizes[index]} bytes</li>
        ))}
      </ul>
    </div>
  );
}

export default App;