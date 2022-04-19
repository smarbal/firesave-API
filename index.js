const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express()

app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("./database");


app.use(express.json()) //Pour parser du json

exports.api = functions.https.onRequest(app);

// To handle "Function Timeout" exception
exports.functionsTimeOut = functions.runWith({
    timeoutSeconds: 300,
});


app.get("/", (req, res, next) =>
    res.json({ message: "Firebase function service is working" })
);

app.post('/login', function (req, res, next) {
    if (!req.body.email) return res.status(400).json({error: 'missing email'});
    if (!req.body.password) return res.status(400).json({error: 'missing password'});
  
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE) // don't persist auth session
    .then(function() {
      return firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
    })
    .then((user) => { // https://firebase.google.com/docs/reference/js/firebase.User
      let uid = user.uid;
  
      // set cookie with UID or some other form of persistence
      // such as the Authorization header
      res.cookie('__session', { uid: uid }, { signed: true, maxAge: 3600 });
      res.set('cache-control', 'max-age=0, private') // may not be needed. Good to have if behind a CDN.
      res.send('You have successfully logged in');
  
      return firebase.auth().signOut(); //clears session from memory
    })
    .catch((err) => {
      next(err);
    });
  });


app.post('/register', async function (req, res, next) {
    if (!req.body.email) return res.status(400).json({error: 'missing email'});
    if (!req.body.password) return res.status(400).json({error: 'missing password'});
    
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const full_name = req.body.full_name;

    const auth = await db.create_user(email,username,password,full_name);


      
    //Returns the uid of the user

    const user = { username: username,
                    email:email,
                    full_name:full_name,
                    following: [username],
                    posts: []
    };

    const result = await db.set("users", username, user);

    return res.json(result);
  });

  
app.post('/newpost',async function (req, res, next) {  //takes the tokenId and the post content as parameters
  const token = req.body.token
  const content = req.body.content
  const user = db.get_user(token)
  //const user = req.body.user //while client isn't implemented, can't have token
  //db.isAuthorized(uid, token_uid, true);

  const post = { content : content,
                 likes: "", 
                 user: user.username,
                 timestamp: Date.now()
  }

  const result = await db.create("posts", post);
  
  db.add_to_array('users', user.username, "posts", result.id)  //user.username  // add the post id to the user's posts, so it's easier to fetch in the database
  return res.json(post)

});

app.post('/like', async function (req, res, next) {
  const token = req.body.token
  const post = req.body.post
  const user = db.get_user(token)


  result = db.add_to_array('posts', post, 'likes', user.username)

  return res.status(200).json({Succes: user.username + 'liked post ' + post});

});

app.post('/unlike', async function (req, res, next) {
  const token = req.body.token
  const post = req.body.post
  const user = db.get_user(token)


  result = db.remove_from_array('posts', post, 'likes', user.username)

  return res.status(200).json({Succes: user.username + 'unliked post ' + post});

});

app.post('/follow', async function (req, res, next) {
  const token = req.body.token
  const follow_user = req.body.username

  const user = db.get_user(token)


  result = db.add_to_array('user', user.username, 'following', follow_user)

  return res.status(200).json({Succes: user.username + 'unliked post ' + post});

});

app.post('/unfollow', async function (req, res, next) {
  const token = req.body.token
  const follow_user = req.body.username
  const user = db.get_user(token)


  result = db.remove_from_array('user', user.username, 'following', follow_user)

  return res.status(200).json({Succes: user.username + 'unliked post ' + post});

});


app.get('/posts', async function (req, res, next) {

  const username = req.query.username

  const doc = await db.get('users',username)
  following = doc.following

  var all_posts = []
  /* Fetch every post of the followed users and append them in a list. 
     Could have used the 'in' query method of Firestore but would have been limited to 10 users
  */
  following.forEach(async function(user, index, array) {
    posts_snapshot = await db.firestore.collection('posts').where('user', '==', user).get();  // Maybe add a date limitation ? : .where('timestamp', '>=', Date.now() - 86400 // one week ago)
    posts_snapshot.forEach(doc => {
      all_posts.push(doc.data());
    });
    if (index == array.length - 1){
      const sorted = all_posts.sort((a, b) => b.timestamp - a.timestamp)
      return res.status(200).json(sorted)

    }
  });
  
  
});

app.get('/user', async function (req, res, next) {

  const username = req.query.username

  const doc = await db.get('users',username)
  return res.status(200).json(doc)

});

module.exports = app;
  

app.listen(8080, () => {
    console.log('Listening on port 8080')
})