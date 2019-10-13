import React, { useState, useRef, useEffect } from 'react'
import 'react-sigma/sigma/nodes'

function ForceAtlas2 (props) {
  const linLogMode = useRef(false)
  const scalingRatio = useRef(1)
  const gravity = useRef(1)
  const worker = useRef(false)

  const [isRunning, setIsRunning] = useState(false)

  return (
    <div className={'layoutSettings settings'}>
      <p>Options</p>
      <br />
      <div>
        <input ref={linLogMode}type='checkbox' value='linLogMode' />linLogMode
      </div>
      <div>
        <input step={0.1} min={0.1} max={10} defaultValue={scalingRatio.current} onChange={(event) => {
          scalingRatio.current = event.target.value
        }} type='number' />scalingRatio
      </div>
      <div>
        <input step={0.1} min={0.1} max={50} defaultValue={gravity.current} onChange={(event) => {
          gravity.current = event.target.value
        }} type='number' />gravity
      </div>
      <div>
        <input ref={worker} type='checkbox' value='worker' />worker
      </div>
      <button onClick={(event) => {
        if (props.network) {
          console.log(props.network)
          if (!isRunning) {
            props.network.startForceAtlas2({ linLogMode: linLogMode.current.checked, scalingRatio: scalingRatio.current, gravity: gravity.current, worker: worker.current.checked })
          } else {
            props.network.configForceAtlas2({ linLogMode: linLogMode.current.checked, scalingRatio: scalingRatio.current, gravity: gravity.current, worker: worker.current.checked })
          }
          setIsRunning(true)
        }
      }}>Start</button>
      <button onClick={(event) => {
        props.network.stopForceAtlas2()
        setIsRunning(false)
      }}>Stop</button>
    </div>
  )
}

export { ForceAtlas2 }
