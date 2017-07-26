(function ($) {

	var settings = {
		dataUrl: '/xmlpackage/dropsearchdata?disableTemplate=true',
		searchUrl: '/search/index',
		minimumSearchLength: 3,
		resultCount: 10,
		searchBoxSelector: '.js-search-box',
		templateSelector: '.js-drop-search-template',
		productAreaSelector: '.js-drop-search-product-area',
		productResultsSelector: '.js-drop-search-product-results',
		itemTemplateSelector: '.js-drop-search-repeating-item',
		viewAllSelector: '.js-drop-search-view-all',
		searchFormSelector: '.js-drop-search',
		loadingSelector: '.js-drop-search-loading'
	};

	var templateElement;
	var resultTarget;
	var currentAjaxRequest;
	var currentSearchString;

	var hideResults = function () {
		resultTarget.addClass('off');
		resultTarget.empty();
	}

	var initialize = function (options) {
		settings = $.extend(settings, options);
		// Take a copy of the template element when we initialize
		templateElement = $(settings.templateSelector).clone();
		resultTarget = $(settings.templateSelector);

		$('.js-search-box').keyup(function () {
			var searchString = $(this).val().trim();
			if(searchString.length < settings.minimumSearchLength) {
				hideResults();
				return;
			}
			
			// Don't run the search unless something has changed
			if(currentSearchString === searchString)
				return;

			currentSearchString = searchString;

			var queryPrefix = settings.dataUrl.indexOf('?') === -1 ? "?" : "&";
			var url = settings.dataUrl + queryPrefix + "searchterm=" + searchString

			showLoading();

			// Kill any existing requests before making the new one
			if(currentAjaxRequest && currentAjaxRequest.readyState != 4) {
				currentAjaxRequest.abort();
			}
			currentAjaxRequest = $.ajax({
				url: url,
				cache: false,
				dataType: 'json'
			})
			.done(function (data) {
				updatePageDisplay(data);
			});
		});

	};

	// hide dropsearch when you click off of the search area
	$('html').click(function () {
		$(settings.templateSelector).addClass('off');
	});

	$(settings.searchFormSelector).click(function (event) {
		event.stopPropagation();
	});

	var showLoading = function () {
		$(settings.templateSelector).addClass('loading');
	}

	var hideLoading = function () {
		$(settings.templateSelector).removeClass('loading');
	}

	var updatePageDisplay = function (data) {
		// Hide the results if we don't have any
		if(!data || !data.products || data.products.length === 0) {
			hideResults();
			return;
		}

		var resultHtml = buildResultHtml(data);
		resultTarget.removeClass('off');
		resultTarget.empty();
		resultTarget.append(resultHtml);

		// Change 'data-src' attributes to 'src' attributes
		resultTarget.find('img[data-src]').each(function () {
			$(this)
				.attr('src', $(this).data('src'));
		});

		hideLoading();
	};

	var buildResultHtml = function (data) {
		if(!data)
			return '';

		// Take a copy of the main template to work with
		var template = templateElement.clone();

		// Find the products area
		var productAreaTemplate = template.find(settings.productAreaSelector);

		// Products
		var productResults = buildProductResultsHtml(data.products, productAreaTemplate);
		productAreaTemplate.empty();
		productAreaTemplate.append(productResults);

		return template.html();
	};

	var buildProductResultsHtml = function (products, template) {
		// If we don't have product results return an empty string
		if(!products || products.length === 0)
			return '';

		// Find the product results area
		var productResults = $(template).find(settings.productResultsSelector);
		// Take a copy of the main item template
		var itemTemplate = template.find(settings.itemTemplateSelector).clone();
		// Empty out the product results
		productResults.empty();

		for(var i = 0; i < settings.resultCount; i++) {
			if(products[i]) {
				var product = products[i];
				var itemHtml = itemTemplate
					.html()
					.replace(new RegExp('{{url}}', 'g'), product.url)
					.replace(new RegExp('{{imageUrl}}', 'g'), product.imageUrl)
					.replace(new RegExp('{{altText}}', 'g'), product.altText)
					.replace(new RegExp('{{name}}', 'g'), product.name);

				productResults.append(itemHtml);
			}
		}

		var viewAllLink = template.find(settings.viewAllSelector);
		if(products.length > settings.resultCount) {
			var searchUrl = settings.searchUrl + '?searchTerm=' + $(settings.searchBoxSelector).val();
			viewAllLink.attr('href', searchUrl);
		}
		else {
			viewAllLink.remove();
		}

		return template.html();
	}

	$.dropSearch = {
		initialize: initialize,
	};

})(adnsf$);
