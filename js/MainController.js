angular.module('app')
	.controller('MainController',function($scope){

		chrome.commands.onCommand.addListener(function(command){
			var text=getClipboardText();
			write(text);
		});

		$scope.directory="No file Selected";
		var chosenEntry=null;

		
		$scope.chooseEntry = function(){
			 chrome.fileSystem.chooseEntry({type: 'openWritableFile', accepts:[{extensions: ["txt"]}]}, function(entry) {
			 	chosenEntry=entry;
			   	displayPath(entry.fullPath);
			});
		};


		function displayPath(path){
			$scope.directory=path.substring(1);
			$scope.$apply();	
		};

		function errorHandler(e) {
 			 console.error(e);
		}

		//writes given text to chosen file
		function write(data){
			chosenEntry.createWriter(function(fileWriter){
				fileWriter.seek(fileWriter.length);
				if(fileWriter.length==0)data=data;
				else if($scope.linebreak)data="\r\n"+"\r\n"+data;
				else if($scope.space)data=" "+data;
				else data=data;
				var bb= new Blob([data],{type:'text/plain'});
				fileWriter.write(bb);
			},errorHandler);
		}


		//hacky function to get the clipboard text from  document.execCommand('paste');
		function getClipboardText() {
		    var pasteDiv = document.createElement("div");
		    pasteDiv.style.position = "absolute";
		    pasteDiv.style.left = "-10000px";
		    pasteDiv.style.top = "-10000px";
		    pasteDiv.contentEditable = true;
		    var insertionElement = document.activeElement; 
		    var nodeName = insertionElement.nodeName.toLowerCase(); 
		    while (nodeName !== "body" && nodeName !== "div" && nodeName !== "li" && nodeName !== "th" && nodeName !== "td") { 
		        insertionElement = insertionElement.parentNode; 
		        nodeName = insertionElement.nodeName.toLowerCase(); 
		    }
		    insertionElement.appendChild(pasteDiv);
		    pasteDiv.focus();
		    document.execCommand('paste');
		    var clipboardText = pasteDiv.innerText;
		    insertionElement.removeChild(pasteDiv);

		    return clipboardText;
		}

		//will be used for visual toggling
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