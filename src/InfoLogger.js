import * as listenerutils from './listenerutils.js';

const __gutter = 4;

export default class InfoLogger {
	constructor() {
		this.items = [
			['user agent', navigator.userAgent],
			['pointer type', listenerutils.eventName]
		].sort((a, b) => b[0].length - a[0].length);
		this.leftWidth = this.items[0][0].length + __gutter;
	}
	log () {
		for (let i = 0, ii = this.items.length; i < ii; i++) {
			let label = this.items[i][0];

			for (var j = 0, jj = this.leftWidth - label.length; j < jj; j++) {
				label += ' ';
			}

			console.log(label + this.items[i][1]);
		} 
	}
}