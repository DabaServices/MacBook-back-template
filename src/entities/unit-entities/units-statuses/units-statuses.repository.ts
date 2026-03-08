import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Transaction } from "sequelize";
import { UNIT_RELATION_TYPES } from "src/contants";
import { UnitRelation } from "../unit-relations/unit-relation.model";
import { IUnitStatus, UnitStatus } from "./units-statuses.model";

@Injectable()
export class UnitStatusTypesRepository {
    constructor(
        @InjectModel(UnitStatus) private readonly unitStatusHistoryModel: typeof UnitStatus,
        @InjectModel(UnitRelation) private readonly unitRelationModel: typeof UnitRelation,
    ) { }

    async fetchHierarchyUnitIds(date: string, unitIds: number[], transaction?: Transaction) {
        const rootUnitIds = [...new Set(unitIds)];
        if (rootUnitIds.length === 0) return [];

        const now = new Date(date);
        const visited = new Set<number>(rootUnitIds);
        const hierarchyUnitIds = [...rootUnitIds];

        let frontier = rootUnitIds;
        while (frontier.length > 0) {
            const relations = await this.unitRelationModel.findAll({
                attributes: ["relatedUnitId"],
                where: {
                    unitRelationId: UNIT_RELATION_TYPES.ZRA,
                    unitId: { [Op.in]: frontier },
                    startDate: { [Op.lt]: now },
                    endDate: { [Op.gte]: now }
                },
                transaction,
            });

            const next: number[] = [];
            for (const relation of relations) {
                const childId = relation.relatedUnitId;
                if (visited.has(childId)) continue;

                visited.add(childId);
                hierarchyUnitIds.push(childId);
                next.push(childId);
            }

            frontier = next;
        }

        return hierarchyUnitIds;
    }

    updateStatuses(unitsStatuses: IUnitStatus[]) {
        return this.unitStatusHistoryModel.bulkCreate(unitsStatuses, {
            updateOnDuplicate: ['unitStatusId'],
        })
    }

    clearStatusesForUnitsDate(unitIds: number[], date: string, transaction?: Transaction) {
        if (unitIds.length === 0) return Promise.resolve(0);

        return this.unitStatusHistoryModel.destroy({
            where: {
                unitId: { [Op.in]: unitIds },
                date,
            },
            transaction,
        });
    }

    clearStatusForUnitDate(unitId: number, date: string, transaction?: Transaction) {
        return this.unitStatusHistoryModel.destroy({
            where: {
                unitId,
                date,
            },
            transaction,
        });
    }

    /**
     * Deletes ALL rows in units_statuses for the given date,
     * effectively resetting every unit back to status 0 (requesting).
     * Returns the number of rows destroyed.
     */
    resetAllForDate(date: string): Promise<number> {
        return this.unitStatusHistoryModel.destroy({
            where: { date: new Date(date) },
        });
    }

    /**
     * Counts rows that still have a non-zero unit_status_id for the given date.
     * Used to verify a full reset: expected result is 0.
     */
    countNonZeroStatusesForDate(date: string): Promise<number> {
        return this.unitStatusHistoryModel.count({
            where: {
                date: new Date(date),
                unitStatusId: { [Op.ne]: 0 },
            },
        });
    }
}
