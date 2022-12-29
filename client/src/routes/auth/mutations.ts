import { gql } from "graphql-request"

export const signInMutation = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          email
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`
