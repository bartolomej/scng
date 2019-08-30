const app = require('express').Router();
const {getSchools} = require('../db/news');
const {getReposDetails} = require('../services/github');

app.get('/', async (req, res) => {
  let stats;
  try {
    stats = await getReposDetails();
  } catch (e) {}
  res.render('home', {
    layout: false,
    schools: await getSchools(),
    stats
  });
});

app.get('/contribute', async (req, res) => {
  res.render('contribute', {
    layout: false,
    technologies: [
      {name: 'Photoshop', url: 'https://www.photoshop.com/', image: '/assets/images/photoshop.jpg'},
      {name: 'Figma', url: 'https://www.figma.com/', image: '/assets/images/figma.png'},
      {name: 'Git', url: 'https://git-scm.com/', image: '/assets/images/git.png'},
      {name: 'Grafana', url: 'https://grafana.com/', image: '/assets/images/grafana.png'},
      {name: 'Nginx', url: 'https://nginx.com/', image: '/assets/images/nginx.png'},
      {name: 'Dokku', url: 'http://dokku.viewdocs.io/dokku/', image: '/assets/images/dokku.png'},
      {name: 'Node.js', url: 'https://nodejs.org/en/', image: '/assets/images/nodejs.png'},
      {name: 'React Native', url: 'https://facebook.github.io/react-native/', image: '/assets/images/reactnative.png'},
      {name: 'GitHub', url: 'https://github.com/', image: '/assets/images/github.png'},
    ]
  });
});

module.exports = app;