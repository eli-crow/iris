export function getDataFromImgElement(img) {
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);
	return ctx.getImageData(0, 0, img.width, img.height);
}

export function tintImageData (ctx, srcData, colorTuple, amount = 1) {
	const outImg = ctx.createImageData(srcData);

	if (amount < 1) {
		for (let i = 0, ii = outImg.data.length; i < ii; i += 4) {
			outImg.data[i]     = amount * colorTuple[0] + (1-amount) * srcData.data[i];
			outImg.data[i + 1] = amount * colorTuple[1] + (1-amount) * srcData.data[i+1];
			outImg.data[i + 2] = amount * colorTuple[2] + (1-amount) * srcData.data[i+2];
			outImg.data[i + 3] = srcData.data[i + 3];
		}
	} else {
		for (let i = 0, ii = outImg.data.length; i < ii; i += 4) {
			outImg.data[i]     = colorTuple[0];
			outImg.data[i + 1] = colorTuple[1];
			outImg.data[i + 2] = colorTuple[2];
			outImg.data[i + 3] = srcData.data[i + 3];
		}
	} 

	return outImg;
}

export function getCanvasFromImageData (data) {
	const canvas = document.createElement('canvas');
	canvas.width = data.width;
	canvas.height = data.height;
	canvas.getContext('2d').putImageData(data, 0, 0);
	return canvas;
}

export function stamp (ctx, img, x, y, width, height, colorTuple, blend) {
	let data;

	if (img instanceof HTMLImageElement || img instanceof Image) {
		data = getDataFromImgElement(img)
	}
	else if (img instanceof HTMLCanvasElement) {
		data = img.getContext('2d').getImageData(0,0,img.width,img.height);
	}

	const tinted = getCanvasFromImageData(
		tintImageData(img.getContext('2d'), data, colorTuple, blend)
	);
	ctx.drawImage(tinted, x, y, width, height);
}

export function drawTexture (context, img, x, y, width, height, rotation, opacity, erase) {
	context.save();
	context.translate(x,y);
	context.rotate(rotation);
	if (erase) context.globalCompositeOperation = 'destination-out';
	context.globalAlpha = opacity;
	context.drawImage(img, -width/2, -height/2, width, height);
	context.restore();
};

export function getPixel (context, x, y) { 
	return context.getImageData(x,y,1,1).data;
};

export function resizeCanvasComputed (canvas) {
	const cs = window.getComputedStyle(canvas);
	canvas.width = parseInt(cs.width);
	canvas.height = parseInt(cs.height);
}

export function resizeToParent (canvas) {
	if (!canvas.parentElement) {
		console.warn('canvas not in DOM tree');
		return false;
	}

	const cs = window.getComputedStyle(canvas.parentElement);
	canvas.width = parseInt(cs.width);
	canvas.height = parseInt(cs.height);
}

export function drawCheckerboard (canvas, size, color1, color2) {
	const ctx = canvas.getContext('2d');
	ctx.save();

	//generate the pattern
	let tCan = document.createElement('canvas');
	let tCtx = tCan.getContext('2d');
	tCan.width = size*2;
	tCan.height = size*2;

	tCtx.fillStyle = color1;
	tCtx.fillRect(0, 0, size, size);
	tCtx.fillRect(size, size, size, size);

	tCtx.fillStyle = color2;
	tCtx.fillRect(size, 0, size, size);
	tCtx.fillRect(0, size, size, size);

	//fill using pattern
	ctx.fillStyle = ctx.createPattern(tCan, 'repeat');
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	tCan = null;
	tCtx = null;

	ctx.restore();
}