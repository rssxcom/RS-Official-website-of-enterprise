(function($) {
    $.fn.jCarouselLite = function(o) {
        o = $.extend({
            btnPrev: null,
            btnNext: null,
            btnGo: null,
            mouseWheel: false,
            auto: null,
            speed: 200,
            easing: null,
            vertical: false,
            circular: true,
            visible: 3,
            start: 0,
            scroll: 1,
            beforeStart: null,
            afterEnd: null
        },
        o || {});
        return this.each(function() {
            var b = false,
            animCss = o.vertical ? "top": "left",
            sizeCss = o.vertical ? "height": "width";
            var c = $(this),
            ul = $(" >ul", c),
            tLi = $(">li", ul),
            tl = tLi.size(),
            v = o.visible;
            if (o.circular) {
                ul.prepend(tLi.slice(tl - v - 1 + 1).clone()).append(tLi.slice(0, v).clone());
                o.start += v
            }
            var f = $(">li", ul),
            itemLength = f.size(),
            curr = o.start;
            c.css("visibility", "visible");
            f.css({
                overflow: "hidden",
                float: o.vertical ? "none": "left"
            });
            ul.css({
                margin: "0",
                padding: "0",
                position: "relative",
                "list-style-type": "none",
                "z-index": "1"
            });
            c.css({
                overflow: "hidden",
                position: "relative",
                "z-index": "2",
                left: "0px"
            });
            var g = o.vertical ? height(f) : width(f);
            var h = g * itemLength;
            var j = g * v;
            f.css({
                width: f.width(),
                height: f.height()
            });
            ul.css(sizeCss, h + "px").css(animCss, -(curr * g));
            c.css(sizeCss, j + "px");
            if (o.btnPrev) $(o.btnPrev).click(function() {
                return go(curr - o.scroll)
            });
            if (o.btnNext) $(o.btnNext).click(function() {
                return go(curr + o.scroll)
            });
            if (o.btnGo) $.each(o.btnGo,
            function(i, a) {
                $(a).click(function() {
                    return go(o.circular ? o.visible + (i - 1) * o.scroll: i - 1)
                })
            });
            if (o.mouseWheel && c.mousewheel) c.mousewheel(function(e, d) {
                return d > 0 ? go(curr - o.scroll) : go(curr + o.scroll)
            });
            if (o.auto) setInterval(function() {
                go(curr + o.scroll)
            },
            o.auto + o.speed);
            function vis() {
                return f.slice(curr).slice(0, v)
            };
            function go(a) {
                if (!b) {
                    if (o.beforeStart) o.beforeStart.call(this, vis());
                    if (o.circular) {
                        if (a <= o.start - v - 1) {
                            ul.css(animCss, -((itemLength - (v * 2)) * g) + "px");
                            curr = a == o.start - v - 1 ? itemLength - (v * 2) - 1 : itemLength - (v * 2) - o.scroll
                        } else if (a >= itemLength - v + 1) {
                            ul.css(animCss, -((v) * g) + "px");
                            curr = a == itemLength - v + 1 ? v + 1 : v + o.scroll
                        } else curr = a
                    } else {
                        if (a < 0 || a > itemLength - v) return;
                        else curr = a
                    }
                    b = true;
                    ul.animate(animCss == "left" ? {
                        left: -(curr * g)
                    }: {
                        top: -(curr * g)
                    },
                    o.speed, o.easing,
                    function() {
                        if (o.afterEnd) o.afterEnd.call(this, vis());
                        b = false

                    });
                    if (!o.circular) {
                        $(o.btnPrev + "," + o.btnNext).removeClass("disabled");
                        $((curr - o.scroll < 0 && o.btnPrev) || (curr + o.scroll > itemLength - v && o.btnNext) || []).addClass("disabled")
                    }
                }
                return false
            }
        })
    };
    function css(a, b) {
        return parseInt($.css(a[0], b)) || 0
    };
    function width(a) {
        try {
            return a[0].offsetWidth + css(a, 'marginLeft') + css(a, 'marginRight')
        } catch(ex) {
            return 0
        }
    };
    function height(a) {
        return a[0].offsetHeight + css(a, 'marginTop') + css(a, 'marginBottom')
    }
})(jQuery);

function overall(root){
	var root = root || document;
	var re = /j_([\w_]+)/;
	var funcs = {};
	$(".js",root).each(function(i) {
		var m = re.exec(this.className);
		if (m) {
			var f = funcs[m[1]];		
			if (!f) {
				f = eval('CF.' + m[1].replace(/\_/gi,'.'));
				funcs[m[1]] = f;
			}			
			f && f(this);
		}
	});
}

var CF = new Object();
CF.index = {
	//换一批
	carouseProduct: function(obj){		
		var obj = $(obj);
		var prevChild = obj.prev();
		var visible = 5;
		var liNums = $('li', obj).length;		
		var pageNum = Math.ceil( liNums/visible );
		var pageStr = '';
		prevChild.append('<ul class="jcarouseLiteNav"></ul>');
		var jcarouseLiteNav = $('>ul.jcarouseLiteNav', prevChild);		
		for(var i = 0; i < pageNum; i++){
			pageStr += '';
		}

		$('>dt .1', jcarouseLiteNav).parent().addClass('current');

		if(liNums <=visible){
			jcarouseLiteNav.hide();
		}
		obj.jCarouselLite({
			btnNext: $('>dt.next ', jcarouseLiteNav),
			btnPrev: $('>dt.prev a', jcarouseLiteNav),
			visible: visible,
			scroll: visible,
			speed: 1000,
			afterEnd: function(a){
				$('>dt.current', jcarouseLiteNav).removeClass('current');
				var currLI = $(a[0]).attr("class").split('order')[1];
				$('>dt:eq(' + currLI + ')', jcarouseLiteNav).addClass('current');
			},
			btnGo: $('>li:not([class*=previous]):not([class*=next]) a', jcarouseLiteNav)
		})
		var width = obj.width();
		obj.width( width - 3 );
	}
	
}

CF.other = {
	picChange: function(obj){
		$(obj).before('<div id="project-pic-nav">').find('ul').cycle({
			fx:'fade',
			timeout: 3000,
			next:obj,
			pager:'#project-pic-nav',
			pageEvent:null
		})

	}
}



$(function() {
    overall();//执行换一批
})
//切换
$(function(){		
	//设计案例切换
	$('.title-list li').mouseover(function(){
		var liindex = $('.title-list li').index(this);
		$(this).addClass('on').siblings().removeClass('on');
		$('.Guess_js div.product').eq(liindex).fadeIn(150).siblings('div.product').hide();
		var liWidth = $('.title-list li').width();
		$('.Guess .title-list p').stop(false,true).animate({'left' : liindex * liWidth + 'px'},300);
	});
	
	//设计案例hover效果
	$('.Guess_js .product li').hover(function(){
	},function(){
	});
	});

//学校环境
			window.onload=function(){
				var odiv = document.getElementById('Science');
				var oul = odiv.getElementsByTagName('ul')[0];
				var ali = oul.getElementsByTagName('li');
				var spa = -2;				
				oul.innerHTML=oul.innerHTML+oul.innerHTML;
				oul.style.width=ali[0].offsetWidth*ali.length+'px';
				function move(){
					if(oul.offsetLeft<-oul.offsetWidth/2){
						oul.style.left='0';
					}
					if(oul.offsetLeft>0){
						oul.style.left=-oul.offsetWidth/2+'px'
					}
					oul.style.left=oul.offsetLeft+spa+'px';
				}
				var timer = setInterval(move,40)
				
				odiv.onmousemove=function(){clearInterval(timer);}
				odiv.onmouseout=function(){timer = setInterval(move,40)};
				document.getElementsByTagName('a')[0].onclick = function(){
					spa=-2;
				}
				document.getElementsByTagName('a')[1].onclick = function(){
					spa=2;
				}
			}


//	文字滚动start
function AutoScroll(obj){
        $(obj).find("ul:first").animate({
                marginTop:"-25px"
        },500,function(){
                $(this).css({marginTop:"0px"}).find("li:first").appendTo(this);
        });
}
$(document).ready(function(){
	var wzScroll = setInterval('AutoScroll("#scrollDiv")',2000);
	wzScroll;
 $("#scrollDiv ul li").hover(function() {
 	clearInterval(wzScroll);
    },function() {
    	wzScroll = setInterval('AutoScroll("#scrollDiv")',2000)
    });
});
//	文字滚动end

//bannre
// $(function(){
//
// 	var $window = $(window),window_width = $window.width();
//
// 	$('#js_banner, #js_banner_img li').width(window_width);
//
// 	new $.Tab({
//
// 		target: $('#js_banner_img li'),
//
// 		effect: 'slide3d',
//
// 		animateTime: 1000,
//
// 		stay: 3500,
//
// 		autoPlay: true,
//
// 		merge: true,
//
// 		prevBtn: $('#js_banner_pre'),
//
// 		nextBtn: $('#js_banner_next')
//
// 	});
//
// });
//

