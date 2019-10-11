import React, { useState, useRef } from 'react'
import { Sigma, RandomizeNodePositions, RelativeSize, NodeShapes } from 'react-sigma'
import './App.css'
import SigmaNodes from './SigmaNodes'

import NodeDetail from './NodeDetail'

function Network (props) {
  const shapes = ['def', 'pacman', 'star', 'equilateral', 'cross', 'diamond', 'circle', 'square']
  const edgeLabelSizes = ['fixed', 'proportional']
  const layouts = ['forceAtlas2', 'random']

  const [shape, setShape] = useState(shapes[0])
  const [edgeLabelSize, setEdgeLabelSize] = useState(edgeLabelSizes[0])
  const [selectedLayout, setSelectedLayout] = useState(layouts[0])
  const [startLayout, setStartLayout] = useState(false)

  const [showNodeDetail, setShowNodeDetail] = useState(false)
  const [nodeDetail, setNodeDetail] = useState(null)
  const [edgeLabelSizePowRatio, setEdgeLabelSizePowRatio] = useState(0.8)

  const renderLayoutOptions = (layout) => {
    switch (layout) {
      case layouts[0]:
        return <div className={'settings'}>
          <p>Options</p>

          <button onClick={(event) => {
            setStartLayout(true)
          }}>Start</button>
          <button onClick={(event) => {
            setStartLayout(false)
          }}>Stop</button>
        </div>
      case layouts[1]:
        return <div className={'settings'}>
          <p>Options</p>

          <button onClick={(event) => {
            setStartLayout(true)
          }}>Random</button>
        </div>

      default:
        return null
    }
  }

  return (
    <div>
      <Sigma renderer='canvas' style={{ height: '100vh', display: 'flex', flexDirection: 'row-reverse' }} graph={props.network}>
        <div className={'sidePanel'}>
          <h3>Settings</h3>
          <div className={'settings'}>
            <p>Node type</p>
            <select onChange={(event) => {
              setShape(event.target.selectedOptions[0].value)
            }}>
              {
                shapes.map((o, i, a) => {
                  return <option value={o}>{o}</option>
                })
              }
            </select>
          </div>
          <div className={'settings'}>
            <p>Edge color</p>
            <input />
          </div>
          <div className={'settings'}>
            <p>Edge type</p>
            <select onChange={(event) => {
              setEdgeLabelSize(event.target.selectedOptions[0].value)
            }}>
              {
                edgeLabelSizes.map((o, i, a) => {
                  return <option value={o}>{o}</option>
                })
              }
            </select>
          </div>
          <div className={'settings'}>
            <p>Edge LabelSizePowRatio</p>
            {
              edgeLabelSize === 'fixed'
                ? (
                  <input disabled type='number' onChange={(event) => {
                    setEdgeLabelSizePowRatio(event.target.value)
                  }} />
                )
                : (
                  <input type='number' onChange={(event) => {
                    setEdgeLabelSizePowRatio(event.target.value)
                  }} />
                )
            }
          </div>

          <div className={'settings'}>
            <p>Layout</p>
            <select onChange={(event) => {
              setStartLayout(false)
              setSelectedLayout(event.target.selectedOptions[0].value)
            }}>
              {
                layouts.map((o, i, a) => {
                  return <option value={o}>{o}</option>
                })
              }
            </select>
          </div>
          {
            renderLayoutOptions(selectedLayout)
          }

          {(nodeDetail && showNodeDetail) &&
          <NodeDetail node={nodeDetail} />
          }
        </div>
        <SigmaNodes nodeType={shape}
          initialSize={100}
          showNodeDetail={setShowNodeDetail}
          setSelectedNode={setNodeDetail}
          edgeLabelSize={edgeLabelSize}
          edgeLabelSizePowRatio={edgeLabelSizePowRatio}
          selectedLayout={selectedLayout}
          startLayout={startLayout}
          setStartLayout={setStartLayout}

        />
        <RandomizeNodePositions />
      </Sigma>
    </div>
  )
}

export default Network
