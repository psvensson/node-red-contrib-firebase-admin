# node-red-contrib-firebase-admin

A node-red module that wraps the server-side  admin SDK of firebase, firestore, cloud storage, etc.

*NOTE* This library uses similar names to other firebase modules. Check to ensure there is no overlap between config nodes, which may cause unpredictable results.

# Overview
The main difference of this module and all other firebase/store modules for node-red is
that it takes a service account credential token as configuration.

This means that the nodes can run outside of the normal security rules, in admin mode, which is useful when running on the back-end.

# Configuration Setup
**Firebase Service Account Credentials** This is a json of the service account credentials private key file. This can be found in Firebase console by clicking the cogwheel icon in the top left, going to "Project Settings" and to the "Service Accounts" tab. 
Click "Generate new private key", which should trigger a download. Open the file in an IDE and copy the text to the node configuration. It will like 
{
  "type": "service_account",
  "project_id": ...
  ...
}
**Firebase Database URL** The database URL for the database can be found in the respective databases in the console. 
The url has has a format like "https://myprojectname.firebaseio.com".



# Realtime Database (rtdb) Nodes

## rtdb-get and firestore-get
Get data from a path in the rtdb database

Input: **msg.payload** with json {"path": "foo/bar"}
Output: **msg.payload** is data at the path "foo/bar".

## rtdb-on and firestore-on
Set up a snapshot listener for a path in the rtdb database

Input: **msg.payload** with json {"path": "foo/bar"}
Output: Injects **msg.payload** with value of data was at path "foo/bar" on change

## rtdb-set
Set data at a path in the rtdb database. Uses onSnapshot and will fire every time the data at the path changes and so drive flow execution from that point.

Input: **msg.payload** with json {"path": "foo/bar", "obj": {"the": "object"}}

## rtdb-push
Pushes the new object onto an array under the path

Input: **msg.payload** with json {"path": "foo/bar", "obj": {"object": "toy","color":"blue"}}

## rtdb-query
Set up a reactive query for a path in the rtdb database. 

Input: **msg.payload** with json {"path": "foo/bar", queries:[], on: "value"}}
For **queries**, the array should contain a json object with the query parameters. Some examples:
- {"startAt": "foo"}
- {"endAt": "bar"}
- {"equalTo": "quux"}
- {"orderBy": "child", "value": "height"}  (can also be "key" or "value)
- {"limitTo": "last", "value": 3}  (can also be "first")

Optionally, **on**: "value" can be replaced with "child_added", "child_removed", "child_changed", "child_moved". If empty, "value" is *default*.

Output: **msg.payload** is an array[] of query results .



# Firestore nodes
## firestore-get
Get data from a path in the rtdb database

Input: **msg.payload** with json {"path": "foo/bar"}
Output: **msg.payload** is data at the path "foo/bar".

## firestore-on
Set up a snapshot listener for a path in the rtdb database

Input: **msg.payload** with json {"path": "foo/bar"}
Output: Injects **msg.payload** with value of data was at path "foo/bar" on change
## firestore-set
Set data at a path in the firestore database. Uses "onSnapshot" and will fire every time the data at the path changes and so drive flow execution from that point.

 {"path": "foo/bar", "obj": {"some": object, "foo": 17}}

## firestore-add
Adds the new object under the collection the path describes and assigns it a random id

Input: **msg.payload** is json object with "path" and "obj" keys {"path": "foo/bar", "obj": {"some": object, "foo": 17}}

Output: **msg.payload** becomes the ID of the new document

## firestore-query
Set up a reactive query for a collection in the firestore database.

Input: **msg.payload** is json object with "path", "limit, "startAt", "endAt", "orderBy", "orderDirection", and "queries" keys.
Notes: startAt and endAt follow the orderBy property. orderDirection defaults to "desc".
Ex
	{
		"path": "foo/bar",
		"limit": 7, 
		"startAt": 4000,  // follows the orderBy property
		"endAt": 4050, // follows the orderBy property
		"orderBy": "shoeSize",
		"orderDirection": "asc", //default is "desc"
		"queries":[
			["company", ["=="] "ACME"],
			["createdAt", ">", 1560099394242]
		]
	}

Output: **msg.payload** is an array of query results.


# Storage nodes
## storage-read
Read file data from a file at a given path under a given cloud storage bucket. 

Input: **msg.payload** is json object with optional "bucket" and optional "path", which override the default values set in the general firebase SDK settings.

	{
            "bucket": "xyzzyz123.appspot.com", 
            "path": "myFile.txt"
    }

Output: Buffer object containing the binary file contents. Can easily be converted to a string by calling toString() on the Buffer.
 
## storage-write
Writes the content of  JavaScript Buffer object to a file path in a storage bucket. 

Input: **msg.payload** is json object with optional "bucket" and "path" 

    { 
            "bucket": "abc.appspot.com", // optional, is otherwise set as node config
            "path": "foo/bar/baz.json", // optional, see above
            "contents": <Buffer obj>,
            "contentType": "application/json" }, // optional
            "metadata": { "very":"interesting"}, // optional
            "public": true, // optional
            "private": false // optional
    } 
    
Output: **msg.payload** is json object with "success" status and new "filename" string
    
## storage-list
Lists the contents of files in a bucket

If "path" is defined in the json payload, only files beginning with that path will be returned. If omitted, the root level of the bucket is returned in the payload.
A path can also be deep likes this; "foo/bar/baz". "delimiter" is the charatcer used to delimit directory levels, "/" by default. 

Input: **msg.payload** is json object with optional parameters
    
    {
            "bucket": "xyzzyz123.appspot.com",  // optional
            "path": "directory1", // optional
            "delimiter": "/" // optional
    }

Output: An array of google cloud-storage File objects. If you take this output and send it to a function which outputs a payload like this;

    {"files": array_of_File_obejcts}
    
The storage-read module will read all file contents and output an object of filename keyed Buffer objects instead of the normal one.    

## storage-delete
Deletes a file at a given path under a given cloud storage bucket. The default bucket to be used can be set in the general firebase SDK settings.
If the payload defines an optional bucket property, it will override the default bucket settings.

Input: **msg.payload** is json object with optional parameters

    {
            "bucket": "xyzzyz123.appspot.com", 
            "path": "myFile.txt"
    }

Output: An array of headers returned by the operation if all went well.


# Auth nodes

Dcoumentation and problem-solving hints can be found here; (https://firebase.google.com/docs/auth/admin/verify-id-tokens). Note that you need to explicitly get the correct id token in the client and send it to the back-end. 

## verify-idtoken
Decrypts a firebase client SDK JWT idToken into a user object.

Input: **msg.payload** is json object with optional parameters

    {
        idtoken: "eyJhbGciOiJSUz....fMrAUdK"
    }

Output: **msg.payload** returned is an array of user details.

    {
		"name": "Foo Foobarson", "picture": "https://...", ..
    }






#Use In Functions
After initializing, the reference to the firebase SDK is stored in the global context variable 'firebase', which can be used
in any function like this;

    let fb = global.get('firebase')
    fb.firestore().doc('foo/bar').get().then((ref)=>{
        let d = ref.data()
        node.send( {payload: {data: d}});
    })

The cloud-storage reference is also made available under the global context variable 'cloud-storage'.