const request = require('supertest')
const app = require('./server')
describe('GET station info', () => {
  it('should fetch station infomation for the given station id', async () => {
    return request(app)
      .get("/stationInfo/2")
      .expect(200);
  })
})