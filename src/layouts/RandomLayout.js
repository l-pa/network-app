import React, { } from 'react'
import 'react-sigma/sigma/nodes'

function RandomLayout (props) {
  return (
    <div className={'layoutSettings settings'}>
      <p />
      <button onClick={(event) => {
        props.network.graph.nodes().forEach(n => {
          n.x = Math.random()
          n.y = Math.random()
        })
        props.network.refresh()
      }}>Random</button>
    </div>

  )
}

export { RandomLayout }
