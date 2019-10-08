// https://github.com/stamat/jquery.vertical-truncateor
(function ($) {
	function vertical_truncator($source, ending, callback) {
		var $tester = $('<div></div>');
		var text = $source.text();
		if ($source.data('vertical-truncator-original')) {
			text = $source.data('vertical-truncator-original');
		} else {
			$source.data('vertical-truncator-original', text);
		}

		//TODO: if old width, font-size and line-height differ on resize perform truncate
		var w = $source.width();
		if (!$source.data('vertical-truncator-width')) {
			$source.data('vertical-truncator-width', w);
		}

		var text_pts = text.split(' ');

		if (!ending) {
			ending = '...';
		}


		var line_height = $source.css('line-height');
		var font_size = parseInt($source.css('font-size'), 10);

		if (line_height === 'normal') {
			line_height = font_size * 1.16; // 1.16 difference constant
		} else {
			line_height = parseInt(line_height, 10);
		}

		var h = line_height * parseInt($source.data('vertical-truncator'));
		console.log(h);

		$('body').append($tester);

		$tester.css({
			width:	w,
			'font-size': font_size + 'px',
			'line-height': line_height + 'px',
			'font-family': $source.css('font-family'),
			'font-weight': $source.css('font-weight'),
			'font-style': $source.css('font-style'),
			'z-index': 0,
			position: 'fixed',
			left: '-9999px',
			top: 0
		});

		var res_arr_last = [];
		var res_arr = [];

		for	(var i = 0; i < text_pts.length; i++) {
			var pt = text_pts[i];
			res_arr.push(pt);
			$tester.empty();
			$tester.text(res_arr.join(' ').replace(/[,\.\s]*$/g, '') + ending);

			if ($tester.height() <= h) {
				res_arr_last.push(pt);
			} else {
				break;
			}
		}
		$tester.remove();

		var result = res_arr_last.join(' ');
		result = result.replace(/[,\.\s]*$/g, '');

		if (text.length !== result.length) {
			result += ending;
		}

		$source.text(result);

		$source.trigger('vertical-truncator');

		if (callback) {
			callback();
		}

		if (!$source.hasClass('vertically-truncated')) {
			$(window).on('resize', function(){
				vertical_truncator($source, ending, callback);
			});
		}

		$source.addClass('vertically-truncated');
	}

	window.vertical_truncator = vertical_truncator;

	$.fn.vertical_truncator = function(ending, callback) {
		vertical_truncator($($this), ending, callback);
	};

	window.vertically_truncate = function(ending, callback) {
		$('[data-vertical-truncator]').each(function() {
			vertical_truncator($(this), ending, callback);
		});
	};
})(jQuery);
