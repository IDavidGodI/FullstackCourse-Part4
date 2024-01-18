const lodash = require("lodash");

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  const reducer = (total, blog) => {
    return total + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (max, blog) => {
    if (max && blog.likes <= max.likes) return max;
    return {
      title: blog.title,
      author: blog.author,
      likes: blog.likes
    }
  }
  return blogs.reduce(reducer, null)
}

const mostBlogs = (blogs) => {

  const result = lodash(blogs)
    .countBy("author")
    .entries()
    .maxBy(1)

  console.log(result)
  return {
    author: result[0],
    blogs: result[1]
  }

}

const totalAuthorLikes = (blogs, author) => {
  const authorBlogs = blogs.filter(blog => blog.author === author)

  return totalLikes(authorBlogs)
}

const mostLikes = (blogs) => {

  const result = lodash(blogs)
    .groupBy("author")
    .map((authorBlogs, author) => ({
      author, likes: lodash.sumBy(authorBlogs, "likes")
    }))
    .maxBy("likes")

  return result;
  // const reducer = (max, blog) => {
  //   if (max && blog.author === max.author) return max;
  //   const authorLikes = totalAuthorLikes(blogs, blog.author)

  //   if (max && authorLikes <= max.likes) return max;

  //   return {
  //     author: blog.author,
  //     likes: authorLikes
  //   }
  // }

  // return blogs.reduce(reducer, null)
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}