/*
creditz to the guy who posted that on stack overflow
works really fineeEEEee. hat to replace that crazy eq(0) syntax.
did not read and understand the code but 't'werks
*/
var DomUtil = {
  getDomPath:function(el) {
    var stack = [];
    while ( el.parentNode != null ) {
      var sibCount = 0;
      var sibIndex = 0;
      for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
        var sib = el.parentNode.childNodes[i];
        if ( sib.nodeName == el.nodeName ) {
          if ( sib === el ) {
            sibIndex = sibCount;
          }
          sibCount++;
        }
      }
      if ( el.hasAttribute('id') && el.id != '' ) {
        stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
      } else if ( sibCount > 1  ) {
        stack.unshift(el.nodeName.toLowerCase() + ':nth-of-type(' + parseInt(sibIndex+1) + ')');
      } else {
        stack.unshift(el.nodeName.toLowerCase());
      }
      el = el.parentNode;
    }

    return stack.join(" "); // removes the html element and build a reusable querySelector string
  },
  findElementByPath: function(elementPath){
    return document.querySelector(elementPath);
  }
};
