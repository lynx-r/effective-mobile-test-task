import blockUserConsumerHandler from '@user/consumers/block-user';
import createUserConsumerHandler from '@user/consumers/create-user';
import { Rabbitmq } from 'building-blocks/rabbitmq/rabbitmq';
import { RabbitmqConnectionOptions } from 'building-blocks/rabbitmq/rabbitmq-connection-options-builder';
import { IPublisher, Publisher } from 'building-blocks/rabbitmq/rabbitmq-publisher';
import { container } from 'tsyringe';

export const initialRabbitmq = async (options?: RabbitmqConnectionOptions): Promise<void> => {
  const rabbitmq = container.resolve(Rabbitmq);

  await rabbitmq
    .createConnection((builder) => {
      builder
        .host(options?.host)
        .port(options?.port)
        .username(options?.username)
        .password(options?.password);
    })
    .then((c) => {
      container.register<IPublisher>('IPublisher', Publisher);

      c.addConsumer((x) => {
        (x.exchangeName('UserCreated'), x.handler(createUserConsumerHandler));
      });
      c.addConsumer((x) => {
        (x.exchangeName('UserBlocked'), x.handler(blockUserConsumerHandler));
      });
    });
};
