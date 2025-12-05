import { Node } from "./Node";
import { Directory } from "./Directory";
import { Exception } from "../common/Exception";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { ServiceFailureException } from "../common/ServiceFailureException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        try {
            this.assertClassInvariants();
            this.assertIsInState(FileState.CLOSED);
            // do something
            this.state = FileState.OPEN;
        } catch (e) {
            if (e instanceof Exception) {
                throw new ServiceFailureException("Error", e);
            }
            throw e;
        }
    }

    public read(noBytes: number): Int8Array {
        try {
            this.assertClassInvariants();
            this.assertIsInState(FileState.OPEN);
            let result: Int8Array = new Int8Array(noBytes);
            // do something

            let tries: number = 0;
            for (let i: number = 0; i < noBytes; i++) {
                try {
                    result[i] = this.readNextByte();
                } catch(ex) {
                    tries++;
                    if (ex instanceof MethodFailedException) {
                        // Oh no! What @todo?!
                        MethodFailedException.assert(tries < 3, "too many failes tries reading next byte");
                    }
                }
            }

            return result;
        } catch (e) {
            if (e instanceof Exception) {
                throw new ServiceFailureException("Error", e);
            }
            throw e;
        }
    }

    protected readNextByte(): number {
        return 0; // @todo
    }

    public close(): void {
        try {
            this.assertClassInvariants();
            this.assertIsInState(FileState.OPEN);
            // do something
            this.state = FileState.CLOSED;
        } catch (e) {
            if (e instanceof Exception) {
                throw new ServiceFailureException("Error", e);
            }
            throw e;
        }
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

	private assertIsInState(state: FileState) {
		IllegalArgumentException.assert(this.doGetFileState() !== state);
	}
}
