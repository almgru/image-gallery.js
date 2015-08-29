"use strict";

function existsInDocument(selector) {
    return $(selector).length > 0;
}

function getIndexOfElement(element, type) {
    return $(type).parent().children(type).index($(element));
}