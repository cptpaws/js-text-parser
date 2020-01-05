class Interval {
    constructor(start, end) {
        this._start = start;
        this._end = end;

        this.same = this.same.bind(this);
        this.intersects = this.intersects.bind(this);
    }

    get start() {
        return this._start;
    }

    set start(value) {
        this._start = parseInt(value, 10) || 0;
    }

    get end() {
        return this._end;
    }

    set end(value) {
        this._end = parseInt(value, 10) || 0;
    }

    get length() {
        return Math.abs(this.start - this.end);
    }

    offset(byStart, byEnd) {
        byStart = byStart || 0;
        byEnd = byEnd || byStart;
        return new Interval(this.start + byStart, this.end + byEnd);
    }

    intersects(other) {
        return Math.max(this.start, other.start) <= Math.min(this.end, other.end);
    }

    exceeds(other) {
        return this.end > other.end;
    }

    isIncluded(other) {
        return this.start >= other.start && this.end <= other.end;
    }

    includes(other) {
        return this.start <= other.start && this.end >= other.end;
    }

    same(other) {
        return this.start === other.start && this.end === other.end;
    }

    json() {
        return {
            start: this.start,
            end: this.end
        };
    }
}

module.exports = Interval;