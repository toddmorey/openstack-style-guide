// Toggle sidebar menu on mobile
$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.sidebar').toggleClass('active');
  });
});