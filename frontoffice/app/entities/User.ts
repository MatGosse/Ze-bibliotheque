import {AbstractEntity} from "~/entities/AbstractEntity";

export class User extends AbstractEntity{
    public email!: string;
    public password: string | undefined;

    public constructor(data: Partial<User>) {
        super();
        Object.assign(this, data);
    }
}
