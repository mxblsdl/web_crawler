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

async function crawlPage(baseURL, currentURL, pages) {
  const cu = new URL(currentURL);
  const bu = new URL(baseURL);
  if (cu.hostname !== bu.hostname) {
    return pages;
  }
  const normalCurrent = normalizeURL(currentURL);

  if (pages[normalCurrent] > 0) {
    pages[normalCurrent]++;
    return pages;
  }

  if (currentURL === baseURL) {
    pages[normalCurrent] = 0;
  } else {
    pages[normalCurrent] = 1;
  }

  console.log(`Crawling ${currentURL}`);
  let htmlBody = "";
  try {
    const html = await fetch(currentURL);
    if (html.status >= 400) {
      console.log(`error: got status code: ${html.status}`);
      return pages;
    }
    const headers = html.headers.get("content-type");
    if (!headers.includes("text/html")) {
      console.log(`error: content type: ${headers}`);
      return pages;
    }
    htmlBody = await html.text();
  } catch (err) {
    console.log("Error", err);
  }
  const nextURLS = getURLsFromHTML(htmlBody, baseURL);
  for (const url of nextURLS) {
    pages = await crawlPage(baseURL, url, pages);
  }
  return pages;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
