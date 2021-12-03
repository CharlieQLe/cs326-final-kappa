'use strict'

const { client } = require('./initializeServer.js');

// tasks {
//      "name": "",
//      "description": ""
//      "date": ""
//      "time": ""
//      "class": ""
// }
// ==============================================================


/**
 * Process a get request to retrieve every task.
 * 
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>} request 
 * @param {Response<any, Record<string, any>, number>} response 
 */

 function getAll(request, response) {
    client.db('final-kappa').collection("tasks").find({ user: request.params.user })
        .toArray()
        .then(tasks => response.end(JSON.stringify({ status: 0, result: tasks })))
        .catch(err => response.end(JSON.stringify({ status: -1, result: `Error on tasksAPI.getAll: ${err}` })));
}

/**
 * Process a post request to create a task.
 * 
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>} request 
 * @param {Response<any, Record<string, any>, number>} response 
 */
 function postCreate(request, response) {
    
    // atm, no tag or class field
    
    client.db('final-kappa').collection("tasks").findOne({
        name: request.body['name'],
        user: request.params.user
    })
        .then(existingTask => {
            if (existingTask) {
                response.end(JSON.stringify({ status: -1, result: "Error in tasksAPI.postCreate: task with the same name already exists" }));
            } else {
                client.db('final-kappa').collection("tasks").insertOne({
                    name: request.body['name'],
                    user: request.params.user,
                    description: request.body['description'],
                    date: request.body['date'],
                    time: request.body['time']
                })
                    .then(_ => response.end(JSON.stringify({ status: 0, result: "Create task received!" })))
                    .catch(err => response.end(JSON.stringify({ status: -1, result: `Error in tasksAPI.postCreate: ${err}` })));
            }
        })
        .catch(err => response.end(JSON.stringify({ status: -1, result: `Error in tasksAPI.postCreate: ${err}` })));
}

/**
 * Process a post request to edit a task.
 * 
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>} request 
 * @param {Response<any, Record<string, any>, number>} response 
 */
 function postEdit(request, response) {
    client.db('final-kappa').collection("tasks").updateOne({
        name: request.body['name'],
        user: request.params.user
    }, {
        $set: {
            name: request.body['name'],
            description: request.body['description'],
            date: request.body['date'],
            time: request.body['time']
        }
    })
        .then(_ => response.end(JSON.stringify({ status: 0, result: "Edit task received!" })))
        .catch(err =>  response.end(JSON.stringify({ status: -1, result: `Error in tasksAPI.postEdit: ${err}` })));
}

/**
 * Process a post request to remove a task.
 * 
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>} request 
 * @param {Response<any, Record<string, any>, number>} response 
 */
 function postRemove(request, response) {
    client.db('final-kappa').collection("tasks").deleteOne({
        name: request.body['name'],
        user: request.params.user
    })
        .then(_ => response.end(JSON.stringify({ status: 0, result: "Remove task received!" })))
        .catch(err =>  response.end(JSON.stringify({ status: -1, result: `Error in tasksAPI.postRemove: ${err}` })));
}



module.exports = { getAll, postCreate, postEdit, postRemove };




