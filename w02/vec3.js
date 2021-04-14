// JavaScript source code
class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

    }

    min() {
        var min = this.x;
        if (min > this.y) {
            min = this.y;

        }
        if (min > this.z) {
            min = this.z;

        }
        return min;
    }

    max() {
        var max = this.x;
        if (max < this.y) {
            max = this.y;

        }
        if (max < this.z) {
            max = this.z;

        }
        return max;
    }

    mid() {
        if (this.x <= this.y && this.y <= this.z) {
            return this.y;
        }
        if (this.z <= this.y && this.y <= this.x) {
            return this.y
        }
        if (this.y <= this.x && this.x <= this.z) {
            return this.x;
        }
        if (this.z <= this.x && this.x <= this.y) {
            return this.x
        }
        if (this.x <= this.z && this.z <= this.y) {
            return this.z;
        }
        if (this.y <= this.z && this.z <= this.x) {
            return this.z
        }
    }

    sa(v) {
        v.x = v.x-this.x;
        v.y = v.y-this.y;
        v.z = v.z-this.z;
        return v;
    }

    size() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    seki(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

}