// Todo: check for gl context name
const GL_CONTEXT_NAME = 'webgl';

module.exports.getPixel = function (canvas, x, y) {
	const gl = canvas.getContext(GL_CONTEXT_NAME);
	var pixel = new Uint8Array(4);
	gl.readPixels(x, canvas.height - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
	return [pixel[0], pixel[1], pixel[2], pixel[3] / 255];
}

module.exports.uniformByType = function(gl, type, location, values) {
	switch(type)
	{
		case '1f': gl.uniform1f(location, values); break;
		case '2f': gl.uniform2f(location, ...values); break;
		case '3f': gl.uniform3f(location, ...values); break;
	}
};

module.exports.createShader = function(gl, sourceCode, type) {
	// Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
	var shader = gl.createShader( type );
	gl.shaderSource( shader, sourceCode );
	gl.compileShader( shader );

	if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
		var info = gl.getShaderInfoLog( shader );
		throw "Could not compile WebGL program. \n\n" + info;
	}
	return shader;
};

module.exports.createAndLinkProgram = function(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const info = gl.getProgramInfoLog(program);
		throw "could not compile WebGL program. \n\n" + info;
	}
	return program;
};