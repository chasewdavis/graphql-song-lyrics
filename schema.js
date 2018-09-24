const { buildSchema } = require('graphql');
const { apiseeds, genius } = require('./config/keys');
const fetch = require('node-fetch');
const {
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLString,
    GraphQLObjectType
} = require('graphql');

const lyricType = new GraphQLObjectType({
    name: 'Lyrics',
    description: '...',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: res => res.result.track.name
        },
        text: {
            type: GraphQLString,
            resolve: res => res.result.track.text
        }
    })
});

const searchHitType = new GraphQLObjectType({
    name: 'hit',
    description: '...',
    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: res => {
                return res.result.title;
            }
        },
        artist: {
            type: GraphQLString,
            resolve: res => {
                return res.result.primary_artist.name;
            }
        }
    })
})

const searchType = new GraphQLObjectType({
    name: 'Search',
    description: '...',
    fields: () => ({
        hits: {
            type: GraphQLList(searchHitType),
            resolve: res => {
                return res.response.hits;
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',
        fields: () => ({
            lyrics: {
                type: lyricType,
                args: {
                    artist: { type: GraphQLString },
                    song: { type: GraphQLString }
                },
                resolve: (root, args) => {
                    return fetch(`https://orion.apiseeds.com/api/music/lyric/${args.artist}/${args.song}?apikey=${apiseeds}`)
                    .then(res => res.json())
                }
            },
            search: {
                type: searchType,
                args: {
                    userInput: { type: GraphQLString }
                },
                resolve: (root, args) => {
                    return fetch(`https://api.genius.com/search?q=${args.userInput}&access_token=${genius}`)
                    .then(res => res.json())
                }
            }
        })
    })
});
