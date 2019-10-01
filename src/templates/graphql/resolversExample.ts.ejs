import { gql } from 'apollo-server-express'
import { queue, pubsub } from '../server'
import {
  QueryResolvers,
  MutationResolvers,
  SubscriptionResolvers,
} from '../__generated__/graphql'

const TRACK_ADDED = 'TRACK_ADDED'

export const typeDefs = gql`
  type Track {
    title: String!
    artist: String!
    album: String!
  }

  input TrackInput {
    title: String!
    artist: String!
    album: String!
  }

  extend type Query {
    currentQueue: [Track!]!
  }

  extend type Mutation {
    addTrack(input: TrackInput!): [Track!]!
  }

  extend type Subscription {
    trackAdded: Track!
  }
`

interface Resolvers {
  Query: QueryResolvers
  Mutation: MutationResolvers
  Subscription: SubscriptionResolvers
}

export const resolvers: Resolvers = {
  Query: {
    currentQueue: () => queue,
  },

  Mutation: {
    addTrack: (_, { input }) => {
      pubsub.publish(TRACK_ADDED, { trackAdded: input })
      queue.push(input)

      return queue
    },
  },

  Subscription: {
    trackAdded: {
      subscribe: () => pubsub.asyncIterator([TRACK_ADDED]),
    },
  },
}

