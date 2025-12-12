import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1765528513705 implements MigrationInterface {
    name = 'InitialMigration1765528513705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'blocked')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, "status" "public"."user_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."token_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "refreshToken" character varying NOT NULL, "expires" TIMESTAMP NOT NULL, "type" "public"."token_type_enum" NOT NULL DEFAULT '0', "blacklisted" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL, "userId" integer NOT NULL, "scopes" text array NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TYPE "public"."token_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
