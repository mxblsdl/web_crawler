const { normalizeURL, crawlPage } = require("./crawl");
const { argv } = require("node:process");
const { printReport } = require("./report");

async function main() {
  //   argv.forEach((val, index) => {
  //     console.log(`${index}: ${val}`);
  //   });
  baseURL = argv.slice(2);
  if (baseURL.length < 1) {
    console.log("no arguments specified");
    process.exit();
  } else if (baseURL.length > 1) {
    console.log("too many arguments specified");
    process.exit();
  } else {
    console.log(`Starting web scape for ${baseURL[0]}`);
    const pages = await crawlPage(baseURL, baseURL, {});
    printReport(pages);
  }
}

main();
