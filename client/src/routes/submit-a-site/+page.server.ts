import api from "$lib/api"
import { redirect } from "@sveltejs/kit"
import { gql } from "graphql-request"
import type { Actions, PageServerLoad } from "./$types"

const submitSiteMutation = gql`
  mutation SubmitSiteMutation($name: String, $link: String, $id: ID) {
    createSubmission(data: { name: $name, link: $link, submitter: { connect: { id: $id } } }) {
      id
      name
      link
      status
      submitter {
        id
        name
        email
      }
    }
  }
`

export const load: PageServerLoad = async ({ locals }) => {
  return { user: locals.user }
}

export const actions: Actions = {
  "submit-a-site": async ({ request, locals }) => {
    const formData = await request.formData()
    const variables = { name: formData.get("name"), link: formData.get("link"), id: locals.user?.id }
    const res = await api.request(submitSiteMutation, variables, { credentials: "include" })

    if (res) {
      throw redirect(303, `/account`)
    }
  },
}
