"use strict";

var Utils = new function() {
    this.existsInDocument = function(selector) {
        return $(selector).length > 0;
    };

    this.getIndexOfElement = function(element, type) {
        return $(type).parent().children(type).index($(element));
    };

    // Credit to: http://opensourcehacker.com/2011/12/01/calculate-aspect-ratio-conserving-resize-for-images-in-javascript/
    this.calculateAspectRatioFit = function(srcWidth, srcHeight, maxWidth, maxHeight) {

        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

        return { width: srcWidth*ratio, height: srcHeight*ratio };
    };

    this.getDataFromElements = function(dataID, selector) {
        var data = [];

        $(selector).each(function(i, obj) {
            data.push($(obj).data(dataID));
        });

        return data;
    };
};