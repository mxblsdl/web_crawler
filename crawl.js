const { JSDOM } = require("jsdom");

function normalizeURL(url) {
  const urlObj = new URL(url);
  if (urlObj.pathname === "/") {
    return urlObj.hostname;
  }
  const path = urlObj.pathname.endsWith("/")
    ? urlObj.pathname.slice(0, -1)
    : urlObj.pathname;

  return urlObj.hostname + path;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const aElements = dom.window.document.querySelectorAll("a");
  for (const aElement of aElements) {
    if (aElement.href.slice(0, 1) === "/") {
      try {
        urls.push(new URL(aElement.href, baseURL).href);
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`);
      }
    } else {
      try {
        urls.push(new URL(aElement.href).href);
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`);
      }
    }
  }
  return urls;
}

async function crawlPage(currentURL) {
  try {
    const html = await fetch(currentURL);
    if (html.status >= 400) {
      console.log(`error: got status code: ${html.status}`);
      return;
    }
    const headers = html.headers.get("content-type");
    if (!headers.includes("text/html")) {
      console.log(`error: content type: ${headers}`);
      return;
    }
    console.log(await html.text());
  } catch (err) {
    console.log("Error", err);
  }
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
