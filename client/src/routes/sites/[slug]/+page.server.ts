import { gql } from "graphql-request"
import api from "$lib/api"
import type { PageServerLoad } from "./$types"

const query = gql`
  query SitePageQuery($slug: String, $userId: ID) {
    sites(where: { slug: { equals: $slug } }) {
      id
      name
      link
      slug
      description
      landscapeImage {
        url
        extension
      }
      tags {
        name
        slug
      }
      categories {
        name
        slug
      }
      favorites(where: { user: { id: { equals: $userId } } }) {
        id
      }
    }
  }
`

export const load: PageServerLoad = async ({ params, setHeaders, locals }) => {
  // setHeaders({ "Cache-Control": "max-age=1" })
  const variables = { slug: params.slug, userId: locals.user?.id }
  const data = await api.request(query, variables)
  return data.sites[0]
}
