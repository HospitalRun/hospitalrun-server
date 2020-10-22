const patientResolvers = {
  Query: {
    info: () => 'HospitalRun GraphQL API',
  },
  Mutation: {
    createPatient: async (_: any, args: any) => {
      console.log(args.patientRequest)
      return {
        id: 'helloWorld',
        name: args.patientRequest.name,
        code: args.patientRequest.code,
      }
    },
  },
}

export default patientResolvers
