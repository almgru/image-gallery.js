"use strict";

var Gallery = function() {
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
        $("#gallery-popup").hide();
        this.imageLinks = Utils.getDataFromElements("full-src", ".gallery-thumbnail");
        setupEventListeners();
        updateMaxDimensions();
    };

    var show = function() {
        updatePopupSize(that.imageLinks[that.imageIndex]);
        setImageSrc(that.imageLinks[that.imageIndex]);
        $("#gallery-popup").fadeIn(GALLERY_FADE_SPEED);
    };

    var hide = function() {
        $("#gallery-popup").fadeOut(GALLERY_FADE_SPEED, function() {
            if (that.fullscreen) {
                Utils.leaveFullscreen("gallery-popup");
            }
        });
    };

    var toggleFullscreen = function() {
        that.fullscreen = !that.fullscreen;
        updatePopupSize(that.imageLinks[that.imageIndex]);

        if (that.fullscreen) {
            Utils.enterFullscreen("gallery-popup");
        }
        else {
            Utils.leaveFullscreen("gallery-popup");
        }
    };

    var next = function() {
        setImageIndex(that.imageIndex + 1);
        updatePopupSize(that.imageLinks[that.imageIndex]);
        setImageSrc(that.imageLinks[that.imageIndex]);
    };

    var previous = function() {
        setImageIndex(that.imageIndex - 1);
        updatePopupSize(that.imageLinks[that.imageIndex]);
        setImageSrc(that.imageLinks[that.imageIndex]);
    };

    var setupEventListeners = function() {
        $(document).click(function(e) {
            switch ($(e.target).attr("class")) {
                case "gallery-thumbnail":
                    that.fullscreen = false;
                    updatePopupSize();
                    setImageIndex(Utils.getIndexOfElement(e.target, ".gallery-thumbnail"));
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
            updatePopupSize(that.imageLinks[that.imageIndex]);
        });
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

        updateMaxDimensions();

        image.onload = function() {
            var $galleryImg = $("#gallery-img");
            var dimensions = Utils.calculateAspectRatioFit(image.width, image.height, that.maxWidth, that.maxHeight);

            $galleryImg.css({"width": dimensions.width, "height": dimensions.height});
            $("#gallery-popup").css({"width": dimensions.width, "height": dimensions.height});

            $galleryImg.show();
            $("#gallery-load-img").hide();
        };

        image.src = imgSrc;
    };
};
