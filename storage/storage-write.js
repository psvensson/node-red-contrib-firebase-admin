
module.exports = function(RED) {

  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;


    if(config.cred){
      let c = RED.nodes.getNode(config.cred)
      this.admin = c.admin
      this.storage = c.storage
      this.bucket = config.bucket || c.bucket
      this.path = config.path
    }

    //console.log('configuring storage-write to listen for messages')
    node.on('input', function(msg) {
      if(msg && msg.payload){
        let path = msg.payload.path || this.path
        let bucket = msg.payload.bucket || this.bucket
        let contents = msg.payload.contents
        let options ={
          contentType: msg.payload.contentType || 'auto',
          metadata: msg.payload.metadata || {},
          private: msg.payload.private || true,
          public: msg.payload.public || true,
        }
        console.log('storage-write writing file to bucket "'+bucket+'" path "'+path+'" contents is of type '+(typeof contents))
        console.dir(contents)
        const myBucket = this.storage.bucket(bucket);
        const file = myBucket.file(path);
        file.save(contents, options, function(err) {
          if (!err) {
            // File written successfully.
            node.send({payload:{success:true, filename: path}})
          } else {
            console.log('cloud storage write error: '+err)
            node.send({payload:{success:false, filename: path}})
          }
        });
      }
    }.bind(this));


  }
  RED.nodes.registerType("storage-write", FirebaseAdmin);
}