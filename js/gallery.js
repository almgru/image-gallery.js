"use strict";

var gallery = new function() {
    this.imageLinks = [];
    this.imageIndex = 0;
    this.fullscreen = false;
    this.maxWidth = 0;
    this.maxHeight = 0;
    this.originalSizePercentage = 0.6;      // TODO: Automatically fetch popup width percentage from css

    var GALLERY_FADE_SPEED = 300;
    var FULLSCREEN_SIZE_PERCENTAGE = 0.98;
    var that = this;

    this.initialize = function() {
        var $galleryPopup = $("#gallery-popup");

        $galleryPopup.hide();

        this.imageLinks = getImageLinks();
        setupEventListeners();

        updateMaxDimensions();
    };

    var show = function() {
        /* Fades out previous image before opening the new one, in case
           gallery is already open*/
        $("#gallery-popup").fadeOut(GALLERY_FADE_SPEED, function() {
            updatePopupSize(that.imageLinks[that.imageIndex]);
            setImageSrc(that.imageLinks[that.imageIndex]);
            $("#gallery-popup").fadeIn(GALLERY_FADE_SPEED);
        });
    };

    var hide = function() {
        $("#gallery-popup").fadeOut(GALLERY_FADE_SPEED);
    };

    var toggleFullscreen = function() {
        that.fullscreen = !that.fullscreen;
        updateMaxDimensions();
        updatePopupSize(that.imageLinks[that.imageIndex]);
    };

    var next = function() {
        setImageIndex(that.imageIndex + 1);
        show();
    };

    var previous = function() {
        setImageIndex(that.imageIndex - 1);
        show();
    };

    var setupEventListeners = function() {
        $(document).click(function(e) {
            switch ($(e.target).attr("class")) {
                case "gallery-thumbnail":
                    setImageIndex(getIndexOfElement(e.target, ".gallery-thumbnail"));
                    show();
                    break;

                case "gallery-button":
                    if (e.target.id === "gallery-close") {
                        hide();
                    } else if (e.target.id === "gallery-maximize") {
                        toggleFullscreen();
                    }
                    break;

                case "gallery-arrow":
                    if (e.target.id === "gallery-next") {
                        next();
                    } else {
                        previous();
                    }
                    break;

                default:
                    if (e.target.id !== "gallery-img") {
                        hide();
                    }
                    break;
            }
        });

        $(".gallery-arrow").hover(function(e) {
            $(e.target).fadeTo("fast", 0.25);
        }, function(e) {
            $(e.target).fadeTo("fast", 0);
        });

        $(".gallery-button").hover(function(e) {
            $(e.target).fadeTo("fast", 0.75);
        }, function(e) {
            $(e.target).fadeTo("fast", 0.5);
        });

        $(window).resize(function() {
            updateMaxDimensions();
            updatePopupSize(that.imageLinks[that.imageIndex]);
        });
    };

    var getImageLinks = function() {
        var links = [];

        $(".gallery-thumbnail").each(function(i, obj) {
            links.push($(obj).data("full-src"));
        });

        return links;
    };

    var setImageIndex = function(i) {
        var index = i;
        var maxLength = that.imageLinks.length - 1;

        if (index < 0) {
            index = maxLength;
        } else if (index > maxLength) {
            index = 0;
        }

        that.imageIndex = index;
    };

    var setImageSrc = function(imgSrc) {
        var $galleryImg = $("#gallery-img");

        $galleryImg.hide();
        $galleryImg.attr("src", imgSrc);
        $("#gallery-load-img").show();
        console.log("showing");
    };

    var updateMaxDimensions = function() {
        if (that.fullscreen) {
            that.maxWidth = window.innerWidth * FULLSCREEN_SIZE_PERCENTAGE;
            that.maxHeight = window.innerHeight * FULLSCREEN_SIZE_PERCENTAGE;
        } else {
            that.maxWidth = window.innerWidth * that.originalSizePercentage;
            that.maxHeight = window.innerHeight * that.originalSizePercentage;
        }
    };

    var updatePopupSize = function(imgSrc) {
        var image = new Image();

        image.onload = function() {
            var dimensions = calculateAspectRatioFit(image.width, image.height, that.maxWidth, that.maxHeight);

            $("#gallery-popup").css({"width": dimensions.width, "height": dimensions.height});
            $("#gallery-img").show();
            $("#gallery-load-img").hide();
        };

        image.src = imgSrc;
    };

    // Credit to: http://opensourcehacker.com/2011/12/01/calculate-aspect-ratio-conserving-resize-for-images-in-javascript/
    var calculateAspectRatioFit = function(srcWidth, srcHeight, maxWidth, maxHeight) {

        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

        return { width: srcWidth*ratio, height: srcHeight*ratio };
    };
};
