self.addEventListener("message", event => {
  if (event.data.run === true) {
    self.postMessage({ status: "Worker started" });
    self.postMessage({ nodes: event.data.nodes });
  }

  if (event.data.run === false) {
    self.postMessage({ status: "Worker stopped" });
  }
});
