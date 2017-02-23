const Tool = require('../src/Tool.js');

describe('A Tool', () => {
	it('should not be able to instantiated directly.', () =>{
		expect(() => { const tool = new Tool(); }).toThrow(new Error('Abstract class: cannot be instantiated directly.'))
	})
});