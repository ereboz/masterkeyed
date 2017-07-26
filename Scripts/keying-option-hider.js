/*
	sort Keyed Alike first
	remove the dropdown altogether


$(function () {
	/* globals */

	var DEBUG = true;
	var $keyingOption = $('#product-options-wrap #variantSelector[name="variants"]');
	var keyingOption = getKeyingOption();
	var keyedAlikeText = 'Keyed Alike'

	/* MAIN */

	debug('current keying option: ' + keyingOption);

	debug('selecting ' + keyedAlikeText);
	setKeyedAlikeOption();

	hideKeyingOptions();

	/* lib functions */

	/* hide all keying options except Keyed Alike */
	function hideKeyingOptions() {
		debug('hiding keying options...');

		$keyingOption.find('option').each(function (i, el) {
			var option = $(el).text();

			if (option !== keyedAlikeText) {
				debug('removing option: ' + option);
				$(el).remove();
			}
		});
	}

	/* select Keyed Alike to trigger price change (if any) */
	function setKeyedAlikeOption() {
		var $option = $keyingOption.find('option:contains("' + keyedAlikeText + '")');
		var val = $option.val();

		debug('setting Option to val ' + val);

		$keyingOption.val(val);
		$keyingOption.trigger('change');
	}

	/* return the current keying option */
	function getKeyingOption() {
		var val = $keyingOption.val();
		var $option = $keyingOption.find('option[value="' + val + '"]');
		return $option.text();
	}

	/* util functions */

	function debug() {
		if (DEBUG) console.log.apply(null, arguments);
	}
});