/*
    primary file for the api
*/
//dependencies
const http = require('http');
const config = require('./config');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;

//Instantiate the http server
var httpServer = http.createServer(function(req,res)
{
  server(req,res);
});
//tell servers to listen on port as per the environment
httpServer.listen(config.httpPort,function(){
  console.log('httpServer listening on port '+config.httpPort+' in mode: '+ config.env_name);
});
//create a unified server for http servers
var server = function(req,res) {
      //get the trimmed path from the url
      var parsedUrl = url.parse(req.url,true);
      var unTrimmedpath = parsedUrl.pathname.toLowerCase();
      var path = unTrimmedpath.replace(/^\/+|\/+$/g,'');
      //now get headers,paylaod, method
      var method = req.method.toUpperCase();
      var headers = req.headers;
      var buffer ='';
      var queryStringObject = parsedUrl.query;
      //creating a new decoder to decode the data coming in
      var decoder = new StringDecoder('utf-8');
      //start storing payload into the buffer as it comes in a stream
      req.on('data',function(data){
       buffer += decoder.write(data);
    });
    //As req emits end event,respond to the request
    req.on('end',function()
    {
        buffer+=decoder.end();
        //choose a given handler to handle the request
        //if no handler is matched, redirect to NOT_FOUND handler
        var choosenHandler = typeof(router[path]) != 'undefined'? router[path] : handlers.notFound;
        //Decide the data object to send callback
        var sendData =
        {
          'headers': headers,
          'payload': buffer,
          'method' : method,
          'path': path,
          'queryStringObject':queryStringObject
        };
        choosenHandler(sendData,function(statusCode,payload)
        {
          //if paylaod is not provided choose a default payload
            payload = typeof(payload) == 'object' ? payload : {};
            var payload_string = JSON.stringify(payload);
          //if statusCode is not defined choose a default statusCode
            statusCode = typeof(statusCode)=='number'? statusCode : 200;
          //set the response as JSON
          res.setHeader('Content-Type','application/json');
          //send the response
          res.writeHead(statusCode);
          res.end(payload_string);
          //log the reponse to the console
          console.log('The payload sent to request is : '+ payload_string + ' the statusCode is '+ statusCode);
        });

    });

};
// create a handler object
var handlers ={};
//define request handlers on the router
//this returns a welcome message in JSON format
handlers.hello = function(data,callback)
{
  if(data.method != 'POST')
  {
    return callback(404);
  }
    callback(408,{'message':' Hi there, you are welcome! '});
};

handlers.goodbye = function(data,callback)
{
  callback(412,{'message':'Bye Bye! see you soon !'});
};
//a notFound handler
handlers.notFound = function(data,callback)
{
   callback(404);
};
//set up the router
var router = {
  'hello': handlers.hello,
  'goodbye':handlers.goodbye
}
