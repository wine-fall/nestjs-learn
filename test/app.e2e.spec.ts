import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { spec, request } from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto } from 'src/bookmark/dto/dto.bookmark';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  // let config: ConfigService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3100);
    prisma = app.get(PrismaService);
    prisma.cleanDb();
    request.setBaseUrl('http://localhost:3100');
  });

  afterAll(async () => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: '123-abc',
    };
    describe('Sign up', () => {
      it('should sign up', () => {
        return spec().post('/auth/signup').withBody(dto).expectStatus(201);
      });
      it('should throw if email is empty', () => {
        return spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return spec().post('/auth/signup').withBody(null).expectStatus(400);
      });
    });
    describe('Sign in', () => {
      it('should sign in', () => {
        return spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('jwtToken', 'jwtToken');
      });
      it('should throw if email is empty', () => {
        return spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return spec().post('/auth/signin').withBody(null).expectStatus(400);
      });
    });
  });
  describe('User', () => {
    const dto: EditUserDto = {
      email: 'gzy@email.com',
      firstName: 'wine',
      lastName: 'fall',
    };
    describe('get profile', () => {
      it('should get profile', () => {
        return spec()
          .get('/user/profile')
          .withHeaders({
            Authorization: 'Bearer $S{jwtToken}',
          })
          .expectStatus(200);
      });
    });
    describe('edit profile', () => {
      it('should edit profile', () => {
        return spec()
          .patch('/user/edit/profile')
          .withHeaders({
            Authorization: 'Bearer $S{jwtToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Bookmark', () => {
    const createBookmarkDto: CreateBookmarkDto = {
      title: "I'm a title",
      link: 'www.google.com',
      description: 'A test description',
    };
    it('should get an empty bookmark list', () => {
      return spec()
        .get('/bookmark/get/bookmarkList')
        .withHeaders({
          Authorization: 'Bearer $S{jwtToken}',
        })
        .expectBodyContains('[]');
    });
    describe('Create bookmark by user', () => {
      it('should create a bookmark', () => {
        return spec()
          .post('/bookmark/create')
          .withHeaders({
            Authorization: 'Bearer $S{jwtToken}',
          })
          .withBody(createBookmarkDto)
          .stores((req, res) => {
            return {
              id1: res.body.id,
              name1: '111',
            };
          })
          .expectStatus(201);
      });
    });

    // it('should get a bookmark list contains an object', () => {
    //   return spec()
    //     .get('/bookmark/get/bookmarkList')
    //     .withHeaders({
    //       Authorization: 'Bearer $S{jwtToken}',
    //     })
    //     .expectJsonLength(1);
    // });
  });
});
