$(function(){function o(){"night"==Cookies.get("read-mode")&&($("body").addClass("night-mode"),$("#nightshift").removeClass("fa-moon-o").addClass("fa-sun-o")),"day"==Cookies.get("read-mode")&&($("body").removeClass("night-mode"),$("#nightshift").removeClass("fa-sun-o").addClass("fa-moon-o"))}o(),$("#nightshift").click(function(){var s;s=$("body").hasClass("night-mode")?"day":"night",Cookies.set("read-mode",s,{expires:7,path:"/"}),o()})});