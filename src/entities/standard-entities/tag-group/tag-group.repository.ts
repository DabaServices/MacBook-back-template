import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ITagGroup, TagGroup } from "./tag-group.model";
import { StandardTag } from "../standard-tag/standard-tag.model";
import { UnitStandardTags } from "../unit-standard-tag/unit-standard-tag.model";
import { UnitId } from "src/entities/unit-entities/unit-id/unit-id.model";
import { Unit } from "src/entities/unit-entities/unit/unit.model";

@Injectable()
export class TagGroupRepository {
    constructor(@InjectModel(TagGroup) private readonly tagGroup: typeof TagGroup) { }

    fetchAll() {
        return this.tagGroup.findAll({
            include: [{
                model: StandardTag,
                include: [{
                    model: UnitStandardTags,
                    include: [{
                        model: UnitId,
                        include: [{
                            model: Unit
                        }]
                    }]
                }]
            }]
        });
    }

    fetchById(id: number) {
        return this.tagGroup.findOne({
            where: { id }
        })
    }

    fetchByDescription(description: string) {
        return this.tagGroup.findOne({
            where: {
                description
            }
        })
    }

    createTagGroup(tagGroup: ITagGroup) {
        return this.tagGroup.upsert(tagGroup);
    }

    updateTagGroup(tagGroup: ITagGroup) {
        return this.tagGroup.upsert(tagGroup);
    }

    deleteTagGroup(id: number) {
        return this.tagGroup.destroy({
            where: { id }
        });
    }
}