import languageModel from "./../../utils/languageModel";

function ServeLangItem() {
  const langCntnt = languageModel();
  // Ensure we always return an object with default values for SSR compatibility
  return langCntnt && typeof langCntnt === "object"
    ? langCntnt
    : {
        home: "Home",
        blogs: "Blogs",
        Show_more: "Show more",
        Blog_Not_Found: "Blog Not Found",
      };
}

export default ServeLangItem;
