const Emitter = require('../src/Emitter.js');

describe('An Emitter', function () {
	let reactor;

	beforeEach(function () {
		reactor = new Emitter(['eventone', 'eventtwo', 'eventthree']);
	})

	it('sends an event object to callbacks', function () {
		reactor.on('eventone', function(event) {
			expect(event.data).toEqual(Math.PI);
		});
		reactor.emit('eventone', {data: Math.PI})
	})
})