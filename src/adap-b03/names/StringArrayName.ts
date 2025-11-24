import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
		if (delimiter !== undefined) {
			super(delimiter);
		} else {
			super();
		}
		this.components = source;
    }

    public clone(): Name {
		let newComponents : string[] = this.components.map((s) => s.slice());
		return new StringArrayName(newComponents, this.getDelimiterCharacter().slice());
    }

    public getNoComponents(): number {
		return this.components.length;
    }

    public getComponent(i: number): string {
		return this.components[i];
    }

    public setComponent(i: number, c: string) {
		this.components[i] = c;
    }

    public insert(i: number, c: string) {
		this.components.splice(i, 0, c);
    }

    public append(c: string) {
		this.components.push(c);
    }

    public remove(i: number) {
		this.components.splice(i, 1);
    }
}
