const cookie = require("cookie");

const defaults = {
  csrfTokenCookieName: "X-CSRF-Token",
  csrfTokenBodyKey: "csrfToken",
};
const doubleCookieSubmitMiddleware = (opts = {}) => {
  const options = {
    ...defaults,
    ...opts,
  };
  const doubleCookieSubmitMiddlewareBefore = async (request) => {
    const { headers, body, cookies, version } = request.event;

    const httpMethod = getVersionHttpMethod[version ?? "1.0"]?.(request.event);
    if (httpMethod !== "POST") return;

    // Parse Cookies
    let cookieObject = {};

    // API Gateway V1
    if (headers?.Cookie) {
      cookieObject = cookie.parse(headers.Cookie);
    }

    // API Gateway V2
    if (cookies && Array.isArray(cookies)) {
      cookieObject = cookies.reduce(
        (accumulator, cookieValue) => ({
          ...accumulator,
          ...cookie.parse(cookieValue),
        }),
        {}
      );
    }

    // Parse JSON Body
    let bodyObject = {};
    try {
      const data = request.event.isBase64Encoded
        ? Buffer.from(body, "base64").toString()
        : body;

      bodyObject = JSON.parse(data);
    } catch (err) {
      console.log(err);
      const response = {
        statusCode: 400,
        body: { message: "Invalid JSON body" },
      };
      return response;
    }

    const bodyCsrfToken = bodyObject
      ? bodyObject[options.csrfTokenBodyKey]
      : null;
    const cookieCsrfToken = cookieObject
      ? cookieObject[options.csrfTokenCookieName]
      : null;

    if (
      !bodyCsrfToken ||
      !cookieCsrfToken ||
      bodyCsrfToken !== cookieCsrfToken
    ) {
      const response = {
        statusCode: 403,
        body: { message: "Invalid CSRF token" },
      };
      return response;
    }
  };

  return {
    before: doubleCookieSubmitMiddlewareBefore,
  };
};

const getVersionHttpMethod = {
  "1.0": (event) => event.httpMethod,
  "2.0": (event) => event.requestContext.http.method,
};

exports.doubleCookieSubmitMiddleware = doubleCookieSubmitMiddleware;
