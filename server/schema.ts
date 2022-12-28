// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { graphql, list } from "@keystone-6/core"
import { allowAll } from "@keystone-6/core/access"

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import { text, relationship, password, timestamp, select, image, checkbox, virtual } from "@keystone-6/core/fields"

// the document field is a more complicated field, so it has it's own package
import { document } from "@keystone-6/fields-document"
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from ".keystone/types"
import { responsiveImage } from "./custom-fields/responsive-image"
// import { hasSession, isAdmin, isAdminOrUser } from "./access"

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
export const hasSession = ({ session }: { session: Session }) => {
  return !!session?.data.id
}

// Validate the current user is an Admin
export const isAdmin = ({ session }: { session: Session }) => session?.data.isAdmin

// Validate the current user is updating themselves
export const isUser = ({ session, item }: { session: Session; item: UserData }) => {
  return session?.data.id === item.id
}

// Validate the current user is an Admin, or updating themselves
export const isAdminOrUser = ({ session, item }: { session: Session; item: UserData }) =>
  isAdmin({ session }) || isUser({ session, item })

export const lists: Lists = {
  User: list({
    access: {
      operation: {
        query: hasSession,
        create: () => true,
        delete: hasSession,
        update: hasSession,
      },
      item: {
        create: () => true,
        update: isAdminOrUser,
        delete: isAdminOrUser,
      },
    },
    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique",
      }),

      password: password({ validation: { isRequired: true } }),

      isAdmin: checkbox({
        // access: {
        //   update: isAdmin,
        // },
      }),

      submissions: relationship({ ref: "Submission.submitter", many: true }),
      favorites: relationship({ ref: "Favorite.user", many: true }),

      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },
  }),

  // Post: list({
  //   // WARNING
  //   //   for this starter project, anyone can create, query, update and delete anything
  //   //   if you want to prevent random people on the internet from accessing your data,
  //   //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  //   access: allowAll,

  //   // this is the fields for our Post list
  //   fields: {
  //     title: text({ validation: { isRequired: true } }),

  //     // the document field can be used for making rich editable content
  //     //   you can find out more at https://keystonejs.com/docs/guides/document-fields
  //     content: document({
  //       formatting: true,
  //       layouts: [
  //         [1, 1],
  //         [1, 1, 1],
  //         [2, 1],
  //         [1, 2],
  //         [1, 2, 1],
  //       ],
  //       links: true,
  //       dividers: true,
  //     }),

  //     // with this field, you can set a User as the author for a Post
  //     author: relationship({
  //       // we could have used 'User', but then the relationship would only be 1-way
  //       ref: "User.posts",

  //       // this is some customisations for changing how this will look in the AdminUI
  //       ui: {
  //         displayMode: "cards",
  //         cardFields: ["name", "email"],
  //         inlineEdit: { fields: ["name", "email"] },
  //         linkToItem: true,
  //         inlineConnect: true,
  //       },

  //       // a Post can only have one author
  //       //   this is the default, but we show it here for verbosity
  //       many: false,
  //     }),

  //     // with this field, you can add some Tags to Posts
  //     tags: relationship({
  //       // we could have used 'Tag', but then the relationship would only be 1-way
  //       ref: "Tag.posts",

  //       // a Post can have many Tags, not just one
  //       many: true,

  //       // this is some customisations for changing how this will look in the AdminUI
  //       ui: {
  //         displayMode: "cards",
  //         cardFields: ["name"],
  //         inlineEdit: { fields: ["name"] },
  //         linkToItem: true,
  //         inlineConnect: true,
  //         inlineCreate: { fields: ["name"] },
  //       },
  //     }),
  //   },
  // }),

  Site: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({
        isIndexed: "unique",
        validation: { isRequired: true, match: { regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ } },
      }),
      link: text({ validation: { isRequired: true } }),
      description: text({ ui: { displayMode: "textarea" } }),
      portraitImage: responsiveImage({ storage: "responsive_images" }),
      landscapeImage: responsiveImage({ storage: "responsive_images" }),
      isFeatured: checkbox({ defaultValue: false }),
      tags: relationship({
        ref: "Tag.sites",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
      }),
      categories: relationship({
        ref: "Category.sites",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
      }),
      content: document({
        formatting: true,
        dividers: true,
        links: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
        ],
      }),
      favorites: relationship({ ref: "Favorite.site", many: true }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },
  }),

  Tag: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    // ui: {
    //   isHidden: true,
    // },

    // this is the fields for our Tag list
    fields: {
      name: text(),
      slug: text({
        isIndexed: "unique",
        validation: { isRequired: true, match: { regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ } },
      }),
      // this can be helpful to find out all the Sites associated with a Tag
      sites: relationship({ ref: "Site.tags", many: true }),
    },
  }),

  Category: list({
    access: allowAll,
    fields: {
      name: text(),
      slug: text({
        isIndexed: "unique",
        validation: { isRequired: true, match: { regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ } },
      }),
      sites: relationship({ ref: "Site.categories", many: true }),
    },
  }),

  Submission: list({
    access: {
      operation: {
        query: hasSession,
        create: hasSession,
        delete: hasSession,
        update: hasSession,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      link: text({ validation: { isRequired: true } }),
      description: text({ ui: { displayMode: "textarea" } }),
      status: select({
        options: [
          { label: "Received", value: "received" },
          { label: "In Review", value: "in-review" },
          { label: "Accepted", value: "accepted" },
          { label: "Denied", value: "denied" },
        ],
        defaultValue: "received",
        validation: { isRequired: true },
      }),
      submitter: relationship({
        ref: "User.submissions",
        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          linkToItem: true,
          inlineConnect: true,
        },
        many: false,
      }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },
  }),

  Favorite: list({
    access: {
      operation: {
        query: hasSession,
        create: hasSession,
        delete: hasSession,
        update: hasSession,
      },
    },
    fields: {
      site: relationship({
        ref: "Site.favorites",
        // this is some customisations for changing how this will look in the AdminUI
        many: false,
      }),
      user: relationship({
        ref: "User.favorites",
        many: false,
      }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },
  }),
}
