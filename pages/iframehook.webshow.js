// parent jquery context
var _$ = window.parent.window.$;
$(function () {
	_$('#page').trigger('hooked', $);
});
