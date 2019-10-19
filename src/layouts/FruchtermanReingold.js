import React, { useState, useRef, useEffect } from 'react'

function FruchtermanReingold (props) {
  const autoArea = useRef(false)
  const area = useRef(1)
  const gravity = useRef(1)
  const speed = useRef(0.1)
  const iterations = useRef(1000)

  const [isRunning, setIsRunning] = useState(false)

  return (
    <div className={'layoutSettings settings'}>
      <p>Options</p>
      <br />
      <div>
        <input ref={autoArea}type='checkbox' value='linLogMode' />autoArea
      </div>
      <div>
        <input step={0.1} min={0.1} max={20} defaultValue={area.current} onChange={(event) => {
          area.current = event.target.value
        }} type='number' />area
      </div>
      <div>
        <input step={0.1} min={0.1} max={50} defaultValue={gravity.current} onChange={(event) => {
          gravity.current = event.target.value
        }} type='number' />gravity
      </div>
      <div>
        <input step={0.1} min={0.1} max={50} defaultValue={speed.current} onChange={(event) => {
          speed.current = event.target.value
        }} type='number' />speed
      </div>
      <div>
        <input step={1} min={1} max={10000} defaultValue={iterations.current} onChange={(event) => {
          iterations.current = event.target.value
        }} type='number' />iterations
      </div>
      <button onClick={(event) => {
        const settings = { easing: 'quadraticIn', autoArea: autoArea.current.checked, area: area.current, gravity: gravity.current, speed: speed.current, iterations: iterations.current }
        if (window.network) {
          if (!isRunning) {
            // Start the algorithm:
            var listener = window.sigma.layouts.fruchtermanReingold.configure(window.network, settings)
            // Bind all events:
            listener.bind('start stop interpolate', function (event) {
              console.log(event.type)
            })
            window.sigma.layouts.fruchtermanReingold.start(window.network)
          } else {
          //  window.network.configForceAtlas2(settings)
          }
          setIsRunning(true)
          while (window.sigma.layouts.fruchtermanReingold.isRunning(window.network)) {
            console.log('xd')
          }
        }
      }}>Start</button>
      <button onClick={(event) => {
        window.network.killForceAtlas2()
        setIsRunning(false)
      }}>Stop</button>
    </div>
  )
}

export { FruchtermanReingold }
