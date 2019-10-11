import React, { useState, useEffect } from 'react'
import './App.css'
import JsonParse from './JsonParse'
import Network from './Network'

function App () {
  let fileReader

  const [file, setFile] = useState()
  const [jsonDialog, setJsonDialog] = useState(false)
  const [loadDialog, setLoadDialog] = useState(true)
  const [showNetwork, setShowNetwork] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFileRead = (e) => {
    const content = fileReader.result
    try {
      setFile(JSON.parse(content))
      setJsonDialog(true)
    } catch (e) {
      console.log('Err', e)
    }
  }

  useEffect(() => {
    if (file) {
      console.log(file)
    }
  }, [file])

  return (
    <div>

      {!showNetwork ? (
        <div className='App'>
          {
            jsonDialog && <JsonParse file={file} showNetwork={setShowNetwork} />
          }
          {loadDialog &&
          <div className={'intro'}>
            <div className={'center'}>

              <div className={'left'}>

                {/* <input type="file" onChange={(event) => {
                  fileReader = new FileReader()
                  fileReader.onloadend = handleFileRead
                  fileReader.readAsText(event.target.files[0])
                }}
              ></input> */}
                File input
              </div>
              <div className={'border'} />
              <div className={'right'}>
                <h1>
                  Network graph demo
                </h1>
                <h3>Examples</h3>
                <p className={'example'} onClick={() => {
                  setLoading(true)
                  fetch('https://raw.githubusercontent.com/dunnock/react-sigma/master/public/upwork.json').then(
                    res => res.json()
                  )
                    .then(res => {
                      setFile(res)
                      setShowNetwork(true)
                      setLoading(false)
                    }
                    )
                }}>
                  Network.json
                </p>
              </div>
            </div>
            <div className={'loading'}>
              {
                loading &&
                <h2>Loading</h2>
              }
            </div>
          </div>
          }
        </div>
      ) : (
        <div >
          <Network network={file} />
        </div>
      )
      }

    </div>
  )
}

export default App
