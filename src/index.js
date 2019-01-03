import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

let posts = [
  { id: '1', title: 'Post number 1 title ', body: 'Post number 1 body', published: true, author: '1' },
  { id: '2', title: 'Post number 2 title', body: 'Post number 2 body', published: false, author: '3' },
  { id: '3', title: 'Post number 3 title', body: 'Post number 3 body', published: true, author: '1' }
]
let users = [
  { id: '1', name: 'abdelhedi', email: 'sjkjdfnksdf', age: 15 },
  { id: '2', name: 'Mohammed', email: 'sjkjdfnksdf', age: 15 },
  { id: '3', name: 'Emir', email: 'sjkjdfnksdf', age: 15 }
]
let comments = [
  { id: '1', text: 'This is awesome ! i really like it ;) !', author: '2', post: '3' },
  { id: '2', text: 'Nice bro :D !', author: '1', post: '3' },
  { id: '3', text: 'Goooooooooooooooooood', author: '2', post: '1' }
]
const typeDefs = `
type Query {
  me: User!
  Post: Post!
  add(x:Int!,y:Int!): Float!
  posts(query:String): [Post!]!
  users: [User!]!
  comments:[Comment!]!
}
type Mutation{
  createUser(input: createUserInput): User!
  createPost(input: createPostInput): Post!
  createComment(input: createCommentInput): Comment!
  deleteUser(id: ID!): User!
}



input createUserInput {
  name:String!
  email: String!
  age:Int
}
input createPostInput {
  title: String!
  body: String!
  published: Boolean
  author: String!
}
input createCommentInput{
  text: String!
  post: String!
  author: String!
}



type User{
  id: ID!
  name: String!
  email: String!
  age: Int
  posts:[Post!]!
  comments:[Comment!]
}
type Post{
  id: ID!
  title: String!
  body: String!
  published: Boolean
  author: User!
  comments: [Comment!]
}
type Comment{
  id: ID!
  text: String!
  author: User!
  post: Post!
}
`
const resolvers = {
  Query: {
    me: () => ({ id: '54df5g4d5fg4d5f4gdfg', name: 'abdelhedi', email: 'sjkjdfnksdf', age: 15 }),
    Post: () => ({ id: '1245dsd45dfgsdf', title: 'Article title', body: 'This is tje content of the Article' }),
    add: (_, { x, y }) => (x + y) * 10,
    posts: (_, { query }) => query ? posts.filter(post => post.title.toLowerCase().includes(query) || post.body.includes(query)) : posts,
    users: () => users,
    comments: () => comments
  },
  Mutation: {
    createUser: (parent, args, cx, info) => {
      const emailTaken = users.some(user => user.email === args.input.email)
      if (emailTaken) throw new Error('This email is already used')
      const newuser = {
        id: uuidv4(),
        ...args.input
      }
      users.push(newuser)
      return newuser
    },
    createPost: (parent, args, ctx, info) => {
      const userExist = users.some(user => user.id === args.input.author)
      if (!userExist) throw new Error('User does not exist !')
      const post = {
        id: uuidv4(),
        ...args.input
      }
      posts.push(post)
      return post
    },
    createComment: (parent, args, ctx, info) => {
      const userExist = users.some(user => user.id === args.input.author)
      const postExist = posts.some(post => post.id === args.input.post)
      const isPublished = (posts.find(post => post.id === args.input.post).published)
      if (!userExist || !postExist || !isPublished) throw new Error('Input Error was founded')
      const newComment = {
        id: uuidv4(),
        ...args.input
      }
      comments.push(newComment)
      return newComment
    },
    deleteUser: (parent, args, ctx, info) => {
      const user = users.find(user => user.id === args.id)
      if (user.length < 1) {
        throw new Error('Oh user does not exist')
      }
      // Removing user comments
      comments = comments.filter(comment => comment.author !== args.id)

      // Removing user posts
      posts = posts.filter((post) => {
        const match = post.author === args.id
        if (match) {
          comments = comments.filter(comment => comment.post !== post.id)
        }
        return !match
      })

      // Removing user from users
      users = users.filter(u => u.id !== user.id)
      return user
    }
  },
  Post: {
    author: (parent, args, ctx, info) => users.find((user) => user.id === parent.author),
    comments: (parent, args, ctx, info) => comments.filter((comment) => comment.post === parent.id)
  },
  User: {
    posts: (parent, args, ctx, info) => posts.filter((post) => post.author === parent.id),
    comments: (parent, args, ctx, info) => comments.filter((comment) => comment.author === parent.id)
  },
  Comment: {
    author: (parent, args, ctx, info) => users.find((user) => user.id === parent.author),
    post: (parent, args, ctx, info) => posts.find(post => post.id === parent.post)
  }
}
const server = new GraphQLServer({ typeDefs, resolvers })
server.start(({ port }) => {
  console.log(`Server started at ${port}`)
})
