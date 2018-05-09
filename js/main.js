///////////////////////////////////////////////////////////////////////////////
// Matt Michaels
// matt@mattmichaels.info
// 412-860-5048
///////////////////////////////////////////////////////////////////////////////
// Submitted 12/27/2017
///////////////////////////////////////////////////////////////////////////////
// Meeting the following guidelines
// 1. Start / Pause / Resume button
// 2. Dots appear every 1 second
// 3. Dots fall at constant speed
// 4. Dots fall speed can adjust between 10px - 100px per second
// 5. Dots fall speed can be adjusted with a slider
// 5. Dot size randomizes between 10px - 100px
// 6. Dot value = inverse of size (10px = 10pts, 100px = 1pt)
// 7. Touch dot = disappear & add points to score
///////////////////////////////////////////////////////////////////////////////

var container;    // Container
var speed;        // Options for time adjustments
var i = 0;        // Counter for dot creation
var score = 0     // Counter for scoreboard

///////////////////////////////////////////////////////////////////////////////
// Starting the game on load.
///////////////////////////////////////////////////////////////////////////////
function init() {
  container = document.getElementById("dot_container");             // Defining container
  speed = 85.1;                                                     // Sets starting speed to 10 pixels per second
  dotCreator();                                                     // Start running the dot creation function
};

///////////////////////////////////////////////////////////////////////////////
// Dot killer.
///////////////////////////////////////////////////////////////////////////////
function destroy(evt) {
  container.removeChild(evt.target);
};

///////////////////////////////////////////////////////////////////////////////
// Dot creation loop
///////////////////////////////////////////////////////////////////////////////
function dotCreator() {

  setInterval(function() {
    var dot = document.createElement("span");                       // Creating dots with 1s interval
    var size = Math.floor(Math.random() * (100 - 10 + 1)) + 10;     // Setting random sizes between 10 - 100

    if( $('#power_button').hasClass("playing")) {
      i++;                                                          // Add interval count

      dot.className = "canvas__dot clickable";
      dot.style.width = size + "px";                                // Dynamic size
      dot.style.height = size + "px";
      dot.style.right = Math.random()*100 + "%";                    // Random position
      dot.style.WebkitAnimation = "fall " + speed + "s linear";     // Use current speed w/ CSS 'fall' animation
      container.appendChild(dot);                                   // Add it
      dot.addEventListener("webkitAnimationEnd", destroy);          // Listen for animation end
    }
  }, 1000);
};

///////////////////////////////////////////////////////////////////////////////
// Start screen
///////////////////////////////////////////////////////////////////////////////
$('#startup').click( function() {
  $(this).fadeOut();
  $('.controlbar__button').toggleClass('playing');
});

///////////////////////////////////////////////////////////////////////////////
// Play / Pause function
///////////////////////////////////////////////////////////////////////////////
$('.controlbar__button').click( function() {
  $('.canvas__dot').toggleClass('clickable pause');                 // Pausing animation, disabling click action

  $('body').toggleClass('disabled');                                // Setting body as disabled

  $(this).toggleClass('playing');                                   // Button messages
  $(this).removeClass('start-it-up');                               // Button messages
});


///////////////////////////////////////////////////////////////////////////////
// Clearing dots / Updating score
///////////////////////////////////////////////////////////////////////////////
$(document).on('click', '.clickable', function() {                  // Listening for clicks on .canvas__dots added to DOM
  var size = $(this).width() + 6;                                   // Checking the actual size of dot + border size

  function getScore() {                                             // Calculating rounded scores based off of dimension
    if (size < 50) {                                                // Checking less than 50
      var lessThan = Math.round(10 - 0.1 * size);
      score = score + lessThan;                                     // Updating score
    } else {                                                        // Checking more than 50
      var moreThan = Math.round(10 - 0.09 * size);
      score = score + moreThan;                                     // Updating score
    }
  }

  getScore();                                                       // Running score generator
  $(this).remove();                                                 // Destroy dot
  document.getElementById("score").innerHTML = score;               // Write updated point
});


///////////////////////////////////////////////////////////////////////////////
// Pixel Per Second speed being calculated
///////////////////////////////////////////////////////////////////////////////
$("#pps_throttle").on("input", function updateSpeed(event, ui) {
  var alldots = $('.canvas__dot');                                  // Capturing all pre-existing dots
  var vh = $(window).height();                                      // Calculating current Viewport Height
  var rate = this.value;                                            // Capturing #slider value
  var pps = vh / rate;                                              // Defining PPS by dividing 'vh' by 'rate'
  speed = pps;                                                      // Updating the global PPS speed for new dots

  $('.controlbar__speed--rate').html(                               // Printing out the PPS based off of the 'rate'
    "Currently animating at " + rate + " pixels per second"
  );
  $(alldots).css('animation', "fall " + pps + 's linear');          // Assigning the PPS speed to pre-existing dots
});

window.onload = init;
