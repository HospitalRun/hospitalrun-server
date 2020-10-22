const patientSchema = `
    type Name {
    givenName: String
    familyName: String
    prefix: String
    suffix: String
    fullName: String
}

type Patient {
    id: ID!
    name: Name
    code: String!
}

input NameRequest {
    givenName: String
    familyName: String
    prefix: String
    suffix: String
    fullName: String
}

input PatientRequest {
    name: NameRequest
    code: String!
}

extend type Mutation {
    createPatient(patientRequest: PatientRequest!): Patient!
}
`

export default patientSchema
