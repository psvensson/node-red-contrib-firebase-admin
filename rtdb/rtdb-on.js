

let oldpath
let msgin

module.exports = function(RED) {

  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const cb = (res)=>{
      console.log('firebase get result '+res)
      //console.dir(res)
      let val = res.val()
      //console.dir(val)
      if(msgin){
        msgin.payload = val
        node.send(msgin)
      } else {
        node.send({payload: val})
      }

    }

    let setUpListener = (path)=>{
      console.log('rtdb-on setUpListener for path '+path)
      if(oldpath){
        this.admin.database().ref(oldpath).off('value', cb)
      }
      if(path){
        this.admin.database().ref(path).on('value', cb)
        oldpath = path
      }  else {
        console.log('----- rtdb-on got empty path !!')
        console.dir(config)
      }
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


    //console.log('configuring rtdb-on to listen for messages')
    node.on('input', function(msg) {
      let path = this.path
      if(msg && msg.payload){
        path = path || msg.payload.path
        msgin = msg
        setUpListener(path)
      }
    }.bind(this));

  }
  RED.nodes.registerType("rtdb-on", FirebaseAdmin);
}