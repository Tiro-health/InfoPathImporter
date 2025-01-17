import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  useEffect(() => {
    // Detect browser and check for PWA support
    const isPwaSupported = () => {
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      const isEdge = /Edg/.test(navigator.userAgent);
      const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
      const isFirefox = /Firefox/.test(navigator.userAgent);

      if (isFirefox) {
        return false; // Firefox does not fully support PWA features
      }

      return isChrome || isEdge || isSafari;
    };

    if (!isPwaSupported()) {
      setWarningMessage("Your browser does not fully support PWA features. Please use Chrome, Edge, or Safari for the best experience.");
    }

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

        console.log("Doing POST to:");
        console.log(`${import.meta.env.VITE_SERVER_URL}/kws/upload-xsn`);

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
            .then((response) => {
              setStatusCode(response.status); // Update state with status code
              return response.json();
            })
            .then((data) => {
              console.log(data);
              setErrorMessage(null); // Clear any previous error message
            })
            .catch((error) => {
              console.error("Error:", error);
              setErrorMessage(error.message); // Update state with error message
            });
        });
      };
      window.launchQueue.setConsumer(launchHandler);
    }
  }, []);

  return (
    <div>
      <h1>Infopath Importer v0.0.1</h1>
      {warningMessage ? (
        <p style={{ color: 'red' }}>{warningMessage}</p>
      ) : (
        <>
            <p>Uploaded {fileNames.length} file(s)</p>
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Status Code</th>
                  <th>Error Message</th>
                </tr>
              </thead>
              <tbody>
                {fileNames.map((fileName) => (
                  <tr key={fileName}>
                    <td>{fileName}</td>
                    <td>{statusCode}</td>
                    <td>{errorMessage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </>
      )}
    </div>
  );
}

export default App;