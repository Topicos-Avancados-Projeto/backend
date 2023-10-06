export class BaseException extends Error {
    private readonly description;

    constructor(description: string | Record<string, any>) {
        super();
        this.description = description;
        this.extractMessage();
        this.extractName();
    }

    private extractMessage() {
        if(typeof this.description === 'string') this.message = this.description;
        else if(typeof this.description == 'object')
        this.message = this.description.message;
    }

    private extractName() {
        this.name = this.constructor.name;
    }

    public getDescription(): string | object {
        return this.description
    }
}

export class NotOwnershitCheckerException extends BaseException {
    constructor(message = 'Resource Ownership Cheker nof found.') {
        super({type: 'NotOwnershitCheckerException', message});
    }
}