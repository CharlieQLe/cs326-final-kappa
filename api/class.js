'use strict';

/**
 * Process a get request to retrieve every class.
 * 
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>} request 
 * @param {Response<any, Record<string, any>, number>} response 
 */
function getAll(request, response) {
    response.end(JSON.stringify({ result: "Get all classes received!" }));
}

/**
 * Process a post request to create a class.
 * 
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>} request 
 * @param {Response<any, Record<string, any>, number>} response 
 */
function postCreate(request, response) {
    response.end(JSON.stringify({ result: "Add a class received!" }));
}

/**
 * Process a get request to retrieve the data of a class.
 * 
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>} request 
 * @param {Response<any, Record<string, any>, number>} response 
 */
function getClass(request, response) {
    response.end(JSON.stringify({ result: "Get class data received!" }));
}

/**
 * Process a post request to edit a specific class.
 * 
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>} request 
 * @param {Response<any, Record<string, any>, number>} response 
 */
function postEdit(request, response) {
    response.end(JSON.stringify({ result: "Edit class received!" }));
}

/**
 * Process a post request to remove a specific class.
 * 
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>} request 
 * @param {Response<any, Record<string, any>, number>} response 
 */
function postRemove(request, response) {
    response.end(JSON.stringify({ result: "Remove class received!" }));
}


/**
 * Process a get request to search for files with tags.
 * 
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>} request 
 * @param {Response<any, Record<string, any>, number>} response 
 */
function getSearch(request, response) {
    response.end(JSON.stringify({ result: "Search received!" }));
}

module.exports = { getAll, postCreate, getClass, postEdit, postRemove, getSearch };