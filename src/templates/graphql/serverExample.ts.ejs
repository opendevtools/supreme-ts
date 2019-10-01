import express from 'express'
import { ApolloServer, gql, PubSub } from 'apollo-server-express'
import {
  typeDefs as queueDefs,
  resolvers as queueResolvers,
} from './resolvers/queue'
import merge from 'lodash.merge'
import { Track } from './__generated__/graphql'
import http from 'http'

export const pubsub = new PubSub()

export const queue: Track[] = [
  {
    title: 'Hospital for Souls',
    artist: 'Bring Me The Horizon',
    album: 'Sempiternal',
  },
]

const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`

const server = new ApolloServer({
  typeDefs: [typeDefs, queueDefs],
  resolvers: merge(queueResolvers),
  playground: {
    tabs: [
      {
        endpoint: 'http://localhost:4000/graphql',
        name: 'Queries',
        query: `query currentQueue {
  currentQueue {
    ...TrackInfo
  }
}

# Might need to prettify for Playground to see this mutation<Paste>
mutation addTrack($track: TrackInput!) {
  addTrack(input: $track) {
    ...TrackInfo
  }
}

fragment TrackInfo on Track {
  title
  artist
  album
}
        `,
        variables: `{
  "track": {
    "title": "Antivist",
    "album": "Sempiternal",
    "artist": "Bring Me The Horizon"
  }
}`,
      },
      {
        endpoint: 'http://localhost:4000/graphql',
        name: 'Subscription',
        query: `# Run this subscription query then run the mutation in the first tab
# to see the results to the right
subscription trackAdded {
  trackAdded {
    title
    artist
    album
  }
}`,
      },
    ],
  },
})

const app = express()

server.applyMiddleware({ app })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)


