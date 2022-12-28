import { gql } from "graphql-request"
import api from "$lib/api"
import type { Actions, PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"

const query = gql`
  query SitesPageQuery($whereFilter: SiteWhereInput!, $userId: ID, $orderBy: [SiteOrderByInput!]) {
    sites(where: $whereFilter, orderBy: $orderBy) {
      id
      name
      slug
      landscapeImage {
        url
        extension
      }
      favorites(where: { user: { id: { equals: $userId } } }) {
        id
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
export const load: PageServerLoad = async ({ url, setHeaders, locals }) => {
  // setHeaders({ "Cache-Control": "max-age=1" })

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

  let orderBy: any = []
  const sortItems = url.searchParams.get("sort")

  if (sortItems) {
    const arr = sortItems.split(" ")
    arr.forEach((item) => {
      const newArr = item.split(":")
      orderBy.push({ [newArr[0]]: newArr[1] })
    })
  }

  const variables = {
    whereFilter: {
      OR: orFilters,
    },
    userId: locals.user?.id,
  }
  if (orderBy.length) {
    // @ts-ignore
    variables.orderBy = orderBy
  }

  const data = await api.request(query, variables)
  return data
}
