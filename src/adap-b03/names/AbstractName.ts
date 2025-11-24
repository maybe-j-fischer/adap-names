import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
		this.delimiter = delimiter;
    }

	/* hash function taken from https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js */
	private static cyrb53(str : string, seed = 0): number {
		let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
		for(let i = 0, ch; i < str.length; i++) {
			ch = str.charCodeAt(i);
			h1 = Math.imul(h1 ^ ch, 2654435761);
			h2 = Math.imul(h2 ^ ch, 1597334677);
		}
		h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
		h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
		h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
		h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
		return 4294967296 * (2097151 & h2) + (h1 >>> 0);
	};

	/** Escapes any character that has a special meaning in regex */
	protected static escapeRegexChars(s: string): string {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

    public asString(delimiter: string = this.delimiter): string {
		let components : string[] = [];
		for (let i = 0; i < this.getNoComponents(); ++i) {
			components.push(this.getComponent(i));
		}
		const regexp_delimiter = new RegExp(AbstractName.escapeRegexChars(ESCAPE_CHARACTER + this.delimiter), "g");
		const regexp_escape = new RegExp(AbstractName.escapeRegexChars(ESCAPE_CHARACTER + ESCAPE_CHARACTER), "g");
		return components.map((s : string) => s.replace(regexp_delimiter, this.delimiter).replace(regexp_escape, ESCAPE_CHARACTER)).join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
		let components : string[] = [];
		for (let i = 0; i < this.getNoComponents(); ++i) {
			components.push(this.getComponent(i));
		}
		if (this.delimiter !== DEFAULT_DELIMITER) {
			const regexp_old_delimiter = new RegExp(AbstractName.escapeRegexChars(ESCAPE_CHARACTER + this.delimiter), "g");
			const regexp_new_delimiter = new RegExp(AbstractName.escapeRegexChars(DEFAULT_DELIMITER), "g");
			return components.map((s) => s.replace(regexp_old_delimiter, this.delimiter).replace(regexp_new_delimiter, ESCAPE_CHARACTER + DEFAULT_DELIMITER)).join(DEFAULT_DELIMITER);
		} else {
			return components.join(DEFAULT_DELIMITER);
		}
    }

    public isEqual(other: Name): boolean {
		/* alternatively compare the data strings */
		if (this.getDelimiterCharacter() !== other.getDelimiterCharacter() || this.getNoComponents() !== other.getNoComponents()) {
			return false;
		}
		for (let i = 0; i < this.getNoComponents(); ++i) {
			if (this.getComponent(i) !== other.getComponent(i)) {
				return false;
			}
		}
		return true;
    }

    public getHashCode(): number {
		return AbstractName.cyrb53(this.asDataString());
    }

    public isEmpty(): boolean {
		return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
		return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
    abstract clone(): Name;


    public concat(other: Name): void {
		/* TODO what should happen if the delimiters differ? */
		for (let i = 0; i < other.getNoComponents(); ++i) {
			this.append(other.getComponent(i));
		}
    }

}
