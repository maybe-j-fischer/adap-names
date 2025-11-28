import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName, ExceptionType } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

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
        this.assertClassInvariants();
    }

    private getComponents() : string[] {
        const delimiter_regex = new RegExp("(?<!\\\\(?:\\\\{2})*)" + StringName.escapeRegexChars(this.delimiter), "g");
        return this.name.split(delimiter_regex);
    }

    public clone(): Name {
        this.assertClassInvariants();
        return new StringName(this.name, this.getDelimiterCharacter());
    }

    public getNoComponents(): number {
        this.assertClassInvariants();
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertHasComponentNo(i);
        this.assertClassInvariants();
        return this.getComponents()[i];
    }

    public setComponent(i: number, c: string) {
        this.assertHasComponentNo(i);
        this.assertIsValidComponent(c)
        const new_components = this.getComponents();
        new_components[i] = c;
        this.name = new_components.join(this.delimiter);
        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        this.assertIsValidComponent(c)
        const new_components = this.getComponents();
        new_components.splice(i, 0, c);
        this.name = new_components.join(this.delimiter);
        this.noComponents += 1;
        this.assertClassInvariants();
    }

    public append(c: string) {
        this.assertIsValidComponent(c)
        const new_components = this.getComponents();
        new_components.push(c);
        this.name = new_components.join(this.delimiter);
        this.noComponents += 1;
        this.assertClassInvariants();
    }

    public remove(i: number) {
        this.assertHasComponentNo(i);
        const new_components = this.getComponents();
        new_components.splice(i, 1);
        this.name = new_components.join(this.delimiter);
        this.noComponents -= 1;
        this.assertClassInvariants();
    }

    private assertHasComponentNo(i: number) {
        IllegalArgumentException.assert(this.getComponents().length > i, "index out of range");
        IllegalArgumentException.assert(i >= 0, "index out of range");
    }

    private assertIsValidComponent(c: string, et: ExceptionType = ExceptionType.IllegalArgument) {
        this.assertIsNotNullOrUndefined(c);
        /* matches unescaped delimiter characters */
        const delimiter_regex = new RegExp("(?<!\\\\(?:\\\\{2})*)" + StringName.escapeRegexChars(this.delimiter), "g");
        /* matches single (unescaped and not immediately before a delimiter character) escape character ('\\'); */
        const escape_character_regex = new RegExp("(?<=(?:^|[^\\\\])(?:\\\\{2})*)\\\\(?!(?:" + StringName.escapeRegexChars(this.delimiter) + ")|(?:\\\\))", "g");
        if (c.match(delimiter_regex) !== null || c.match(escape_character_regex) !== null) {
            this.dispatchException("expected a correctly masked component, but received: \"" + c + "\"", et);
        }
    }

    private assertClassInvariants() {
        const components = this.getComponents();
        if (components.length !== this.noComponents) {
            throw new InvalidStateException("Number of components is corrupted");
        }
        for (let i = 0; i < components.length; ++i) {
            this.assertIsValidComponent(components[i], ExceptionType.IllegalArgument);
        }
        this.assertIsValidDelimiterCharacter(this.delimiter, ExceptionType.IllegalArgument);
    }
}
