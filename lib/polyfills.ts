// Polyfills for browser APIs needed by pdfjs-dist in Node.js environment
if (typeof globalThis.DOMMatrix === "undefined") {
  // Simple DOMMatrix polyfill
  class DOMMatrix {
    a: number = 1;
    b: number = 0;
    c: number = 0;
    d: number = 1;
    e: number = 0;
    f: number = 0;
    m11: number = 1;
    m12: number = 0;
    m21: number = 0;
    m22: number = 1;
    m41: number = 0;
    m42: number = 0;

    constructor(init?: string | number[]) {
      if (typeof init === "string") {
        // Parse matrix string (simplified)
        const values = init.match(/[\d.-]+/g)?.map(Number) || [];
        if (values.length >= 6) {
          this.a = values[0];
          this.b = values[1];
          this.c = values[2];
          this.d = values[3];
          this.e = values[4];
          this.f = values[5];
          this.m11 = this.a;
          this.m12 = this.b;
          this.m21 = this.c;
          this.m22 = this.d;
          this.m41 = this.e;
          this.m42 = this.f;
        }
      } else if (Array.isArray(init) && init.length >= 6) {
        this.a = init[0];
        this.b = init[1];
        this.c = init[2];
        this.d = init[3];
        this.e = init[4];
        this.f = init[5];
        this.m11 = this.a;
        this.m12 = this.b;
        this.m21 = this.c;
        this.m22 = this.d;
        this.m41 = this.e;
        this.m42 = this.f;
      }
    }

    multiply(other: DOMMatrix): DOMMatrix {
      const result = new DOMMatrix();
      result.a = this.a * other.a + this.c * other.b;
      result.b = this.b * other.a + this.d * other.b;
      result.c = this.a * other.c + this.c * other.d;
      result.d = this.b * other.c + this.d * other.d;
      result.e = this.a * other.e + this.c * other.f + this.e;
      result.f = this.b * other.e + this.d * other.f + this.f;
      result.m11 = result.a;
      result.m12 = result.b;
      result.m21 = result.c;
      result.m22 = result.d;
      result.m41 = result.e;
      result.m42 = result.f;
      return result;
    }

    translate(x: number, y: number): DOMMatrix {
      const translate = new DOMMatrix([1, 0, 0, 1, x, y]);
      return this.multiply(translate);
    }

    scale(x: number, y?: number): DOMMatrix {
      const scaleY = y !== undefined ? y : x;
      const scale = new DOMMatrix([x, 0, 0, scaleY, 0, 0]);
      return this.multiply(scale);
    }

    rotate(angle: number): DOMMatrix {
      const rad = (angle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const rotate = new DOMMatrix([cos, sin, -sin, cos, 0, 0]);
      return this.multiply(rotate);
    }

    invert(): DOMMatrix {
      const det = this.a * this.d - this.b * this.c;
      if (det === 0) {
        throw new Error("Matrix is not invertible");
      }
      const result = new DOMMatrix();
      result.a = this.d / det;
      result.b = -this.b / det;
      result.c = -this.c / det;
      result.d = this.a / det;
      result.e = (this.c * this.f - this.d * this.e) / det;
      result.f = (this.b * this.e - this.a * this.f) / det;
      result.m11 = result.a;
      result.m12 = result.b;
      result.m21 = result.c;
      result.m22 = result.d;
      result.m41 = result.e;
      result.m42 = result.f;
      return result;
    }
  }

  globalThis.DOMMatrix = DOMMatrix as any;
}

if (typeof globalThis.DOMPoint === "undefined") {
  class DOMPoint {
    x: number = 0;
    y: number = 0;
    z: number = 0;
    w: number = 1;

    constructor(x?: number, y?: number, z?: number, w?: number) {
      if (x !== undefined) this.x = x;
      if (y !== undefined) this.y = y;
      if (z !== undefined) this.z = z;
      if (w !== undefined) this.w = w;
    }
  }

  globalThis.DOMPoint = DOMPoint as any;
}
