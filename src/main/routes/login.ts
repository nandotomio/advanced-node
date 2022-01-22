import { Router } from 'express'

export default (router: Router): void => {
  router.post('/api/login/facebook', (_, res) => {
    res.send({ data: 'any_data' })
  })
}
