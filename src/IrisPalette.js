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

		this._uniforms = {};
		this.addUniform('resolution', {type: '2f', value: [0,0]});
		for (let name in uniforms) this.addUniform(name, uniforms[name]);

		this._positionLocation = gl.getAttribLocation(this.program, 'position');

		this.use();
		this._buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
		gl.bufferData(gl.ARRAY_BUFFER, primatives.circle(1, 50), gl.STATIC_DRAW);
	}

	draw () {
		const gl = this.gl;
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 2);
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

	activate() {
		const gl = this.gl;
		gl.useProgram(this.program);
		gl.vertexAttribPointer(this._attributes.position.location, 2, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
	}
}

module.exports = IrisPalette;