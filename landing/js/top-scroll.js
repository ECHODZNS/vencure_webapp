
$(function(){
// for navbar background color when scrolling
    $(window).scroll(function () {
        var $scrolling = $(this).scrollTop();
        var bc2top = $(".back-top-btn");
        if ($scrolling > 150) {
                bc2top.fadeIn(1000);
            } else {
                bc2top.fadeOut(1000);
            }
    });
    
     // another back to top button start
    $('.back-top-btn').click(function (e) {
      e.preventDefault();
      $('html,body').animate({
        scrollTop: 0
      }, 1500);
    });
  // another back to top button end
    
    });