"use strict";

$(document).ready(function() {
    if (Utils.existsInDocument(".gallery-block")) {
        var gallery = new Gallery();
        gallery.initialize();
    }
});