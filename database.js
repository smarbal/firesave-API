// This class is a wrapper for database connection. It centeralizes generic CRUD operations.
// Here, we are implementing the Database class with Singleton design pattern

const { user } = require("firebase-functions/v1/auth");

const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

//  Singleton is a design pattern where we create only a single instance (or object) from a class
require("firebase/auth");

class Database {
    constructor() {
      if (this.instance) return this.instance; // This is the key idea of implementing singleton. Return the same instance (i.e. the one that has already been created before)
  
      // We only proceedd to the following lines only if no instance has been created from this class
      Database.instance = this;
  
      const admin = require("firebase-admin"); // To access Firestore API
  
      // Since the functions and firestore run on the same server,
      //  we can simply use default credential.
      // However, if your app run different location, you need to create a JSON Firebase credentials
      var serviceAccount = require("./serviceAccountKey.json");

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
  
      this.firestore = admin.firestore();
      this.auth= admin.auth()


    }
  
    // Define some helper methods for CRUD operations
    // Note that, each firestore function call is asynchronous.
    //  Thus, you want to use the 'await' keyword at the caller.
  
    async create(collection, document) {
      const result = await this.firestore.collection(collection).add(document);
      document.id = result.id;
      return document;
    }
  
    async getList(collection) {
      const result = await this.firestore.collection(collection).get();
  
      const list = [];
      result.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        list.push(data);
      });
      return list.length ? list : null;
    }
  
    async get(collection, id) {
      const result = await this.firestore.collection(collection).doc(id).get();
      if (!result.exists) return null; // Record not found
  
      const doc = result.data();
      doc.id = result.id;
      return doc;
    }
    
    async get_where(collection, id) {
      const result = await this.firestore.collection(collection).doc(id).get();
      if (!result.exists) return null; // Record not found
  
      const doc = result.data();
      doc.id = result.id;
      return doc;
    }

    async set(collection, id, document) {
      const doc = this.firestore.collection(collection).doc(id);
      const result = await doc.get();
  
      //if (!result.exists) return null; // Record not found
  
      await doc.set(document);
  
      document.id = id;
      return document;
    }
  
    async delete(collection, id) {
      const doc = this.firestore.collection(collection).doc(id);
      const result = await doc.get();
  
      if (!result.exists) return null; // Record not found
  
      await doc.delete();
  
      return { id };
    }

    async create_user(email,username,password, full_name){
      //Firebase documentation is wrong and says to use getAuth() but that's for frontend
      return this.auth.createUser({
        email: email,
        username: username,
        password: password,
        displayName: full_name,
      })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid);
        return userRecord.uid
      })
      .catch((error) => {
        console.log('Error creating new user:', error);
      });
      }
    
    async verify_token(idToken){
      // idToken comes from the client app
      this.auth.verifyIdToken(idToken)
        .then((decodedToken) => {
          const uid = decodedToken.uid;
          return uid 
        })
        .catch((error) => {
          console.log("Error verifying token")
        });
    }

    isAuthorized( uid, token_uid, allowSameUser) {
    
          if (allowSameUser && uid && token_uid === uid)
              return next();
    
          /*if (!role)
              return res.status(403).send();
    
          if (opts.hasRole.includes(role))
              return next();
          */
          return res.status(403).send();
      
    }

    async get_user(token){
      const uid = await this.verify_token(token)
      return this.auth.getUser(uid);

    }

    async add_to_array(collection, doc , array, value){

      const docRef = this.firestore.collection(collection).doc(doc);

      const added = await docRef.update({
        [array]: FieldValue.arrayUnion(value)
      });
      

    }

    async remove_from_array(collection, doc , array, value){

      const docRef = this.firestore.collection(collection).doc(doc);

      docRef.update({
        [array]: FieldValue.arrayRemove(value)
      });
      

    }
     
  } 

  
  
  module.exports = new Database();
  