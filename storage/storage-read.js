

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
        console.log('------------------------------ storage-read reading from bucket "'+bucket+'" path "'+path+'"')
        if(msg.payload.files && msg.payload.files.length > 0){
          console.log('--reading from files')
          let count = msg.payload.files.length
          let rv = {}
          msg.payload.files.forEach((_file)=>{
            ((file)=>{
              console.log('reading file '+file.name)
              this.storage
              .bucket(bucket)
              .file(file.name).download().then((content)=>{
                console.log('storage-read got file '+file.name)
                rv[file.name] = content
                if(--count === 0){
                  console.log('all files done, sending..')
                  for(let x in rv){
                    console.log(x)
                  }
                  node.send({payload:rv})
                }
              })
            })(_file)
          })
        } else {
          console.log('reading single file from path '+path)
          this.storage
          .bucket(bucket)
          .file(path).download().then((file)=>{
            console.log('storage-read got file')
            //console.dir(file)
            node.send({payload:file})

          })
        }
      }
    }.bind(this));


  }
  RED.nodes.registerType("storage-read", FirebaseAdmin);
}