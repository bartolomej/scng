const fetch = require('node-fetch');

module.exports.getReposDetails = async function () {
  const HOST = 'https://api.github.com';
  let scngApi = await Promise.all([
    request(`${HOST}/repos/bartolomej/scng-api/stats/commit_activity`),
    request(`${HOST}/repos/bartolomej/scng-api/branches`)
  ]);
  let scngMobile = await Promise.all([
    request(`${HOST}/repos/bartolomej/scng-mobile/stats/commit_activity`),
    request(`${HOST}/repos/bartolomej/scng-mobile/branches`)
  ]);

  return {
    api: {
      commits: calculateTotalCommits(scngApi[0]),
      branches: scngApi[1].length
    },
    mobile: {
      commits: calculateTotalCommits(scngMobile[0]),
      branches: scngMobile[1].length
    }
  }
};

function calculateTotalCommits(commitActivity) {
  let totalCommits = 0;
  for (let i = 0; i < commitActivity.length; i++) {
    totalCommits += commitActivity[i].total;
  }
  return totalCommits;
}

async function request(url) {
  let response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  });
  return await response.json();
}