import { GraphQLClient } from "graphql-request"

const api = new GraphQLClient("http://localhost:3000/api/graphql", { headers: { credentials: "include" } })

export default api
