let msgin;

module.exports = function (RED) {
  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const cb = (res) => {
      console.log("firebase rtdb-get result " + JSON.stringify(res));
      let val = res.val();
      if (msgin) {
        msgin.payload = val;
        node.send(msgin);
      } else {
        node.send({ payload: val });
      }
      msgin = "";
    };

    let setUpListener = (path) => {
      console.log("* rtdb-get setUpListener for path " + path);
      if (path) {
        this.admin
          .database()
          .ref(path)
          .once("value")
          .then(
            (res) => {
              cb(res);
            },
            (fail) => {
              console.log("rtdb-get failure ");
              console.dir(fail);
            }
          );
      } else {
        console.log("----- rtdb-get got empty path !!");
        console.dir(config);
      }
    };

    if (config.cred) {
      let c = RED.nodes.getNode(config.cred);
      this.admin = c.admin;
    }

    this.path = config.path;
    if (this.path) {
      setUpListener(this.path);
    }

    node.on(
      "input",
      function (msg) {
        let path = this.path;
        if (msg && msg.payload) {
          path = path || msg.payload.path;
          msgin = msg;
          setUpListener(path);
        }
      }.bind(this)
    );
  }
  RED.nodes.registerType("rtdb-get", FirebaseAdmin);
};
