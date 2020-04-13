
let msgin
let unsub

module.exports = function(RED) {
  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    if(config.cred){
      let c = RED.nodes.getNode(config.cred)
      this.admin = c.admin
    }

    const setup = (path)=>{
      if(unsub){
        unsub()
      }
      this.admin.firestore().doc(path).get().then(cb)
    }

    const cb = (res)=>{
      console.log('firestore get result '+res)
      console.dir(res)
      let val = res.data()
      console.log('val='+val)
      if(msgin){
        msgin.payload = val
        node.send(msgin)
      } else {
        node.send({payload: val})
      }
    }

    node.on('input', function(msg) {
      if(msg && msg.payload){
        msgin = msg
        const path = msg.payload.path
        setup(path)

      }
    }.bind(this));

    if(config.path){
      setup(config.path)
    }


  }
  RED.nodes.registerType("firestore-get", FirebaseAdmin);
}
