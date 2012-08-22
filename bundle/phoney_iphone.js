(function() {
  var BACKDROP_FRAME, ISO_MAJOR_OFFSET, ISO_MINOR_OFFSET, ISO_SKEW, SCREENSHOT_URL, cacheBustUrl, createPhoneyPhone, drawStaticBackdropAndReturnTransformer, matrixTransformedForView;

  ISO_SKEW = 15;

  ISO_MAJOR_OFFSET = 50;

  ISO_MINOR_OFFSET = 5;

  BACKDROP_FRAME = {
    x: 0,
    y: 0,
    width: 320,
    height: 480
  };

  SCREENSHOT_URL = symbiote.baseUrlFor("screenshot");

  drawStaticBackdropAndReturnTransformer = function(paper) {
    var transformer;
    paper.canvas.setAttribute("width", "100%");
    paper.canvas.setAttribute("height", "100%");
    paper.canvas.setAttribute("viewBox", "0 0 380 720");
    transformer = symbiote.transformStack();
    transformer.skew(0, ISO_SKEW).translate(6, 6);
    paper.rect(0, 0, 360, 708, 40).attr({
      fill: "black",
      stroke: "gray",
      "stroke-width": 4
    }).transform(transformer.desc());
    transformer.push().translate(180, 655);
    paper.circle(0, 0, 34).transform(transformer.desc()).attr("fill", "90-#303030-#101010");
    paper.rect(0, 0, 22, 22, 5).attr({
      stroke: "gray",
      "stroke-width": 2
    }).transform(transformer.push().translate(-11, -11).descAndPop());
    transformer.translate(24, 120).translate(-ISO_MAJOR_OFFSET, 0);
    return transformer;
  };

  matrixTransformedForView = function(matrix, origin, depth) {
    return matrix.push().translate(origin.x, origin.y).translate(depth * -ISO_MINOR_OFFSET, 0).descAndPop();
  };

  cacheBustUrl = function(url) {
    return "" + url + "?" + ((new Date()).getTime());
  };

  createPhoneyPhone = function(paper) {
    var addViewSnapshot, backdrop, backdropTransformer, drawHighlightFrame, refreshBackdrop;
    backdropTransformer = drawStaticBackdropAndReturnTransformer(paper);
    backdrop = void 0;
    refreshBackdrop = function() {
      if (backdrop != null) {
        backdrop.remove();
      }
      return backdrop = paper.image().transform(backdropTransformer.desc()).attr(BACKDROP_FRAME).attr('src', cacheBustUrl(SCREENSHOT_URL)).toFront();
    };
    refreshBackdrop();
    addViewSnapshot = function(_arg) {
      var depth, frame, origin, size, src, uid;
      frame = _arg.frame, src = _arg.src, depth = _arg.depth, uid = _arg.uid;
      size = frame.size, origin = frame.origin;
      return paper.image(src, 0, 0, size.width, size.height).transform(matrixTransformedForView(backdropTransformer, origin, depth));
    };
    drawHighlightFrame = function(frame) {
      var origin, size;
      size = frame.size, origin = frame.origin;
      return paper.rect(0, 0, size.width, size.height).attr({
        fill: "#aaff00",
        opacity: 0.8,
        stroke: "black"
      }).transform(backdropTransformer.push().translate(origin.x, origin.y).descAndPop());
    };
    return {
      refreshBackdrop: refreshBackdrop,
      drawHighlightFrame: drawHighlightFrame,
      addViewSnapshot: addViewSnapshot
    };
  };

  window.symbiote.createPhoneyPhone = createPhoneyPhone;

}).call(this);
