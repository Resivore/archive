require("dotenv").config();

module.exports = function(eleventyConfig) {
  eleventyConfig.addGlobalData("env", process.env);
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");

  return {
    templateFormats: ["html", "njk", "js"],
    dir: {
      input: ".",
      includes: "_includes",
      output: "publish"
    },
  };
};
