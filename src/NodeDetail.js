import React from 'react'
import './NodeDetail.css'

function NodeDetail (props) {
  return <div className={'window'}>
    <pre style={{ whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(props.node.data.node, null, 2)}
    </pre>
  </div>
}

export default NodeDetail
