import type {Authors} from "~/entities/Authors";
import {AbstractEntity} from "~/entities/AbstractEntity";

export class Books extends AbstractEntity{
    public name!: string;
    public Author!: Authors;

    public constructor(data: Partial<Authors>) {
        super();
        Object.assign(this, data);
    }
}