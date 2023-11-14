import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
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
}
