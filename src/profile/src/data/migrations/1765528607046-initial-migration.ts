import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1765528607046 implements MigrationInterface {
    name = 'InitialMigration1765528607046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."profile_status_enum" AS ENUM('active', 'blocked')`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "userId" integer NOT NULL DEFAULT '0', "firstName" character varying NOT NULL, "middleName" character varying NOT NULL, "lastName" character varying NOT NULL, "birthday" TIMESTAMP, "status" "public"."profile_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, CONSTRAINT "UQ_3825121222d5c17741373d8ad13" UNIQUE ("email"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TYPE "public"."profile_status_enum"`);
    }

}
