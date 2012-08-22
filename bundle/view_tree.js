(function() {
  var createViewTree, listItemTitleFor, transformDumpedViewToListItem;

  listItemTitleFor = function(rawView) {
    var title;
    title = "" + rawView['class'];
    if (rawView.accessibilityLabel) {
      return "" + title + ": '" + rawView.accessibilityLabel + "'";
    } else {
      return title;
    }
  };

  transformDumpedViewToListItem = function(rawView) {
    var subview, subviewList, title, viewListItem, _i, _len, _ref;
    title = listItemTitleFor(rawView);
    viewListItem = $("<li><a>" + title + "</a></li>");
    subviewList = $("<ul/>");
    $('a', viewListItem).data('rawView', rawView);
    _ref = rawView.subviews;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      subview = _ref[_i];
      subviewList.append(transformDumpedViewToListItem(subview));
    }
    viewListItem.append(subviewList);
    return viewListItem;
  };

  createViewTree = function($container) {
    var reload;
    $container.on('click', 'a', function() {
      var $this, selectedView;
      $this = $(this);
      selectedView = $this.data('rawView');
      bean.fire(selectedView, 'selected');
      $('a', $container).removeClass('selected');
      return $this.addClass('selected');
    });
    $container.on('mouseenter', 'a', function() {
      var view;
      view = $(this).data('rawView');
      return bean.fire(view, 'hoverenter');
    });
    $container.on('mouseleave', 'a', function() {
      var view;
      view = $(this).data('rawView');
      return bean.fire(view, 'hoverleave');
    });
    reload = function(rootView) {
      $container.children().remove();
      $container.append(transformDumpedViewToListItem(rootView));
      return $container.treeview({
        collapsed: false
      });
    };
    return {
      reload: reload
    };
  };

  symbiote.createViewTree = createViewTree;

}).call(this);
