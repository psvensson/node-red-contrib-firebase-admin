# node-red-contrib-firebase-admin

A node-red module that wraps the server-side  admin SDK of firebase, firestore, et.c.

# Overview
The main difference of this module and all other firebase/store modules for node-red is
that it takes a service account credential token as configuration.

This means that the nodes can run outside of the normal security rules, in admin mode, which is usefule when running on the back-end.

# Realtime Database (rtdb) Nodes

## rtdb-get
Get data from a path in the rtdb database

input: {payload: {path: 'foo/bar'}}

output: <whatever data was at the path 'foo/bar' in the rtdb database>

## rtdb-set
Set data at a path in the rtdb database. Use 'on' snapshot so will fire everytime the data at the path changes and so drive flow executin from that point.

input: {payload: {path: 'foo/bar'}, {some: 'object', foo: 17}}

## rtdb-query
Set up a reactive wuery for a path in the rtdb database. 

input: {payload: {path: 'foo/bar', queries:[], on: 'value}}

on: 'value' (can also be 'child_added', 'child_removed', 'child_changed', 'child_moved'). 
If an 'on' property is missing, on: 'value' is assumed as default

Where each query is an object that can look like either of the following examples;
    
- {startAt: 'foo'}
- {endAt: 'bar'}
- {equalTo: 'quux'}
- {orderBy: 'child', value: 'height'}  (can also be 'key' or 'value)
- {limitTo: 'last', value: 3}  (can also be 'first')

output: [an array of results for the query]


# Firestore nodes

TBD

# Storage nodes

TBD

# Auth nodes

TBD

