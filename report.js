function printReport(pages) {
  console.log("Report process beginning");

  sortedPages = sortPages(pages);

  for (const page of sortedPages) {
    console.log(`Found ${page[1]} internal links to ${page[0]}`);
  }
}

function sortPages(obj) {
  const objArray = Object.entries(obj);
  objArray.sort(function (a, b) {
    return b[1] - a[1];
  });
  return objArray
}

module.exports = {
  printReport,
};
