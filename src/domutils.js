const strutils = require('./strutils.js');

//returns an HTMLCollection
function HTMLToElements (html) {
	const el = document.createElement('div');
	el.innerHTML = html;
	return el.children;
}

function formatRgbaString (rgbaArr) {
	if (rgbaArr.length === 3) {
		rgbaArr[3] = 1; //alpha
	}
	return 'rgba('+ rgbaArr.join(',') + ')';
}

module.exports.remove = function (element) {
	element.parentElement.removeChild(element);
}

module.exports.getAbsoluteOffset = function (element) {
	const offset = {left: element.offsetLeft, top: element.offsetTop};
	while (element = element.parent) {
		offset.left += element.offsetLeft;
		offset.top += element.offsetTop;
	}
	return offset;
}

function getBoundingPageRect (el) {
	const body = document.body.getBoundingClientRect();
	const rect = el.getBoundingClientRect();
	return {
		left: rect.left - body.left,
		right: rect.right - body.left,
		top: rect.top - body.top,
		bottom: rect.bottom - body.top,
		width: rect.width,
		height: rect.height
	}
}

module.exports.setVendorCss = function (element, property, value) {
	element.style[property] = value;

	const p = strutils.titleCase(property);
	element.style["webkit" + p] = value;
	element.style["moz" + p] = value;
	element.style["ms" + p] = value;
	element.style["o" + p] = value;
};

function rectsIntersect (a, b) {
	return !(
		a.right < b.left ||
		a.left > b.right ||
		a.bottom < b.top ||
		a.top > b.bottom
	)
}
function rectContains (a, b) {
	return !(
		a.right > b.right ||
		a.left < b.left ||
		a.bottom > b.bottom ||
		a.top < b.top
	)
}

module.exports.elementBoundsIntersect = function (a, b) {
	return rectsIntersect (
		a.getBoundingClientRect(),
		b.getBoundingClientRect()
	);
}

module.exports.rectsIntersect = rectsIntersect;
module.exports.rectContains = rectContains;
module.exports.HTMLToElements = HTMLToElements;
module.exports.formatRgbaString = formatRgbaString;
module.exports.getBoundingPageRect = getBoundingPageRect;