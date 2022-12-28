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
