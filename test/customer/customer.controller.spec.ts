import { Test, TestingModule } from '@nestjs/testing';
import { VisitorController } from '../../src/visitor/visitor.controller';

describe('CustomerController', () => {
	let controller: VisitorController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [VisitorController],
		}).compile();

		controller = module.get<VisitorController>(VisitorController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
