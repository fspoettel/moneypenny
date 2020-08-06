const getLogin = (req, res) => {
  res.render('login.njk', {
    title: 'Login'
  })
}

module.exports = getLogin
