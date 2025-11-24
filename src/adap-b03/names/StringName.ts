import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
		if (delimiter !== undefined) {
			super(delimiter);
		} else {
			super();
		}
		this.name = source;
		this.noComponents = this.getComponents().length;
    }

	private getComponents() : string[] {
		const delimiter_regex = new RegExp("(?<!\\\\(?:\\\\{2})*)" + StringName.escapeRegexChars(this.delimiter), "g");
		return this.name.split(delimiter_regex);
	}

    public clone(): Name {
		return new StringName(this.name.slice(), this.getDelimiterCharacter().slice());
    }

    public getNoComponents(): number {
		return this.noComponents;
    }

    public getComponent(i: number): string {
		return this.getComponents()[i];
    }

    public setComponent(i: number, c: string) {
		const new_components = this.getComponents();
		new_components[i] = c;
		this.name = new_components.join(this.delimiter);
    }

    public insert(i: number, c: string) {
		const new_components = this.getComponents();
		new_components.splice(i, 0, c);
		this.name = new_components.join(this.delimiter);
		this.noComponents += 1;
    }

    public append(c: string) {
		const new_components = this.getComponents();
		new_components.push(c);
		this.name = new_components.join(this.delimiter);
		this.noComponents += 1;
    }

    public remove(i: number) {
		const new_components = this.getComponents();
		new_components.splice(i, 1);
		this.name = new_components.join(this.delimiter);
		this.noComponents -= 1;
    }
}
