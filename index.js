require('dotenv').config();
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

MongoClient.connect(process.env.DB_URL, function (err, client) {
  db = client.db('RealWorld');

  app.listen(8080, function () {
    console.log('listening on 8080');
  });
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

/**
 * List Articles
 */
app.get('/api/articles', async (request, response) => {
  try {
    console.log(`Query : ${JSON.stringify(request.query)}`);
    const article = await db.collection('articles').find().toArray();
    response.send({ result: article });
  } catch (err) {
    response.send(500);
  }
});

/**
 * Feed Articles
 */
app.get('/api/articles/feed', async (request, response) => {
  try {
    const article = await db.collection('articles').find().toArray();
    response.send({ result: article });
  } catch (err) {
    response.send(500);
  }
});

/**
 * Get Article
 */
app.get('/api/articles/:slug', async (request, response) => {
  try {
    const slug = request.params.slug;
    const article = await db.collection('articles').findOne({ 'article.slug': slug });
    response.send({ result: article });
  } catch (err) {
    response.send(500);
  }
});

/**
 * Create Article
 */
app.post('/api/articles', async (request, response) => {
  try {
    currentCount = await db.collection('count').findOne({ name: 'Post Count' });
    const nextCount = currentCount.totalPost + 1;
    const receiveBody = request.body.article;
    const body = {
      slug: receiveBody.title.replaceAll(' ', '-'),
      ...request.body.article,
      createAt: new Date(),
      updatedAt: new Date(),
      favorited: false,
      favoritesCount: 0,
    };
    const article = {
      _id: nextCount,
      article: body,
    };
    await db.collection('articles').insertOne(article);
    await db.collection('count').updateOne({ name: 'Post Count' }, { $inc: { totalPost: 1 } });
    response.send(article);
  } catch (err) {
    response.send(500);
  }
});

/**
 * Update Article
 */
app.put('/api/articles/:slug', async (request, response) => {
  try {
    const slug = request.params.slug;
    const receiveBody = request.body.article;

    const findArticle = await db.collection('articles').findOne({ 'article.slug': slug });
    const article = {
      _id: findArticle._id,
      article: {
        ...findArticle.article,
        ...receiveBody,
        slug: receiveBody.title.replaceAll(' ', '-'),
        updatedAt: new Date(),
      },
    };

    await db.collection('articles').findOneAndReplace({ 'article.slug': slug }, article);
    response.send(article);
  } catch (err) {
    response.send(500);
  }
});

/**
 * Delete Article
 */
app.delete('/api/articles/:slug', async (request, response) => {
  try {
    const slug = request.params.slug;
    await db.collection('articles').findOneAndDelete({ 'article.slug': slug });
    response.send('Success');
  } catch (err) {
    response.send(500);
  }
});

/**
 * Add Comments to an Article
 */
app.post('/api/articles/:slug/comments', async (request, response) => {
  try {
    const slug = request.params.slug;
    const receiveBody = request.body.comment;

    const findArticle = await db.collection('articles').findOne({ 'article.slug': slug });
    const comments = findArticle.article.comments;
    let commentId;
    let commentList;
    let commentBody = {
      id: 0,
      ...receiveBody,
      createAt: new Date(),
      updatedAt: new Date(),
    };

    if (!comments || comments.length < 1) {
      commentId = 1;
      commentList = [{ ...commentBody, id: 1 }];
    } else {
      commentId = comments[comments.length - 1].id + 1;
      commentList = [...comments, { ...commentBody, id: commentId }];
    }

    const article = {
      _id: findArticle._id,
      article: {
        ...findArticle.article,
        ...receiveBody,
        comments: commentList,
      },
    };

    await db.collection('articles').findOneAndReplace({ 'article.slug': slug }, article);
    response.send(commentList[commentList.length - 1]);
  } catch (err) {
    response.send(500);
  }
});

/**
 * Get Comments from an Article
 */
app.get('/api/articles/:slug/comments', async (request, response) => {
  try {
    const slug = request.params.slug;
    const article = await db.collection('articles').findOne({ 'article.slug': slug });
    response.send({ result: article.article.comments || [] });
  } catch (err) {
    response.send(500);
  }
});

/**
 * Delete Comment
 */
app.delete('/api/articles/:slug/comment/:id', async (request, response) => {
  try {
    const slug = request.params.slug;
    const id = Number(request.params.id);
    const findArticle = await db.collection('articles').findOne({ 'article.slug': slug });
    const comments = findArticle.article.comments;
    const article = {
      _id: findArticle._id,
      article: {
        ...findArticle.article,
        comments: comments.filter((comment) => comment.id !== id),
      },
    };

    await db.collection('articles').findOneAndReplace({ 'article.slug': slug }, article);
    response.send('Success');
  } catch (err) {
    response.send(500);
  }
});

/**
 * Favorite Article
 */
app.post('/api/articles/:slug/favorite', async (request, response) => {
  try {
    const slug = request.params.slug;
    const findArticle = await db.collection('articles').findOne({ 'article.slug': slug });
    const article = {
      _id: findArticle._id,
      article: {
        ...findArticle.article,
        favorited: true,
      },
    };
    await db.collection('articles').findOneAndReplace({ 'article.slug': slug }, article);
    response.send(article);
  } catch (err) {
    response.send(500);
  }
});

/**
 * Unfavorite Article
 */
app.delete('/api/articles/:slug/favorite', async (request, response) => {
  try {
    const slug = request.params.slug;
    const findArticle = await db.collection('articles').findOne({ 'article.slug': slug });
    const article = {
      _id: findArticle._id,
      article: {
        ...findArticle.article,
        favorited: false,
      },
    };
    await db.collection('articles').findOneAndReplace({ 'article.slug': slug }, article);
    response.send(article);
  } catch (err) {
    response.send(500);
  }
});

/**
 * Get Tags
 */
app.get('/api/tags', async (request, response) => {
  response.send(['reactjs', 'angularjs']);
});

// /**
//  * Get Article
//  */
// app.get('/api/articles/:id', async (request, response) => {
//   try {
//     const id = Number(request.params.id);
//     const article = await db.collection('articles').findOne({ _id: id });
//     response.send({ result: article });
//   } catch (err) {
//     response.send(500);
//   }
// });

// /**
//  * Update Article
//  */
// app.put('/api/articles/:id', async (request, response) => {
//   try {
//     const id = Number(request.params.id);
//     const body = request.body;
//     const findArticle = await db.collection('articles').findOne({ _id: id });
//     const article = {
//       _id: id,
//       article: {
//         ...findArticle.article,
//         ...body.article,
//         updatedAt: new Date(),
//       },
//     };
//     await db.collection('articles').findOneAndReplace({ _id: id }, article);
//     response.send(article);
//   } catch (err) {
//     response.send(500);
//   }
// });

// /**
//  * Delete Article
//  */
//  app.delete('/api/articles/:id', async (request, response) => {
//     try {
//       const id = Number(request.params.id);
//       await db.collection('articles').findOneAndDelete({ _id: id });
//       response.send('Success');
//     } catch (err) {
//       response.send(500);
//     }
//   });
