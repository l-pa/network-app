import { useEffect } from 'react'
import 'react-sigma/sigma/nodes'

const SigmaNodes = props => {
  useEffect(() => {
    props.sigma.bind('clickNode', (node) => {
      console.log(node)
      props.showNodeDetail(true)
      props.setSelectedNode(node)
    })

    props.sigma.bind('overNode', (node) => {

    })
  }, [])

  useEffect(() => {
    if (props.sigma) {
      console.log(props.sigma)
      // memo

      props.sigma.settings('defaultNodeType', props.nodeType)
      props.sigma.refresh()
    }
  }, [props.nodeType])

  useEffect(() => {
    if (props.sigma) {
      props.sigma.settings('labelSize', props.edgeLabelSize)
      props.sigma.settings('labelSizeRatio', props.edgeLabelSizePowRatio)
      props.sigma.refresh()
    }
  }, [props.edgeLabelSize, props.edgeLabelSizePowRatio])

  useEffect(() => {
    if (props.sigma) {
      if (props.startLayout) {
        switch (props.selectedLayout) {
          case 'forceAtlas2':
            props.sigma.startForceAtlas2()
            break
          case 'random':
            props.sigma.graph.nodes().forEach(n => {
              n.x = Math.random()
              n.y = Math.random()
            })
            props.setStartLayout(false)
            props.sigma.refresh()
            break
        }
      } else {
        switch (props.selectedLayout) {
          case 'forceAtlas2':
            props.sigma.stopForceAtlas2()
            break
        }
      }
    }
  }, [props.startLayout])

  return null
}

export default SigmaNodes
