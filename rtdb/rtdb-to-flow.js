const runtime = require("@node-red/runtime");

let oldpath;

module.exports = function (RED) {
  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const cb = (res) => {
      //console.log('firebase get result '+res)
      //console.dir(res)
      if (config.env_var && process.env[config.env_var]) {
        let val = res.val();
        runtime.flows.getFlow({ id: val.id }).then((flow) => {
          console.log(
            "rtdb-to-flow old flow updated_at = " +
              flow.updated_at +
              " new flow updated_at = " +
              val.updated_at
          );
          if (!flow.updated_at || val.updated_at > flow.updated_at) {
            console.log("updating flow...");
            runtime.flows.updateFlow({ id: val.id, flow: val });
          }
          //console.log('val='+val)
          node.send({ payload: val });
        });
      } else {
        console.log(
          "skipping flow update because environment variable " +
            config.env_var +
            " was either not defined or not set to true"
        );
      }
    };

    let setUpListener = (path) => {
      //console.log('rtdb-get setUpListener for path '+path)
      if (oldpath) {
        this.admin.database().ref(oldpath).off("value", cb);
      }
      this.admin.database().ref(path).on("value", cb);
      oldpath = path;
    };

    if (config.cred) {
      let c = RED.nodes.getNode(config.cred);
      this.admin = c.admin;
    }

    //console.log('------------------------------- rtdg-get config')
    //console.dir(config)
    this.path = config.path;
    if (this.path) {
      setUpListener(this.path);
    }

    //console.log('configuring rtdb-get to listen for messages')
    node.on(
      "input",
      function (msg) {
        let path = this.path;
        if (msg && msg.payload) {
          path = msg.payload.path;
          setUpListener(path);
        }
      }.bind(this)
    );
  }
  RED.nodes.registerType("rtdb-to-flow", FirebaseAdmin);
};
