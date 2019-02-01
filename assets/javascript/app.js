$(document).ready(function () {

    $("#header").load("header.html");
    $("#footer").load("footer.html");


    // Popup Image
    $('.image-popup-vertical-fit').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        mainClass: 'mfp-img-mobile',
        image: {
            verticalFit: true
        }
    });



});