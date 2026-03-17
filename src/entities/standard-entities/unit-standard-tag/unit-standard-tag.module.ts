import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UnitStandardTagController } from "./unit-standard-tag.controller";
import { UnitStandardTags } from "./unit-standard-tag.model";
import { UnitStanadrdTagRepository } from "./unit-standard-tag.repository";
import { UnitStandardTagService } from "./unit-standard-tag.service";

@Module({
    imports: [SequelizeModule.forFeature([UnitStandardTags])],
    controllers: [UnitStandardTagController],
    providers: [UnitStandardTagService, UnitStanadrdTagRepository],
})

export class UnitStandardTagModule { }
