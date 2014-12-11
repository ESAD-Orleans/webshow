var _$;
//
//
$(document).ready(function () {
	var $page_wrapper = $('#page_wrapper'),
		$page_description = $('#page_description'),
		$page = $('#page'),
		page = $page.get(0),
		pages = null,
		screensizes = null,
		pagesIndex = 0,
		scrollRatio = 1,
		screensizesIndex = 0,
		json = null,
		delayPageDown = 3000,
		delayInterTitle = 3000;
	//
	//
	function ResizeTo(width, height) {
		$page_wrapper.css({
			width: width,
			height: height
		})
	}
	//
	//
	$page.on('hooked',function(e,$_){
		// iframe jquery context
		_$ = $_;
		//


		function PageDown(){
			var $body = _$('body'),
				scrollratio = .5;
			var scrollMax = $body.height() - $page.height()*(1- scrollratio);
				scrollTarget = $body.scrollTop() + $page.height()* scrollratio;

			if(scrollTarget>scrollMax){
				$body.delay(delayPageDown).animate({scrollTop:0},NextSize);
			}else{
				$body.delay(delayPageDown).animate({
					scrollTop: scrollTarget
				}, PageDown)
			}
		}

		function NextSize(){
			screensizesIndex++;
			if(screensizesIndex<screensizes.length){
				ResizeTo(screensizes[screensizesIndex].width, screensizes[screensizesIndex].height);
				PageDown();
			}else{
				NextPage();
			}

		}

		ResizeTo(screensizes[screensizesIndex].width, screensizes[screensizesIndex].height);
		//
		$page.hide().delay(500).fadeIn();

		setTimeout(PageDown,500);

	});
	//
	function NextPage(){
		pagesIndex ++;
		pagesIndex = pagesIndex%pages.length;
		screensizesIndex = 0;
		//
		var pageData = pages[pagesIndex],
			screensizesSet = pageData.screensizesSet;
		//
		//
		if(!screensizesSet) {
			screensizesSet = json.screensizesSet;
		}
		//
		screensizes = [];
		_(screensizesSet).each(function(size){
			switch(typeof(size)){
				case 'string' :
					var s = _(json.screensizes).findWhere({id:size});
					if(s){
						_(screensizes).push(s);
					}
					break;
				case 'object' :
					_(screensizes).push(size);
					break;
			}
		});
		//
		if (pageData.author && pageData.title) {
			$page_description.html(_.template('<h1><%= title %></h1><h2><%= author %></h2>')(pageData));
			$page_description.delay(500).fadeIn().delay(delayInterTitle).fadeOut();
		}
		//
		if(page.src != ''){
			$page.fadeOut(function(){
				$page_description.queue(function(){
					page.src = pageData.url;
					$page_description.dequeue();
				})
			});
		}else{
			$page_description.queue(function () {
				page.src = pageData.url;
				$page_description.dequeue();
			})
		}
	}
	//
	function Start(){
		pagesIndex = pages.length-1;
		NextPage();
	}
	//
	//
	$.ajax({
		url:'pages/pages.json',
		dataType:'json'
	}).done(function(data){
		json = data;
		pages = json.pages;
		//
		if(json.delayPageDown){delayPageDown = json.delayPageDown}
		if(json.delayInterTitle){delayInterTitle = json.delayInterTitle}
		if(json.scrollRatio){scrollRatio = json.scrollRatio}
		//
		Start();
	}).error(function(e,s,c){
		alert("une erreur est survenue lors du chargement \n["+s+"] "+c+"");
		console.log(e,s,c);
	})

});