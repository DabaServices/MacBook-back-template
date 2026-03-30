import { BadGatewayException, Injectable } from "@nestjs/common";
import { MESSAGE_TYPES } from "../../../constants";
import { CreateUnitFavoriteMaterial, DeleteUnitFavoriteMaterial } from "./DTO/dto";
import { UnitFavoriteMaterialRepository } from "./unit-favorite-material.repository";

@Injectable()
export class UnitFavoriteMaterialService {
    constructor(private readonly repository: UnitFavoriteMaterialRepository) { }

    async create(unitFavoriteMaterial: CreateUnitFavoriteMaterial) {
        try {
            await this.repository.create(unitFavoriteMaterial);
            return {
                message: `המק״ט ${unitFavoriteMaterial.materialId} נשמר למועדפים בהצלחה`,
                type: MESSAGE_TYPES.SUCCESS
            }
        } catch (error) {
            console.log(error);

            throw new BadGatewayException({
                message: `שמירת המק״ט ${unitFavoriteMaterial.materialId} למועדפים נכשלה, יש לנסות שנית`,
                type: MESSAGE_TYPES.FAILURE
            })
        }
    }

    async destroy(unitFavoriteMaterial: DeleteUnitFavoriteMaterial) {
        try {
            await this.repository.destroy(unitFavoriteMaterial);
            return {
                message: `המק״ט ${unitFavoriteMaterial.materialId} הוסר מהמועדפים`,
                type: MESSAGE_TYPES.SUCCESS
            }
        } catch (error) {
            console.log(error);

            throw new BadGatewayException({
                message: `מחיקת המק״ט ${unitFavoriteMaterial.materialId} מהמועדפים נכשלה, יש לנסות שנית`,
                type: MESSAGE_TYPES.FAILURE
            })
        }
    }
}