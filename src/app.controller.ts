import {Controller, Get, Param} from '@nestjs/common';
import {AppService} from './app.service';
import axios from "axios";
import {response} from "express";

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

    @Get('data/student/:studentCode')
    async dataStudent(@Param('studentCode') studentCode: string) {
		return await axios.get(`https://daa-documentos.unamad.edu.pe:8081/api/getStudentInfo/extended/${studentCode}`,
			{
				headers: {
					'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYmQyNDEyNy0zYTAwLTQwNmItYmVlMC1kMmZiNDNiYjA4MjkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibm1hY2Vkb2MiLCJuYW1lIjoibm1hY2Vkb2MiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiUmVnaXN0cm8gQWNhZMOpbWljbyIsIkFkbWluaXN0cmFkb3IgZGUgR2VzdGlvbiBEb2NlbnRlIiwiQWRtaW5pc3RyYWRvciBkZSBNYXRyaWN1bGEiLCJTb3BvcnRlIGRlIFVzdWFyaW9zIiwiQWRtaW5pc3RyYWRvciBkZSBMYXVyYXNzaWEiLCJBcGlDb25zdW1lciIsIkFkbWluaXN0cmFkb3IgZGUgRmluYW56YXMiXSwiZXhwIjoxNjgzNjY1NzY4LCJpc3MiOiJjOTg0ZGZiMWEwMTdhM2VmOGI5N2UyNTM5ZjdlY2FhYSJ9.pDXP__jSRV62TNM4q4fUQ969mF4OBFd5aeglF_VU5OQ`
				}
			}).then((response) => response.data);
    }
}
