// const middlewares = require("/opt/nodejs/middlewares");
const middlewares = require("./doubleCookieSubmit");
const middy = require('@middy/core');

const lambdaHandler = async (event, context) => {
    const response = {
        headers: {
            "abc": 123
        },
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
}

exports.handler = middy()
  .use(middlewares.doubleCookieSubmitMiddleware()) // handles common http errors and returns proper responses
  .handler(lambdaHandler)
