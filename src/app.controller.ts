import {Controller, Get, Param} from '@nestjs/common';
import {AppService} from './app.service';
import axios from "axios";
import {response} from "express";
import { ApiParam } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('version')
    version(): string {
        return this.appService.version();
    }

    @Get('team')
    developerTeam() {
        return this.appService.developerTeam();
    }

    @ApiParam({name: 'studentCode', type: String})
    @Get('data/student/:studentCode')
    dataStudent(@Param('studentCode') studentCode: string) {
		return this.appService.dataStudent(studentCode);
    }
}
