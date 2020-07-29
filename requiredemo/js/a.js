define(["js/b","js/c"],function(b,c){
    function fun1(){
     require(["ca"],function(ca){
      	 console.log(ca);
     });
      alert("it works");
    }
    b.getName();
    fun1();
    
    return {
    	getName:function(){
    		
    	}
    	
    };

});