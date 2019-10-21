import React, { useState, useRef, useEffect } from 'react'

function Noverlap (props) {
  const nodeMargin = useRef(5)
  const scaleNodes = useRef(1.2)
  const gridSize = useRef(20)
  const permittedExpansion = useRef(1.1)
  const rendererIndex = useRef(0)
  const speed = useRef(2)
  const maxIterations = useRef(100)
  const [isRunning, setIsRunning] = useState(false)

  const bind = useRef(false)

  return (
    <div className='layoutSettings settings'>
      <p>Options</p>
      <br />
      <div>
        <input
          step={0.1} min={0.1} max={10} defaultValue={nodeMargin.current} onChange={(event) => {
            nodeMargin.current = event.target.value
          }} type='number'
        />nodeMargin
      </div>
      <div>
        <input
          step={0.1} min={0.1} max={10} defaultValue={scaleNodes.current} onChange={(event) => {
            scaleNodes.current = event.target.value
          }} type='number'
        />scaleNodes
      </div>
      <div>
        <input
          step={1} min={0} max={10} defaultValue={gridSize.current} onChange={(event) => {
            gridSize.current = event.target.value
          }} type='number'
        />gridSize
      </div>
      <div>
        <input
          step={0.1} min={0.1} max={10} defaultValue={permittedExpansion.current} onChange={(event) => {
            permittedExpansion.current = event.target.value
          }} type='number'
        />permittedExpansion
      </div>
      <div>
        <input
                    disabled
          step={1} min={0} max={10} defaultValue={rendererIndex.current} onChange={(event) => {
            rendererIndex.current = event.target.value
          }} type='number'
        />rendererIndex
      </div>
      <div>
        <input
          step={0.1} min={0.1} max={10} defaultValue={speed.current} onChange={(event) => {
            speed.current = event.target.value
          }} type='number'
        />speed
      </div>
      <div>
        <input
          step={0.1} min={0.1} max={10} defaultValue={maxIterations.current} onChange={(event) => {
            maxIterations.current = event.target.value
          }} type='number'
        />maxIterations
      </div>
      <button onClick={(event) => {
        console.log({ nodeMargin: Number.parseFloat(nodeMargin.current), easing: 'quadraticInOut', scaleNodes: Number.parseFloat(scaleNodes.current), gridSize: gridSize.current, permittedExpansion: permittedExpansion.current, rendererIndex: rendererIndex.current, speed: speed.current, maxIterations: maxIterations.current })

        var listner = window.network.configNoverlap({ nodeMargin: Number.parseFloat(nodeMargin.current), easing: 'quadraticInOut', scaleNodes: scaleNodes.current, gridSize: gridSize.current, permittedExpansion: permittedExpansion.current, rendererIndex: rendererIndex.current, speed: speed.current, maxIterations: maxIterations.current })
        listner.bind('start stop interpolate', (event) => {
          console.log(event.type)
        })
        window.network.startNoverlap()
      }}
      >Start
      </button>

    </div>

  )
}

export { Noverlap }
