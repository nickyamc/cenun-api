import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from '../../src/attendance/attendance.controller';

describe('AttendanceController', () => {
	let controller: AttendanceController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AttendanceController],
		}).compile();

		controller = module.get<AttendanceController>(AttendanceController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
