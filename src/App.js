import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Network from "./components/Network";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  let fileReader;

  const [file, setFile] = useState();
  const [showNetwork, setShowNetwork] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(""); // use error boundaries

  const fileName = useRef("graph");

  const largestComponent = useRef(false);

  const renderer = useRef(0);

  const handleFileRead = e => {
    //   const content = fileReader.result
    console.log(URL.createObjectURL(e));
    setLoading(true);
    fileName.current = e.name
      .split(".")
      .slice(0, -1)
      .join(".");

    try {
      switch (e.name.split(".").pop()) {
        case "gexf":
          setFile({ url: URL.createObjectURL(e), type: "gexf" });
          break;
        case "json":
          setFile({ url: URL.createObjectURL(e), type: "json" });
          break;
        case "gml":
          setFile({ url: URL.createObjectURL(e), type: "gml" });
          //     const result = gml2json.parse(gmlString);
          console.log(e);
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
    console.log("called new sigma"); // TODO
    if (showNetwork === false) window.network = new window.sigma();
  }, [showNetwork]);

  const setExample = (url, type, name) => {
    setLoading(true);
    setFile({
      url,
      type
    });
    fileName.current = name;
    setShowNetwork(true);
    setErrorMessage(null);
  };
  return (
    <ErrorBoundary>
      <div>
        {!showNetwork ? (
          <div className="App">
            <div className="intro">
              <div className="center">
                <div className="left">
                  <h2>Custom network</h2>
                  <p>GEXF - 1.2+ / JSON / GML</p>
                  <input
                    type="file"
                    accept=".gexf, .json, .gml"
                    onChange={event => {
                      setErrorMessage(null);
                      fileReader = new FileReader();
                      fileReader.onloadend = handleFileRead(
                        event.target.files[0]
                      );
                      fileReader.readAsText(event.target.files[0]);
                    }}
                  />
                  <br />
                  <br />
                  <input
                    type="checkbox"
                    defaultChecked={largestComponent.current}
                    onChange={e =>
                      (largestComponent.current = e.target.checked)
                    }
                  />
                  Largest component
                </div>
                <div className="border" />
                <div className="right">
                  <h3>Examples</h3>
                  <div
                    role="button"
                    tabIndex="0"
                    onClick={() => {
                      setExample(
                        "https://raw.githubusercontent.com/l-pa/network-app/master/src/networks/java_packages.json",
                        "json",
                        "java_packages"
                      );
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
                      setExample(
                        "https://raw.githubusercontent.com/l-pa/network-app/master/src/networks/karate.json",
                        "json",
                        "karate"
                      );
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
                      setExample(
                        "https://raw.githubusercontent.com/dunnock/react-sigma/master/public/upwork.json",
                        "json",
                        "upwork"
                      );
                    }}
                    className="example"
                  >
                    <p>Network.json</p>
                  </div>
                  <div
                    role="button"
                    tabIndex="-1"
                    onClick={() => {
                      setExample(
                        "https://raw.githubusercontent.com/l-pa/network-app/master/src/networks/codeminer.gexf",
                        "gexf",
                        "code_miner"
                      );
                    }}
                    className="example"
                  >
                    <p>Java code.GEXF</p>
                    <small>Source code structure of a Java program</small>
                    <br />
                    <small>by S.Heymann & J.Palmier, 2008.</small>
                  </div>
                </div>
              </div>
              {/* <div className="center">
                <button
                  type="button"
                  className="subButton"
                  onClick={e => {
                    e.preventDefault();
                    window.location.href =
                      "https://github.com/l-pa/network-app";
                  }}
                >
                  Github
                </button>

                <button type="button" className="subButton">
                  License
                </button>
              </div> */}
              <div className="loading">{loading && <h2>Loading</h2>}</div>
              <div className="loading">
                {errorMessage && <h2>{errorMessage}</h2>}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Network
              setShowNetwork={setShowNetwork}
              largestComponent={largestComponent.current}
              network={file}
              loading={loading}
              setLoading={setLoading}
              fileName={fileName.current}
              renderer={renderer}
              setErrorMessage={setErrorMessage}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
