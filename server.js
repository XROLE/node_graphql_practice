const express = require('express');
const {graphqlHTTP} = require('express-graphql');

const {
    GraphQLSchema,
    GraphQLList,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    NoUnusedFragmentsRule,
    GraphQLInt,
    GraphQLScalarType,
    GraphQLNonNull, 
} = require('graphql');

// DATA TO BE USED
const authors = [
    {id: 1, name: 'B. M. Nsume'},
    {id: 1, name: 'J. D. Lee'},
    {id: 1, name: 'X. .V Diamond'},
];
const books = [
    {id: 1, name: 'Fighting Temptation in the early days', authorId: 1},
    {id: 2, name: 'Forever tempting serpent', authorId: 3},
    {id: 3, name: 'Making it big in hard times', authorId: 1},
    {id: 4, name: 'Cordinated attacks of positive mindsets', authorId: 2},
    {id: 5, name: 'Tallibans in the red sea', authorId: 2},
    {id: 6, name: 'The blue moon of a gold walker', authorId: 2},
    {id: 7, name: 'Coding is not for the genius', authorId: 1},
    {id: 8, name: 'No one knows it all', authorId: 3},
];

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represent an Author of a book',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {
            type: BookType,
            resolve: (author) => {
                return books.find(book => book.authorId === author.id)
            }
        },
    }),
});

const BookType = new GraphQLObjectType({
    name: "Books",
    description: "This represents a book written by an author",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: { type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        },
    }),
});

// TODO: add query for getting a single author =============================================

const RootQueryType = new GraphQLObjectType({
    name: "Query", 
    description: "Root Query",
    fields: () => ({
        book: {
            type: BookType,
            description: 'A single book',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => {
                return books.find(book => book.id === args.id);
            },
        },
        books: {
            type: new GraphQLList(BookType),
            description: "List of books",
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of all Authors',
            resolve: () => authors,

        },
    }),
});

const schema = new GraphQLSchema({
    query: RootQueryType,
})

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));
app.listen(5000, () => console.log('Server Running'));
