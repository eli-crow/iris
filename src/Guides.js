export default class Guides
{
  constructor (canvas, spacing, angle, color) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.angle = angle / 180 * Math.PI;
    this.spacing = spacing;
    this.color = color;
  }

  draw () {
    const ctx = this.context;
    const tempC = ctx.strokeStyle;
    ctx.strokeStyle = this.color;
    
    let i = 0;
    let endX;
    const n = this.spacing;
    const l = window.innerHeight*2;
    ctx.beginPath();
    do {
      endX = i + l * Math.cos(this.angle);
      ctx.moveTo(i, 0);
      ctx.lineTo(endX, l*Math.sin(this.angle));
      i+=n;
    } 
    while (endX < window.innerWidth)
      
    ctx.stroke();
    ctx.strokeStyle = tempC;
  }

  clear () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}