# WebService
Web service that accepts HTTP requests and returns responses based on the conditions.


To run the web service you must have node installed, if you dont have it installed install it from https://nodejs.org/en/download/

Open the directory where you have downloaded the repository on the terminal and use 'node Server.js' command to start the server.

The server will run on port 3000.

With the help of Postman you can post a request, If you dont have it installed get it from https://www.postman.com/downloads/

To add transactions use POST request to http://localhost:3000/add

To spend points use POST request to http://localhost:3000/spend

GET request to  http://localhost:3000/get  will give you the available points for each payer.

