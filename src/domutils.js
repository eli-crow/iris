import * as strutils from './strutils.js';

//returns an HTMLCollection
export function HTMLToElements (html) {
	const el = document.createElement('div');
	el.innerHTML = html;
	return el.children;
}

export function formatRgbaString (rgbaArr) {
	if (rgbaArr.length === 3) {
		rgbaArr[3] = 1; //alpha
	}
	return 'rgba('+ rgbaArr.join(',') + ')';
}

export function remove (element) {
	element.parentElement.removeChild(element);
}

export function getAbsoluteOffset(element) {
	const offset = {left: element.offsetLeft, top: element.offsetTop};
	while (element = element.parent) {
		offset.left += element.offsetLeft;
		offset.top += element.offsetTop;
	}
	return offset;
}

export function getBoundingPageRect (el) {
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

export function setVendorCss (element, property, value) {
	element.style[property] = value;

	const p = strutils.titleCase(property);
	element.style["webkit" + p] = value;
	element.style["moz" + p] = value;
	element.style["ms" + p] = value;
	element.style["o" + p] = value;
};

export function rectsIntersect (a, b) {
	return !(
		a.right < b.left ||
		a.left > b.right ||
		a.bottom < b.top ||
		a.top > b.bottom
	)
}
export function rectContains (a, b) {
	return !(
		a.right > b.right ||
		a.left < b.left ||
		a.bottom > b.bottom ||
		a.top < b.top
	)
}

export function elementBoundsIntersect (a, b) {
	return rectsIntersect (
		a.getBoundingClientRect(),
		b.getBoundingClientRect()
	);
}