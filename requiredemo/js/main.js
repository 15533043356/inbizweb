require.config({
	baseUrl:"/inbizweb/requiredemo",
    paths : {
        "jquery" : ["http://libs.baidu.com/jquery/2.0.3/jquery"],
        "a" : "js/a"   
    }
});
require(["jquery","a"],function($,a){
	debugger;
    $(function(){
        alert("load finished");  
    })
})
