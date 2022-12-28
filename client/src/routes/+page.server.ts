import { gql } from "graphql-request"
import api from "$lib/api"
import type { Actions, PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"

const featuredSitesQuery = gql`
  query FeaturedSitesQuery($userId: ID) {
    sites(take: 3, where: { isFeatured: { equals: true } }) {
      id
      name
      description
      slug
      portraitImage {
        url
        extension
      }
      # landscapeImage {
      #   url
      #   extension
      # }
      tags {
        id
        name
      }
      categories {
        id
        name
      }
      favorites(where: { user: { id: { equals: $userId } } }) {
        id
      }
    }
  }
`

const moreSitesQuery = gql`
  query MoreSitesQuery($ids: [ID!], $userId: ID) {
    sites(take: 6, where: { id: { notIn: $ids } }) {
      id
      name
      description
      slug
      portraitImage {
        url
        extension
      }
      # landscapeImage {
      #   url
      #   extension
      # }
      tags {
        id
        name
      }
      categories {
        id
        name
      }
      favorites(where: { user: { id: { equals: $userId } } }) {
        id
      }
    }
  }
`

export const load: PageServerLoad = async ({ setHeaders, locals }) => {
  // setHeaders({ "Cache-Control": "max-age=1" })
  const featuredSites = await api.request(featuredSitesQuery, { userId: locals.user?.id })
  const featuredIds = featuredSites.sites.map((site: any) => site.id)
  const moreSites = await api.request(moreSitesQuery, { ids: featuredIds, userId: locals.user?.id })
  return { featuredSites: featuredSites.sites, moreSites: moreSites.sites }
}

export const actions: Actions = {
  search: async ({ request }) => {
    const formData = await request.formData()
    throw redirect(303, `/sites?search=${formData.get("search")}`)
  },
}
