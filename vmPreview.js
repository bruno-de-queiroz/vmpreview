/*
  vmPreview

	Gerador de previews de Velocity Macros
*/

// Requires
var	fs = require('fs')
	, config = require("./config")
	, Buffer = require("buffer").Buffer
	, Iconv = require("iconv").Iconv;

// Test needs
function log(msg){
	console.log(">> "+msg);
	console.log("-----------------");
}


// VAR
var		args = process.argv.slice(2)
	,	workspace = config.workspace
	,	datapath = config.datapath || "./data"
	,	savepath = config.savepath || "./processed"
	,	encode = "utf-8" // Encode
	,	regLinha = /[^\r\n]+/g // Strip das linhas
	,	regFile = /(.*)\/([\w-_]+)\.vm$/
	,	regParse = /#parse\(\"(.*)\"/ // Strip dos comandos #parse
	, 	regVariables = /\!?\$\{?\!?([\w]+)\}?/g
	, 	regGroupStatement = /\"?\!?\$\{?\!?([\w]+)\}?\"?\s?([\=]{2}|\!\=|[\&]{2}|[\|]{2})\s?\"?\!?\$\{?\!?([\w]+)\}?\"?/g
	,	regSingleStatement = /\"?\!?\$\{?\!?([\w]+)\}?\"?\s?([\=]{2}|\!\=|[\&]{2}|[\|]{2})\s?\"([\w]+)\"?\s?([\&]{2}|[\|]{2})?/g
	,	regSetStatement = /\"?\!?\$\{?\!?([\w]+)\}?\"?\s?(\=)\s?(\'(.*)\'|\"(.*)\"|(.*))?\s?\)/g
	,	regLogic = /\#([\w\(\$\{\}\&\|\!\=\s\'\"\.\-\_]+)\)|\#(end|else)/g
	,	regLogicSET = /\#set\((.*)([\s]+([\=]{2}|\!\=)[\s]+(.*))?\)/g
	,	regLogicIF = /\#if\((.*)([\s]+([\=]{2}|\!\=)[\s]+(.*))?\)/g
	,	regLogicELSE = /\#else(.*)/g
	,	regLogicELIF = /\#elseif\((.*)([\s]+([\=]{2}|\!\=)[\s]+(.*))?\)/g
	,	regLogicEND = /\#end(.*)/g
	,	file = []
	,	fileCount = 1
	,	finalCode = ""
	, 	alwaysFirstCase = true
	,	defaults = {
			'userName': 'Bruno de Queiroz'
			, 'userEmail' : 'cad_bsilva@uolinc.com'
			, 'cartItensData' : '<td><font  face="arial" size="2">Teste</font></td><td><font  face="arial" size="2">R$ 1.000,00</font></td>'
	}
	,	data = {}

fs.exists(savepath, function (exists) {
	if(!exists)
		fs.mkdir(savepath, function (er) {
			log(er)
		});
});

// Análise de Arquivos
var fileAnalysis = (function(){

	var c = 0;

	var genFilePath = function(path){
		var url = path.match(regParse)[1];
		path = [workspace,url].join("");

		return path;
	}

	var processVariables = function(string,array){
		//log("Processing Variables");
		for(var i=0,j=array.length;i<j;i++){
			var key = array[i].replace(/\{\!?(.*)\}/g,"$1");
			if(data.hasOwnProperty(key)){
				string = string.replace(new RegExp(array[i],"g"),data[key]);
			}
		}
		return string;
	}

	var processLogic = function(line){
		//log("Processing IF");

		var matches = line.match(regVariables)
			, variables = []
			, _return;


		if(matches && matches.length == 1){

			var a = matches[0].replace(/[\$\{\}\!]/g,"");

			eval("_return = "+ data.hasOwnProperty(a));

			//log("Results of: " + a + " exists ? : " + _return);

		} else {
			var groupStatement,
				singleStatement,
				_returnArray = [];

			while( groupStatement = regGroupStatement.exec(line) ){
				var g = groupStatement
					, a = data[g[1]] || false
					, b = g[2]
					, c = data[g[3]] || false
					, result = eval(" "+a+" "+b+" "+c);

				log("Results of: " + g[1] + " "+ b + " " + g[3] + " : " + result);

				_returnArray.push(result);
			}

			while( singleStatement = regSingleStatement.exec(line) ){
				var g = singleStatement
					, a = data[g[1]] || false
					, b = g[2]
					, c = g[3]
					, result = eval(" "+a+" "+b+" '"+c+"'");

				//log("Results of: " + g[1] + " "+ b + " '" + g[3] + "'' : " + result);
				_returnArray.push(result);
			}

			eval("_return = "+ _returnArray.join(" && "));

			//log("Results of: "+ _returnArray.join(" && ") + " : " + _return);

		}

		return _return;
	}

	var extendArray = function(a,b){
		while(b.length){
			a.push(b.shift());
		}
		return a;
	}

	var extendObject = function(a,b){
		for(var i=0,j=Object.keys(b).length;i<j;i++){
			var key = Object.keys(b)[i];
			a[key] = b[key];
		}
		return a;
	}

	var readFile = function(path,filename,callback) {
		var file = ""
			, iconv = new Iconv('ISO-8859-1', 'UTF-8')
			, buffer = iconv.convert(fs.readFileSync(path)).toString("utf8")
			, variables = []
			, print = true;

		if(filename){
			try {
				log("Loading Data From: "+ datapath+"/"+filename+".js");
				var temp;
				eval("temp = "+fs.readFileSync(datapath+"/"+filename+".js").toString());
				data = extendObject(data,temp);
			} catch(e){
				console.log(e);
				data = extendObject(data,defaults);
			}
		}

		log("Processing: "+ path);

		buffer.split("\n").forEach(function(line) {

			if(isFilePath(line)){
				var url = genFilePath(line);
				file += readFile(url);
			} else {

				if(regLogicIF.test(line)){
					print = processLogic(line);
				} else if(regLogicEND.test(line))
					print = true;

				if(regLogicELSE.test(line))
					print = !print;



				if(print){

					var lineVars;

					while(lineVars = regVariables.exec(line)){
						variables.push(lineVars[1]);
					}

					var setStatement = regLogicSET.test(line);

					if(setStatement){
						var matchs;
						while( matchs = regSetStatement.exec(line) ){
							data[matchs[1]] = matchs[4] || matchs[3];
						}

						line = line.replace(regLogicSET,"");
					}
					file += line.replace(regLogic,"").replace(regVariables,"$1") + "\n";
				}
			}
		});

		file = processVariables(file,variables);

		if(callback)
			callback(file);

		return file;
	}

	var writeFile = function(fileName,fileContent){
		var buffer = new Buffer(fileContent)
			, iconv = new Iconv('UTF-8', 'ISO-8859-1')
			, text = iconv.convert(buffer)
			, file = savepath+"/"+fileName+".html";

		fs.writeFile(file, text, function(err) {
			if(err)
				return log(err)
			else
				return log("File copied to: " + file);
		});
	}

	var isFilePath = function(path){
		return regParse.test(path);
	}

	var isLogicalBlock = function(line){
		return regLogic.test(line);
	}

	var start = function(file){
		fileList.add(file, null, null);
		var fileToOpen = fileList.getNext();
		readFile(fileToOpen.path,writeFile);
	}

	var process = function(filename,file){
		readFile(file,filename,function(fileContent){
			writeFile(filename,fileContent)
		})
	}

	return{
		readFile: readFile
		, start: start
		, process: process
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

for(var k=0,j=args.length;k<j;k++){
	var match = args[k].match(regFile);
	if(match)
		fileAnalysis.process(match[2],args[k]);
	else
		console.log("Not a valid vm file : " + args[k]);
};
