const axios = require("axios");

module.exports = {
  findUserHistory,
};

function getMMR(user_token, entitlements_token, sub, region) {
  var config = {
    method: "get",
    url:
      "https://pd." +
      region +
      ".a.pvp.net/mmr/v1/players/" +
      sub +
      "/competitiveupdates?startIndex=0&endIndex=20",
    headers: {
      Authorization: "Bearer " + user_token,
      "X-Riot-Entitlements-JWT": entitlements_token,
    },
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw new Error("tokens expired.");
    });
}

function findUserHistory(user_token, entitlements_token, sub, region) {
  return getMMR(user_token, entitlements_token, sub, region)
    .then((response) => {
      return { data: response };
    })
    .catch((error) => {
      throw new Error(error);
    });
}
