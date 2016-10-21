$(document).ready(function(){
  var $header = $('#page-header, #pjs-sect');
  var $win = $(window);
  var viewportH = $win.height();//screen.height
  var viewportW = $win.width();//screen.width
  var $root = $('html, body');
  $header.css('min-height', viewportH);

  if(viewportW > 670){
    particlesJS.load('pjs-sect', './js/particlesjs-config.json');
  }

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
  iframe.style.minHeight = iframe.contentWindow.document.body.scrollHeight + "px";
}
