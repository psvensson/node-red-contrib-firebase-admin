

let unsub

module.exports = function(RED) {
  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    if(config.cred){
      let c = RED.nodes.getNode(config.cred)
      this.admin = c.admin
    }

    const cb = (res)=>{
      console.log('firestore get result '+res)
      console.dir(res)
      let val = res.data()
      console.log('val='+val)
      node.send({payload:val})
    }

    node.on('input', function(msg) {
      if(msg && msg.payload){
        const path = msg.payload.path
        if(unsub){
          unsub()
        }
        this.admin.firestore().doc(path).onSnapshot(cb)

      }
    }.bind(this));


  }
  RED.nodes.registerType("firestore-get", FirebaseAdmin);
}