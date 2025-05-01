import request from 'supertest';
import app from '../app';

describe('Auth endpoints', () => {
    let token: string;

    it('POST /api/auth/login -> 200 & token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'James' })
            .expect(200)
            .expect('Content-Type', /json/);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('GET /api/auth/protected without token -> 401', async () => {
        await request(app).get('/api/auth/protected').expect(401);
    });

    it('GET /api/auth/protected with malformed token -> 403', async () => {
        await request(app)
            .get('/api/auth/protected')
            .set('Authorization', 'Bearer wrong.token.here')
            .expect(403);
    });

    it('Get /api/auth/protected with valid token -> 200 & message', async () => {
        const res = await request(app)
            .get('/api/auth/protected')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);
        expect(res.body).toEqual({
            message: 'Hello James, you are authenticated!',
        });
    });
});
