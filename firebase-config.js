const _admin = require('firebase-admin')
const {Storage} = require('@google-cloud/storage');

let global = this.context().global
let init = (global.get('firebase') !== undefined)
let s

module.exports = function(RED) {
  function FirebaseConfigNode(n) {
    RED.nodes.createNode(this,n);
    //------------------------------
    this.cred = n.cred
    this.dburl = n.dburl
    this.bucket = n.bucket
    //------------------------------
    this.admin = _admin
    this.storage = s
    if(!init){
      console.log('setting admin....')
      this.credentials = JSON.parse(this.cred);
      let credobj = _admin.credential.cert(this.credentials)
      //console.dir(credobj)
      //process.env.GOOGLE_APPLICATION_CREDENTIALS = 'creds.json'
      init = true

      console.log('*** parsed firebase credentials: '+this.credentials.type+', project-id: '+this.credentials.project_id)
      _admin.initializeApp({
        credential: credobj,
        databaseURL: this.dburl
      });

      global.set('firebase', _admin)
      console.log('setting storage....')

      s = new Storage({
        //projectId: 'something-2e584',
        //email: 'firebase-adminsdk-d1xiy@something-2e584.iam.gserviceaccount.com',
        credentials: this.credentials
      })

      global.set('cloud-storage', s)

      //s = new Storage()
    }
  }
  RED.nodes.registerType("firebase-config", FirebaseConfigNode);
}
