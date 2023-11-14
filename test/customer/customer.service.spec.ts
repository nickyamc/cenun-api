import { Test, TestingModule } from '@nestjs/testing';
import { VisitorService } from '../../src/visitor/visitor.service';

describe('CustomerService', () => {
	let service: VisitorService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [VisitorService],
		}).compile();

		service = module.get<VisitorService>(VisitorService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
