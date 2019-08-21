const metalsmith = require('metalsmith')
const metalsmithRedirect = require('..')

metalsmith(__dirname)
  .use(
    metalsmithRedirect({
      redirections: {
        '/github': 'https://github.com',
      },
      frontmatter: true,
      preserveHash: { timeout: 2 },
    })
  )
  .build(error => {
    if (error) {
      throw error
    }
  })
