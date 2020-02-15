import { useEffect } from "react";

const SigmaSettings = props => {
  useEffect(() => {
    // TODO

    window.network.bind("clickNode", node => {
      props.showNodeDetail(true);
      props.setSelectedNode(node);
      console.log(node);

      fetch(`http://localhost:5000/followings/?u=${node.data.node.id}`)
        .then(res => res.json())
        .then(followings => {
          let tmp = window.network.graph.edges().length + 1;
          const edges = window.network.graph.edges();
          for (let i = 0; i < followings.length - 1; i++) {
            const element = followings[i];
            edges.push({
              id: tmp,
              source: node.data.node.id,
              target: element.id
            });
            tmp += 1;
          }

          fetch(`http://localhost:5000/followers/?u=${node.data.node.id}`)
            .then(res => res.json())
            .then(followers => {
              let tmpA = window.network.graph.edges().length + 1;

              for (let i = 0; i < followers.length - 1; i++) {
                const element = followers[i];
                edges.push({
                  id: tmpA,
                  target: node.data.node.id,
                  source: element.id
                });
                tmpA += 1;
              }

              let results = [...followers, ...followings];

              results = results.filter(
                (v, i, a) => a.findIndex(t => t.id === v.id) === i
              );

              let final = [...results, ...window.network.graph.nodes()];

              final = final.filter(
                (v, i, a) => a.findIndex(t => t.id === v.id) === i
              );

              console.log(final);
              window.network.graph.clear();
              window.network.graph.read({
                nodes: final,
                edges
              });
              window.network.refresh();
            });
        });
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

export default SigmaSettings;
