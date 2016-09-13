$(document).ready(function(){


	$("#main-page").show();
	$("#funfacts-page").hide();
	$("#about-page").hide();

	//Display different pages for each tab
	$("#nav-main").click(function(){
		$("#main-page").show();
		$("#funfacts-page").hide();
		$("#about-page").hide();
	});
	$("#nav-funfacts").click(function(){
		$("#main-page").hide();
		$("#funfacts-page").show();
		$("#about-page").hide();
	});
	$("#nav-about").click(function(){
		$("#main-page").hide();
		$("#funfacts-page").hide();
		$("#about-page").show();
	});

	//Keep the tab highlighted when clicked
	$("#nav-bar table th").click(function(){
		$("#nav-bar table th").css("background-color", "white");
		$(this).css("background-color", "#efefef");
	})


});