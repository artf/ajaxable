$(document).ready(function(){
  var $header = $('#page-header, #pjs-sect');
  var viewportH = $(window).height();
  var $root = $('html, body');
  $header.css('min-height', viewportH);

  // highlight.js init
  //$('pre code').each(function(i, block) {
    //hljs.highlightBlock(block);
  //});

  $('.scroll-link').click(function() {
    console.log('clicked');
    var target = $($.attr(this, 'data-target'));
    if( target.length ){
        $root.animate({
            scrollTop: (target.offset().top -70 )
        }, 500);
        return false;
    }
  });
})

var resizeIframe = function(iframe) {
  iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
}
