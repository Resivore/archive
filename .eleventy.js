// at the very top, so process.env is populated from .env in dev
require("dotenv").config();

module.exports = function(eleventyConfig) {
  // 1) pass your env vars through to templates
  eleventyConfig.addGlobalData("env", process.env);

  // 2) copy static asset folders straight through to “publish”
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");

  return {
    // 3) configure your input/includes/output
    dir: {
      input: ".",
      includes: "_includes",
      output: "publish"
    },
    // 4) process both .html and .njk files
    templateFormats: ["html", "njk"]
  };
};
