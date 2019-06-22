

module.exports = function(RED) {
  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    if(config.cred){
      let c = RED.nodes.getNode(config.cred)
      this.admin = c.admin
    }

    node.on('input', function(msg) {
      if(msg && msg.payload){
        console.log('rtdb-push got input')
        console.dir(msg)
        const path = msg.payload.path
        const obj = msg.payload.obj
        console.log('storing '+obj+' at rtdb path '+path)
        this.admin.database().ref(path).push(obj).then((res)=>{
          console.log('firebase set result '+res)
          console.dir(res)
          node.send({payload: res})
        })
      }
    }.bind(this));


  }
  RED.nodes.registerType("rtdb-push", FirebaseAdmin);
}