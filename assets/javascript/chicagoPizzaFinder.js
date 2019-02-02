$( document ).ready(function() {
  $(".results").hide();
});

var currentNeighborhood;
var lat;
var lon;
var limitFlag = false;
var currentSort = "real_distance";
var currentSortMessage = "Nearest Distance - Ascending";
var currentOrder = "asc";
var currentCustomSearch = "Enter a whole number in USD.";
var priceLimit;
var APIKey = "970787db61d7cd3d75995d95ca6ad545";
var userInput = false;
var neighborhoods = [{name:"Humboldt Park",lat:"41.9028",lon:"-87.7071"},{name:"Wicker Park",lat:"41.9088",lon:"-87.6796"},{name:"Downtown",lat:"41.8757",lon:"-87.6243"},{name:"Rogers Park",lat:"42.0106",lon:"-87.6696"},{name:"Austin",lat:"41.8929",lon:"-87.7616"},{name:"Brighton Park",lat:"41.8194",lon:"-87.6990"},{name:"Hyde Park",lat:"41.7943",lon:"-87.5907"}];

var queryURL;

$(".initial").on("click", function(event) {
  currentNeighborhood = $(this).html();

  for(var i=0;i<neighborhoods.length;i++)
  {
    if(currentNeighborhood===neighborhoods[i].name)
    {
      lat = neighborhoods[i].lat;
      lon = neighborhoods[i].lon;
      break;
    }
  }

  $(".contents").empty();
  displayContent();
  initiateClickListeners();

  displayAPIResults();
});

function initiateClickListeners()
{
  $(".neighborhoodSelect").on("click", function(event) {
    currentNeighborhood = $(this).html();

    for(var i=0;i<neighborhoods.length;i++)
    {
      if(currentNeighborhood===neighborhoods[i].name)
      {
        lat = neighborhoods[i].lat;
        lon = neighborhoods[i].lon;
        break;
      }
    }
    displayAPIResults();
  });

  $(".sortSelect").on("click", function(event) {
    if($(this).html()==="Nearest Distance - Ascending")
    {
      currentSort="real_distance";
      currentSortMessage="Nearest Distance - Ascending";
      currentOrder="asc";
    }
    else if($(this).html()==="Ratings - Ascending")
    {
      currentSort="rating";
      currentSortMessage="Ratings - Ascending";
      currentOrder="asc";
    }
    else
    {
      currentSort="rating";
      currentSortMessage="Ratings - Descending";
      currentOrder="desc";
    }

    displayAPIResults();
  });

  $(".priceSearch").on("click", function(event) {
    event.preventDefault();
    currentCustomSearch = $("#inlineFormInput").val().trim();

    if(currentCustomSearch === "")
    {
      $(".modal-body").html("<p>You did not enter anything in the search bar. Please enter a whole dollar amount.</p>");
      $("#myModal").modal();
      limitFlag=false;
      currentCustomSearch = "Enter a whole number in USD.";
      $(".setCustomPlaceholder").html('<input type="text" class="form-control mb-2" id="inlineFormInput" placeholder="'+currentCustomSearch+'">');
    }
    else if(isNumeric(currentCustomSearch)===false)
    {
      $(".modal-body").html("<p>Your input is not valid due to it not being a whole number. Please enter a whole dollar amount.</p>");
      $("#myModal").modal();
      limitFlag=false;
      currentCustomSearch = "Enter a whole number in USD.";
      $(".setCustomPlaceholder").html('<input type="text" class="form-control mb-2" id="inlineFormInput" placeholder="'+currentCustomSearch+'">');
    }
    else if(currentCustomSearch==="0")
    {
      $(".modal-body").html("<p>You entered zero(0). The max average has been removed as a filter.</p>");
      $("#myModal").modal();
      limitFlag=false;
      currentCustomSearch = "Enter a whole number in USD.";
      $(".setCustomPlaceholder").html('<input type="text" class="form-control mb-2" id="inlineFormInput" placeholder="'+currentCustomSearch+'">');
      
    }
    else if(currentCustomSearch.startsWith("0"))
    {
      $(".modal-body").html("<p>You started this number with a zero(0). Please enter a whole dollar amount.</p>");
      $("#myModal").modal();
      limitFlag=false;
      currentCustomSearch = "Enter a whole number in USD.";
      $(".setCustomPlaceholder").html('<input type="text" class="form-control mb-2" id="inlineFormInput" placeholder="'+currentCustomSearch+'">');
    }
    else
    {
      limitFlag=true;
      displayAPIResults();
    }
  });
}

function isNumeric(value) 
{
  return /^-{0,1}\d+$/.test(value);
}

function displayContent()
{
  var text = '                \
    <div class="row text-center">  \
      <div class="col-lg-4">  \
        <h4>Neighborhood: </h4> \
        <div class="dropdown"> \
          <button class="btn btn-secondary dropdown-toggle neighborhoodTitle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> \
            '+currentNeighborhood+' \
          </button> \
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton"> \
            <a class="dropdown-item neighborhoodSelect" href="#">Humboldt Park</a> \
            <a class="dropdown-item neighborhoodSelect" href="#">Logan Square</a> \
            <a class="dropdown-item neighborhoodSelect" href="#">Downtown</a> \
            <a class="dropdown-item neighborhoodSelect" href="#">Rogers Park</a> \
            <a class="dropdown-item neighborhoodSelect" href="#">Austin</a> \
            <a class="dropdown-item neighborhoodSelect" href="#">Brighton Park</a> \
            <a class="dropdown-item neighborhoodSelect" href="#">Hyde Park</a> \
          </div> \
        </div> \
      </div> \
      <div class="col-lg-4"> \
        <h4>Sort by:</h4> \
        <div class="dropdown"> \
          <button class="btn btn-secondary dropdown-toggle sortTitle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> \
              '+currentSortMessage+' \
          </button> \
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton"> \
            <a class="dropdown-item sortSelect" href="#">Nearest Distance - Ascending</a> \
            <a class="dropdown-item sortSelect" href="#">Ratings - Ascending</a> \
            <a class="dropdown-item sortSelect" href="#">Ratings - Descending</a> \
          </div> \
        </div> \
      </div> \
      <div class="col-lg-4">  \
        <h4>Max average cost for two people:</h4> \
        <form> \
          <div class="form-row align-items-center"> \
            <div class="col-sm-9 setCustomPlaceholder"> \
              <input type="text" class="form-control mb-2" id="inlineFormInput" placeholder="'+currentCustomSearch+'"> \
            </div> \
            <div class="col-sm-2"> \
                <button type="submit" class="btn btn-secondary mb-2 priceSearch" id="myBtn">Submit</button> \
            </div> \
          </div> \
        </form> \
      </div> \
    </div> \
  </div> \
  <div class="resultsNumber text-center"></div> \
  ';

  $(".instructions").html('There are additional filters on this page. You can search by neighborhood, distance/ratings, and by a maximum average cost for two people. Entering a zero(0) in the search field removes that filter from the search results.<br><br>');
  $(".contents").append(text);

  $(".results").show();
}

function displayAPIResults()
{
  $(".neighborhoodTitle").html(currentNeighborhood);
  $(".sortTitle").html(currentSortMessage);
  $(".setCustomPlaceholder").html('<input type="text" class="form-control mb-2" id="inlineFormInput" placeholder="'+currentCustomSearch+'">');

  searchZomato();
  // googleMapsAPI();
}

function searchZomato()
{
  $(".zomatoResults").html("");

  if(limitFlag===true)
  {
    queryURL = "https://developers.zomato.com/api/v2.1/search?apikey="+APIKey+"&count=1000&lat="+lat+"&lon="+lon+"&radius=200&cuisines=82&sort="+currentSort+"&order="+currentOrder+"";

    $.ajax({
      url: queryURL,
      method: "GET"
    })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {
      var validRestaurants = [];
      var count = 0;
      var resultsDone = false;
      var i = 0;
  
      while(resultsDone===false)
      {
        if(response.restaurants[i].restaurant.average_cost_for_two<=currentCustomSearch)
        {
          validRestaurants.push(response.restaurants[i]);
          count++;
          i++;
        }
        else
        {
          i++;
        }

        if(count===15)
        {
          resultsDone=true;
        }
      }

      for(var i=0;i<validRestaurants.length;i++)
      {
        $(".resultsNumber").html("<br><p>Displaying Results 15 out of "+response.results_found+"</p>");
        $(".zomatoResults").append("<tr>");
          $(".zomatoResults").append("<td><a href='"+validRestaurants[i].restaurant.url+"' target='_blank'>"+validRestaurants[i].restaurant.name+"</a></td>");
          $(".zomatoResults").append("<td>"+validRestaurants[i].restaurant.location.address+"</td>");
          $(".zomatoResults").append("<td>"+validRestaurants[i].restaurant.cuisines+"</td>");
          $(".zomatoResults").append("<td>"+validRestaurants[i].restaurant.average_cost_for_two+"</td>");
          if(validRestaurants[i].restaurant.user_rating.aggregate_rating===0)
          {
            $(".zomatoResults").append("<td>No Rating</td>");
          }
          else
          {
            $(".zomatoResults").append("<td>"+validRestaurants[i].restaurant.user_rating.aggregate_rating+"</td>");
          }
        $(".zomatoResults").append("</tr>");
      }
    });
  }
  else
  {
    queryURL = "https://developers.zomato.com/api/v2.1/search?apikey="+APIKey+"&count=15&lat="+lat+"&lon="+lon+"&radius=200&cuisines=82&sort="+currentSort+"&order="+currentOrder+"";

    $.ajax({
      url: queryURL,
      method: "GET"
    })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {
      for(var i=0;i<response.restaurants.length;i++)
      {
        $(".resultsNumber").html("<br><p>Displaying Results "+response.restaurants.length+" out of "+response.results_found+"</p>");
        $(".zomatoResults").append("<tr>");
          $(".zomatoResults").append("<td><a href='"+response.restaurants[i].restaurant.url+"' target='_blank'>"+response.restaurants[i].restaurant.name+"</a></td>");
          $(".zomatoResults").append("<td>"+response.restaurants[i].restaurant.location.address+"</td>");
          $(".zomatoResults").append("<td>"+response.restaurants[i].restaurant.cuisines+"</td>");
          $(".zomatoResults").append("<td>"+response.restaurants[i].restaurant.average_cost_for_two+"</td>");
          if(response.restaurants[i].restaurant.user_rating.aggregate_rating===0)
          {
            $(".zomatoResults").append("<td>No Rating</td>");
          }
          else
          {
            $(".zomatoResults").append("<td>"+response.restaurants[i].restaurant.user_rating.aggregate_rating+"</td>");
          }
        $(".zomatoResults").append("</tr>");
      }
    });
  }
} 