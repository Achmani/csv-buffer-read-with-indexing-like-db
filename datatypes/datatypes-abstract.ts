export abstract class DataTypes<T,S> {

    protected max: number;
    protected min: number;
    protected preg: String;

    protected pad = ' ';


    constructor(min: number, max: number) {
        this.max = max == -1 ? Number.MAX_SAFE_INTEGER : max;
        this.min = min;
        this.preg = "";
    }

    abstract isLength(arg: T): boolean;
    abstract isPreg(arg: T): boolean;
    abstract set(arg: T): S;
    abstract get(arg: S): T;
    abstract getLength(): number;
}