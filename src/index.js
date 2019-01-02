import { GraphQLServer } from 'graphql-yoga'

const posts = [
  { id: 'jsdfsdf4521sdf', title: 'Post number 1 title ', body: 'Post number 1 body', published: true },
  { id: 'jsdfsdsdfsf4521sdf', title: 'Post number 2 title', body: 'Post number 2 body', published: false },
  { id: 'jsdfsdfsdf4521sdf', title: 'Post number 3 title', body: 'Post number 3 body', published: true }
]
const typeDefs = `
type Query {
  me: User!
  Post: Post!
  add(x:Int!,y:Int!): Float!
  posts(query:String): [Post!]!
}
type User{
  id: ID!
  name: String!
  email: String!
  age : Int
}
type Post{
  id: ID!
  title: String!
  body : String!
  published :Boolean
}
`
const resolvers = {
  Query: {
    me: () => ({ id: '54df5g4d5fg4d5f4gdfg', name: 'abdelhedi', email: 'sjkjdfnksdf', age: 15 }),
    Post: () => ({ id: '1245dsd45dfgsdf', title: 'Article title', body: 'This is tje content of the Article' }),
    add: (_, { x, y }) => (x + y) * 10,
    posts: (_, { query }) => posts.filter(post => post.title.toLowerCase().includes(query) || post.body.includes(query))
  }
}
const server = new GraphQLServer({ typeDefs, resolvers })
server.start(({ port }) => {
  console.log(`Server started at ${port}`)
})
