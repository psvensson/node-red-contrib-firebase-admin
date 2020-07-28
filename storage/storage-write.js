module.exports = function (RED) {
  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    if (config.cred) {
      let c = RED.nodes.getNode(config.cred);
      this.config = c;
      this.admin = c.admin;

      this.bucket = config.bucket || c.bucket;
      this.path = config.path;
    }

    node.on(
      "input",
      function (msg) {
        try {
          if (msg && msg.payload) {
            let global = this.context().global;
            this.storage = this.config.storage || global.get("cloud-storage");
            let path = msg.payload.path || msg.path || this.path;
            let bucket = msg.payload.bucket || msg.bucket || this.bucket;
            let contents = msg.payload.contents || msg.payload;
            let options = {
              contentType: msg.payload.contentType || msg.contentType || "auto",
              metadata: msg.payload.metadata || msg.metadata || {},
              private: msg.payload.private || msg.private || true,
              public: msg.payload.public || msg.public || true,
            };
            console.log(
              'storage-write writing file to bucket "' +
                bucket +
                '" path "' +
                path +
                '" contents is of type ' +
                typeof contents
            );
            const myBucket = this.storage.bucket(bucket);
            const file = myBucket.file(path);
            file.save(contents, options, function (err) {
              if (!err) {
                // File written successfully.
                msg.payload = { success: true, filename: path };
              } else {
                console.log(
                  "cloud storage write error: " + JSON.stringify(err)
                );
                msg.payload = { success: false, filename: path };
              }
              node.send(msg);
            });
          }
        } catch (ex) {
          console.log("storage-read caught exception: " + ex);
          msg.payload = ex;
          node.send(msg);
        }
      }.bind(this)
    );
  }
  RED.nodes.registerType("storage-write", FirebaseAdmin);
};
