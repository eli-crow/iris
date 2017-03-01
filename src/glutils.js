function getPixel (canvas, x, y) {
	const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	var pixel = new Uint8Array(4);
	gl.readPixels(x, canvas.height - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
	return [pixel[0], pixel[1], pixel[2], pixel[3]];
}

function uniformByType (gl, type, location, values) {
	switch(type)
	{
		case '1f': gl.uniform1f(location, values); break;
		case '2f': gl.uniform2f(location, ...values); break;
		case '3f': gl.uniform3f(location, ...values); break;
	}
};

function createShader(gl, sourceCode, type) {
	var shader = gl.createShader( type );
	gl.shaderSource( shader, sourceCode );
	gl.compileShader( shader );

	if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
		var info = gl.getShaderInfoLog( shader );
		throw "Could not compile WebGL program. \n\n" + info;
	}
	return shader;
};

function createAndLinkProgram(gl, vertexShader, fragmentShader) {
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

function createAndLinkProgramFromSource (gl, vertexSrc, fragmentSrc) {
	const vertShader = createShader(gl, vertexSrc, gl.VERTEX_SHADER);
	const fragShader = createShader(gl, fragmentSrc, gl.FRAGMENT_SHADER);
	return createAndLinkProgram(gl, vertShader, fragShader);
}

module.exports.getPixel = getPixel;
module.exports.uniformByType = uniformByType;
module.exports.createShader = createShader;
module.exports.createAndLinkProgram = createAndLinkProgram;
module.exports.createAndLinkProgramFromSource = createAndLinkProgramFromSource;