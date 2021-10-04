const radius = 6;
const colors = {
  canvasBackground: "#141414",
  elementMain: "#949494",
  elementAux: "#666666",
  lockedElement: "#ff6969",
};

export function Connection(id, x, y, scale) {
  this.id = id;
  this.type = "connection";
  this.x = x / scale;
  this.y = y / scale;
  this.beams = [];
  this.aligned = true;
  this.radius = radius;
  this.locked = false;

  this.draw = function (ctx) {
    this.path = new Path2D();
    ctx.beginPath();
    this.path.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    ctx.fillStyle = colors.canvasBackground;
    ctx.strokeStyle = this.locked ? colors.lockedElement : colors.elementAux;
    ctx.lineWidth = this.radius / 3;
    ctx.fill(this.path);
    ctx.stroke(this.path);
    ctx.closePath();
  };

  this.scale = function (s) {
    const A = [
      [s, 0],
      [0, s],
    ];
    this.v = numeric.dot(A, this.v);
  };

  this.translate = function (xTranslate, yTranslate) {
    this.displayX += xTranslate;
    this.displayY += yTranslate;
  };
}

export function Beam(id, el1, el2) {
  this.id = id;
  this.type = "beam";
  this.el1 = el1;
  this.el2 = el2;
  this.length = 0;
  this.aligned = false;

  this.calculateLength = function () {
    const ySquared = Math.pow(
      Math.max(this.el1.y, this.el2.y) - Math.min(this.el1.y, this.el2.y),
      2
    );
    const xSquared = Math.pow(
      Math.max(this.el1.x, this.el2.x) - Math.min(this.el1.x, this.el2.x),
      2
    );
    this.length = Math.sqrt(ySquared + xSquared);
  };

  this.calculateTextCoords = function () {
    const offset = 15;
    const o =
      Math.max(this.el1.y, this.el2.y) - Math.min(this.el1.y, this.el2.y);
    const a =
      Math.max(this.el1.x, this.el2.x) - Math.min(this.el1.x, this.el2.x);
    const angle = Math.atan(o / a);

    return {
      x: (this.el1.x + this.el2.x) / 2 + Math.abs(offset * Math.sin(angle)),
      y: (this.el1.y + this.el2.y) / 2 + Math.abs(offset * Math.cos(angle)),
    };
  };

  this.draw = function (ctx) {
    this.calculateLength();
    // console.log(this);
    ctx.beginPath();
    this.path = new Path2D();

    // Draw beam
    ctx.lineWidth = 3;
    ctx.globalCompositeOperation = "destination-over";
    ctx.strokeStyle = colors.elementMain;
    this.path.moveTo(el1.x, el1.y);
    this.path.lineTo(el2.x, el2.y);
    ctx.stroke(this.path);
    ctx.globalCompositeOperation = "source-over";

    // Add beam ID text
    ctx.font = "Arial 10px";
    ctx.fillStyle = colors.elementMain;
    const { x, y } = this.calculateTextCoords();
    ctx.fillText(`${this.id} - ${this.length.toFixed(2)}`, x, y);
    ctx.closePath();
  };
}

export function Support(id, x, y, scale) {
  this.id = id;
  this.type = "support";
  this.x = x / scale;
  this.y = y / scale;
  this.beams = [];
  this.aligned = true;
  this.locked = false;

  this.draw = function (ctx) {
    ctx.fillStyle = this.locked ? colors.lockedElement : colors.elementMain;
    ctx.strokeStyle = colors.elementAux;
    ctx.lineWidth = 1;
    this.path = new Path2D();
    this.path.rect(0, 0, 0, 0);
    let p2 = new Path2D(
      "M 12 12 L 6 12 L 3 9 L -3 9 L -6 12 L -12 12 L -6 -3 C -3 -9 3 -9 6 -3 L 12 12 M -3 0 A 3 3 90 0 0 3 0 A 3 3 90 0 0 -3 0"
    );
    let m = new DOMMatrix();
    m.e = this.x;
    m.f = this.y;
    this.path.addPath(p2, m);
    ctx.stroke(this.path);
    ctx.fill(this.path);
  };
}

export function Force(id, element) {
  this.id = id;
  this.type = "force";
  this.element = element;
  this.aligned = false;
  this.magnitude = 100;
  this.angle = 0;

  this.draw = function (ctx) {
    const offset = Math.max(10, Math.min(50, this.magnitude / 10));
    ctx.fillStyle = colors.elementMain;
    ctx.lineWidth = 1;
    ctx.globalCompositeOperation = "destination-over";
    this.path = new Path2D();
    this.path.rect(0, 0, 0, 0);
    let p2 = new Path2D(
      `
        M 0 ${24 + offset} 
        L 6 ${14 + offset} 
        L 2 ${14 + offset} 
        M 0 ${24 + offset} 
        L -6 ${14 + offset} 
        L -2 ${14 + offset} 
        L -2 10 
        L 2 10 
        L 2 ${14 + offset}
        `
    );
    let m = new DOMMatrix(`rotate(${this.angle}deg)`);
    m.e = this.element.x;
    m.f = this.element.y;
    this.path.addPath(p2, m);
    ctx.stroke(this.path);
    ctx.fill(this.path);
    ctx.globalCompositeOperation = "source-over";
  };
}
