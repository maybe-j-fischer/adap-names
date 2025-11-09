import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
		this.components = source;

		if (delimiter != undefined) {
			this.delimiter = delimiter;
		}
    }

	/** Escapes any character that has a special meaning in regex */
	private static escapeRegexChars(s: string): string {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

    public asString(delimiter: string = this.delimiter): string {
		const regexp_delimiter = new RegExp(StringArrayName.escapeRegexChars(ESCAPE_CHARACTER + this.delimiter), "g");
		const regexp_escape = new RegExp(StringArrayName.escapeRegexChars(ESCAPE_CHARACTER + ESCAPE_CHARACTER), "g");
		return this.components.map((s : string) => s.replace(regexp_delimiter, this.delimiter).replace(regexp_escape, ESCAPE_CHARACTER)).join(delimiter);
    }

    public asDataString(): string {
		if (this.delimiter !== DEFAULT_DELIMITER) {
			const regexp_old_delimiter = new RegExp(StringArrayName.escapeRegexChars(ESCAPE_CHARACTER + this.delimiter), "g");
			const regexp_new_delimiter = new RegExp(StringArrayName.escapeRegexChars(DEFAULT_DELIMITER), "g");
			return this.components.map((s) => s.replace(regexp_old_delimiter, this.delimiter).replace(regexp_new_delimiter, ESCAPE_CHARACTER + DEFAULT_DELIMITER)).join(DEFAULT_DELIMITER);
		} else {
			return this.components.join(DEFAULT_DELIMITER);
		}
    }

    public getDelimiterCharacter(): string {
		return this.delimiter;
    }

    public isEmpty(): boolean {
		return this.components.length === 0;
    }

    public getNoComponents(): number {
		return this.components.length;
    }

    public getComponent(i: number): string {
		return this.components[i];
    }

    public setComponent(i: number, c: string): void {
		this.components[i] = c;
    }

    public insert(i: number, c: string): void {
		this.components.splice(i, 0, c);
    }

    public append(c: string): void {
		this.components.push(c);
    }

    public remove(i: number): void {
		this.components.splice(i, 1);
    }

    public concat(other: Name): void {
		/* TODO what should happen if the delimiters differ? */
		for (let i = 0; i < other.getNoComponents(); ++i) {
			this.append(other.getComponent(i));
		}
    }

}
