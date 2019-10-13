import { useEffect } from 'react'
import 'react-sigma/sigma/nodes'

const SigmaNodes = props => {
  useEffect(() => {
    props.setNetworkInstance(props.sigma)
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
      Object.keys(props.settings).forEach(function (key) {
        props.sigma.settings(key, props.settings[key])
        console.log(props.sigma.settings(key))
      })
      props.sigma.refresh()
    }
  }, [props.settings])

  return null
}

export default SigmaNodes
