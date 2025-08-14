import type {Books} from "~/entities/Books";
import {AbstractEntity} from "~/entities/AbstractEntity";

export class Categories extends AbstractEntity{
    public name!: string;
    public Books: Books[] = [];

    public constructor(data: Partial<Categories>) {
        super();
        Object.assign(this, data);
    }
}