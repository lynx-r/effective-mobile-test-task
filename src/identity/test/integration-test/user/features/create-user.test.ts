import { FakeCreateUser } from '@test/shared/fakes/user/fake-create-user';
import { Fixture, IntegrationTestFixture } from '@test/shared/fixtures/integration-test.fixture';
import { UserDto } from '@user/dtos/user.dto';
import { UserCreated } from 'building-blocks/contracts/identity.contract';
import { mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import 'reflect-metadata';

describe('integration test for create user', () => {
  const integrationTestFixture = new IntegrationTestFixture();
  let fixture: Fixture;

  beforeAll(async () => {
    fixture = await integrationTestFixture.initilizeFixture();
  });

  afterAll(async () => {
    await integrationTestFixture.cleanUp();
  });

  it('should create user and retrieve a user from the database', async () => {
    const result = await mediatrJs.send<UserDto>(FakeCreateUser.generate());

    const isPublished = await fixture.publisher.isPublished(new UserCreated());
    expect(isPublished).toBe(true);

    const user = fixture.userRepository.findUserById(result.id);
    expect(user).not.toBeNull();
  });
});
