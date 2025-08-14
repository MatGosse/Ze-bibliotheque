export abstract class AbstractEntity {
    public id!: number | string;
    public createdAt?: Date;
    public updatedAt?: Date;
}