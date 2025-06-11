module.exports = function(eleventyConfig) {
  // Passthrough copy asset folders to the output "publish" directory
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "publish"
    },
    templateFormats: ["html", "njk"] // Process both .html and .njk files
  };
};

module.exports = function(eleventyConfig) {
  // expose all your process.env into your templates
  eleventyConfig.addGlobalData("env", process.env);
  return {
    dir: { input: ".", output: "publish" }
  };
};
