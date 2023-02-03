import { DataTypes } from "./datatypes-abstract";

export class Varchar extends DataTypes<String, String>{

    isLength(arg: String): boolean {
        let length = Buffer.from(arg).length;
        if (length >= this.min && length <= this.max) {
            return true;
        }
        throw new Error(arg + "length is at " + this.min + " to " + this.max);
    }

    isPreg(arg: String): boolean {
        return true;
    }

    set(arg: String): String {
        this.isLength(arg);
        this.isPreg(arg);
        return arg.padEnd(this.max, this.pad);
    }

    get(arg: String): String {
        return arg.trimRight();
    }

    getLength(): number {
        return this.max;
    }

}