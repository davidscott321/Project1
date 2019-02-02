
var name = "";
var comment = "";
var timestamp;
var likes = 0;
var dislikes = 0;

var reference;

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
  reference= $("#name").val().trim();
  // this uses Moment.js to save the timestamp of the child being added.
  timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
  
  var newData={
      name: name,
      comment: comment,
      timestamp: timestamp,
      likes: likes,
      dislikes: dislikes
  }

  database.ref(name).update(newData);
}

// When the add comment button is clicked, execute this code.
$(".btn").on("click", function(event) {
    event.preventDefault();

    name = $("#name").val().trim();
    comment = $("#comment").val().trim();
    
    writeData();
});

// Likes function

$(document).on("click", ".likeButton", function(event) {
  likes++;
 
  database.ref($(this).attr('data-id')).update({
    likes: likes
  
  });
  $(".likesHolder[data='" + database.ref(name).name +"']").html(database.ref(name).likes);
});

//Dislikes function
$(document).on("click", ".dislikeButton", function(event) {

  dislikes++;
 
  database.ref(name).update({
    dislikes: dislikes

  });
  $(".dislikesHolder[data='" + database.ref(name).name +"']").html(database.ref(name).dislikes);
});

database.ref().on("value", function(snapshot) {
  console.log(snapshot.val());

  likesCounter = snapshot.val().likesCount;
  dislikesCounter = snapshot.val().dislikesCount;
  

  $("#click-value").text(snapshot.val().clickCount);
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// This displays a new row of data every time a child is added to the database.
database.ref().on("child_added", function(snapshot) {
  // var newData = snapshot.val();
  // console.log(newData, 'test')
  
  $(".postArea").append("<hr><div class='row'><div class='col-lg-3'><p>"
    +snapshot.val().name+"</p><p>"
    +snapshot.val().timestamp+"</p></div><div class='col-lg-6'>"
    +snapshot.val().comment+"</div><div class='col-lg-3'><button type='button' class='btn btn-secondary likeButton' data-id="+snapshot.val().name+">Like</button>&nbsp;&nbsp;Likes: <span class='likesHolder' data-id='"+snapshot.val().name+"'>"+snapshot.val().likes+"</span><br><button type='button' class='btn btn-secondary dislikeButton'data-id="+snapshot.val().name+">Dislike</button>&nbsp;&nbsp;Dislikes: <span class='dislikesHolder' data-id='"+snapshot.val().name+"'>"+snapshot.val().likes+"</span>");
});


