import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
		this.name = source;

		if (delimiter != undefined) {
			this.delimiter = delimiter;
		}

		this.noComponents = this.getComponents().length;
    }

	/** Escapes any character that has a special meaning in regex */
	private static escapeRegexChars(s: string): string {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	private getComponents() : string[] {
		const delimiter_regex = new RegExp("(?<!\\\\(?:\\\\{2})*)" + StringName.escapeRegexChars(this.delimiter), "g");
		return this.name.split(delimiter_regex);
	}

    public asString(delimiter: string = this.delimiter): string {
		const components = this.getComponents();
		const regexp_delimiter = new RegExp(StringName.escapeRegexChars(ESCAPE_CHARACTER + this.delimiter), "g");
		const regexp_escape = new RegExp(StringName.escapeRegexChars(ESCAPE_CHARACTER + ESCAPE_CHARACTER), "g");
		return components.map((s : string) => s.replace(regexp_delimiter, this.delimiter).replace(regexp_escape, ESCAPE_CHARACTER)).join(delimiter);
    }

    public asDataString(): string {
		if (this.delimiter !== DEFAULT_DELIMITER) {
			const components = this.getComponents();
			const regexp_old_delimiter = new RegExp(StringName.escapeRegexChars(ESCAPE_CHARACTER + this.delimiter), "g");
			const regexp_new_delimiter = new RegExp(StringName.escapeRegexChars(DEFAULT_DELIMITER), "g");
			return components.map((s) => s.replace(regexp_old_delimiter, this.delimiter).replace(regexp_new_delimiter, ESCAPE_CHARACTER + DEFAULT_DELIMITER)).join(DEFAULT_DELIMITER);
		} else {
			return this.name;
		}
    }

    public getDelimiterCharacter(): string {
		return this.delimiter;
    }

    public isEmpty(): boolean {
		return this.noComponents == 0;
    }

    public getNoComponents(): number {
		return this.noComponents;
    }

    public getComponent(x: number): string {
		return this.getComponents()[x];
    }

    public setComponent(n: number, c: string): void {
		const new_components = this.getComponents();
		new_components[n] = c;
		this.name = new_components.join(this.delimiter);
    }

    public insert(n: number, c: string): void {
		const new_components = this.getComponents();
		new_components.splice(n, 0, c);
		this.name = new_components.join(this.delimiter);
		this.noComponents += 1;
    }

    public append(c: string): void {
		const new_components = this.getComponents();
		new_components.push(c);
		this.name = new_components.join(this.delimiter);
		this.noComponents += 1;
    }

    public remove(n: number): void {
		const new_components = this.getComponents();
		new_components.splice(n, 1);
		this.name = new_components.join(this.delimiter);
		this.noComponents -= 1;
    }

    public concat(other: Name): void {
		/* TODO what should happen if the delimiters differ? */
		for (let i = 0; i < other.getNoComponents(); ++i) {
			this.append(other.getComponent(i));
		}
    }

}
