# firesave-API
NodeJS API for a people managing service to help in case of a fire

## Initialisation 

You need to configure your MysQL credentials, the JWT password and the server settings (host, port) in a `.env` file : 
```
DB_USER = '***'
DB_PASSWORD = '***'
SERVER = '***'
PORT = ***
JWT_PASSWORD = '***'
```
When running the application for the firsttime make sure that sequelize forces the synchronisation (in `database/index.js`) :
`sequelize.sync({force : true});`
This will create all the needed tables in your database. Make sure to set it to false once it's done, or else your data will be erased after each initialisation.  

Ideally you will want to add manually a promotion and then an admin user into your database to get things started (you won't be able to do it through the API). 
