import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
type Query {
  hello: String!
  name : String!
  me: User!
  Post: Post!
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
    hello: () => 'Bismilleh alrahmen alrahim',
    name: () => 'abdelhedi',
    me: () => ({ id: '54df5g4d5fg4d5f4gdfg', name: 'abdelhedi', email: 'sjkjdfnksdf', age: 15 }),
    Post: () => ({ id: '1245dsd45dfgsdf', title: 'Article title', body: 'This is tje content of the Article' })
  }
}
const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => {
  console.log('Server stared ! ')
})
