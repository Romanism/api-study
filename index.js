const express = require('express');
const app = express();
// const MongoClient = require('mongodb').MongoClient;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(8080, function () {
  console.log('listening on 8080');
});

// ========== Main ========== //

/**
 * Main
 */
app.get('/', function (request, response) {
  response.send('Hello, World!');
});

/**
 * Authentication
 */
app.post('/api/users/login', function (request, response) {
  response.send(request.body);
});

// ========== User ========== //

const user = {
  user: {
    username: 'Jacob',
    email: 'jake@jake.jake',
    password: 'jakejake',
  },
};

/**
 * Registration
 */
app.post('/api/users', function (request, response) {
  response.send(request.body);
});

/**
 * Get Current User
 */
app.get('/api/user', function (request, response) {
  response.send(user);
});

/**
 * Update User
 */
app.put('/api/user', function (request, response) {
  const putUser = request.body.user;
  const updateUser = {
    user: {
      ...user.user,
      ...putUser,
    },
  };
  response.send(updateUser);
});

// ========== Profile ========== //

const profile = {
  profile: {
    username: 'jake',
    bio: 'I work at statefarm',
    image: 'https://api.realworld.io/images/smiley-cyrus.jpg',
    following: false,
  },
};

/**
 * Get Profile
 */
app.get('/api/profiles/:username', function (request, response) {
  console.log(`User name : ${request.params.username}`);
  const getProfile = {
    profile: {
      ...profile.profile,
      username: request.params.username,
    },
  };
  response.send(getProfile);
});

/**
 * Follow User
 */
app.post('/api/profiles/:username/follow', function (request, response) {
  console.log(`User name : ${request.params.username}`);
  const postProfile = {
    profile: {
      ...profile.profile,
      username: request.params.username,
    },
  };
  response.send(postProfile);
});

/**
 * Unfollow User
 */
app.delete('/api/profiles/:username/follow', function (request, response) {
  const profile = {
    profile: {
      username: request.params.username,
      bio: 'I work at statefarm',
      image: 'https://api.realworld.io/images/smiley-cyrus.jpg',
      following: false,
    },
  };
  response.send(profile);
});

// ========== Article ========= //

const articles = {
  articles: [
    {
      slug: 'how-to-train-your-dragon',
      title: 'How to train your dragon',
      description: 'Ever wonder how?',
      body: 'It takes a Jacobian',
      tagList: ['dragons', 'training'],
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
      favorited: false,
      favoritesCount: 0,
      author: {
        username: 'jake',
        bio: 'I work at statefarm',
        image: 'https://i.stack.imgur.com/xHWG8.jpg',
        following: false,
      },
    },
    {
      slug: 'how-to-train-your-dragon-2',
      title: 'How to train your dragon 2',
      description: 'So toothless',
      body: 'It a dragon',
      tagList: ['dragons', 'training'],
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
      favorited: false,
      favoritesCount: 0,
      author: {
        username: 'jake',
        bio: 'I work at statefarm',
        image: 'https://i.stack.imgur.com/xHWG8.jpg',
        following: false,
      },
    },
  ],
  articlesCount: 2,
};

const article = {
  article: {
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    body: 'It takes a Jacobian',
    tagList: ['dragons', 'training'],
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z',
    favorited: false,
    favoritesCount: 0,
    author: {
      username: 'jake',
      bio: 'I work at statefarm',
      image: 'https://i.stack.imgur.com/xHWG8.jpg',
      following: false,
    },
  },
};

/**
 * List Articles
 */
app.get('/api/articles', function (request, response) {
  response.send(articles);
});

/**
 * Feed Articles
 */
app.get('/api/articles/feed', function (request, response) {
  response.send(articles);
});

/**
 * Get Article
 */
app.get('/api/articles/:slug', function (request, response) {
  console.log(`Slug : ${request.params.slug}`);
  response.send(article);
});

/**
 * Create Article
 */
app.post('/api/articles', function (request, response) {
  const postArticle = request.body.article;
  const createArticle = {
    article: {
      ...article.article,
      ...postArticle,
    },
  };
  response.send(createArticle);
});

/**
 * Update Article
 */
app.put('/api/articles/:slug', function (request, response) {
  console.log(`Slug : ${request.params.slug}`);
  const updateArticle = {
    article: {
      ...article.article,
      title: request.params.slug,
    },
  };
  response.send(updateArticle);
});

/**
 * Delete Article
 */
app.delete('/api/articles/:slug', function (request, response) {
  console.log(`Slug : ${request.params.slug}`);
  response.send('Success');
});
