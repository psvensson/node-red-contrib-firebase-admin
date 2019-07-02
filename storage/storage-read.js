

let oldpath

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

    //console.log('configuring storage-read to listen for messages')
    node.on('input', function(msg) {
      if(msg && msg.payload){
        let path = msg.payload.path || this.path
        let bucket = msg.payload.bucket || this.bucket
        console.log('storage-read reading from bucket "'+bucket+'" path "'+path+'"')
        this.storage
        .bucket(bucket)
        .file(path).download().then((file)=>{
          console.log('storage-read got file')
          //console.dir(file)
          node.send({payload:file})

        })
      }
    }.bind(this));


  }
  RED.nodes.registerType("storage-read", FirebaseAdmin);
}