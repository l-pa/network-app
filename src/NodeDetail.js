import React from 'react'
import './NodeDetail.css'

function NodeDetail (props) {
  return <div className={'window'}>
    <p className={'close'} onClick={() => {
      props.setVisibility(false)
    }}>X</p>
    <pre style={{ whiteSpace: 'pre-wrap' }}>
      <button onClick={() => {
        props.node.data.node.label = 'xd'
        window.network.refresh()
      }}>
        Change node
      </button>
      {JSON.stringify(props.node.data.node, null, 2)}
    </pre>
  </div>
}

export default NodeDetail
