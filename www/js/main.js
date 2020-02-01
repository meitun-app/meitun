jQuery(document).ready(function($) {

    var classe = "";
    var $obj = $("#all-animation-icon");
    var $objcol = $(".col-md-4");
    var intervalo;
    $(".btns button,.btn-cta-secondary").click(function(){
//			$(".col-md-4").toggleClass("show");
			
            clearInterval(intervalo);

            efeito = $(this).data("efect");

            if($obj.hasClass(efeito)){
                $obj.removeClass(efeito);
                $(".col-md-4").removeClass("show");
            }

            if(efeito == "rotate-row"){
                $obj.addClass("girar");
                
                                
            }else if($obj.hasClass("girar")){
                $obj.removeClass("girar");
                                
            }
            
            
			if ($objcol.hasClass("show")) {
				setTimeout(function(){
					$(".col-md-4,.overFlowDiv").removeClass("show");
				},2000)
			} else{
				$(".col-md-4,.overFlowDiv").addClass("show");
			}
            $obj.removeClass(classe).addClass($(this).data("efect"));
            classe = efeito;

			
			
    });
    
    
});