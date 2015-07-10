angular.module('app')
	.controller('MainController',function($scope){


		window.addEventListener("keydown",checkKeyPressed,false);

		$scope.directory="No Directory Selected";
		var chosenEntry=null;
		$scope.inputText="";
		$scope.click = function(){
			 chrome.fileSystem.chooseEntry({type: 'openWritableFile'}, function(entry) {
			 	chosenEntry=entry;
			 	console.log(chosenEntry);
			    $scope.displayPath(entry.fullPath);
			});
		};


		$scope.displayPath = function(path){
			$scope.directory=path;
			$scope.$apply();	
		};

		function errorHandler(e) {
 			 console.error(e);
		}

		$scope.write = function(data){
			chosenEntry.createWriter(function(fileWriter){
				fileWriter.onwrite = function(e){
					console.log('Completed');
				};
				fileWriter.onerror=function(e){
					console.log("FAILED");
				};
				fileWriter.seek(fileWriter.length);
				var bb= new Blob([data],{type:'text/plain'});
				fileWriter.write(bb);
			},errorHandler);
		}

		$scope.getSelectionText = function(){
		    var text = "";
		    if (window.getSelection){
		        text = window.getSelection().toString();
		        $scope.write(text);
		    }

		   
		}

		function checkKeyPressed(e){
			if(e.keyCode=="65"){
				console.log("key logged");
				$scope.getSelectionText();
			}
		}

	
	});