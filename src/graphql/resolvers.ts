const resolvers = {
  Query: {
    add: async (_: any, { x, y }: any) => x + y,
  },
}

export default resolvers
