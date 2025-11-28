import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

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
		this.assertIsInState(FileState.CLOSED);
        // do something
		this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
		this.assertIsInState(FileState.OPEN);
        // read something
        return new Int8Array();
    }

    public close(): void {
		this.assertIsInState(FileState.OPEN);
        // do something
		this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

	private assertIsInState(state: FileState) {
		IllegalArgumentException.assert(this.doGetFileState() !== state);
	}
}
