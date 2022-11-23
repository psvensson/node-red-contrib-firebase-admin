const runtime = require("@node-red/runtime");

module.exports = function (RED) {
  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    if (config.cred) {
      let c = RED.nodes.getNode(config.cred);
      this.admin = c.admin;
    }

    node.on(
      "input",
      function (msg) {
        if (msg && msg.payload) {
          console.log("flow-to-rtdb got input");
          console.dir(msg);
          this.path = msg.payload.path || config.path;
          this.flowId = msg.payload.flowId || config.flowId;
          console.log(
            "flow-to-rtdb path=" + this.path + ", flowId=" + this.flowId
          );

          runtime.flows.getFlow({ id: this.flowId }).then((flow) => {
            flow.updated_at = Date.now();
            this.admin
              .database()
              .ref(this.path)
              .set(flow)
              .then(
                (res) => {
                  console.log("firebase set result " + res);
                  console.dir(res);
                  node.send({ payload: res });
                },
                (err) => {
                  console.log("rtdb saving error");
                  console.dir(err);
                }
              )
              .catch((ex) => {
                console.log("rtdb saving exception");
                console.dir(ex);
              });
          });
        }
      }.bind(this)
    );
  }
  RED.nodes.registerType("flow-to-rtdb", FirebaseAdmin);
};
