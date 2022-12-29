// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config, graphql } from "@keystone-6/core"

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema"

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from "./auth"

export default withAuth(
  config({
    server: {
      cors: { origin: ["http://127.0.0.1:5173"], credentials: true },
    },
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "postgresql",
      useMigrations: true,
      url: process.env.DATABASE_URL || "",
    },
    // db: {
    //   // we're using sqlite for the fastest startup experience
    //   //   for more information on what database might be appropriate for you
    //   //   see https://keystonejs.com/docs/guides/choosing-a-database#title
    //   provider: "sqlite",
    //   url: "file:./keystone.db",
    // },
    lists,
    session,
    ui: {
      isAccessAllowed: (context) => !!context.session?.data.isAdmin,
    },
    storage: {
      local_images: {
        kind: "local",
        type: "image",
        transformName: (filename) => filename,
        generateUrl: (path) => `http://localhost:3000/images${path}`,
        serverRoute: {
          path: "/images",
        },
        storagePath: "public/images",
      },
      responsive_images: {
        kind: "local",
        type: "image",
        transformName: (filename) => filename,
        generateUrl: (path) => `http://localhost:3000/responsive_images${path}`,
        serverRoute: {
          path: "/responsive_images",
        },
        storagePath: "public/responsive_images",
      },
    },
  })
)
