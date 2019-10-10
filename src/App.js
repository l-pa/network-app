import React, { useState, useEffect } from 'react';
import './App.css';
import JsonParse from './JsonParse'
import Network from './Network'

function App() {

  let myGraph = { nodes: [{ id: "n1", label: "Alice" }, { id: "n2", label: "Rabbit" }], edges: [{ id: "e1", source: "n1", target: "n2", label: "SEES" }] };

  let fileReader

  const [file, setFile] = useState()
  const [jsonDialog, setJsonDialog] = useState(false)
  const [loadDialog, setLoadDialog] = useState(true)
  const [showNetwork, setShowNetwork] = useState(false)


  const handleFileRead = (e) => {
    const content = fileReader.result
    try {
      setFile(JSON.parse(content))
      setJsonDialog(true)
    } catch (e) {
      console.log("Err", e);
    }
  }

  useEffect(() => {
    if (file) {
      console.log(file);
    }
  }, [file])

  return (
    <div>

      {!showNetwork ? (
        <div className="App">
          {
            jsonDialog && <JsonParse file={file} showNetwork={setShowNetwork}></JsonParse>
          }
          {loadDialog &&
            <div className={"intro center"}>

              <div className={"left"}>

                {/* <input type="file" onChange={(event) => {
                  fileReader = new FileReader()
                  fileReader.onloadend = handleFileRead
                  fileReader.readAsText(event.target.files[0])
                }}
                ></input> */}
                File input
              </div>
              <div className={"border"}></div>
              <div className={"right"}>
                <h1>
                  Network graph demo
                </h1>
                <p>Examples</p>
                <p onClick={() => {
                  fetch('https://raw.githubusercontent.com/dunnock/react-sigma/master/public/upwork.json').then(
                    res => res.json()
                  )
                    .then(res => {
                      setFile(res)
                      setShowNetwork(true)
                    }
                    )
                }}>
                  TEST
                </p>
              </div>
            </div>
          }
        </div>
      ) : (
          <div >
              <Network network={file}></Network>
          </div>
        )
      }

    </div>
  );
}

export default App;
