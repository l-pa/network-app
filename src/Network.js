import React, { useState, useRef, useEffect } from 'react'
import { Sigma, RandomizeNodePositions } from 'react-sigma'
import './App.css'
import SigmaNodes from './SigmaNodes'
import NodeDetail from './NodeDetail'
import { SketchPicker } from 'react-color'
import { ForceAtlas2 } from './layouts/ForceAtlas2'
import { RandomLayout } from './layouts/RandomLayout'

function Network (props) {
  const shapes = ['def', 'pacman', 'star', 'equilateral', 'cross', 'diamond', 'circle', 'square']
  const edgeLabelSizes = ['fixed', 'proportional']
  const layouts = ['forceAtlas2', 'random']

  const networkRef = useRef(null)

  const [shape, setShape] = useState(shapes[0])
  const [edgeLabelSize, setEdgeLabelSize] = useState(edgeLabelSizes[0])

  const [edgeColor, setEdgeColor] = useState('#000')
  const [nodeColor, setNodeColor] = useState('#000')
  const [labelColor, setLabelColor] = useState('#fff')

  const [selectedLayout, setSelectedLayout] = useState(layouts[0])

  const [showNodeDetail, setShowNodeDetail] = useState(false)
  const [nodeDetail, setNodeDetail] = useState(null)
  const [edgeLabelSizePowRatio, setEdgeLabelSizePowRatio] = useState(0.8)
  const [labelThreshold, setLabelThreshold] = useState(3)

  const [showColorPickerNode, setShowColorPickerNode] = useState(false)
  const [showColorPickerEdge, setShowColorPickerEdge] = useState(false)
  const [showColorPickerLabel, setShowColorPickerLabel] = useState(false)

  const renderLayoutOptions = (layout) => {
    switch (layout) {
      case layouts[0]:
        return <ForceAtlas2 network={networkRef.current} />
      case layouts[1]:
        return <RandomLayout network={networkRef.current} />
      default:
        return null
    }
  }

  const setNetworkInstance = (network) => {
    networkRef.current = network
  }

  return (
    <div>
      <Sigma renderer='canvas' style={{ height: '100vh', display: 'flex', flexDirection: 'row-reverse' }} graph={props.network}>
        <div className={'sidePanel'}>
          <h3 style={{ margin: '1em' }}>Settings</h3>
          <small>
            Color will not work if nodes / edges have custom color in JSON
          </small>
          <div className={'settings'}>
            <p>Node color</p>
            <input value={nodeColor} onClick={() => {
              setShowColorPickerNode(val => !val)
            }} />
            {
              showColorPickerNode &&
              <SketchPicker onChangeComplete={(event) => {
                setNodeColor(event.hex)
              }
              } />
            }
          </div>
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
            <p>Label threshold</p>
            <input defaultValue={labelThreshold} step={0.1} min={1} max={100} type='number' onChange={(event) => {
              setLabelThreshold(event.target.value)
            }} />
            <small>The minimum size a node must have on screen to see its label displayed.</small>
          </div>

          <div className={'settings'}>
            <p>Label color</p>
            <input value={labelColor} onClick={() => {
              setShowColorPickerLabel(val => !val)
            }} />
            {
              showColorPickerLabel &&
              <SketchPicker onChangeComplete={(event) => {
                setLabelColor(event.hex)
              }
              } />
            }
          </div>

          <div className={'settings'}>
            <p>Edge color</p>
            <input value={edgeColor} onClick={() => {
              setShowColorPickerEdge(val => !val)
            }} />
            {
              showColorPickerEdge &&
              <SketchPicker onChangeComplete={(event) => {
                setEdgeColor(event.hex)
              }
              } />
            }
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
                  <div>
                    <input disabled type='number' onChange={(event) => {
                      setEdgeLabelSizePowRatio(event.target.value)
                    }} />
                    <br />
                    <small>
                    Available with proportional edge label type
                    </small>
                  </div>
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
              if (event.target.selectedOptions[0].value !== selectedLayout) // REFACTOR - LAYOUT.STOP() ...
              {
                setSelectedLayout(event.target.selectedOptions[0].value)
                networkRef.current.stopForceAtlas2()
              }
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
          <NodeDetail node={nodeDetail} setVisibility={setShowNodeDetail} />
          }
        </div>

        <SigmaNodes
          nodeType={shape}
          settings={
            {
              labelSizeRatio: edgeLabelSizePowRatio,
              labelSize: edgeLabelSize,
              edgeColor: 'default',
              defaultNodeColor: nodeColor,
              defaultEdgeColor: edgeColor,
              labelThreshold: labelThreshold,
              defaultLabelColor: labelColor
            }
          }
          setNetworkInstance={setNetworkInstance}
          showNodeDetail={setShowNodeDetail}
          setSelectedNode={setNodeDetail}
          selectedLayout={selectedLayout}
        />
        <RandomizeNodePositions />
      </Sigma>
    </div>
  )
}

export default Network
