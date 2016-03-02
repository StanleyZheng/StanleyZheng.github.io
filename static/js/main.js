$(document).ready(function(){


	$("#home-page").show();
	$("#portfolio-page").hide();
	$("#about-page").hide();

	//Display different pages for each tab
	$("#nav-home").click(function(){
		$("#home-page").show();
		$("#portfolio-page").hide();
		$("#about-page").hide();
	});
	$("#nav-portfolio").click(function(){
		$("#home-page").hide();
		$("#portfolio-page").show();
		$("#about-page").hide();
	});
	$("#nav-about").click(function(){
		$("#home-page").hide();
		$("#portfolio-page").hide();
		$("#about-page").show();
	});

});