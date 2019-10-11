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
      props.sigma.graph.nodes().forEach(node => {
        node.type = props.nodeType
        var degree = props.sigma.graph.degree(node.id)
        node.size = props.initialSize * Math.sqrt(degree)
      })
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

  return null
}

export default SigmaNodes
