let stats = {};

module.exports = function () {
  return (req, res, next) => {
    res.on('finish', () => {
      const event = `${req.method} ${getRoute(req)} ${res.statusCode}`;
      stats[event] = stats[event] ? stats[event] + 1 : 1;
    });
    next()
  };
};

module.exports.getStats = function () {
  return stats;
};

function getRoute(req) {
  const route = req.route ? req.route.path : '';
  const baseUrl = req.baseUrl ? req.baseUrl : '';

  return route ? `${baseUrl === '/' ? '' : baseUrl}${route}` : 'unknown route'
}