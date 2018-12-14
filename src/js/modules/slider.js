$(function () {
    const owlCarousel = require('owl.carousel2');
    if (window.innerWidth < 768) {
        var owl = $('.slider-case');

        // $('.slider-case').owlCarousel({
        owl.owlCarousel({
            items: 1,
            responsive: {
                768: {
                    items: 2
                },
            },
            loop: false,
            rewind: true,
            autoplay: true,
            autoplayTimeout: 4000,
            autoplayHoverPause: true,
            smartSpeed: 500, //slide speed smooth
            margin: 0,
            // autoWidth: true,
            dots: false,
            nav: false,
            center: false
        });
    }
});