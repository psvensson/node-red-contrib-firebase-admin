// "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc0NGY2MGU5ZmI1MTVhMmEwMWMxMWViZWIyMjg3MTI4NjA1NDA3MTEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTczNDA4MDM4MzUwLWI2aGNoN3NvamliNmkxNjZtN3BtOWtmcDNvaHJoMzRrLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTczNDA4MDM4MzUwLWI2aGNoN3NvamliNmkxNjZtN3BtOWtmcDNvaHJoMzRrLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA5ODI2MDk5NjU1NTU2Mjk4ODI0IiwiZW1haWwiOiJwc3ZlbnNzb25AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJmVkpiSWRzMFFuVlBWbm50VUtoSmFnIiwiaWF0IjoxNTk2OTY1OTMxLCJleHAiOjE1OTY5Njk1MzF9.Rq8bsj-RlcMdVjk2UuJrUykyJcRcaTRohQD788lCigIVxLedxIJ5rZRndRVzSTUmX2n_sgCdtiFLN2w16KHy5v2053fNXvlyEuR4t1fctt_LU-OygLGW4qeSPEWonu7zBmhy2aaJBHnx0NzqRbCYewm0zVrI_BEgju-OvJAlH5pud9Ycs7o7d6NaJsJp0JW3bEcz0bgETA2jWlYIR3ZeQSRxYcjwTZ2OhbocMEWYVFVoTF8n0PVlFe21cZs3RfA2KWfuVvwvrB2BGku6rkVANoT8UJKkhLP81NipgPzIowui72O5pbCCm5senj5D_VMh74NmptHSLAKTGHv36EzzPA"


module.exports = function (RED) {
    function FirebaseAdmin(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        if (config.cred) {
            let c = RED.nodes.getNode(config.cred)
            this.admin = c.admin
        }

        node.on('input', function (msg) {
            if (msg && msg.payload) {
                console.log('verify-idtoken got input')
                console.dir(msg)
                const idtoken = msg.payload.idtoken
                try {
                    this.admin.auth().verifyIdToken(idtoken)
                        .then(function (decodedToken) {
                            console.log('verify-idtoken got result:')
                            console.dir(decodedToken)
                            this.status({ fill: "green", shape: "ring", text: '' });
                            node.send({ payload: decodedToken })
                        }.bind(this)).catch(function (error) {
                            console.log('verify-idtoken caught an exception!')
                            console.dir(error)
                            this.status({ fill: "red", shape: "ring", text: error.errorInfo.message });
                        }.bind(this));
                } catch (ex) {
                    this.status({ fill: "red", shape: "ring", text: ex.code });
                }

            }
        }.bind(this));


    }
    RED.nodes.registerType("verify-idtoken", FirebaseAdmin);
}