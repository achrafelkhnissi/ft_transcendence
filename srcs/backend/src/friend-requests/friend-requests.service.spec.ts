import { Test, TestingModule } from '@nestjs/testing';
import { FriendRequestsService } from './friend-requests.service';

describe('FriendsRequestsService', () => {
  let service: FriendRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendRequestsService],
    }).compile();

    service = module.get<FriendRequestsService>(FriendRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
