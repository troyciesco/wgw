import type { Handle } from "@sveltejs/kit"
import api from "$lib/api"
import { gql } from "graphql-request"

const meQuery = gql`
  query MeQuery {
    authenticatedItem {
      ... on User {
        id
        name
        email
        isAdmin
      }
    }
  }
`

export const handle: Handle = async ({ event, resolve }) => {
  // get cookies from browser
  const session = event.cookies.get("keystonejs-session")

  if (!session) {
    // if there is no session load page as normal
    return await resolve(event)
  }

  api.setHeader("authorization", `Bearer ${session}`)

  const res = await api.request(meQuery)

  // if `user` exists set `events.local`
  if (res.authenticatedItem?.id) {
    event.locals.user = {
      id: res.authenticatedItem?.id,
      name: res.authenticatedItem?.name,
      email: res.authenticatedItem?.email,
      isAdmin: res.authenticatedItem?.isAdmin,
    }
  }

  // load page as normal
  return await resolve(event)
}
