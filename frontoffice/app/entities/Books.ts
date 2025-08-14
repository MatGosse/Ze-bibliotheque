import {AbstractEntity} from "~/entities/AbstractEntity";
import type {Authors} from "~/entities/Authors";
import type {Categories} from "~/entities/Categories";

export class Books extends AbstractEntity{
    public name!: string;
    public author!: Authors | string;
    public categories!: Categories[] | string[];

    public constructor(data: Partial<Books>) {
        super();
        Object.assign(this, data);
    }
}