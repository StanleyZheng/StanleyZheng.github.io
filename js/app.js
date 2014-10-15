angular.module('myapp', ['ui.bootstrap']);

function demo($scope){
	$scope.oneAtATime = true;
	$scope.groups = [
		{	
			title: "Dynamic Group Header 1",
			contentl: "Dynamic Group Body"

		},
		{
			title: "Dynamic Group Header 2",
			content2: "Dynamic Group Body 2"
		},
	];

	$scope.dynamicItem = "Dynamic Item";
	$scope.items = ['Item 1', 'Item 2', 'Item 3'];
	$scope.addItem = function(){
		var newItem = $scope.items.length + 1;
		$scope.items.push('Item ' + newItem);
	};
}