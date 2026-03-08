import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Transaction } from "sequelize";
import { UnitStatusTypesRepository } from "./units-statuses.repository";
import { UpdateUnitStatus } from "./DTO/updateUnitStatus";

@Injectable()
export class UnitStatusTypesService {
    constructor(private readonly repository: UnitStatusTypesRepository) { }

    async updateHierarchyStatuses(
        unitsStatuses: UpdateUnitStatus,
        date: string,
        transaction?: Transaction
    ) {
        try {
            const hierarchyUnitIds = await this.repository.fetchHierarchyUnitIds(date, unitsStatuses.unitsIds);
            const targetUnitIds = unitsStatuses.updateHierarchy
                ? hierarchyUnitIds
                : unitsStatuses.unitsIds;

            if (unitsStatuses.clearHierarchyStatuses) {
                return this.repository.clearStatusesForUnitsDate(targetUnitIds, date, transaction);
            }

            const statusesToSave = targetUnitIds.map(unitId => ({
                unitId,
                unitStatusId: unitsStatuses.statusId,
                date: new Date(date)
            }));

            return this.repository.updateStatuses(statusesToSave);
        } catch (error) {
            console.log(error);
        }
    }

    clearStatusForUnitDate(unitId: number, date: string, transaction?: Transaction) {
        return this.repository.clearStatusForUnitDate(unitId, date, transaction);
    }

    /**
     * Resets all units_statuses rows for the given date to status 0.
     * Implementation: destroys all rows for the date (no row = status 0 in app logic),
     * then verifies no non-zero rows remain.
     *
     * Returns 200 with reset count when all units are at status 0.
     * Throws InternalServerErrorException if any non-zero rows persist.
     */
    async resetAllStatusesForDate(date: string) {
        const resetCount = await this.repository.resetAllForDate(date);

        const remaining = await this.repository.countNonZeroStatusesForDate(date);
        if (remaining > 0) {
            throw new InternalServerErrorException(
                `Reset incomplete: ${remaining} unit(s) still have a non-zero status for date ${date}`
            );
        }

        return {
            data: { resetCount },
            message: `Successfully reset ${resetCount} unit(s) to status 0 for date ${date}`,
        };
    }
}
