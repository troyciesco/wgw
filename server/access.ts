type Session = {
  data: {
    id: string
    isAdmin: boolean
  }
}

type UserData = {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

// Validate there is a user with a valid session
export const hasSession = ({ session }: { session: Session }) => !!session?.data.id

// Validate the current user is an Admin
export const isAdmin = ({ session }: { session: Session }) => session?.data.isAdmin

// Validate the current user is updating themselves
export const isUser = ({ session, item }: { session: Session; item: UserData }) => session?.data.id === item.id

// Validate the current user is an Admin, or updating themselves
export const isAdminOrUser = ({ session, item }: { session: Session; item: UserData }) =>
  isAdmin({ session }) || isUser({ session, item })
