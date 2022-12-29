import { GraphQLClient } from "graphql-request"
import { PUBLIC_API_URL } from "$env/static/public"

const api = new GraphQLClient(PUBLIC_API_URL, { headers: { credentials: "include" } })

export default api
