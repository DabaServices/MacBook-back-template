import { Controller, Get, Req } from "@nestjs/common";
import { StandardService } from "./standard.service";
import { StandardDrawerDataDto } from "./standard.types";

@Controller("/standard")
export class StandardController {
    constructor(private readonly service: StandardService) { }

    @Get("tool-material-ids")
    getToolMaterialIds(@Req() request: Request): Promise<string[]> {
        const unitId = Number(request.headers["unit"]);
        const reqDate = request["date"];
        return this.service.getRelevantToolMaterialIds(unitId, reqDate);
    }

    @Get("")
    getStandard(@Req() request: Request): Promise<StandardDrawerDataDto[]> {
        const unitId = Number(request.headers["unit"]);
        const reqDate = request["date"];
        console.log(`[StandardController] Received request for unit: ${unitId} (raw: ${request.headers["unit"]}), date: ${reqDate} (raw: ${request.headers["screendate"]})`);

        return this.service.getStandardDrawerData(
            unitId,
            reqDate,
        );
    }
}
