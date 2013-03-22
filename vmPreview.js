/*
  vmPreview

	Gerador de previews de Velocity Macros
*/

// Requires
var fs = require('fs');

// Test needs
function i(msg){
	console.log(">>"+msg);
	console.log("-----------------");
}


// VAR
var
		args = ["./jaiminho/422/pagseguro/m16_deposit_overpaid.vm","gerado.html","./jaiminho"]//process.argv.slice(2) // Argumentos
	,	baseFile = args[0] // Argumento: Caminho do arquivo base
	,	generateFile = args[1] // Argumento: Caminho do arquivo a ser gerado
	,	encode = "utf-8" // Encode
	,	regLinha = /[^\r\n]+/g // Strip das linhas
	,	regParse = /#parse\(\"(.*)\"/ // Strip dos comandos #parse
	,	myRoot = args[2] // Raiz a partir da qual o Velocity considera o ponto de partida
	,	file = []
	,	fileCount = 1
	,	finalCode = ""
;

// Análise de Arquivos
var fileAnalysis = (function(){

	var c = 0;

	var genFilePath = function(path){
		path = path.replace(/\s/g,"");
		path = path.replace("#parse(\"","");
		path = path.replace("\")","");
		path = [myRoot,path].join("");

		i(path);

		return path;
	}

	var isFilePath = function(path){
		return !!~path.search(regParse);
	}

	var openFile = function(file){

		c++;

		var
			code = ""
			,qtLines = 0
		;

		fs.readFile(file.path,encode, function(err,data){
			if (err) {
		    	return i(err);
			}

			code = data.match(regLinha);
			qtLines = code.length;


			for(var line = 0; line < qtLines; line++){
				if(isFilePath(code[line])){					
					code[line] = genFilePath(code[line]);
					fileList.add(code[line],file.index,line);					
				}
			}

			file.code = code;			

			var b = fileList.getNext();
			i(b);

			if(fileList.getTotal()<=c){ // Remover o 13
				openFile(b);
			}else{				
				i(fileAnalysis.generate());
			}
			
		});
	}

	var generate = function(){
		var
			finalCode = null
			,totalFiles = fileList.getTotal() - 1
			,father = 0
			,fatherLine = 0

		;

		for(var fileToOpen = totalFiles; fileToOpen>=0; fileToOpen--){

			father = fileList.file[fileToOpen].father;
			fatherLine = fileList.file[fileToOpen].fatherLine;
			

			//console.log(fileToOpen,fileList.file[fileToOpen].code);
			i(father);
			fileList.file[father].code[fatherLine] = fileList.file[fileToOpen].code;
		}

		finalCode = fileList.file[0].code;

		return finalCode;

	}

	var start = function(file){		
		fileList.add(file, null, null);		
		var fileToOpen = fileList.getNext();		
		fileAnalysis.openFile(fileToOpen);
	}

	return{
		openFile: openFile
		,generate: generate
		,start: start
	}

})();

// Lista de Arquivos
var fileList = (function(){

	var
		count = 0
		,list = -1
		,file = []
		,total = 0
	;

	var add = function(path, father, fatherLine){
		file.push({index:total, path: path, code: null , father:father, fatherLine:fatherLine});		
		total++;
	}

	var getNext = function(){		
		list = list + 1;
		var obj = file[list];						
		return obj;
	}		

	var getTotal = function(){
		return total;
	}

	var getList = function(){
		return list;
	}

	return{
		file: file
		,add: add		
		,getList:getList
		,getNext: getNext			
		,getTotal: getTotal		
	}
})();

fileAnalysis.start(baseFile);
