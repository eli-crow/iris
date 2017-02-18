const glutils = require('./glutils.js');
const primatives = require('./primatives');

// maintains own uniforms and gl state.
class IrisPalette
{
	constructor (gl, fragmentSrc, vertexSrc, uniforms) {
		this.gl = gl;

		const vertShader = glutils.createShader(gl, vertexSrc, gl.VERTEX_SHADER);
		const fragShader = glutils.createShader(gl, fragmentSrc, gl.FRAGMENT_SHADER);
		this.program = glutils.createAndLinkProgram(gl, vertShader, fragShader);
		gl.useProgram(this.program);

		this._uniforms = {};
		this.addUniform('resolution', {type: '2f', value: [0,0]});
		for (let name in uniforms) this.addUniform(name, uniforms[name]);

		this._positionLocation = gl.getAttribLocation(this.program, 'position');

		this._buffer = gl.createBuffer();
		this._pts = primatives.circle(1, 50);
	}

	activate() {
		const gl = this.gl;
		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this._positionLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
		gl.bufferData(gl.ARRAY_BUFFER, this._pts, gl.STATIC_DRAW);
		gl.vertexAttribPointer(this._positionLocation, 2, gl.FLOAT, false, 0, 0);
	}
	draw () {
		const gl = this.gl;
		gl.drawArrays(gl.TRIANGLE_FAN, 0, this._pts.length/2);
	}
	getUniform (name) {
		return this._uniforms[name].value;
	}
	setUniform (name, value) {
		const uniform = this._uniforms[name];
		uniform.value = value;
		glutils.uniformByType(this.gl, uniform.type, uniform.location, uniform.value);
	}
	addUniform(name, descriptor) {
		descriptor.location = this.gl.getUniformLocation(this.program, name);
		this._uniforms[name] = descriptor;
		this.setUniform(name, descriptor.value);
	}
}

module.exports = IrisPalette;