module.exports = function(eleventyConfig) {
  return {
    // where Eleventy looks for your .njk files
    dir: {
      input: ".",
      includes: "_includes",
      output: "publish"
    },
    // process both .html (copied) and .njk (templated)
    templateFormats: ["html", "njk"]
  };
};
