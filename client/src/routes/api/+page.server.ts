import api from "$lib/api"
import { gql } from "graphql-request"
import type { Actions, PageServerLoad } from "./$types"

export const createFavoriteMutation = gql`
  mutation CreateFavoriteMutation($siteId: ID, $userId: ID) {
    createFavorite(data: { site: { connect: { id: $siteId } }, user: { connect: { id: $userId } } }) {
      id
      site {
        name
      }
      user {
        name
      }
    }
  }
`

export const deleteFavoriteMutation = gql`
  mutation DeleteFavoriteMutation($favoriteId: ID) {
    deleteFavorite(where: { id: $favoriteId }) {
      id
    }
  }
`

export const load: PageServerLoad = async ({ locals }) => {
  return { user: locals.user }
}

export const actions: Actions = {
  "toggle-favorite": async ({ request, locals }) => {
    const formData = await request.formData()
    const favoriteId = formData.get("favoriteId")

    if (!!favoriteId) {
      const variables = { favoriteId: formData.get("favoriteId") }
      const res = await api.request(deleteFavoriteMutation, variables, { credentials: "include" })
      return res
    } else {
      const variables = { siteId: formData.get("siteId"), userId: locals.user.id }
      const res = await api.request(createFavoriteMutation, variables, { credentials: "include" })
      return res
    }
  },
}
