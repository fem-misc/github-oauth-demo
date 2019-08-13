const client_id = 'c77bc8557ef9d64fc4b7'
const client_secret = 'ba6895285524bc72f26a345d593bf354f01eab5b'

const path = require('path')
const Koa = require('koa')
const serve = require('koa-static')
const route = require('koa-route')
const fetch = require('node-fetch')

const static = serve(path.join(__dirname, '/public'))

const app = new Koa()

app.use(static)

app.use(route.get('/oauth/redirect', async ctx => {
  const code = ctx.request.query.code
  console.log('code:', code)

  const oauthResponse = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
    {
      method: 'post',
      headers: {
        accept: 'application/json'
      }
    }
  ).then(res => res.json())

  const { access_token, token_type } = oauthResponse
  console.log('access_token:', access_token)

  const result = await fetch(
    `https://api.github.com/user`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `${token_type} ${access_token}`
      }
    }
  ).then(res => res.json())

  console.log(result)

  ctx.response.redirect(`/welcome.html?name=${result.name}`)
}))

app.listen(3000)
