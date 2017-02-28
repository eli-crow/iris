module.exports.drawTexture = function (context, img, x, y, width, height, rotation, opacity, erase) {
	context.save();
  context.translate(x,y);
  context.rotate(rotation);
  if (erase) context.globalCompositeOperation = 'destination-out';
  context.globalAlpha = opacity;
  context.drawImage(img, -width/2, -height/2, width, height);
  context.restore();
};

module.exports.getPixel = (context, x, y) => { 
	const c = context.getImageData(x,y,1,1).data;
	return [+c[0], +c[1], +c[2], +c[3]];
};