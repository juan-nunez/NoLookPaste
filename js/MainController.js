angular.module('app')
	.controller('MainController',function($scope){

		chrome.commands.onCommand.addListener(function(command){
			var text=getClipboardText();
			write(text);
		});

		$scope.directory="No file Selected";
		var chosenEntry=null;

		$scope.chooseEntry = function(){
			 chrome.fileSystem.chooseEntry({type: 'openWritableFile'}, function(entry) {
			 	chosenEntry=entry;
			 	console.log(chosenEntry);
			    displayPath(entry.fullPath);
			});
		};


		function displayPath(path){
			$scope.directory=path;
			$scope.$apply();	
		};

		function errorHandler(e) {
 			 console.error(e);
		}

		function write(data){
			chosenEntry.createWriter(function(fileWriter){
				fileWriter.onwrite = function(e){
					console.log('Completed');
				};
				fileWriter.onerror=function(e){
					console.log("FAILED");
				};
				fileWriter.seek(fileWriter.length);
				if($scope.linebreak)data="\n"+data;
				else if($scope.space)data=" "+data;
				else data=data;
				var bb= new Blob([data],{type:'text/plain'});
				fileWriter.write(bb);
			},errorHandler);
		}

		function getClipboardText() {
		    // create div element for pasting into
		    var pasteDiv = document.createElement("div");

		    // place div outside the visible area
		    pasteDiv.style.position = "absolute";
		    pasteDiv.style.left = "-10000px";
		    pasteDiv.style.top = "-10000px";

		    // set contentEditable mode
		    pasteDiv.contentEditable = true;

		    // find a good place to add the div to the document
		    var insertionElement = document.activeElement; // start with the currently active element
		    var nodeName = insertionElement.nodeName.toLowerCase(); // get the element type
		    while (nodeName !== "body" && nodeName !== "div" && nodeName !== "li" && nodeName !== "th" && nodeName !== "td") { // if have not reached an element that it is valid to insert a div into (stopping eventually with 'body' if no others are found first)
		        insertionElement = insertionElement.parentNode; // go up the hierarchy
		        nodeName = insertionElement.nodeName.toLowerCase(); // get the element type
		    }

		    // add element to document
		    insertionElement.appendChild(pasteDiv);

		    // paste the current clipboard text into the element
		    pasteDiv.focus();
		    document.execCommand('paste');

		    // get the pasted text from the div
		    var clipboardText = pasteDiv.innerText;

		    // remove the temporary element
		    insertionElement.removeChild(pasteDiv);

		    // return the text
		    return clipboardText;
		}

		$scope.linebreak=false;
		$scope.space=false;


		$scope.toggleSpace = function(){
			
			if($scope.space==false){
				$scope.space=true;
				if($scope.linebreak)
					$scope.linebreak=false;
			}
			else $scope.space=false;
		}

		$scope.toggleLineBreak = function(){
			if($scope.linebreak==false){
				$scope.linebreak=true;
				if($scope.space)
					$scope.space=false;
			}
			else $scope.linebreak=false;
		}
		
		
	});