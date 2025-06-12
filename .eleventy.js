module.exports = async function(eleventyConfig) {
  const EleventyVitePlugin = (await import("@11ty/eleventy-plugin-vite")).default;
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPlugin(EleventyVitePlugin, {
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
