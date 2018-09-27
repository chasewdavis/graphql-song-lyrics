const { apiseeds, genius } = require('./config/keys');
const { buildSchema } = require('graphql');
const fetch = require('node-fetch');
const _ = require('lodash');
const Q = require('q');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLVarial,
    GraphQLSchema,
    GraphQLList,
    GraphQLInt
} = require('graphql');

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
        },
        lyrics: {
            type: GraphQLString,
            resolve: res => {
                return fetch(`https://orion.apiseeds.com/api/music/lyric/${res.result.primary_artist.name}/${res.result.title}?apikey=${apiseeds}`)
                .then(res => res.json())
                .then(res => res.result ? res.result.track.text : null);
            }
        }
    })
});

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
});

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',
        fields: () => ({
            search: {
                type: searchType,
                args: {
                    userInput: { type: GraphQLString }
                },
                resolve: (root, args) => {
                    return fetch(`https://api.genius.com/search?q=${args.userInput}&access_token=${genius}`)
                    .then(searchHits => {
                        return searchHits.json()
                    })
                }
            }
        })
    })
});
