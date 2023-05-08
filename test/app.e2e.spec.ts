import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { spec, request } from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import {
  CreateBookmarkDto,
  UpdateBookmarkDto,
} from 'src/bookmark/dto/dto.bookmark';

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

    const updateBookmarkDto: UpdateBookmarkDto = {
      id: null,
      title: "I'm a update title",
      link: 'www.baidu.com',
      description: 'A test update description',
    };
    it('should get an empty bookmark list', () => {
      return spec()
        .get('/bookmark/get/bookmarkList')
        .withHeaders({
          Authorization: 'Bearer $S{jwtToken}',
        })
        .expectBodyContains('[]');
    });
    it('should create a bookmark', () => {
      return spec()
        .post('/bookmark/create')
        .withHeaders({
          Authorization: 'Bearer $S{jwtToken}',
        })
        .withBody(createBookmarkDto)
        .stores((req, res) => {
          updateBookmarkDto.id = res.body.id;
          return {
            bookmarkId: res.body.id,
          };
        })
        .expectStatus(201);
    });
    it('should get a bookmark list with an object contains id1', () => {
      return spec()
        .get('/bookmark/get/bookmarkList')
        .withHeaders({
          Authorization: 'Bearer $S{jwtToken}',
        })
        .expectBodyContains('$S{bookmarkId}');
    });
    it('should get a get a single bookmark', () => {
      return spec()
        .get('/bookmark/get/single/bookmark')
        .withQueryParams('id', '$S{bookmarkId}')
        .withHeaders({
          Authorization: 'Bearer $S{jwtToken}',
        })
        .expectStatus(200);
    });
    it('should update a bookmark which id is eqaul to $S{bookmarkId}', () => {
      return spec()
        .post('/bookmark/update/single/bookmark')
        .withBody(updateBookmarkDto)
        .withHeaders({
          Authorization: 'Bearer $S{jwtToken}',
        })
        .expectBodyContains('www.baidu.com')
        .expectStatus(201);
    });
    it('should delete a bookmark which id is eqaul to $S{bookmarkId}', () => {
      return spec()
        .delete('/bookmark/delete/single/bookmark')
        .withBody({
          id: updateBookmarkDto.id,
        })
        .withHeaders({
          Authorization: 'Bearer $S{jwtToken}',
        })
        .expectStatus(200);
    });
    it('should create a bookmark list', () => {
      return spec()
        .post('/bookmark/createList')
        .withBody({
          createBookmarkDtoList: [
            createBookmarkDto,
            {
              ...createBookmarkDto,
              description: 'A second test description',
            },
          ],
        })
        .withHeaders({
          Authorization: 'Bearer $S{jwtToken}',
        })
        .expectStatus(201);
    });
    it('should delete a bookmark list', () => {
      return spec()
        .delete('/bookmark/delete/bookmarkList')
        .withHeaders({
          Authorization: 'Bearer $S{jwtToken}',
        })
        .expectStatus(200);
    });
  });
});
