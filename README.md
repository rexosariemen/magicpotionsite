# <a href="https://magicpotionsite.herokuapp.com/" target="_blank">Curology Magic Potion Launch Site</a>
### This is the order page for the new curology skin care product
## Getting Started
### On the Browser
The Application is deployed on Heroku as <a href="https://magicpotionsite.herokuapp.com/">magicpotionsite.</a>
- Note that it may take few seconds for the webpage to initially load as
the app is using the free web dyno which goes to sleep after 30-minutes of no web
traffic. Thus, there will be a short delay before the web dyno is active on the first request.

### On your Local Machine
To run the application on your local machine: 
- <a href="https://github.com/rexosariemen/magicpotionsite.git">Clone the repository</a>
- Run `npm install` to install dependencies for the server
- Run `cd client && npm install` to install dependencies for client
- Run `npm run dev` from the root directory to start both the server and client.

The client will be running on localhost `3000` and the server on `5500`

## Technologies used
- <a href="https://github.com/facebook/react" alt="">React</a>
- <a href="https://github.com/expressjs/express" alt="">Express</a>
- <a href="https://github.com/expressjs/express" alt="">mongo DB</a>

## Front End Architecture
The front end architecture was built on React. This provided the flexibility to
build encapsulated compoenent that was used to manage the form input in the state.

Controlled Component was used to manage the data from the form input elements
for validation. 
Error was handled by bindding catch method to the post req. The error object was then accessed for error type specific to the one passed in from the post `/magic` endpoint before generating a useful message to the client on the error. 

Forms are validated in the front end to minimize server calls. On change, the 
validation function is invoked to provide prompts to the user if the information
provided in the input field is invalid or incomplete.

## API Architecture
RESTful API is implemented. This is to allow for handling multiple types of  calls, handling different data formats and structural change depending on future needs of the application. 

The application has endpoints for `post`, `get`, `patch` and `delete`. The current UI only
has access to the post `./magic` endpoint.
#### POST `/magic` Endpoint
This endpoint adds new order to the DB. Before adding the order, the checkOrder 
route middleware checks that the same user (using the email to check duplicates)
is not making an order of more than 3 potions for a given month. If a user's
current order and previous order(s) quantity is greater than 3, the
order is rejected with BAD REQUEST (400) status and a notification to the user on 
exceeding 3 potions for the given month.
Note that the api does not check for duplicate names, as up to three orders of 1 potion 
can be made by the same user for a given month since the minimum quantity for any
given order is 1. However, for any order that makes the total (previous and current)
orders exceeds 3, it is rejected and not saved to the DB.
When post req is successful, the user receives a notification to this effect and 
the server responds with the uid of the order and a CREATED (201) status.
#### GET `/magic/uid` Endpoint
This endpoint retrieves the order for the given uid with an OK (200) status on success.
NOT FOUND (404) on failure
#### PATCH `/magic/uid` Endpoint
This updates an existing order for the given uid and respond with the 
uid and the fulfilled column on success. And a NOT FOUND (404) on failure
#### DELETE `/magic/uid` Endpoint
The delete endpoint deletes the order for the given uid with a `resource deleted successfully` response on success and NOT FOUND (404) on failure

## Data Schema
Mongoose was used to implement a typed schema with validations. And to ensure 
flexibility in data structure definition along with making the mongodb interaction
simple. 

In addition to defining the structure and default values for the document, the schema
was used to enforce validation for all fields except the street2 column. This was to ensure
that all fields are properly filled to process client orders.
#### On Scaling
As the number of order increases, more computing power will be needed to process 
previous orders - in order to avoid orders exceeding the max for the given month before accepting new ones - as the 
current design requires. This presents a pitfall as an inefficiently-designed 
aggregation for the database, in addition to over-use of indices. <br />
To efficiently scale, first have to remove the potential of running through every 
document in the database multiple times. This can be avoided by restructuring the 
current design to save each orders to users' accounts. Creating users account will 
optimize the specific amount of RAM and storage space for each compute unit.
By creating users and storing their orders under their account - updating the 
aggregations limit the amount of data being processed in each stage of the pipeline.
This can easily be done since mongoose is tolerant to updates on data schema.

## To improve the current application
1. Use street address validation api like <a href="https://smartystreets.com/products/apis/us-street-api">SmartStreets</a>, to validate each address object before submitting the form to the server.
2. Update the data schema and the checkOrder middleware to create users and store 
orders under respective users. This should improve the algorithm currently being used by the
checkOrder middleware to check previous orders only under the current user rather than 
going through every single documents in the db.
3. Provide more details to users on their previous orders to create a better 
user story, especially with regards to making orders of more than 3 potions in 
a one month period
4. Write test to cover both the client and server code.