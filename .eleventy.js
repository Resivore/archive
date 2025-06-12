const eleventyVite = require("@11ty/eleventy-plugin-vite");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPlugin(eleventyVite, {
    // any plugin options here (see the README)
  });

  return {
    templateFormats: ["html", "njk", "js"],
    dir: {
      input: ".",
      includes: "_includes",
      output: "publish"
    },
  };
};
