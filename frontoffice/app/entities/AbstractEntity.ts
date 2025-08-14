export abstract class AbstractEntity {
    public '@id'!: string
    public id!: number | string;
    public createdAt?: Date;
    public updatedAt?: Date;
}