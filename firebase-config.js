const _admin = require('firebase-admin')
let init = false

module.exports = function(RED) {
  function FirebaseConfigNode(n) {
    RED.nodes.createNode(this,n);
    this.cred = n.cred
    this.dburl = n.dburl
    this.admin = _admin
    if(!init){
      console.log('setting admin....')
      init = true
      this.credentials = JSON.parse(this.cred);
      this.dburl = this.dburl
      console.log('*** parsed firebase credentials: '+this.credentials.type+', project-id: '+this.credentials.project_id)
      _admin.initializeApp({
        credential: _admin.credential.cert(this.credentials),
        databaseURL: this.dburl
      });
    }
  }
  RED.nodes.registerType("firebase-config", FirebaseConfigNode);
}