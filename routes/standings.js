var models  = require('../lib/getModels');
var utils = require('../lib/utils');

exports.get = function(req, res, next) {
  if(utils.processErrors(req,res)!=null) {
    return utils.done(res, {status: 'error', message: req.validationErrors()[0].msg});
  }
  var season = req.query ? (typeof req.query.season == 'object' ? req.query.season[0] : req.query.season) : '20152016';
  console.log('Retrieving standings for '+season+'...');
  models.sequelize.query(
    "SELECT T1.team as team, coalesce(W,0) as W, coalesce(L,0) as L, coalesce(OTL,0) as OTL, 2*W + OTL as points "+
    "FROM "+
      "(select team, count(*) as W from AltGames where season = "+season+" AND result = 'W' group by team) as T1 "+
      "LEFT JOIN "+
      "(select team, count(*) as L from AltGames where season = "+season+" AND result='L' AND gameType='RE' group by team) as T2 "+
      "on T1.team = T2.team "+
      "LEFT JOIN "+
      "(select team, count(*) as OTL from AltGames where season = "+season+" AND result='L' AND gameType<>'RE' group by team) as T3 "+
      "on T1.team = T3.team",
      {raw: true}
  )
  .then(function(q)  {
    var retObj = {};
    retObj.teams = [];
    q[0].forEach(function(row){
      retObj.teams.push(row.team);
      retObj[row.team] = {};
      for (var attr in row) {
        retObj[row.team][attr] = row[attr];
      }
    })
    return res.jsonp(retObj);
  })
  .catch(function(err){
    utils.done(res, {status: 'error', type:'db', message: err});
  });
}