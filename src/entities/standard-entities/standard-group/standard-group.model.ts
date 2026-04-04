import { DataTypes } from "sequelize";
import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { fileURLToPath } from "url";

type IStandardGroup = {
    id: string;
    name: string;
    groupType: string;
}

@Table({ tableName: 'standard_groups', timestamps: false })
export class StandardGroup extends Model<IStandardGroup> {
    @PrimaryKey
    @Column(DataTypes.STRING)
    declare id: string;

    @Column(DataTypes.STRING)
    declare name: string;

    @Column({ field: "group_type", type: DataTypes.STRING })
    declare groupType: string;
}
