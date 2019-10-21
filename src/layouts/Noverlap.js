import React, { useState, useRef, useEffect } from 'react'

window.sigma.utils.pkg('sigma.layouts.noverlap')

const settings = {
  speed: 3,
  scaleNodes: 1.2,
  nodeMargin: 5.0,
  gridSize: 20,
  permittedExpansion: 1.1,
  rendererIndex: 0,
  maxIterations: 500
}

var _instance = {}

/**
 * Event emitter Object
 * ------------------
 */
var _eventEmitter = {}

function Noverlap () {
  var self = this
  this.init = function (sigInst, options) {
    options = options || {}

    // Properties
    this.sigInst = window.network
    this.config = window.sigma.utils.extend(options, settings)
    this.easing = options.easing
    this.duration = options.duration

    if (options.nodes) {
      this.nodes = options.nodes
      delete options.nodes
    }

    if (!window.sigma.plugins || typeof window.sigma.plugins.animate === 'undefined') {
      throw new Error('sigma.plugins.animate is not declared')
    }

    // State
    this.running = false
  }

  this.atomicGo = function () {
    if (!this.running || this.iterCount < 1) return false

    var nodes = this.nodes || this.sigInst.graph.nodes()
        var nodesCount = nodes.length
        var i
        var n
        var n1
        var n2
        var xmin = Infinity
        var xmax = -Infinity
        var ymin = Infinity
        var ymax = -Infinity
        var xwidth
        var yheight
        var xcenter
        var ycenter
        var grid
        var row
        var col
        var minXBox
        var maxXBox
        var minYBox
        var maxYBox
        var adjacentNodes
        var subRow
        var subCol
        var nxmin
        var nxmax
        var nymin
        var nymax

    this.iterCount--
    this.running = false

    for (i = 0; i < nodesCount; i++) {
      n = nodes[i]
      n.dn.dx = 0
      n.dn.dy = 0

      // Find the min and max for both x and y across all nodes
      xmin = Math.min(xmin, n.dn_x - (n.dn_size * self.config.scaleNodes + self.config.nodeMargin))
      xmax = Math.max(xmax, n.dn_x + (n.dn_size * self.config.scaleNodes + self.config.nodeMargin))
      ymin = Math.min(ymin, n.dn_y - (n.dn_size * self.config.scaleNodes + self.config.nodeMargin))
      ymax = Math.max(ymax, n.dn_y + (n.dn_size * self.config.scaleNodes + self.config.nodeMargin))
    }

    xwidth = xmax - xmin
    yheight = ymax - ymin
    xcenter = (xmin + xmax) / 2
    ycenter = (ymin + ymax) / 2
    xmin = xcenter - self.config.permittedExpansion * xwidth / 2
    xmax = xcenter + self.config.permittedExpansion * xwidth / 2
    ymin = ycenter - self.config.permittedExpansion * yheight / 2
    ymax = ycenter + self.config.permittedExpansion * yheight / 2

    grid = {} // An object of objects where grid[row][col] is an array of node ids representing nodes that fall in that grid. Nodes can fall in more than one grid

    for (row = 0; row < self.config.gridSize; row++) {
      grid[row] = {}
      for (col = 0; col < self.config.gridSize; col++) {
        grid[row][col] = []
      }
    }

    // Place nodes in grid
    for (i = 0; i < nodesCount; i++) {
      n = nodes[i]

      nxmin = n.dn_x - (n.dn_size * self.config.scaleNodes + self.config.nodeMargin)
      nxmax = n.dn_x + (n.dn_size * self.config.scaleNodes + self.config.nodeMargin)
      nymin = n.dn_y - (n.dn_size * self.config.scaleNodes + self.config.nodeMargin)
      nymax = n.dn_y + (n.dn_size * self.config.scaleNodes + self.config.nodeMargin)

      minXBox = Math.floor(self.config.gridSize * (nxmin - xmin) / (xmax - xmin))
      maxXBox = Math.floor(self.config.gridSize * (nxmax - xmin) / (xmax - xmin))
      minYBox = Math.floor(self.config.gridSize * (nymin - ymin) / (ymax - ymin))
      maxYBox = Math.floor(self.config.gridSize * (nymax - ymin) / (ymax - ymin))
      for (col = minXBox; col <= maxXBox; col++) {
        for (row = minYBox; row <= maxYBox; row++) {
          grid[row][col].push(n.id)
        }
      }
    }

    adjacentNodes = {} // An object that stores the node ids of adjacent nodes (either in same grid box or adjacent grid box) for all nodes

    for (row = 0; row < self.config.gridSize; row++) {
      for (col = 0; col < self.config.gridSize; col++) {
        grid[row][col].forEach(function (nodeId) {
          if (!adjacentNodes[nodeId]) {
            adjacentNodes[nodeId] = []
          }
          for (subRow = Math.max(0, row - 1); subRow <= Math.min(row + 1, self.config.gridSize - 1); subRow++) {
            for (subCol = Math.max(0, col - 1); subCol <= Math.min(col + 1, self.config.gridSize - 1); subCol++) {
              grid[subRow][subCol].forEach(function (subNodeId) {
                if (subNodeId !== nodeId && adjacentNodes[nodeId].indexOf(subNodeId) === -1) {
                  adjacentNodes[nodeId].push(subNodeId)
                }
              })
            }
          }
        })
      }
    }

    // If two nodes overlap then repulse them
    for (i = 0; i < nodesCount; i++) {
      n1 = nodes[i]
      adjacentNodes[n1.id].forEach(function (nodeId) {
        var n2 = self.sigInst.graph.nodes(nodeId)
        var xDist = n2.dn_x - n1.dn_x
        var yDist = n2.dn_y - n1.dn_y
        var dist = Math.sqrt(xDist * xDist + yDist * yDist)
        var collision = (dist < ((n1.dn_size * self.config.scaleNodes + self.config.nodeMargin) + (n2.dn_size * self.config.scaleNodes + self.config.nodeMargin)))
        if (collision) {
          self.running = true
          if (dist > 0) {
            n2.dn.dx += xDist / dist * (1 + n1.dn_size)
            n2.dn.dy += yDist / dist * (1 + n1.dn_size)
          } else {
            n2.dn.dx += xwidth * 0.01 * (0.5 - Math.random())
            n2.dn.dy += yheight * 0.01 * (0.5 - Math.random())
          }
        }
      })
    }

    for (i = 0; i < nodesCount; i++) {
      n = nodes[i]
      if (!n.fixed) {
        n.dn_x = n.dn_x + n.dn.dx * 0.1 * self.config.speed
        n.dn_y = n.dn_y + n.dn.dy * 0.1 * self.config.speed
      }
    }

    if (this.running && this.iterCount < 1) {
      this.running = false
    }

    return this.running
  }

  this.go = async function () {
    this.iterCount = this.config.maxIterations
    while (this.running) {
      this.atomicGo()
    };
    this.stop()
  }

  this.start = function () {
    if (this.running) return

    var nodes = this.sigInst.graph.nodes()

    var prefix = this.sigInst.renderers[self.config.rendererIndex].options.prefix

    this.running = true

    // Init nodes
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].dn_x = nodes[i][prefix + 'x']
      nodes[i].dn_y = nodes[i][prefix + 'y']
      nodes[i].dn_size = nodes[i][prefix + 'size']
      nodes[i].dn = {
        dx: 0,
        dy: 0
      }
    }

    _eventEmitter[self.sigInst.id].dispatchEvent('start')
    this.go()
  }

  this.stop = function () {
    var nodes = this.sigInst.graph.nodes()

    this.running = false

    if (this.easing) {
      _eventEmitter[self.sigInst.id].dispatchEvent('interpolate')
      window.sigma.plugins.animate(
        self.sigInst,
        {
          x: 'dn_x',
          y: 'dn_y'
        },
        {
          easing: self.easing,
          onComplete: function () {
            self.sigInst.refresh()
            for (var i = 0; i < nodes.length; i++) {
              nodes[i].dn = null
              nodes[i].dn_x = null
              nodes[i].dn_y = null
            }
            _eventEmitter[self.sigInst.id].dispatchEvent('stop')
          },
          duration: self.duration
        }
      )
    } else {
      // Apply changes
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].x = nodes[i].dn_x
        nodes[i].y = nodes[i].dn_y
      }

      this.sigInst.refresh()

      for (var i = 0; i < nodes.length; i++) {
        nodes[i].dn = null
        nodes[i].dn_x = null
        nodes[i].dn_y = null
      }
      _eventEmitter[self.sigInst.id].dispatchEvent('stop')
    }
  }

  this.kill = function () {
    this.sigInst = null
    this.config = null
    this.easing = null
  }
}

window.sigma.prototype.configNoverlap = function (config) {
  var sigInst = window.network

  if (!config) throw new Error('Missing argument: "config"')

  // Create instance if undefined
  if (!_instance[sigInst.id]) {
    _instance[sigInst.id] = new Noverlap()
    _eventEmitter[sigInst.id] = {}
    window.sigma.classes.dispatcher.extend(_eventEmitter[sigInst.id])

    // Binding on kill to clear the references
    sigInst.bind('kill', function () {
      _instance[sigInst.id].kill()
      _instance[sigInst.id] = null
      _eventEmitter[sigInst.id] = null
    })
  }

  _instance[sigInst.id].init(sigInst, config)

  return _eventEmitter[sigInst.id]
}

window.sigma.prototype.startNoverlap = function (config) {
  var sigInst = window.network

  if (config) {
    window.sigma.configNoverlap(sigInst, config)
  }
  _instance[sigInst.id].start()

  return _eventEmitter[sigInst.id]
}

window.sigma.prototype.isNoverlapRunning = function () {
  var sigInst = window.sigma

  return !!_instance[sigInst.id] && _instance[sigInst.id].running
}

function NoverlapUI (props) {
  const nodeMargin = useRef(5)
  const scaleNodes = useRef(1.2)
  const gridSize = useRef(20)
  const permittedExpansion = useRef(1.1)
  const rendererIndex = useRef(0)
  const speed = useRef(2)
  const maxIterations = useRef(100)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
  })

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

export { NoverlapUI }
