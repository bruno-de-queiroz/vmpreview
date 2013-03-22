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
		args = ["/home/bruno/workspace/jaiminho/422/pagseguro/m16_deposit_overpaid.vm","gerado.html","/home/bruno/workspace/jaiminho"]//process.argv.slice(2) // Argumentos
	,	baseFile = args[0] // Argumento: Caminho do arquivo base
	,	generateFile = args[1] // Argumento: Caminho do arquivo a ser gerado
	,	encode = "utf-8" // Encode
	,	regLinha = /[^\r\n]+/g // Strip das linhas
	,	regParse = /#parse\(\"(.*)\"/ // Strip dos comandos #parse
	, 	regVariables = /\$\!?([\w-_]+|\{[\w]+\})/g
	,	myRoot = args[2] // Raiz a partir da qual o Velocity considera o ponto de partida
	,	file = []
	,	fileCount = 1
	,	finalCode = ""
;

// Análise de Arquivos
var fileAnalysis = (function(){

	var c = 0;

	var genFilePath = function(path){
		var url = path.match(regParse)[1];
		path = [myRoot,url].join("");

		return path;
	}

	var readFile = function(path,callback) {
		var file = "";

		i("Processing: "+ path);
		fs.readFileSync(path).toString().split("\n").forEach(function(line) {
			if(isFilePath(line)){
				var url = genFilePath(line);
				file += readFile(url);
			} else {
				file += line + "\n";
			}
		});

		if(callback)
			callback(file);

		return file;

	}

	var writeFile = function(fileContent){
		var file = "./"+generateFile;
		fs.writeFile(file, fileContent , function(err) {
			if(err)
				return i(err)
			else
				return i("File copied to: " + file);
		});
	}

	var isFilePath = function(path){
		return regParse.test(path);
	}

	var start = function(file){
		fileList.add(file, null, null);
		var fileToOpen = fileList.getNext();
		readFile(fileToOpen.path,writeFile);
	}

	return{
		readFile: readFile
		, start: start
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
