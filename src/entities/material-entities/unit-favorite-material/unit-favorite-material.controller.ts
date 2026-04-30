import { Body, Controller, Delete, Post } from "@nestjs/common";
import { CreateUnitFavoriteMaterial, DeleteUnitFavoriteMaterial } from "./DTO/dto";
import { UnitFavoriteMaterialService } from "./unit-favorite-material.service";
import { RequireScreenUnitRequesting } from "src/common/decorators/require-screen-unit-requesting.decorator";

@Controller('favoriteMaterial')
export class UnitFavoriteMaterialController {
    constructor(private readonly service: UnitFavoriteMaterialService) { }

    @Post()
    createUnitFavoriteMaterial(@Body() unitFavoriteMaterial: CreateUnitFavoriteMaterial) {
        return this.service.create(unitFavoriteMaterial);
    }

    @Delete()
    deleteUnitFavoriteMaterial(@Body() unitFavoriteMaterial: DeleteUnitFavoriteMaterial) {
        return this.service.destroy(unitFavoriteMaterial);
    }
}