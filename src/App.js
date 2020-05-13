import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import Network from "./components/Network";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  let fileReader;

  const [file, setFile] = useState();
  const [showNetwork, setShowNetwork] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hidePanels, setHidePanels] = useState(!false);

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
    } catch (err) {
      console.log("Err", err);
    }
  };

  useEffect(() => {
    console.log("called new sigma"); // needs change in sigma lib
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

  useEffect(() => {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    if (params.get("n") && params.get("t")) {
      if (params.get("f")) {
        setExample(params.get("n"), params.get("t"), params.get("f"));
      }

      if (params.get("h") === "1") {
        setHidePanels(!true);
      }

      if (params.get("m") === "1") {
        largestComponent.current = true;
      }
      setExample(params.get("n"), params.get("t"), params.get("f"));
      setShowNetwork(true);
    }
  }, []);

  const setExamplePromise = (url, type, name) => {
    return new Promise((res, rej) => {
      setLoading(true);
      setFile({
        url,
        type
      });
      fileName.current = name;
      setShowNetwork(true);
      setErrorMessage(null);
      res(1);
    });
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
                  <p>GEXF - 1.2+ / JSON / GML</p>
                  <div className="border-h" />
                  <br />
                  <input
                    type="checkbox"
                    defaultChecked={largestComponent.current}
                    onChange={e =>
                      (largestComponent.current = e.target.checked)}
                  />
                  Maximal component
                </div>
                <div className="border" />
                <div className="right">
                  <h3>Examples</h3>
                  <div
                    role="button"
                    tabIndex="0"
                    onClick={() => {
                      setExample(
                        "https://raw.githubusercontent.com/l-pa/network-app/master/src/networks/cpan-authors.gexf",
                        "gexf",
                        "cpan-authors"
                      );
                    }}
                    className="example"
                  >
                    <p>CPAN authors</p>
                    <small>
                      CPAN Explorer is a visualization project aiming at
                      analyzing the relationships between the developers and the
                      packages of the Perl language, known as the CPAN
                      community.
                    </small>
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
            <Network
              hidePanels={hidePanels}
              setShowNetwork={setShowNetwork}
              largestComponent={largestComponent.current}
              network={file}
              loading={loading}
              setLoading={setLoading}
              fileName={fileName.current}
              renderer={renderer}
              setErrorMessage={setErrorMessage}
            />
          )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
