export default class ResizeListener
{
	constructor (descriptor) {
		const resizeElement = descriptor.element || document.body;

		let zoom = 1;
		let clientRect = resizeElement.getBoundingClientRect();

		this.handler = function (e) {
			if (!e.__resizeHandled__) {
				if (descriptor.before) descriptor.before(e);
				e.preventDefault();
			} else {
				return;
			}

			const newRect = resizeElement.getBoundingClientRect();
			const ratio = newRect.width / clientRect.width;
			zoom /= ratio;
			e.zoom = zoom;

			if (descriptor.after) descriptor.after(e);
			e.originalEvent.__resizeHandled__ = true;

			if (document.createEvent) {
				resizeElement.dispatchEvent(e.originalEvent);
			} else {
				this.fireEvent(e.originalEvent.eventType, e.originalEvent);
			}
		}

		resizeElement.addEventListener('resize', () => this.handler, false);
	}

	enable () {

	}

	disable () {

	}
}