import { useEffect } from 'react'

const SigmaNodes = props => {
  useEffect(() => {
    window.network.bind('clickNode', (node) => {
      props.showNodeDetail(true)
      props.setSelectedNode(node)
    })

    window.network.bind('overNode', (node) => {

    })
  }, [])

  useEffect(() => {
    if (window.network) {
      // memo

      window.network.settings('defaultNodeType', props.nodeType)
      window.network.refresh()
    }
  }, [props.nodeType])

  useEffect(() => {
    if (window.network) {
      console.log(props.edgeShape)

      // memo
      window.network.graph.edges().forEach(function (edge) {
        console.log(edge)
        
        edge.type = props.edgeShape
      })
      window.network.refresh()
    }
  }, [props.edgeShape])

  useEffect(() => {
    if (window.network) {
      Object.keys(props.settings).forEach(function (key) {
        window.network.settings(key, props.settings[key])
      })
      window.network.refresh()
    }
  }, [props.settings])

  return null
}

export default SigmaNodes
