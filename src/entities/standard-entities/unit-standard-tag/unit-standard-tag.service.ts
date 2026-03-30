import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { UnitStanadrdTagRepository } from "./unit-standard-tag.repository";
import { CreateUnitStandardTag, DeleteUnitStandardTag } from "./unit-standard-tag.types";
import { MESSAGE_TYPES } from "../../../constants";
import { isDefined } from "class-validator";

@Injectable()
export class UnitStandardTagService {
    constructor(private readonly repository: UnitStanadrdTagRepository) { }

    async createUnitStandardTag(createUnitStandardTag: CreateUnitStandardTag) {
        try {
            const existingUnitStandardTag = await this.repository.fetchUnitStandardTag(createUnitStandardTag);

            if (isDefined(existingUnitStandardTag)) {
                throw new BadRequestException({
                    message: 'היחידה כבר תחת התגית הנוכחית, הקשר לא נוצר',
                    type: MESSAGE_TYPES.FAILURE
                });
            }
            await this.repository.createUnitStandardTag(createUnitStandardTag);

            return {
                message: 'היחידה התווספה אל התגית',
                type: MESSAGE_TYPES.SUCCESS
            };
        } catch (error) {
            console.log(error);

            throw new BadGatewayException({
                message: error?.response?.message ?? 'היחידה לא נוספה אל התגית, יש לנסות שנית',
                type: MESSAGE_TYPES.FAILURE
            })
        }
    }

    async removeUnitStandardTag(deleteUnitStandardTag: DeleteUnitStandardTag) {
        try {
            await this.repository.removeUnitStandardTag(deleteUnitStandardTag);

            return {
                message: 'היחידה נמחקה מן התגית',
                type: MESSAGE_TYPES.SUCCESS
            }
        } catch (error) {
            console.log(error);

            throw new BadGatewayException({
                message: 'היחידה לא נמחקה מן התגית, יש לנסות שנית',
                type: MESSAGE_TYPES.FAILURE
            })

        }
    }
}