const Reactor = require('../src/Reactor.js');

describe('A Reactor', function () {
	let reactor;

	beforeEach(function () {
		reactor = new Reactor(['eventone', 'eventtwo', 'eventthree']);
	})

	it('sends an event object to callbacks', function () {
		reactor.addEventListener('eventone', function(event) {
			expect(event.data).toEqual(Math.PI);
		});
		reactor.dispatchEvent('eventone', {data: Math.PI})
	})
})