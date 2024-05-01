import { AuthModule } from "@/auth/auth.module";
import { connectMongo } from "@/config/initialize/connect_mongo";
import { UserDtoStub } from "@/user/test/stubs/create_user.dto.stub";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { InvalidPasswordCase, InvalidPasswordStub } from "./stubs/password.stub";
import { Model } from "mongoose";
import { User } from "@/models/mongodb/user.schema";

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
        MongooseModule.forRootAsync(connectMongo()),
      ]
    }).compile()

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userModel = app.get<Model<User>>(getModelToken(User.name));
  })

  afterAll(async () => {
    await app.close();
  })

  describe('/signup', () => {
    let userDto: () => UserDtoStub = () => new UserDtoStub();
    let subject = (userDto: UserDtoStub) => {
      return request(app.getHttpServer()).post('/signup').send(userDto);
    };

    afterAll(async () => {
      await userModel.deleteMany({});
    })

    describe('if valid input', () => {
      it('should create a new user', () => {
        let dto = userDto();
        return subject(dto).expect(201);
      });
    });

    describe('if invalid input', () => {
      let dto: UserDtoStub;

      beforeEach(() => {
        dto = userDto();
      })

      describe('with password', () => {
        Object.entries(InvalidPasswordCase)
          .filter((entry) => !isNaN(Number(entry[1])))
          .forEach((entry) => {
            describe(entry[0], () => {
              it('should return validation error', () => {
                dto.password = InvalidPasswordStub.create(
                  entry[1] as InvalidPasswordCase,
                );
                return subject(dto).expect(400);
              });
            });
          });
      });

      describe('with name', () => {
        it('should return validation error', () => {
          dto.name = undefined;
          return subject(dto).expect(400);
        });
      });

      describe('with mail', () => {
        it('should return validation error', () => {
          dto.email = undefined;
          return subject(dto).expect(400);
        });
      });
    });
  });
})