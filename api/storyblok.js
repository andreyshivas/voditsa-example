const express = require('express');
const StoryblokClient = require('storyblok-js-client');
const spaceId = 123770;

let Storyblok = new StoryblokClient({
  oauthToken: 'token',
});

let StoryblokApi = new StoryblokClient({
  accessToken: 'token',
  cache: {
    clear: 'auto',
    type: 'memory'
  }
});

const app = express();
app.use(express.json());


app.post('/update-product', (req, res) => {
  const product = req.body.product;
  const productId = product.id;

  Storyblok.get(`spaces/${spaceId}/stories/${productId}`, {})
  .then(response => {
    const story = response.data.story;

    const inStock = +story.content.in_stock;

    if (inStock !== 0) {
      story.content.in_stock = inStock - 1;
    }

    Storyblok.put(`spaces/${spaceId}/stories/${productId}`, {
      "story": story,
      "force_update": 1,
      "publish": 1
    });
  }).catch(error => {
    console.log('api update-product');
    console.log(error)
  })

  res.send('/update-product');
});

app.post('/filters', (req, res) => {
  const cache = req.body.cache;
  const starts_with = req.body.starts_with;

  StoryblokApi.get(`cdn/stories`, {
    version: 'published',
    starts_with: starts_with,
    resolve_relations: "brand,tip_kozhi,zona,dejstvie",
    cv: cache,
    per_page: 100,
    filter_query: {
      component: {
        in: 'product',
      },
    },
  })
  .then(response => {
    if (response.data.rels) {
      res.status(200).json(response.data.rels);
    }

    if (response.data.rel_uuids) {
      const uniqueItems = [...new Set(response.data.rel_uuids.map(item => item))];
      StoryblokApi.get(`cdn/stories`, {
        version: 'published',
        cv: cache,
        per_page: 100,
        page: 1,
        by_uuids: uniqueItems.join(','),
        sort_by: "content.title:asc",
        filter_query: {
          component: {
            in: 'filter,brand',
          },
        },
      })
      .then(response => {
        if (response.data) {
          res.status(200).json(response.data.stories)
        }
      }).catch(error => {
        console.log('api filters 1');
        console.log(error)
      })
    }
  }).catch(error => {
    console.log('api filters 2');
    console.log(error)
  })
});

module.exports = app
