import { initialDbContext } from '@data/db.context';
import { AuthRepository, IAuthRepository } from '@data/repositories/auth.repository';
import { IUserRepository, UserRepository } from '@data/repositories/user.repository';
import { registerMediatrHandlers } from '@extensions/mediatr.extensions';
import { initialRabbitmq } from '@extensions/rabbitmq.extensions';
import { RegisterRoutes } from '@routes/routes';
import { errorHandler } from 'building-blocks/error-handler/error-handler';
import { RabbitMQConnection } from 'building-blocks/rabbitmq/rabbitmq-connection';
import { Consumer, IConsumer } from 'building-blocks/rabbitmq/rabbitmq-consumer';
import { IPublisher, Publisher } from 'building-blocks/rabbitmq/rabbitmq-publisher';
import { postgresContainerStart } from 'building-blocks/test/container/postgres/postgres-container';
import { rabbitMqContainerStart } from 'building-blocks/test/container/rabbitmq/rabbitmq-container';
import { DataSource } from 'building-blocks/typeorm';
import express, { Express } from 'express';
import passport from 'passport';
import { StartedTestContainer } from 'testcontainers';
import { container } from 'tsyringe';

export class Fixture {
  databaseConnection: DataSource;
  rabbitMQConnection: RabbitMQConnection;
  userRepository: IUserRepository;
  authRepository: IAuthRepository;
  postgresContainer: StartedTestContainer;
  rabbitmqContainer: StartedTestContainer;
  consumer: IConsumer;
  publisher: IPublisher;
  app: Express;
}

export class IntegrationTestFixture {
  private fixture: Fixture = new Fixture();

  public async initilizeFixture(): Promise<Fixture> {
    const [pgOptions, pgContainer] = await postgresContainerStart();
    this.fixture.postgresContainer = pgContainer;

    const [rabbitOptions, rabbitContainer] = await rabbitMqContainerStart();
    this.fixture.rabbitmqContainer = rabbitContainer;

    this.fixture.app = express();

    this.fixture.databaseConnection = await initialDbContext(pgOptions);

    this.fixture.app.use(express.json());

    this.fixture.app.use(express.urlencoded({ extended: true }));

    this.fixture.app.use(passport.initialize());

    RegisterRoutes(this.fixture.app);

    this.fixture.app.use(errorHandler);

    await initialRabbitmq(rabbitOptions);

    this.fixture.userRepository = container.resolve(UserRepository);
    this.fixture.authRepository = container.resolve(AuthRepository);
    this.fixture.publisher = container.resolve(Publisher);
    this.fixture.consumer = container.resolve(Consumer);

    registerMediatrHandlers();

    return this.fixture;
  }

  public async cleanUp() {
    await this.fixture.postgresContainer.stop();
    await this.fixture.rabbitmqContainer.stop();
  }
}
