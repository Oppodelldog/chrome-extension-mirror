function saveConfiguration(config){
	localStorage["coupling"]=config;
}
function loadConfiguration(){
	return localStorage["coupling"];
}