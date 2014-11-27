$().ready(function(){
    var eq = new Array('eq_1');
    $(eq).each(function(){
        var el = this;
        var height = 0;
        $("."+el).each(function(){
            if($(this).height() > height)
            {
                height = $(this).height();
            }
        });
        $("."+el).each(function(){
            $(this).css('height', height+"px");
        })
    });
    
    var ii = 0;
    
    $(".gallery li a").each(function(){
        ii = ii+1;
        $(this).attr('id', ii);
    })
    
    $(".gallery li a").click(function(){
        loadImg($(this).attr('id'));
        return false;
    })
    
    $("wrap_wrapper, #popout img").click(function(){
        if(is_modular_open)
        {
            closeModular();
        }
    });
    
    $("a").click(function(){
        if(is_modular_open)
        {
            return false;
        }
    })
    
    $("#lego a").click(function(){
        triggerLoading();
        var url = $(this).attr('href');
        $.ajax({
            url: url,
            success: function(msg){
                $("#popout .code").css('width', "400px");
                $("#popout .code").css('height', "110px");
                $("#popout").css('top', "200px");
                openModular('text', msg);
            }
        });
        return false;
    })
    
    /*$.ajax({
        type: "POST",
        url: "http://192.168.11.9/brick/webcam",
        success: function(msg){
            eval(msg);
            var i = 0;
            $(image_array).each(function(){
                i++;
                if(i == 1)
                {
                    $(".webcam .photos").append('<img id="img_'+i+'" src="'+this+'" class="visible" />');
                }
                else
                {
                    $(".webcam .photos").append('<img id="img_'+i+'" src="'+this+'" class="hidden" />');
                }
                
                setTimeout(function() {
                    rotateWebcam(1, image_array.length);
                }, 1000);
            })
        }
    });*/
    
});

var current_image = "";

function loadImg(el)
{
    var next_image = 0;
    var previous_image = 0;
    
    var images = 0;
    $(".gallery li a").each(function(){
        images = images+=1;
    });
    
    if(images > 0) {
        current_image = el;
    }
    if(current_image == images) {
        next_image = 1;
    } else {
        next_image = parseInt(current_image)+1;
    }
    if(current_image == 1) {
        previous_image = images;
    } else {
        previous_image = parseInt(current_image)-1;
    }
    
    
    var source = $("#"+el).attr('href');
    var alt = $("#"+el).find('img').attr('alt');
    var img = new Image();
    img.src = source;
    triggerLoading();
    $(img).load(function(){
        var width = img.width;
        if(alt)
        {
            var height = Math.round(img.height)+10;
        }
        else
        {
            var height = Math.round(img.height);
        }
        img = "";
        var w_height = $("#wrapper").height();
        var pop_top = "";
        if(w_height < height)
        {
            pop_top = 0;
        }
        else {
            pop_top = (w_height-height)/2;
        }
        $("#popout .code").css('width', width+"px");
        $("#popout .code").css('height', height+"px");
        $("#popout").css('top', pop_top+"px");
        openModular('img', source, alt, next_image, previous_image, current_image, images);
    });
    img.src = source;
}

function triggerLoading()
{
    $("#wrap_wrapper").fadeTo(200, 0.3);
    setTimeout(function()
    {
        $("#loading").fadeIn(200);
    }, 210)
}

function rotateWebcam(active, images)
{
    if(active == 5)
    {
        var image = 1;
    }
    else
    {
        var image = active;
    }
    $(".webcam .photos .visible").addClass('hidden');
    $(".webcam .photos #img_"+image).removeClass('hidden').addClass('visible');
    setTimeout(function(){
        rotateWebcam(image+1, images);
    }, 1000);
}

var is_modular_open = false;

function changeImage(img)
{
    current_image = img;
    $("#popout").fadeOut(200);
    setTimeout(function(){
        loadImg(img);
    }, 210);
}

function openModular(type, href, txt, next_img, prev_img, current, images)
{
    setTimeout(function(){
        if(type == "img")
        {
            $("#popout .code div").html("<img onclick='closeModular();' src='"+href+"' />");
            if(txt)
            {
                $("#popout .code div").append("<p class='alt'>"+txt+"</p>");
            }
            if(next_img)
            {
                $("#popout .code div").append("<div class=\"img_nav\"><a href=\"javascript:changeImage("+prev_img+")\">&larr;</a> "+current+" / "+images+" <a href=\"javascript:changeImage("+next_img+")\">&rarr;</a></div>");
            }
            $("#loading").fadeOut(200);
            setTimeout(function(){
                $("#popout").fadeIn(200);
            }, 210);
        }
        else if(type == 'text')
        {
            $("#popout .code div").html(href);
            $("#loading").fadeOut(200);
            setTimeout(function(){
                $("#popout").fadeIn(200);
            }, 210);
        }
        is_modular_open = true;
    }, 410);
}

function closeModular()
{
    $("#popout").fadeOut(200);
    setTimeout(function(){
        $("#wrap_wrapper").fadeTo(200, 1);
        setTimeout(function(){
            $("#popout .code div").html("");
        }, 210);
    }, 210);
    is_modular_open = false;
    $("")
    return false;
}

function solvePod(pod)
{
    var pod_url = $("#solve_pod_"+pod).attr('action');
    pod_url = pod_url+pod;
    var key = $("#solve_pod_"+pod+" .iT").attr('value');
    
    $("input").each(function(){
        $(this).blur();
    })
    
    triggerLoading();
    
    $.ajax({
        type: "POST",
        url: pod_url,
        data: "pod_key="+key,
        success: function(msg){
            $("#popout .code").css('width', "400px");
            $("#popout .code").css('height', "110px");
            $("#popout").css('top', "200px");
            openModular('text', msg);
        }
    });
    
    return false;
}