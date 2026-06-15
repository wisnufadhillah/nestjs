import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

type AuthResponse = {
  accessToken: string;
};

describe('JWT authentication (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('rejects protected project routes without a token', async () => {
    await request(app.getHttpServer()).get('/projects').expect(401);
  });

  it('registers a user, returns a JWT token, and allows access to protected routes', async () => {
    const email = `demo-${Date.now()}@mail.com`;

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Demo User',
        email,
        password: 'password123',
      })
      .expect(201);

    const registerBody = registerResponse.body as AuthResponse;

    expect(registerBody.accessToken).toEqual(expect.any(String));

    const token = registerBody.accessToken;

    const projectResponse = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Internship Project',
        description: 'Project created from e2e test',
      })
      .expect(201);

    expect(projectResponse.body).toMatchObject({
      name: 'Internship Project',
      description: 'Project created from e2e test',
    });

    await request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: 'Internship Project' }),
          ]),
        );
      });
  });
});
