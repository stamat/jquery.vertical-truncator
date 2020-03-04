// https://github.com/stamat/jquery.vertical-truncateor
(function ($) {
	function vertical_truncator($source, ending, $trigger, animation_duration, callback) {

		if (!$source.hasClass('vertically-truncated')) {
			$source.parent().css('position', 'relative');
			var $clone = $('<div />');
			var rouge_css = {
				'position': 'absolute',
				'visibility': 'hidden',
				'pointer-events': 'none'
			};

			$clone.css(rouge_css);
			$clone.addClass('vartical-truncator-clone');
			$clone.addClass($source.attr('class'));
			$clone.append($source.html());

			var $tester = $('<div />');
			$tester.addClass('vartical-truncator-tester');
			$tester.css(rouge_css);

			var $parent = $source.parent();
			$parent.append($clone);
			$parent.append($tester);

			$source.addClass('vertically-truncated');
		}

		if (ending === undefined || ending === null) {
			ending = '<span class="ending">... <a href="#">View More</a></span>';
		}

		function expand() {
			$source.addClass('stop-vertical-truncate');
			var $clone = $source.parent().find('.vartical-truncator-clone');
			$source.html($clone.html());

			if (animation_duration) {
				$source.height($clone.height());

				setTimeout(function(){
					$source.css({
						'height': 'auto',
						'overflow': 'auto'
					});
				}, animation_duration);
			} else {
				$source.css({
					'height': 'auto',
					'overflow': 'auto'
				});
			}
		}

		function collapse() {
			$source.removeClass('stop-vertical-truncate');
			var tr_obj = doTruncate($source, ending, callback);
			var $clone = $source.parent().find('.vartical-truncator-clone');

			if (animation_duration) {
				$source.height($clone.height());
				$source.css('overflow', 'hidden');
				$source.height(tr_obj.tester_height);

				setTimeout(function(){
					$source.text(tr_obj.result);
					$source.trigger('vertical-truncator');

					if (tr_obj.text.length !== tr_obj.result.length) {
						$source.append(ending);
					}
				}, animation_duration);
			} else {
				completeTruncate($source, ending, callback);
			}
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

		function doTruncate($source, ending, callback) {
			var $tester = $source.parent().find('.vartical-truncator-tester');
			var $clone = $source.parent().find('.vartical-truncator-clone');
			var text = $clone.text();

			var line_height = $source.css('line-height');
			var font_size = parseInt($source.css('font-size'), 10);

			if (line_height === 'normal') {
				line_height = font_size * 1.16; // 1.16 difference constant
			} else {
				line_height = parseInt(line_height, 10);
			}

			var h = line_height * parseInt($source.data('vertical-truncator'), 10);

			//TODO: skip truncate if width didn't change
			if (h === 0) {
				return {
					text: text,
					tester_height: 0,
					result: ''
				}
			}

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
			var tester_height = $tester.height();
			$tester.empty();

			var result = res_arr_last.join(' ');
			result = result.replace(/[,\.\s]*$/g, '');

			return {
				text: text,
				tester_height: h,
				result: result
			};
		}

		function completeTruncate($source, ending, callback) {
			var tr_obj = doTruncate($source, ending, callback);
			$source.text(tr_obj.result);

			if (tr_obj.text.length !== tr_obj.result.length) {
				$source.append(ending);
			}

			$source.height(tr_obj.tester_height);
			$source.css('overflow', 'hidden');

			$source.trigger('vertical-truncator');

			if (callback) {
				callback($source);
			}
		}

		completeTruncate($source, ending, callback);

		$(window).on('resize', function() {
			if ($source.hasClass('stop-vertical-truncate')) {
				return;
			}
			completeTruncate($source, ending, callback);
		});
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
