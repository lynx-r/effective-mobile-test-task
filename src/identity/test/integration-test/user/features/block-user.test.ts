import { FakeBlockUser } from '@test/shared/fakes/user/fake-block-user';
import { FakeCreateUser } from '@test/shared/fakes/user/fake-create-user';
import { Fixture, IntegrationTestFixture } from '@test/shared/fixtures/integration-test.fixture';
import { UserDto } from '@user/dtos/user.dto';
import { BlockUser } from '@user/features/v1/block-user/block-user';
import { UserBlocked, UserStatus } from 'building-blocks/contracts/identity.contract';
import { mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import 'reflect-metadata';

describe('integration test for block user', () => {
  const integrationTestFixture = new IntegrationTestFixture();
  let fixture: Fixture;

  beforeAll(async () => {
    fixture = await integrationTestFixture.initilizeFixture();
  });

  afterAll(async () => {
    await integrationTestFixture.cleanUp();
  });

  it('should block user', async () => {
    const result = await mediatrJs.send<UserDto>(FakeCreateUser.generate());
    await mediatrJs.send<BlockUser>(FakeBlockUser.generate(result));

    const isPublished = await fixture.publisher.isPublished(new UserBlocked());
    expect(isPublished).toBe(true);

    const user = await fixture.userRepository.findUserById(result.id);
    expect(user.status).toEqual(UserStatus.BLOCKED);
  });
});
