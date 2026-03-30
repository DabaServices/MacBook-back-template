import { BadRequestException, Injectable } from "@nestjs/common";
import { ReportItemRepository } from "./report-item.repository";
import { MESSAGE_TYPES, RECORD_STATUS } from "../../../constants";
import { IReportItem } from "./report-item.model";
import { Sequelize } from "sequelize-typescript";
import { DeleteItemsDTO } from "./report.types";

@Injectable()
export class ReportItemService {
    constructor(private readonly repository: ReportItemRepository,
        private readonly sequelize: Sequelize
    ) { }

    async deleteReportItems(recipientUnitId: number, deleteItemsDTO: DeleteItemsDTO, date: string) {
        const transaction = await this.sequelize.transaction();

        try {
            const reportsToDelete = await this.repository.getReports(recipientUnitId,
                deleteItemsDTO, new Date(date));

            const itemsToDelete: IReportItem[] = reportsToDelete.flatMap(report =>
                (report.items ?? []).map(item => ({
                    ...item.dataValues,
                    status: RECORD_STATUS.INACTIVE,
                    confirmedQuantity: null,
                    reportedQuantity: null
                }))
            );

            await this.repository.updateReportsItems(itemsToDelete);
            await transaction.commit();
        } catch (error) {
            console.log(error);
            await transaction.rollback();

            throw new BadRequestException({
                message: 'נכשלה מחיקת הדיווחים, יש לנסות שנית',
                type: MESSAGE_TYPES.FAILURE
            })
        }
    }
}
