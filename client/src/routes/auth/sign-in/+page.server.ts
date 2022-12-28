import { gql } from "graphql-request"
import api from "$lib/api"
import type { Actions, PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"
import { signInMutation } from "../mutations"

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, "/account")
  }
}

export const actions: Actions = {
  "sign-in": async ({ cookies, request }) => {
    const formData = await request.formData()
    const variables = { email: formData.get("email"), password: formData.get("password") }
    const res = await api.request(signInMutation, variables)
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
  },
}
