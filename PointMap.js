class PointMap {
    constructor(pairs) {
        this.values = new Map();
        this.size = 0;
        if (pairs) {
            for (let [key, value] of pairs) {
                this.set(key, value);
                this.size += 1;
            }
        }
    }

    get(key) {
        const [x, y] = key;
        const innerMap = this.values.get(x);
        return innerMap && innerMap.get(y);
    }

    set(key, value) {
        const [x, y] = key;
        !this.values.has(x) && (this.values.set(x, new Map()));
        const innerMap = this.values.get(x);
        this.values.set(x, innerMap.set(y, value));
        this.size += 1;
        return this;
    }

    delete(key) {
        if (!this.has(key)) {
            return false;
        }
        const [x, y] = key;
        const innerMap = this.values.get(x);
        innerMap.delete(y);
        if (innerMap.size === 0) {
            this.values.delete(x);
        }
        this.size -= 1;
        return true;
    }

    has(key) {
        return this.get(key) !== undefined;
    }

    clear() {
        this.values.clear();
        this.size = 0;
    }

    keys() {
        return [...this].map(entry => entry[0]);
    }

    entries() {
        return [...this];
    }

    // similiar to Map, returns iterator of entries ([key, value])
    [Symbol.iterator]() {
        return new PointMapIterator(this);
    }
}

class PointMapIterator {
    constructor(pointMap) {
        this.pointMap = pointMap;

        this.currentIterator = this.pointMap.values[Symbol.iterator]();
        this.innerIterator = null;
        this.x = null;
    }

    nextToken() {
        let token = this.innerIterator && this.innerIterator.next();
        if (!token || token.done) {
            return { done: true };
        }
        const [y, type] = token.value;
        return {
            value: [[this.x, y], type],
            done: false,
        };
    }

    next() {
        // Return next y associated with current x, if any
        let nextToken = this.nextToken();
        if (!nextToken.done) { 
            return nextToken; 
        };

        // Otherwise, move onto next x coor. We are done iterating when
        // the outer map has finished iterating
        const nextX = this.currentIterator.next();
        if (nextX.done) {
            return { done: true };
        }
        this.x = nextX.value[0];
        this.innerIterator = this.pointMap.values.get(this.x)[Symbol.iterator]();
        return this.nextToken();
    }
}

export default PointMap;
