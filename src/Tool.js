module.exports = class Tool {
	constructor () { if (this.constructor === Tool) throw new Error('Abstract class: cannot be instantiated directly.')}
	onDown () { throw new Error('Abstract method not implemented.')}
	onMove () { throw new Error('Abstract method not implemented.')}
	onUp () { throw new Error('Abstract method not implemented.')}
}