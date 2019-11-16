import { useEffect } from "react";

const SigmaNodes = props => {
  useEffect(() => {
    // TODO

    window.network.bind("clickNode", node => {
      props.showNodeDetail(true);
      props.setSelectedNode(node);
      console.log(node);
    });

    //  window.network.bind("overNode", node => {});
  }, []);

  useEffect(() => {
    if (window.network) {
      Object.keys(props.settings).forEach(function(key) {
        window.network.settings(key, props.settings[key]);
      });
      window.network.refresh();
    }
  }, [props.settings]);

  return null;
};

export default SigmaNodes;
