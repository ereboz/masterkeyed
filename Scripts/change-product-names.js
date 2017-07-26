var url = window.location.href;
var isCategoryPage = url.indexOf('/category/') > -1;
var isSearchPage = url.indexOf('/search') > -1;
var isProductPage = url.indexOf('/product') > -1;

function debug() {
    if (true) return console.log.apply(null, arguments);
}

function changeName(name) {
    var terms = name.split(' ');
    var sku = terms[0];

    terms[0] = processSku(sku);

    return terms.join(' ');
}

function processSku(sku) {
    if (sku === '500KABRK') return sku;
    if (sku.indexOf('DSPT') > -1) return sku.replace('DSPT', 'KADSPT');

    var lastChar = sku[sku.length - 1];
    if (lastChar === 'B') return sku.slice(0, sku.length - 1) + 'KAB';

    if (sku.indexOf('BLH') > -1) return sku.replace('BLH', 'KABLH');
    if (sku.indexOf('BLF') > -1) return sku.replace('BLF', 'KABLF');
    if (sku.indexOf('BLJ') > -1) return sku.replace('BLJ', 'KABLJ');
    if (sku.indexOf('BLN') > -1) return sku.replace('BLN', 'KABLN');
    if (sku.indexOf('BLT') > -1) return sku.replace('BLT', 'KABLT');

    if (sku.indexOf('LH') > -1) return sku.replace('LH', 'KALH');
    if (sku.indexOf('LF') > -1) return sku.replace('LF', 'KALF');
    if (sku.indexOf('LJ') > -1) return sku.replace('LJ', 'KALJ');
    if (sku.indexOf('LN') > -1) return sku.replace('LN', 'KALN');
    if (sku.indexOf('LT') > -1) return sku.replace('LT', 'KALT');

    return sku + 'KA';
}

function changeLinks() {
    var $links = getLinks();
    debug('got ' + $links.length + ' links');
    $links.each(function (i, el) {
        var oldText = $(el).text();
        var newText = changeName(oldText);
        $(el).text(newText);
    });
}

$(function () {
    if (isCategoryPage || isSearchPage || isProductPage) {
        changeLinks();
    }
});

function getLinks() {
    if (isCategoryPage) return $('#CategoryPage table .guidedNavNameWrap a');
    if (isSearchPage) return $('.products-grid .grid-item-name-wrap a');
    if (isProductPage) return $('.product-page-header');
}
