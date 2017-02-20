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
	element.style["webkit" + property] = value;
	element.style["moz" + property] = value;
	element.style["ms" + property] = value;
	element.style["o" + property] = value;
};