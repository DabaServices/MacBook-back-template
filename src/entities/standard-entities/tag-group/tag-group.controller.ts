import { Body, Controller, Delete, Get, Post, Put, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import type { CreateTagGroupDTO, DeleteTagGroupDTO, UpdateTagGroupDTO } from "./tag-group.types";
import { TagGroupService } from "./tag-group.service";

@Controller('/tagGroup')
export class TagGroupController {
    constructor(private readonly service: TagGroupService) { }

    @Get('')
    fetchAll(@Query('level') level: number, @Req() request: Request) {
        return this.service.fetchAll(Number(level), request["date"], Number(request.headers["unit"]));
    }

    @Post('')
    createTagGroup(@Body() createTagGroupDTO: CreateTagGroupDTO) {
        return this.service.createTagGroup(createTagGroupDTO);
    }

    @Put('')
    updateTagGroup(@Body() updateTagGroupDTO: UpdateTagGroupDTO) {
        return this.service.updateTagGroupDTO(updateTagGroupDTO);
    }

    @Delete('')
    deleteTagGroup(@Body() deleteTagGroupDTO: DeleteTagGroupDTO) {
        return this.service.deleteTagGroup(deleteTagGroupDTO.id);
    }
}
