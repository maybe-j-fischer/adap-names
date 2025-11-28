import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName, ExceptionType } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        if (delimiter !== undefined) {
            super(delimiter);
        } else {
            super();
        }
        this.components = source;
        this.assertClassInvariants();
    }

    public clone(): Name {
        this.assertClassInvariants();
        return new StringArrayName(this.components.slice(), this.getDelimiterCharacter());
    }

    public getNoComponents(): number {
        this.assertClassInvariants();
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertHasComponentNo(i);
        this.assertClassInvariants();
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertHasComponentNo(i);
        this.assertIsValidComponent(c)
        this.components[i] = c;
        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        this.assertIsValidComponent(c)
        this.components.splice(i, 0, c);
        this.assertClassInvariants();
    }

    public append(c: string) {
        this.assertIsValidComponent(c)
        this.components.push(c);
        this.assertClassInvariants();
    }

    public remove(i: number) {
        this.assertHasComponentNo(i);
        this.components.splice(i, 1);
        this.assertClassInvariants();
    }

    private assertHasComponentNo(i: number) {
        IllegalArgumentException.assert(this.components.length > i, "index out of range");
        IllegalArgumentException.assert(i >= 0, "index out of range");
    }

    private assertIsValidComponent(c: string, et: ExceptionType = ExceptionType.IllegalArgument) {
        this.assertIsNotNullOrUndefined(c);
        /* matches unescaped delimiter characters */
        const delimiter_regex = new RegExp("(?<!\\\\(?:\\\\{2})*)" + StringArrayName.escapeRegexChars(this.delimiter), "g");
        /* matches single (unescaped and not immediately before a delimiter character) escape character ('\\'); */
        const escape_character_regex = new RegExp("(?<=(?:^|[^\\\\])(?:\\\\{2})*)\\\\(?!(?:" + StringArrayName.escapeRegexChars(this.delimiter) + ")|(?:\\\\))", "g");
        if (c.match(delimiter_regex) !== null || c.match(escape_character_regex) !== null) {
            this.dispatchException("expected a correctly masked component, but received: \"" + c + "\"", et);
        }
    }

    private assertClassInvariants() {
        for (let i = 0; i < this.components.length; ++i) {
            this.assertIsValidComponent(this.components[i], ExceptionType.IllegalArgument);
        }
        this.assertIsValidDelimiterCharacter(this.delimiter, ExceptionType.IllegalArgument);
    }
}
