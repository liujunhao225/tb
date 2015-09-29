// 控制自定义的按钮和文本框样式
$(document).ready(function() {
	$(".dsp-button")
		.mouseover(function() {
			$(this).css("background-color", "#F89A1E");
		})
		.mouseout(function() {
			$(this).css("background-color", "#1E82CC");
		});
	$(".dsp-input")
		.focus(function() {
			$(this).css("border", "1px solid #F89A1E");
		})
		.blur(function() {
			$(this).css("border", "1px solid #1E82CC");
		})
		.each(function() {
			var width = $(this).attr("width");
			if (width && width > 0) {
				$(this).css("width", width + "px");
			}
		});
});
