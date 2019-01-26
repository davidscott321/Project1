var name;
var comment;
var timestamp;
var likes = 0;
var dislikes = 0;

var config = {
  apiKey: "AIzaSyDIyLZeHUFGzB3MAPK0EGfiPpow2TTlLE8",
  authDomain: "test-ca7d5.firebaseapp.com",
  databaseURL: "https://test-ca7d5.firebaseio.com",
  projectId: "test-ca7d5",
  storageBucket: "",
  messagingSenderId: "923842235113"
};

firebase.initializeApp(config);

var database = firebase.database();

function writeData() 
{
  // this uses Moment.js to save the timestamp of the child being added. This is good to display when the comments were added.
  timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
  
  var newData={
      name: name,
      comment: comment,
      timestamp: timestamp,
      likes: likes,
      dislikes: dislikes
  }

  database.ref().push(newData);
}

// When the add comment button is clicked, execute this code.
// The last thing you have to add here is the code to clear the name and comment fields filled out by the user after they hit the 'add comment' button.
$(".btn").on("click", function(event) {
    event.preventDefault();

    name = $("#name").val().trim();
    comment = $("#comment").val().trim();
    
    writeData();
});

// Write the code necessary to increment the like value of a specified child by 1 and then display on the page. This section will only update the database if you get it to work. After that you have to write code to display the code to the webpage similar to the database.ref().on() method below that displays when a child is added to the Firebase.
$(".likeButton").on("click", function(event) {
  // Grab current likes from the database using the child ID of the button that was just clicked and save it to the 'likes' variable in the file I.E. (likes = CHILD.likes)
  // Increment the likes I.E. (likes++)
  // Save the likes back to the database.

});

// Similar to the section above, you can copy and paste if you get that section figured out.
$(".dislikeButton").on("click", function(event) {
  // create code here
});

// This displays a new row of data every time a child is added to the database.
// We still need to figure out how to limit the number of comments that display after the 'add comment' button is clicked. We should not display an unlimited number of comments here.
database.ref().on("child_added", function(snapshot) {
  $(".postArea").append("<hr><div class='row'><div class='col-lg-3'><p>"+snapshot.val().name+"</p><p>"+snapshot.val().timestamp+"</p></div><div class='col-lg-6'>"+snapshot.val().comment+"</div><div class='col-lg-3'><button type='button' class='btn btn-secondary likeButton'>Like</button>&nbsp;&nbsp;Likes: "+snapshot.val().likes+"<br><button type='button' class='btn btn-secondary dislikeButton'>Dislike</button>&nbsp;&nbsp;Dislikes: "+snapshot.val().dislikes+"</div></div>");
});