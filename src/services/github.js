const fetch = require('node-fetch');
const winston = require('winston');

let logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'github-service' },
  transports: [
    new winston.transports.Console
  ]
});

/**
 * Fetches remote repository contribution statistics from Github API.
 * [Github REST API docs](https://developer.github.com/v3/)
 */
module.exports.getReposDetails = async function () {
  const HOST = 'https://api.github.com';

  let scngApi;
  let scngMobile;

  try {
    scngApi = await Promise.all([
      request(`${HOST}/repos/bartolomej/scng-api/stats/commit_activity`),
      request(`${HOST}/repos/bartolomej/scng-api/branches`),
      request(`${HOST}/repos/bartolomej/scng-api/commits`),
    ]);
    scngMobile = await Promise.all([
      request(`${HOST}/repos/bartolomej/scng-mobile/stats/commit_activity`),
      request(`${HOST}/repos/bartolomej/scng-mobile/branches`),
      request(`${HOST}/repos/bartolomej/scng-mobile/commits`),
    ]);
  } catch (e) {
    logger.log({
      level: 'error',
      message: `Request to Github failed`,
      description: e.message
    });
    return Promise.reject(new Error("Request to GitHub failed"));
  }

  return {
    api: {
      commits: calculateTotalCommits(scngApi[0]),
      branches: scngApi[1].length,
      lastCommit: {
        sha: scngApi[2][0].sha.substring(0, 4),
        url: scngApi[2][0].html_url,
        message: scngApi[2][0].commit.message,
        author: scngApi[2][0].commit.author.name
      }
    },
    mobile: {
      commits: calculateTotalCommits(scngMobile[0]),
      branches: scngMobile[1].length,
      lastCommit: {
        sha: scngMobile[2][0].sha.substring(0, 4),
        url: scngMobile[2][0].html_url,
        message: scngMobile[2][0].commit.message,
        author: scngMobile[2][0].commit.author.name
      }
    }
  }
};

function calculateTotalCommits (commitActivity) {
  let totalCommits = 0;
  for (let i = 0; i < commitActivity.length; i++) {
    totalCommits += commitActivity[i].total;
  }
  return totalCommits;
}

async function request (url) {
  let headers = {};
  if (process.env["GITHUB_TOKEN"]) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  } else {
    logger.info("Making request to Github API without auth token (limited to 50 req/hour)")
  }
  let response = await fetch(url, { method: 'GET', headers });
  return await response.json();
}
