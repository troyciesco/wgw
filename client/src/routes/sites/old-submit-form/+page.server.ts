import { gql } from "graphql-request"
import api from "$lib/api"
import type { Actions, PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"

const query = gql`
  query SitesPageQuery($whereFilter: SiteWhereInput!) {
    sites(where: $whereFilter) {
      id
      name
      slug
      cover {
        url
      }
    }
    tags {
      name
      slug
    }
    categories {
      name
      slug
    }
  }
`
export const load: PageServerLoad = async ({ url }) => {
  let searchTerms
  const searchString = url.searchParams.get("search")
  if (searchString) {
    // unique words
    searchTerms = [...new Set(searchString.split(" "))]
  }

  const orFilters: any = []

  // search on name, description, tags, and categories
  searchTerms?.forEach((term) => {
    orFilters.push(
      { name: { contains: term } },
      { description: { contains: term } },
      { tags: { some: { name: { contains: term } } } },
      { categories: { some: { name: { contains: term } } } }
    )
  })

  let includedCategories
  const categories = url.searchParams.get("categories")
  if (categories) {
    // TODO: should i remove any that are in searchTerms so I don't duplicate the categories>some>name filter?
    includedCategories = [...new Set(categories.split(" "))]
  }

  includedCategories?.forEach((term) => {
    orFilters.push({ categories: { some: { slug: { equals: term } } } })
  })

  let includedTags
  const tags = url.searchParams.get("tags")
  if (tags) {
    // TODO: should i remove any that are in searchTerms so I don't duplicate the tags>some>name filter?
    includedTags = [...new Set(tags.split(" "))]
  }

  includedTags?.forEach((term) => {
    orFilters.push({ tags: { some: { slug: { equals: term } } } })
  })

  const variables = {
    whereFilter: {
      OR: orFilters,
    },
  }

  const data = await api.request(query, variables)
  return data
}

export const actions: Actions = {
  "search-and-filter": async ({ request }) => {
    const formData = await request.formData()

    const search = formData.get("search") ?? ""
    let categories = ""
    let tags = ""

    for (const pair of formData.entries()) {
      if (pair[0].includes("category:") && pair[1] === "on") {
        categories += `${pair[0].slice(9)} `
      }
      if (pair[0].includes("tag:") && pair[1] === "on") {
        tags += `${pair[0].slice(4)} `
      }
    }

    throw redirect(303, `/sites?search=${search}&categories=${categories}&tags=${tags}`)
  },
}
