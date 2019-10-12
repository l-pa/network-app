import React, { useState, useRef } from 'react'
import { Sigma, RandomizeNodePositions } from 'react-sigma'
import './App.css'
import SigmaNodes from './SigmaNodes'
import NodeDetail from './NodeDetail'
import { SketchPicker } from 'react-color'

function Network (props) {
  const shapes = ['def', 'pacman', 'star', 'equilateral', 'cross', 'diamond', 'circle', 'square']
  const edgeLabelSizes = ['fixed', 'proportional']
  const layouts = ['forceAtlas2', 'random']

  const linLogMode = useRef(false)
  const scalingRatio = useRef(1)
  const gravity = useRef(1)
  const worker = useRef(false)

  const [shape, setShape] = useState(shapes[0])
  const [edgeLabelSize, setEdgeLabelSize] = useState(edgeLabelSizes[0])

  const [edgeColor, setEdgeColor] = useState('#000')
  const [nodeColor, setNodeColor] = useState('#000')
  const [labelColor, setLabelColor] = useState('#fff')

  const [selectedLayout, setSelectedLayout] = useState(layouts[0])
  const [selectedLayoutOptions, setSelectedOptions] = useState()
  const [startLayout, setStartLayout] = useState(false)

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
        return <div className={'layoutSettings settings'}>
          <p>Options</p>
          <br />
          <div>
            <input ref={linLogMode} type='checkbox' value='linLogMode' />linLogMode
          </div>
          <div>
            <input defaultValue={scalingRatio.current} onChange={(event) => {
              scalingRatio.current = event.target.value
            }} type='number' />scalingRatio
          </div>
          <div>
            <input defaultValue={gravity.current} onChange={(event) => {
              gravity.current = event.target.value
            }} type='number' />gravity
          </div>
          <div>
            <input ref={worker} type='checkbox' value='worker' />worker
          </div>
          <button onClick={(event) => {
            setSelectedOptions({ linLogMode: linLogMode.current.checked, scalingRatio: scalingRatio.current, gravity: gravity.current, worker: worker.current.checked })
            setStartLayout(true)
          }}>Start</button>
          <button onClick={(event) => {
            setStartLayout(false)
          }}>Stop</button>
        </div>
      case layouts[1]:
        return <div className={'layoutSettings settings'}>
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
          <h3 style={{ margin: '1em' }}>Settings</h3>
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
            <input defaultValue={labelThreshold} type='number' onChange={(event) => {
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
          <NodeDetail node={nodeDetail} setVisibility={setShowNodeDetail} />
          }
        </div>
        <SigmaNodes nodeType={shape}
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
          showNodeDetail={setShowNodeDetail}
          setSelectedNode={setNodeDetail}
          selectedLayout={selectedLayout}
          selectedLayoutOptions={selectedLayoutOptions}
          startLayout={startLayout}
          setStartLayout={setStartLayout}
        />
        <RandomizeNodePositions />
      </Sigma>
    </div>
  )
}

export default Network
