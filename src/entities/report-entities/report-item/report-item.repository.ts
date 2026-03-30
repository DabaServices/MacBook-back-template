import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Report } from "../report/report.model";
import { IReportItem, ReportItem } from "./report-item.model";
import { Op } from "sequelize";
import { DeleteItemsDTO } from "./report.types";

@Injectable()
export class ReportItemRepository {
    constructor(@InjectModel(Report) private readonly reportModel: typeof Report,
        @InjectModel(ReportItem) private readonly reportItemModel: typeof ReportItem) { }

    getReports(recipientUnitId: number, deleteItemsDTO: DeleteItemsDTO,
        date: Date) {
        return this.reportModel.findAll({
            include: [{
                model: ReportItem,
                where: {
                    materialId: deleteItemsDTO.materialId
                }
            }],
            where: {
                recipientUnitId,
                reportTypeId: { [Op.in]: deleteItemsDTO.reportTypes },
                createdOn: date
            }
        })
    }

    updateReportsItems(reportsItems: IReportItem[]) {
        return this.reportItemModel.bulkCreate(reportsItems,
            {
                conflictAttributes: ["reportId", "materialId", "reportingLevel"],
                updateOnDuplicate: ['status', 'confirmedQuantity', 'reportedQuantity', 'balanceQuantity']
            }
        )
    }
}
