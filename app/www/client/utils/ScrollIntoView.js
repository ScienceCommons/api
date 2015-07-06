"use strict";

function scrollIntoViewIfOutOfView(el) {
  //var scrollY = window.pageYOffset();
  //var scrollX = window.pageXOffset();

  var heightOfPage = window.innerHeight;
  var widthOfPage = window.innerWidth;

  var rect = el.getBoundingClientRect();
  var yOffset = window.pageYOffset;
  var xOffset = window.pageXOffset;
  var newYOffset = yOffset;
  var newXOffset = xOffset;

  if (rect.top < 0) {
    newYOffset = yOffset + rect.top;
  } else if (rect.bottom > heightOfPage) {
    if (rect.height < heightOfPage) {
      newYOffset = yOffset + (rect.bottom - heightOfPage);
    } else {
      newYOffset = yOffset + rect.top;
    }
  }

  if (rect.left < 0) {
    newXOffset = xOffset + rect.left;
  } else if (rect.right > widthOfPage) {
    if (rect.width < widthOfPage) {
      newXOffset = xOffset + (rect.right - widthOfPage);
    } else {
      newXOffset = xOffset + rect.left;
    }
  }

  if (newYOffset !== yOffset || newXOffset !== xOffset) {
    window.scrollTo(newXOffset, newYOffset);
  }
}

module.exports = scrollIntoViewIfOutOfView;
