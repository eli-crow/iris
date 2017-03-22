const strutils = require('./strutils.js');

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

module.exports.setVendorCss = function (element, property, value) {
	element.style[property] = value;

	const p = strutils.titleCase(property);
	element.style["webkit" + p] = value;
	element.style["moz" + p] = value;
	element.style["ms" + p] = value;
	element.style["o" + p] = value;
};