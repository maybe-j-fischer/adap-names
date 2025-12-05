import { Exception } from "../common/Exception";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

enum ExceptionType {
    IllegalArgument,
    InvalidState,
}

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
		this.assertIsNotNullOrUndefined(bn);
		this.assertIsNotNullOrUndefined(pn);
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
		this.assertIsNotNullOrUndefined(pn);
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        try {
            this.assertIsNotNullOrUndefined(to);
            this.parentNode.removeChildNode(this);
            to.addChildNode(this);
            this.parentNode = to;
            this.assertClassInvariants();
        } catch (e) {
            if (e instanceof Exception) {
                throw new ServiceFailureException("Error", e);
            }
            throw e;
        }
    }

    public getFullName(): Name {
        try {
            const result: Name = this.parentNode.getFullName();
            result.append(this.getBaseName());
            this.assertClassInvariants();
            return result;
        } catch (e) {
            if (e instanceof Exception) {
                throw new ServiceFailureException("Error", e);
            }
            throw e;
        }
    }

    public getBaseName(): string {
        try {
            this.assertClassInvariants();
            return this.doGetBaseName();
        } catch (e) {
            if (e instanceof Exception) {
                throw new ServiceFailureException("Error", e);
            }
            throw e;
        }
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        try {
            this.assertIsValidBaseName(bn);
            this.assertIsNotNullOrUndefined(bn);
            this.doSetBaseName(bn);
            this.assertClassInvariants();
        } catch (e) {
            if (e instanceof Exception) {
                throw new ServiceFailureException("Error", e);
            }
            throw e;
        }
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        try {
            this.assertClassInvariants();
            return this.parentNode;
        } catch (e) {
            if (e instanceof Exception) {
                throw new ServiceFailureException("Error", e);
            }
            throw e;
        }
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        try {
            this.assertIsValidBaseName(bn);
            this.assertClassInvariants();
            if (this.doGetBaseName() === bn) {
                return new Set([this]);
            }
            return new Set();
        } catch (e) {
            if (e instanceof Exception) {
                throw new ServiceFailureException("Error", e);
            }
            throw e;
        }
    }

    protected dispatchException(m: string, et: ExceptionType = ExceptionType.IllegalArgument) {
        switch (et) {
            case ExceptionType.IllegalArgument:
                throw new IllegalArgumentException(m);
            break;
            case ExceptionType.InvalidState:
                throw new InvalidStateException(m);
            break;
            default:
                throw new IllegalArgumentException("unknown exception type encountered while dispatching exception with message: " + m);
        }
    }

    protected assertIsNotNullOrUndefined(o: object | string, et: ExceptionType = ExceptionType.IllegalArgument) {
        if (o === undefined || o === null) {
            this.dispatchException("passed undefined or null as argument", et);
        }
    }

    protected assertIsValidBaseName(bn: string, et: ExceptionType = ExceptionType.IllegalArgument) {
        this.assertIsNotNullOrUndefined(bn);
        if (bn === "") {
            this.dispatchException("basename may not be empty", et);
        }
    }

    protected assertClassInvariants() {
        let bn: string = this.doGetBaseName();
        this.assertIsValidBaseName(bn, ExceptionType.InvalidState);
    }
}
