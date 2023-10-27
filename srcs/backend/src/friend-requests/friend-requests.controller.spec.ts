import { Test, TestingModule } from '@nestjs/testing';
import { FriendRequestsController } from './friend-requests.controller';
import { FriendRequestsService } from './friend-requests.service';

describe('FriendRequestsController', () => {
  let controller: FriendRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendRequestsController],
      providers: [FriendRequestsService],
    }).compile();

    controller = module.get<FriendRequestsController>(FriendRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
