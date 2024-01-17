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
  const reducer = (max, blog) => {
    if (max && blog.author === max.author) return max;
    const authorBlogs = blogs.filter(b => blog.author === b.author).length;

    if (max && authorBlogs <= max.blogs) return max

    return {
      author: blog.author,
      blogs: authorBlogs
    }

  }

  return blogs.reduce(reducer, null)
}

const totalAuthorLikes = (blogs, author) => {
  const authorBlogs = blogs.filter(blog => blog.author === author)

  return totalLikes(authorBlogs)
}

const mostLikes = (blogs) => {

  const reducer = (max, blog) => {
    if (max && blog.author === max.author) return max;
    const authorLikes = totalAuthorLikes(blogs, blog.author)

    if (max && authorLikes <= max.likes) return max;

    return {
      author: blog.author,
      likes: authorLikes
    }
  }

  return blogs.reduce(reducer, null)
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}