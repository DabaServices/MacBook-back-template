import { Body, Controller, Delete, Post, Req } from "@nestjs/common";
import { UnitStatusTypesService } from "./units-statuses.service";
import { UpdateUnitStatus } from "./DTO/updateUnitStatus";

@Controller('statuses')
export class UnitStatusTypesController {
    constructor(private readonly service: UnitStatusTypesService) { }

    @Post('')
    updateHierarchyStatuses(@Body() unitsStatuses: UpdateUnitStatus,
        @Req() request) {
        return this.service.updateHierarchyStatuses(unitsStatuses, request?.['date']);
    }

    /**
     * DELETE /statuses/reset
     *
     * Resets all units in units_statuses for the given date to status 0.
     * Requires the `screendate` header (format: dd.MM.yyyy).
     *
     * Responses:
     *   200 – all units for the date now have unit_status_id = 0
     *   500 – reset incomplete (some units still have a non-zero status)
     *   401 – missing screendate header (handled by HeadersMiddleware)
     */
    @Delete('reset')
    resetAllStatuses(@Req() request) {
        return this.service.resetAllStatusesForDate(request?.['date']);
    }
}