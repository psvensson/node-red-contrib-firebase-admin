

module.exports = function(RED) {

  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;


    if(config.cred){
      let c = RED.nodes.getNode(config.cred)
      this.admin = c.admin
      this.config = c;
      this.bucket = config.bucket || c.bucket
      this.path = config.path
    }
    this.delimiter = config.delimiter

    //console.log('configuring storage-list to listen for messages')
    node.on('input', function(msg) {
      if(msg && msg.payload){
        let global = this.context().global
        this.storage = this.config.storage || global.get('cloud-storage')
        let path = msg.payload.path || this.path
        let bucket = msg.payload.bucket || this.bucket
        console.log('storage-list listing files from bucket "'+bucket+'" path "'+path+'"')
        const options = {
          prefix: path
        };

        if(this.delimiter){
          options.delimiter = this.delimiter
        }

// Lists files in the bucket, filtered by a prefix
        this.storage.bucket(bucket).getFiles(options).then((files)=>{
          console.log('got file listing')
          //console.dir(files[0])
          let f = files[0].filter((e)=>{ return e.name[e.name.length-1] !== '/' })
          msg.payload = {files: f}
          node.send(msg)
        })
      }
    }.bind(this));


  }
  RED.nodes.registerType("storage-list", FirebaseAdmin);
}