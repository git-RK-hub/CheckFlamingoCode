const jwt = require("jsonwebtoken");
function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}
module.exports = generateAccessToken;
function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
}
module.exports = generateRefreshToken;

function getToken(client, userId) {
  return new Promise((resolve, reject) => {
    client.get(JSON.stringify(userId), function (err, reply) {
      if (err) {
        console.log(err);
        reject("Error with redis client");
      } else {
        console.log("Token collected and sent");
        resolve({ result: reply });
      }
    });
  });
}
function generateNewTokens(token, userId, client) {
  let allRefreshTokens;
  let error = false;
  return getToken(client, userId)
    .then((data) => {
      allRefreshTokens = data.result;
      if (!allRefreshTokens && !error) {
        error = "There is no refresh token for the user with";
        return { error: error };
      }
      allRefreshTokens = JSON.parse(allRefreshTokens);

      console.log("I am all refresh tokenks", allRefreshTokens);
      const currentRefreshToken = allRefreshTokens.indexOf(token);
      if ((currentRefreshToken === -1) & !error) {
        error = "Refresh token is wrong";
        return { error: error };
      }
      // const newRefreshToken = getUpdatedRefreshToken(token, userId, client);
      const newAccessToken = generateAccessToken(userId);

      if (!error)
        return {
          error: false,
          accessToken: newAccessToken,
          // refreshToken: newRefreshToken,
        };
    })
    .catch((err) => {
      console.log(err);
    });
}
function getUpdatedRefreshToken(oldRefreshToken, userId, client) {
  const newRefreshToken = generateRefreshToken(userId);
  getToken(client, userId)
    .then((data) => {
      let collectedTokens = JSON.parse(data.result);
      let index = collectedTokens.indexOf(oldRefreshToken);
      if (index !== -1) {
        collectedTokens[index] = newRefreshToken;
      }
      collectedTokens = JSON.stringify(collectedTokens);
      client.setex(
        JSON.stringify(userId),
        3600,
        JSON.stringify(collectedTokens)
      );
    })
    .catch((err) => {
      console.log(err);
    });
  return newRefreshToken;
}
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateNewTokens,
};
