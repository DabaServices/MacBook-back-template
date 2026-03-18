import { Body, Controller, Post, Req } from "@nestjs/common";
import { ExcelService } from "./excel.service";
import type { ExcelImportBody } from "./excel.types";

@Controller("/excel")
export class ExcelController {
    constructor(private readonly service: ExcelService) { }

    @Post("upload")
    importExcelRows(
        @Body() excelImportBody: ExcelImportBody,
        @Req() request: Request
    ) {
        return this.service.importExcelRows(
            request["date"],
            Number(request.headers["unit"]),
            excelImportBody,
        );
    }
}
