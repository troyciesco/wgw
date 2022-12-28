import { gql } from "graphql-request"
import api from "$lib/api"
import type { Actions, PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"
import { signInMutation } from "../mutations"

const signUpMutation = gql`
  mutation SignUpMutation($email: String, $name: String, $password: String) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      name
      email
    }
  }
`

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, "/account")
  }
}

export const actions: Actions = {
  "sign-up": async ({ request, cookies }) => {
    const formData = await request.formData()

    const variables = { email: formData.get("email"), name: formData.get("name"), password: formData.get("password") }

    // sign them up
    const res = await api.request(signUpMutation, variables)

    // sign them in
    if (res.createUser.id) {
      const signInVariables = { email: formData.get("email"), password: formData.get("password") }
      const res = await api.request(signInMutation, signInVariables)
      const token = res?.authenticateUserWithPassword?.sessionToken || ""
      cookies.set("keystonejs-session", token, {
        // send cookie for every page
        path: "/",
        // server side only cookie so you can't use `document.cookie`
        httpOnly: true,
        // only requests from same site can send cookies
        // https://developer.mozilla.org/en-US/docs/Glossary/CSRF
        sameSite: "strict",
        // only sent over HTTPS in production
        secure: process.env.NODE_ENV === "production",
        // set cookie to expire after a month
        maxAge: 60 * 60 * 24 * 30,
      })
      throw redirect(303, `/account`)
    }
  },
}
