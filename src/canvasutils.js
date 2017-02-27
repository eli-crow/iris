module.exports.drawTexture = function (context, img, x, y, width, height, rotation, opacity) {
	context.save();
  context.translate(x,y);
  context.rotate(rotation);
  context.globalAlpha = opacity;
  context.drawImage(img, -width/2, -height/2, width, height);
  context.restore();
};

module.exports.getPixel = function (context, x, y) {
	const p = context.getImageData(x,y,1,1).data;
	return [p[0], p[1], p[2], p[3]];
}