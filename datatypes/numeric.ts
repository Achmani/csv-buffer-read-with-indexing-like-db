import { DataTypes } from "./datatypes-abstract";

export class Numeric extends DataTypes<number, string>{

    private base = 32;

    isLength(arg: number): boolean {
        if (arg >= this.min && arg <= this.max) {
            return true;
        }
        throw new Error(arg + "length is at " + this.min + " to " + this.max);
    }
    
    isPreg(arg: number): boolean {
        return true;
    }

    set(arg: number): string {
        this.isLength(arg);
        this.isPreg(arg);
        return arg.toString(2).padStart(this.base, "0");
    }
    get(arg: string): number {
        return parseInt(arg, 2);
    }

    getLength(): number {
        return this.base;
    }

}