const radius = 5;

export function Circle(x, y) {
  this.x = x;
  this.y = y;
  this.v = [x, y];
  this.radius = radius;

  this.draw = function (ctx) {
    console.log(ctx);
    ctx.beginPath();
    ctx.arc(this.v[0], this.v[1], this.radius, Math.PI * 2, false);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fill();
  };

  this.scale = function (s) {
    const A = [
      [s, 0],
      [0, s],
    ];
    this.v = numeric.dot(A, this.v);
  };

  this.translate = function (xTranslate, yTranslate) {
    this.v[0] += xTranslate;
    this.v[1] += yTranslate;
  };
}
