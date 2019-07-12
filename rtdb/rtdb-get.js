

let oldpath

module.exports = function(RED) {

  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const cb = (res)=>{
      //console.log('firebase get result '+res)
      //console.dir(res)
      let val = res.val()
      //console.log('val='+val)
      node.send({payload:val})
    }

    let setUpListener = (path)=>{
      //console.log('rtdb-get setUpListener for path '+path)
      if(oldpath){
        this.admin.database().ref(oldpath).off('value', cb)
      }
      this.admin.database().ref(path).on('value', cb)
      oldpath = path
    }

    if(config.cred){
      let c = RED.nodes.getNode(config.cred)
      this.admin = c.admin
    }

    //console.log('------------------------------- rtdg-get config')
    //console.dir(config)
    this.path = config.path
    if(this.path){
      setUpListener(this.path)
    }


    //console.log('configuring rtdb-get to listen for messages')
    node.on('input', function(msg) {
      let path = this.path
      if(msg && msg.payload){
        path = msg.payload.path
        setUpListener(path)
      }
    }.bind(this));

    setUpListener(path)

  }
  RED.nodes.registerType("rtdb-get", FirebaseAdmin);
}