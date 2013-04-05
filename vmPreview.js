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
	,	encoding = config.defaults.encoding || "utf-8" // Encode
	,	defaults = config.data || {}
	,	data = {}
	,	regLinha = /[^\r\n]+/g // Strip das linhas
	,	regFile = /(.*)\/([\w-_]+)\.vm$/
	,	regParse = /#parse\(\"(.*)\"/ // Strip dos comandos #parse
	, 	regVariables = /\!?\$\{?\!?([\w]+)\}?/g
	,	regSingleExistStatement = /\#if\s?\(\s?(?:\'|\")?\$\!?\{?([\w-_.\d]+)\}?(?:\'|\")?\)/g
	, 	regGroupStatement = /\"?\!?\$\{?\!?([\w]+)\}?\"?\s?([\=]{2}|\!\=|[\&]{2}|[\|]{2})\s?\"?\!?\$\{?\!?([\w]+)\}?\"?/g
	,	regSingleStatement = /\"?\!?\$\{?\!?([\w]+)\}?\"?\s?([\=]{2}|\!\=|[\&]{2}|[\|]{2})\s?\"([\w]+)\"?\s?([\&]{2}|[\|]{2})?/g
	,	regSetStatement = /\"?\!?\$\{?\!?([\w]+)\}?\"?\s?(\=)\s?(\'(.*)\'|\"(.*)\"|(.*))?\s?\)/g
	,	regCleanIfStatement = /(\#if\s?\(.*\)([^\#]+)\#(else.*|end))/g
	,	regCleanElseStatement = /(\#if\s?\(.*\).*\#else([^\#]+)\#end)/g
	,	regLogic = /\#([\w\(\$\{\}\&\|\!\=\s\'\"\.\-\_]+)\)|\#(end|else)/g
	,	regLogicSET = /\#set\s?\(\$([^\s\=]+)\s?\=\s?(?:\'|\")?([a-zA-Z0-9\.\/\:-_]+)(?:\'|\")?\s?\)/g
	,	regLogicIF = /\#if\s?\(\"?\'?\s?\!?\$\{?\!?(.*)\}?([\s]+([\=]{2}|\!\=)[\s]+(.*))?\"?\'?\s?\)/g
	,	regLogicELSE = /\#else(.*)/g
	,	regLogicELIF = /\#elseif\s?\(\"?\'?\s?\!?\$\{?\!?(.*)\}?([\s]+([\=]{2}|\!\=)[\s]+(.*))?\"?\'?\s?\)/g
	,	regLogicEND = /\#end(.*)/g
	,	file = []
	,	fileCount = 1
	,	finalCode = ""

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
		log("Processing Variables");
		for(var i=0,j=array.length;i<j;i++){
			var key = array[i].replace(/\{\!?(.*)\}/g,"$1");
			if(data.hasOwnProperty(key)){
				string = string.replace(new RegExp(array[i],"g"),data[key]);
			}
		}
		return string;
	}

	var getVariableInfo = function(string){

		var obj = {
			exists: data.hasOwnProperty(string)
			, value: data.hasOwnProperty(string) ? data[string] == "true" || data[string] == "false" ? Boolean(data[string]) : data[string] : false
			, type : data.hasOwnProperty(string) ? data[string] == "true" || data[string] == "false" ? "boolean" : typeof data[string] : undefined
		}
		return obj;
	}

	var processLogic = function(line){
		//log("Processing IF");

		var variables = line.match(regVariables)
			, statement = line.replace(regCleanIfStatement,"$1")
			, existStatement
			, singleStatement
			, groupedStatment
			, results = []
			, result = false;

		while(groupedStatment = regGroupStatement.exec(statement)){
			var o = groupedStatment[2]
				, infoA = getVariableInfo(groupedStatment[1])
				, infoB = getVariableInfo(groupedStatment[3])
				, a = o != "&&" && o != "||" ? infoA.value : infoA.type == "boolean" ? (infoA.exists && infoA.value == true) : infoA.exists
				, b = o != "&&" && o != "||" ? infoB.value : infoB.type == "boolean" ? (infoB.exists && infoA.value == true) : infoB.exists
				, r = eval(a + o + b);

			results.push(r);
		}

		while(singleStatement = regSingleStatement.exec(statement)){
			var o = singleStatement[2]
				, infoA = getVariableInfo(singleStatement[1])
				, a = infoA.exists ? infoA.type == "string" ? "'"+infoA.value+"'" : infoA.value : false
				, b = singleStatement[3] != "true" && singleStatement[3] != "false" ? "'"+singleStatement[3]+"'" : singleStatement[3]
				, r = eval(a + o + b);

			results.push(r);
		}

		while(existStatement = regSingleExistStatement.exec(statement)){
			var r = data.hasOwnProperty(existStatement[1]);

			results.push(r);
		}

		result = eval(results.join("&&"));
		return result;
	}

	var processInlineLogic = function(line){
		var logicResults = processLogic(line);
		if(logicResults){
			line = line.replace(regCleanIfStatement,"$2");
		} else {
			if(regLogicELSE.test(line)){
				line = line.replace(regCleanElseStatment,"$2");
			} else {
				line = line.replace(regCleanIfStatement,"");
			}
		}
		return line;
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
			, iconv = new Iconv(encoding, 'UTF-8')
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

				//log("isInline: "+ (regLogicIF.test(line) && regLogicEND.test(line)));
				if(regLogicIF.test(line)){
					if(!regLogicEND.test(line)){
						log("IF logic: " + line.replace(/[\s\t]/g,""));
						print = processLogic(line);
					} else {
						log("Inline logic: " + line.replace(/[\s\t]/g,""));
						line = processInlineLogic(line);
						print = true;
					}
				} else if(regLogicELSE.test(line)) {
					log("ELSE logic: " + line.replace(/[\s\t]/g,""));
					print = !print;
					log("PRINT LINE: "+print);
				} else if(regLogicEND.test(line)) {
					log("END logic");
					print = true;
				}

				if(print){

					var lineVars,
						setStatement;

					while(lineVars = regVariables.exec(line)){
						variables.push(lineVars[1]);
					}

					while(setStatement = regLogicSET.exec(line)){
						log("Saving Var "+ setStatement[1] + ":" + setStatement[2]);
						data[setStatement[1]] = setStatement[2];
					}

					line = line.replace(regLogicSET,"");

					file += line.replace(regLogic,"").replace(regVariables,"$1") + "\n";
				}
			}
		});

		file = processVariables(file,variables);

		if(callback) {
			callback(file);
		}

		return file;
	}

	var writeFile = function(fileName,fileContent){
		var buffer = new Buffer(fileContent)
			, iconv = new Iconv('UTF-8', encoding)
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
