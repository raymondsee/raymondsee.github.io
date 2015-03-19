$(function(){
    /*
     * toglle the lanuage selector at the bottom right of the page
     */
    $("a.lang-selector").on("click", function() {
        var langList = $("ul#lang-list");
        if (langList.is(":visible")) {
            $("ul#lang-list").slideUp();
        } else {
            $("ul#lang-list").slideDown();
        }
        return false;
    });
    
    /*
     * Show and play the video on Play Button clicked
     */
    $("button.play-button").on("click", function(){
        $(this).hide();
        $(".video-container").show(function(){
            $(".video-container").find("video")[0].play();
        });
        
        return false;
    });
    
    $(".video-container").on("click", function(e){
        if ($(e.target).hasClass("video-container")) {
            var video = $(this).find("video");
            $(this).hide();
            $("button.play-button").show();
        }
        
        return false;
    });
    
    /*
     * Check if specific element is scrolled into view
     */
    //var initTargetTop = null;
    var initTargetTop = document.getElementById("business-container").getBoundingClientRect().top;
    var hasScrolled = false;
    $(window).scroll(function(){
        var currentTargetTop = document.getElementById("business-container").getBoundingClientRect().top;
        if (!hasScrolled && Math.abs(currentTargetTop - initTargetTop) > 200) {
            hasScrolled = true;
        } 
        
        if (isScrolledIntoView("business-container") && initTargetTop !==null && hasScrolled ) {
            slideInBusinessFeatures();
            $(window).unbind("scroll");
        }
    });
    
    /*
     * Carouel
     */
    $(".carousel-wrapper .prev a, .carousel-wrapper .next a, .carousel-wrapper ol.bullets li").on("click", function(){
        slideCarousel($(this))
        return false;
    });
    
    /*
     * 
     * Toggle the offcanvas menu when clicking the hamburger button
     */
    $("button.hamburger-button, button.close-button").on("click", function() {
        var offcanvasMenu = $(".offcanvas-menu");
        if (offcanvasMenu.hasClass("in")) {
            closeOffcanvasMenu();
        } else {
            openOffcanvasMenu();
        }
        
        
        return false;
    });
    
    // Close offcanvas menu when click outside of the menu and only when the menu is open
    $(document).on("click tap", function(e){
        if ($(".offcanvas-menu").hasClass("in") && 
            $(e.target).parents(".offcanvas-menu").length ==0 && 
            !$(e.target).hasClass("offcanvas-menu")
            ) {
            closeOffcanvasMenu();
        }
    });
    
    
    // swap hight resolution images if it is on retina display
    if (isOnRetinaDisplay()) {
        $("img").each(function(){
            originalSrc = $(this).attr('src');
            if (originalSrc.indexOf("@2x")<0) {
                dotIndex = originalSrc.lastIndexOf(".");
                newSrc = originalSrc.slice(0, dotIndex) + "@2x" + originalSrc.substr(dotIndex);
                $(this).attr('src', newSrc);
            }
        });
    }
    

});

var openOffcanvasMenu = function () {
    $(".offcanvas-menu").removeClass("out").addClass("in");
}

var closeOffcanvasMenu = function () {
    $(".offcanvas-menu").removeClass("in").addClass("out");
}
var slideCarousel = function (clickedElement) {
    var currentSlide = $(".slides-wrapper ul li.active");
    var currentSlideId = currentSlide.attr("data-slide-id") * 1;
    var targetSlideId = 1;
    var numberOfSlides = $(".slides-wrapper ul li").length;
    var direction = 1; // default right, -1 is left;

    if (clickedElement.parent().hasClass("prev")) { // prev button clicked
        targetSlideId = currentSlideId - 1;
        direction = -1;
        if (targetSlideId < 1) {
            targetSlideId = numberOfSlides;
        }
    } else if (clickedElement.parent().hasClass("next")) { // next button clicked
        targetSlideId = currentSlideId + 1;
        direction = 1;
        if (targetSlideId > numberOfSlides) {
            targetSlideId = 1;
        }
    } else { // bullet button clicked
        targetSlideId = clickedElement.attr("data-slide") * 1;
        if (targetSlideId< 1 || targetSlideId > numberOfSlides) {
            targetSlideId = 1;
        }

        if (currentSlideId < targetSlideId) {
            direction = 1;
        } else {
            direction = -1;
        }
    }

    if (currentSlideId != targetSlideId) {
        var slidesArray = $(".slides-wrapper ul li");
        var targetSlide = slidesArray[targetSlideId-1];

        if (direction > 0) {
            $(targetSlide).css("margin-left", "100%");
        } else {
            $(targetSlide).css("margin-left", "-100%");
        }

        if (direction > 0) {
            $(currentSlide).removeClass("active").animate({
                zindex: 2,
                marginLeft: "-100%"
            });
            
            $(targetSlide).addClass("active").animate({
                zindex: 4,
                marginLeft: "0%"
            });
        } else {
            $(currentSlide).removeClass("active").animate({
                zindex: 2,
                marginLeft: "100%"
            });
            
            $(targetSlide).addClass("active").animate({
                zindex: 4,
                marginLeft: "0%"
            });
        }
        
        //adjust bullet active state
        var bullets = $(".carousel-wrapper ol.bullets li");
        bullets.removeClass("active");
        $(bullets[targetSlideId-1]).addClass("active");

    }
    return false;
}

var slideInBusinessFeatures = function () {
    /*
     * if screnn size is less than 992px, don't do the animation
     */
    if ($(window).width() < 992) {
        return false;
    }
    
    $("#key").addClass("reset").css("margin-left", "865px").css("opacity", "1");
        
    setTimeout(function() {
        $("#watch").addClass("reset").css("margin-left", "525px").css("opacity", "1");
    }, 300);

    setTimeout(function() {
        $("#devices").addClass("reset").css("margin-left", "185px").css("opacity", "1");
    }, 800);

    setTimeout(function() {
        $("#business-container").attr("style", null);
        $("#key").removeClass("reset").attr("style", null);
        $("#watch").removeClass("reset").attr("style", null);
        $("#devices").removeClass("reset").attr("style", null);
        
        $("#business-container").addClass("normal");//xyz
    }, 2000);

    return false;
}

var isScrolledIntoView = function (targetId) {
    var el = document.getElementById(targetId);
    var targetTop = el.getBoundingClientRect().top;
    var targetBottom = el.getBoundingClientRect().bottom;

    var isVisible = (targetTop >= 0) && (targetBottom <= window.innerHeight);
    return isVisible;
}

var isOnRetinaDisplay = function () {
    var retina = window.devicePixelRatio > 1;
    
    return retina;
}

var adjustCarouselHeight = function () {
    var slideHeight = $(".slides-wrapper ul li").height();
    $(".slides-wrapper ul").css("height", slideHeight);
    return false;
}