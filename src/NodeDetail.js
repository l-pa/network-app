import React, { useRef, useState } from 'react'
import './NodeDetail.css'

function NodeDetail (props) {
  const label = useRef(props.node.data.node.label)
  const color = useRef(props.node.data.node.color)
  const size = useRef(props.node.data.node.size)
  const [isDeleted, setIsDeleted] = useState(false)
  return <div className={'window'}>
    <div className={'close'} onClick={() => {
      props.setVisibility(false)
    }}>X</div>
    <pre style={{ whiteSpace: 'pre-wrap' }}>
      <div className={'option'}>
        <h2>Label</h2>
        <div key={props.node.data.node.label}>
          <input ref={label} type='text' defaultValue={props.node.data.node.label} />
        </div>
      </div>
      <div className={'option'}>
        <h2>Color</h2>
        <div key={props.node.data.node.color}>
          <input ref={color} type='text' defaultValue={props.node.data.node.color} />
        </div>
      </div>

      <div className={'option'}>
        <h2>Size</h2>
        <div key={props.node.data.node.size}>
          <input ref={size} type='text' defaultValue={props.node.data.node.size} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <button onClick={() => {
            props.node.data.node.label = label.current.value
            props.node.data.node.color = color.current.value
            props.node.data.node.size = size.current.value

            window.network.refresh()
          }}>
        Change node
          </button>

          <button onClick={() => {
            window.network.graph.dropNode(props.node.data.node.id)
            window.network.refresh()
            setIsDeleted(true)
          }}>
        Delete node
          </button>
        </div>

        {
          // button
        //     props.node.data.node.label = label.current.value
        //     props.node.data.node.color = color.current.value
        //     props.node.data.node.size = size.current.value
        //     window.network.graph.addNode({
        //       id: 999, label: label.current.value, color: color.current.value, size: size.current.value
        //     })
        //     window.network.refresh()
        //     setIsDeleted(false)

          //   }}>
          // Add node
          //   </button>

        }
      </div>
      {console.log(props.node.data.node)}

      {/* {JSON.stringify(props.node.data.node, null, 2)} */}
    </pre>
  </div>
}

export default NodeDetail
