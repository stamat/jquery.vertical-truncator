// https://github.com/stamat/jquery.vertical-truncateor
(function ($) {
	function vertical_truncator($source, ending, $trigger, animation_duration, callback) {
		var $tester = $('<div></div>');
		var text = $source.text();


		//TODO: do a source clone absolute hidden and pointer events none so we can always know the height of source regardless of the width
		if (!$source.data('vertical-truncator-original-height')) {
			var source_height = $source.height();
			$source.data('vertical-truncator-original-height', source_height);
		}

		if ($source.data('vertical-truncator-original')) {
			text = $($source.data('vertical-truncator-original')).text();
		} else {
			$source.data('vertical-truncator-original', $source.html());
		}

		//TODO: if old width, font-size and line-height differ on resize perform truncate
		var w = $source.width();
		if (!$source.data('vertical-truncator-width')) {
			$source.data('vertical-truncator-width', w);
		}

		if (ending === undefined || ending === null) {
			ending = '<span class="ending">... <a href="#">View More</a></span>';
		}

		function expand() {
			$source.addClass('stop-vertical-truncate');
			$source.html($source.data('vertical-truncator-original'));
		}

		function collapse() {
			$source.removeClass('stop-vertical-truncate');
			vertical_truncator($source, ending, $trigger, animation_duration, callback);
		}

		var $ending = $(ending);
		var $trig = $ending.find('a');

		if ($trigger && $trigger.length) {
			$trig = $trigger;
		}

		if ($trig.length) {
			if (!$trig.hasClass('bound')) {
				$trig.addClass('bound');
				$trig.on('click', function(e) {
					e.preventDefault();

					if ($trig.hasClass('active')) {
						$trig.removeClass('active');
						collapse();
					} else {
						$trig.addClass('active');
						expand();
					}
				});
			}
		}

		var line_height = $source.css('line-height');
		var font_size = parseInt($source.css('font-size'), 10);

		if (line_height === 'normal') {
			line_height = font_size * 1.16; // 1.16 difference constant
		} else {
			line_height = parseInt(line_height, 10);
		}

		var h = line_height * parseInt($source.data('vertical-truncator'), 10);

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

		var text_pts = text.split(' ');

		for	(var i = 0; i < text_pts.length; i++) {
			var pt = text_pts[i];
			res_arr.push(pt);
			$tester.empty();
			$tester.text(res_arr.join(' ').replace(/[,\.\s]*$/g, ''));
			$tester.append(ending);

			if ($tester.height() <= h) {
				res_arr_last.push(pt);
			} else {
				break;
			}
		}
		$tester.remove();

		var result = res_arr_last.join(' ');
		result = result.replace(/[,\.\s]*$/g, '');

		$source.text(result);

		if (text.length !== result.length) {
			$source.append($ending);
		}

		$source.trigger('vertical-truncator');

		if (callback) {
			callback($source);
		}

		if (!$source.hasClass('vertically-truncated')) {
			$(window).on('resize', function() {
				if ($source.hasClass('stop-vertical-truncate')) {
					return;
				}
				vertical_truncator($source, ending, $trigger, animation_duration, callback);
			});
		}

		$source.addClass('vertically-truncated');
	}

	window.vertical_truncator = vertical_truncator;

	$.fn.vertical_truncator = function(ending, $trigger, animation_duration, callback) {
		vertical_truncator($(this), ending, $trigger, animation_duration, callback);
	};

	window.vertically_truncate = function(ending, $trigger, animation_duration, callback) {
		$('[data-vertical-truncator]').each(function() {
			vertical_truncator($(this), ending, $trigger, animation_duration, callback);
		});
	};
})(jQuery);
