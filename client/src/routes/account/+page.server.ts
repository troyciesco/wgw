import api from "$lib/api"
import { redirect, type Actions } from "@sveltejs/kit"
import { gql } from "graphql-request"
import type { PageServerLoad } from "./$types"

const profileQuery = gql`
  query ProfileQuery {
    authenticatedItem {
      ... on User {
        id
        submissions {
          id
          name
          link
          status
          createdAt
        }
        favorites {
          id
          site {
            name
            slug
          }
        }
      }
    }
  }
`

const signOutMutation = gql`
  mutation SignOutMutation {
    endSession
  }
`

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, "/auth/sign-in")
  } else {
    const data = await api.request(profileQuery)
    return { submissions: data.authenticatedItem?.submissions, favorites: data.authenticatedItem?.favorites }
  }
}

export const actions: Actions = {
  "sign-out": async ({ cookies }) => {
    const res = await api.request(signOutMutation)
    if (res) {
      // eat the cookie
      cookies.set("keystonejs-session", "", {
        path: "/",
        expires: new Date(0),
      })

      throw redirect(302, "/")
    }
  },
}
