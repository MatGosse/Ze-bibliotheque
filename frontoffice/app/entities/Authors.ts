import type {Books} from "~/entities/Books";
import {AbstractEntity} from "~/entities/AbstractEntity";

export class Authors extends AbstractEntity{
    public name!: string;
    public Books!: Books[] | null;

    public constructor(data: Partial<Authors>) {
        super();
        Object.assign(this, data);
    }
}