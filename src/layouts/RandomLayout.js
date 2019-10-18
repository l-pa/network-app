import React, { } from 'react'

function RandomLayout (props) {
  return (
    <div className={'layoutSettings settings'}>
      <p />
      <button onClick={(event) => {
        window.network.graph.nodes().forEach(n => {
          n.x = Math.random()
          n.y = Math.random()
        })
        window.network.refresh()
      }}>Random</button>
    </div>

  )
}

export { RandomLayout }
