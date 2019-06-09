

let oldpath

module.exports = function(RED) {
  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    if(config.cred){
      let c = RED.nodes.getNode(config.cred)
      this.admin = c.admin
    }

    const cb = (res)=>{
      console.log('firebase get result '+res)
      console.dir(res)
      let val = res.val()
      console.log('val='+val)
      node.send({payload:val})
    }

    node.on('input', function(msg) {
      if(msg && msg.payload){
        const path = msg.payload.path
        if(oldpath){
          this.admin.database().ref(oldpath).off('value', cb)
        }
        this.admin.database().ref(path).on('value', cb)
        oldpath = path
      }
    }.bind(this));


  }
  RED.nodes.registerType("rtdb-get", FirebaseAdmin);
}