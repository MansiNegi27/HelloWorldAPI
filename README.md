# HelloWorldAPI
This repository contains code for a simple RESTful JSON API that listens to a port 3000 by default.
Although it can also listen on port 5000 for different environment.
When someone posts anything to the route /hello,a welcome message, in JSON format is returned.
When someone posts anything to the route /goodbye, a message, in JSON format is returned.
However, if the method is not POST,a statuscode of 404 is returned
