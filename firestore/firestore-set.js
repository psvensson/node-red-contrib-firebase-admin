

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
        console.log('firestore-set got input')
        console.dir(msg)
        const path = msg.payload.path
        const obj = msg.payload.obj
        console.log('storing '+obj+' at firestore path '+path)
        this.admin.firestore().doc(path).set(obj).then((res)=>{
          console.log('firestore set result '+res)
          console.dir(res)
        })
      }
    }.bind(this));


  }
  RED.nodes.registerType("firestore-set", FirebaseAdmin);
}