const token = '54981b3cefd69340e29697a5b8183413';

module.exports = [
  {
    url: '/user/login',
    type: 'post',
    response: req => {
      return {
        code: 200,
        data: token
      }
    }
  },
  {
    url: '/user/info',
    type: 'get',
    response: req => {
      if (!req.headers['token']) {
        return {
          code: 201,
          data: 'bad authentication token'
        }
      }
      return {
        code: 200,
        data: {
          roles: ['admin'],
          introduction: 'I am a super administrator',
          avatar: 'https://joeschmoe.io/api/v1/random',
          name: 'zhaolei'
        }
      }
    }
  },
  {
    url: '/user/logout',
    type: 'post',
    response: req => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]