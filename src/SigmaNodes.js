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
      Object.keys(props.settings).forEach(function (key) {
        props.sigma.settings(key, props.settings[key])
        console.log(props.sigma.settings(key))
      })
      props.sigma.refresh()
    }
  }, [props.settings])

  useEffect(() => {
    if (props.sigma) {
      console.log(props)
      if (props.startLayout) {
        switch (props.selectedLayout) {
          case 'forceAtlas2':
            if (props.selectedLayoutOptions) {
              props.sigma.startForceAtlas2(props.selectedLayoutOptions)
            } else {
              props.sigma.startForceAtlas2()
            }
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
        props.sigma.stopForceAtlas2()
      }
    }
  }, [props.startLayout])

  useEffect(() => {
    if (props.sigma) {
      if (props.startLayout) {
        switch (props.selectedLayout) {
          case 'forceAtlas2':
            props.sigma.configForceAtlas2(props.selectedLayoutOptions)
            break
        }
      }
    }
  }, [props.selectedLayoutOptions])

  return null
}

export default SigmaNodes
