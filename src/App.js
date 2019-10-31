import React, { useState, useEffect } from "react";
import "./App.css";
import JsonParse from "./JsonParse";
import Network from "./Network";

function App() {
  let fileReader;

  const [file, setFile] = useState();
  const [jsonDialog, setJsonDialog] = useState(false);
  const [loadDialog, setLoadDialog] = useState(true);
  const [showNetwork, setShowNetwork] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileRead = e => {
    //   const content = fileReader.result
    console.log(URL.createObjectURL(e));
    setLoading(true);
    try {
      switch (e.name.split(".").pop()) {
        case "gexf":
          setFile({ url: URL.createObjectURL(e), type: "gexf" });
          break;
        case "json":
          setFile({ url: URL.createObjectURL(e), type: "json" });
          break;
        default:
          console.log("Unsupported file");
          break;
      }
      setShowNetwork(true);
    } catch (e) {
      console.log("Err", e);
    }
  };

  useEffect(() => {
    console.log("called new sigma");
    window.network = new window.sigma();
  }, []);

  return (
    <div>
      {!showNetwork ? (
        <div className="App">
          {jsonDialog && <JsonParse file={file} showNetwork={setShowNetwork} />}
          {loadDialog && (
            <div className="intro">
              <div className="center">
                <div className="left">
                  <h2>Custom network</h2>
                  <p>GEXF - 1.2+ / JSON</p>

                  <input
                    type="file"
                    accept=".gexf, .json"
                    onChange={event => {
                      fileReader = new FileReader();
                      fileReader.onloadend = handleFileRead(
                        event.target.files[0]
                      );
                      fileReader.readAsText(event.target.files[0]);
                    }}
                  />
                </div>
                <div className="border" />
                <div className="right">
                  <h1>Network demo</h1>
                  <h3>Examples</h3>
                  <div
                    role="button"
                    tabIndex="0"
                    onClick={() => {
                      setLoading(true);
                      setFile({
                        url:
                          "https://raw.githubusercontent.com/l-pa/network-app/master/src/networks/java_packages.json",
                        type: "json"
                      });
                      setShowNetwork(true);
                    }}
                    className="example"
                  >
                    <p>Java packages.json</p>
                    <small>1.5k nodes, 8k edges</small>
                  </div>
                  <div
                    role="button"
                    tabIndex="-1"
                    onClick={() => {
                      setLoading(true);
                      setFile({
                        url:
                          "https://raw.githubusercontent.com/l-pa/network-app/master/src/networks/karate.json",
                        type: "json"
                      });
                      setShowNetwork(true);
                    }}
                    className="example"
                  >
                    <p>Zachary's karate club.json</p>
                    <small>A karate club at a US university in the 1970s</small>
                  </div>
                  <div
                    role="button"
                    tabIndex="-2"
                    onClick={() => {
                      setLoading(true);
                      setFile({
                        url:
                          "https://raw.githubusercontent.com/dunnock/react-sigma/master/public/upwork.json",
                        type: "json"
                      });
                      setShowNetwork(true);
                    }}
                    className="example"
                  >
                    <p>Network.json</p>
                  </div>
                  <div
                    role="button"
                    tabIndex="-1"
                    onClick={() => {
                      setLoading(true);
                      setFile({
                        url:
                          "https://raw.githubusercontent.com/l-pa/network-app/master/src/networks/codeminer.gexf",
                        type: "gexf"
                      });
                      setShowNetwork(true);
                    }}
                    className="example"
                  >
                    <p>Java code.GEXF</p>
                    <small>Source code structure of a Java program</small>
                    <br></br>
                    <small>by S.Heymann & J.Palmier, 2008.</small>
                  </div>
                </div>
              </div>
              <div className="loading">{loading && <h2>Loading</h2>}</div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Network
            setShowNetwork={setShowNetwork}
            network={file}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </div>
  );
}

export default App;
