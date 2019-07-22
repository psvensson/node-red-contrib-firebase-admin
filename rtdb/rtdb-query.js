
let msgin
let oldpath
let oldeventtype

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
      msgin.payload = val
      node.send(msgin)
    }

    node.on('input', function(msg) {
      if(msg && msg.payload){
        msgin = msg
        const path = msg.payload.path
        const eventtype = msg.payload.on || 'value'
        if(oldpath){
          this.admin.database().ref(oldpath).off(oldeventtype, cb)
        }
        let ref = this.admin.database().ref(path)

        // Decorate with queries
        if(msg.payload.queries && msg.payload.queries.length > 0){
          console.log('---------------------  found queries')
          let ordered = false
          msg.payload.queries.forEach((query)=>{
            console.dir(query)
            if(typeof query.orderBy !== 'undefined'){
              ordered = true
              console.log('------- setting explicit orderBy')
              if(query.orderBy === 'value'){
                ref = ref.orderByValue()
              } else if(query.orderBy === 'key'){
                ref = ref.orderByKey()
              } else if(query.orderBy === 'child'){
                ref = ref.orderByChild(query.value)
              }
            }
            if(typeof query.startAt !== 'undefined'){
              console.log('------- startAt '+query.startAt)
              ref = ref.startAt(query.startAt)
            }
            if(typeof query.endAt !== 'undefined'){
              console.log('------- endAt '+query.endAt)
              ref = ref.endAt(query.endAt)
            }
            if(typeof query.equalTo !== 'undefined'){
              console.log('------- equalTo '+query.equalTo)
              ref = ref.equalTo(query.equalTo)
            }
            if(typeof query.limitTo !== 'undefined'){
              console.log('------- limitTo '+query.limitTo+' -> '+query.value)
              if(query.limitTo === 'first'){
                ref = ref.limitToFirst(query.value)
              } else if(query.limitTo === 'last'){
                ref = ref.limitToLast(query.value)
              }
            }
          })
        if(!ordered) {
            console.log('setting implicit orderBy')
            ref = ref.orderByValue()
          }
        }

        //console.log('finished rtdb query is')
        //console.dir(ref.queryParams_)

        ref.on(eventtype, cb)
        oldpath = path
        oldeventtype = eventtype
      }
    }.bind(this));


  }
  RED.nodes.registerType("rtdb-query", FirebaseAdmin);
}