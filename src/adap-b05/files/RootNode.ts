import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { Exception } from "../common/Exception";
import { ServiceFailureException } from "../common/ServiceFailureException";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        try {
            this.assertClassInvariants();
            return new StringName("", '/');
        } catch (e) {
            if (e instanceof Exception) {
                throw new ServiceFailureException("Error", e);
            }
            throw e;
        }
    }

    public move(to: Directory): void {
        try {
            this.assertClassInvariants();
        } catch (e) {
            if (e instanceof Exception) {
                throw new ServiceFailureException("Error", e);
            }
            throw e;
        }
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        // null operation
    }

}
