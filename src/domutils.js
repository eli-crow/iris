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