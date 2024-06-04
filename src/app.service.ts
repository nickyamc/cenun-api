import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from "axios";
const PDFDocument = require('pdfkit-table');

@Injectable()
export class AppService {

	private readonly logger = new Logger(AppService.name);

	constructor(
		private readonly configService: ConfigService,
		
	) {}

	getHello(): string {
		return 'Hello World!';
	}

	version(): string {
		return '1.0.0';
	}

	developerTeam() {
		return {
			team: 'Cucs Team',
			members: [
				{
					name: 'Nick Macedo Cordova',
				},
			],
		};
	}

	async dataStudent(studentCode: string) {
		return await axios.get(`https://daa-documentos.unamad.edu.pe:8081/api/getStudentInfo/extended/${studentCode}`,
			{
				headers: {
					'Authorization': `Bearer ${this.configService.get<number>('daa.token')}`
				}
			}).then((response) => {
				this.logger.log('Existo al traer estudiante');
				this.logger.warn(JSON.parse(response.data[0].userName));
				return response.data;
			})
			.catch(() => {
				this.logger.error('Error al traer estudiante');
				return [];
			});
	}
}
