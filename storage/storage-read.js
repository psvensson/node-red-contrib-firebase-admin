

module.exports = function(RED) {

  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;


    if(config.cred){
      let c = RED.nodes.getNode(config.cred)
      this.config = c;
      this.admin = c.admin
      let global = this.context().global
      this.storage = c.storage || global.get('cloud-storage')
      this.bucket = config.bucket || c.bucket
      this.path = config.path

      console.log('config is '+config)
    }

    

    //console.log('configuring storage-read to listen for messages')
    node.on('input', function(msg) {
      if(msg && msg.payload){
        let path = msg.payload.path || msg.path || this.path
        let bucket = msg.payload.bucket || msg.bucket || this.bucket
        let global = this.context().global
        this.storage = global.get('cloud-storage')
        console.log('* storage-read set this.storage to '+this.storage)
        console.log('------------------------------ storage-read reading from bucket "'+bucket+'" path "'+path+'" this.storage = '+this.storage)
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
                  msg.payload = rv
                  node.send(msg)
                }
              }, (fail)=>{
                console.log('storage-read could not find file '+path)
                msg.payload = undefined
                node.send(msg)
              })
            })(_file)
          })
        } else if(msg){
          console.log('* reading single file from path '+path)
          try{
            let s = this.storage 
            s.bucket(bucket)
            .file(path).download().then((file)=>{
              console.log('storage-read got file')
              //console.dir(file)
              msg.payload = file
              node.send(msg)
            }, (fail)=>{
              console.log('storage-read could not find single file '+path)
              msg.payload = undefined
              node.send(msg)
            })
          } catch(ex){
            console.log('storage-read caught exception: '+ex)
            msg.payload = ex
            node.send(msg)
          }
        } else {
          console.log('----- storage-read ignoring empty message!')
        }
      }
    }.bind(this));


  }
  RED.nodes.registerType("storage-read", FirebaseAdmin);
}