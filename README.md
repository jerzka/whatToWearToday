# whatToWearToday
"What to wear today" is a project created at the ComIT NodeJS course during three months. I took the idea of my web application from everyday life. Many women have the same dilemma every morning, standing in front of an open closet full of clothes - "What to wear today?" The web application is the solution and helps manage clothes in a wardrobe. <br/>
Users can store information about their clothes, create their outfits on a canvas, and, as a social interaction, rate others' outfits which caught their eye! The web application tries to suggest what outfit you should choose for a specific weekday or occasion and how to match your clothes. 
Aren't these great features to try out?!

A user must sign in to use the "What to wear today?" web application. If a user hasn't an account - no problem - there is the registration form! The application collects for user authentication only two information: email and password. Application helps the user validate his inputs on the front-end side by checking the proper construction of the e-mail address and informing the user that his input data is wrong with the <b>Bootstrap</b> component - toast.
There is also a back-end validation in the <b>Mongodb model's schema</b>, which says that email and password are required to add a new user.
To provide a secure way to store user information, I store users' passwords in a hashed form. For password hashing, I use the hash function supplied by the <b>bcrypt library</b>.<br/>
After signing in, <b>the user is authenticated</b>. I use the <b>JSON Web Token</b> industry standard to create web tokens shared in a cookie with a browser. The token's signature is created with a secret key the creator only knows.<br/>
I mention that this secret key I store in <b>environmental variables</b>, and they are not committed to GitHub. There are also different environmental variables for the <b>MongoDB database</b> and <b>Firebase Storage</b> credentials. Of course, in a production environment, the environment variables have to be provided.<br/>
The authentication function is a <b>middleware function</b>, and I use it along the application with routes to which only authenticated users have access. I also use middleware functions to upload photos to the Firebase storage. It is cloud storage which provides uploads and downloads of images or videos. I upload clothes and outfits images and retrieve a URL link to save in a MongoDB database.<br/>
"What to wear today?" web application's data are modeled with the <b>ODM Mongoose</b>. This tool provides built-in validators, middleware functions, and helper methods for <b>CRUD operations</b> and queries. Apropos queries, I implemented <b>server-side searching</b>, giving search criteria in a route parameter. <br/>
Almost all pages (404 page is static) in my application are generated with the <b>Handlebars Template</b> language. It compiles templates into JavaScript functions which gives execution templates fast, and what I like, it allows you to write your helpers. I wrote that helper for displaying data, seasons section and rating stars. Handlebars also have helpful built-in helpers like #if, #unless or #each to iterate input objects. That is why "What to wear today?" is a <b>Server Side Rendered (SSR)</b> web application.
