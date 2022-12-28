import { gql } from "graphql-request"
import api from "$lib/api"
import type { PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"

const query = gql`
  query SurpriseSiteQuery {
    sites {
      id
      slug
    }
  }
`
export const load: PageServerLoad = async () => {
  const data = await api.request(query)
  const randomIndex = Math.floor(Math.random() * data.sites.length)

  throw redirect(303, `/sites/${data.sites[randomIndex].slug}`)
}
