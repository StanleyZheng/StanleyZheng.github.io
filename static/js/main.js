$(document).ready(function(){


	$("#mainpage").show();
	$("#projectspage").hide();
	$("#thingpage").hide();
	$("#aboutpage").hide();
	$("#contactpage").hide();

		
	$("#navmain").click(function(){
		$("#mainpage").show();
		$("#projectspage").hide();
		$("#thingpage").hide();
		$("#aboutpage").hide();
		$("#contactpage").hide();

	});

	$("#navprojects").click(function(){
		$("#mainpage").hide();
		$("#projectspage").show();
		$("#thingpage").hide();
		$("#aboutpage").hide();
		$("#contactpage").hide();

	});

	$("#navthing").click(function(){
		$("#mainpage").hide();
		$("#projectspage").hide();
		$("#thingpage").show();
		$("#aboutpage").hide();
		$("#contactpage").hide();

	});

	$("#navabout").click(function(){
		$("#mainpage").hide();
		$("#projectspage").hide();
		$("#thingpage").hide();
		$("#aboutpage").show();
		$("#contactpage").hide();

	});

	$("#navcontact").click(function(){
		$("#mainpage").hide();
		$("#projectspage").hide();
		$("#thingpage").hide();
		$("#aboutpage").hide();
		$("#contactpage").show();

	});









});