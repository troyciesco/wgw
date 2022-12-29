"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core3 = require("@keystone-6/core");

// schema.ts
var import_core2 = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");

// custom-fields/responsive-image/index.ts
var import_types = require("@keystone-6/core/types");
var import_core = require("@keystone-6/core");
var import_sharp = __toESM(require("sharp"));

// custom-fields/responsive-image/utils.ts
var SUPPORTED_IMAGE_EXTENSIONS = ["jpg", "png", "webp", "gif"];
var WEBP_IMAGE_VERSIONS = [
  { resize: 0.125, suffix: "1x" },
  { resize: 0.25, suffix: "2x" },
  { resize: 0.5, suffix: "3x" },
  { resize: 0.75, suffix: "4x" },
  { resize: 1, suffix: "5x" }
];

// custom-fields/responsive-image/index.ts
var ResponsiveImageExtensionEnum = import_core.graphql.enum({
  name: "ResponsiveImageExtension",
  values: import_core.graphql.enumValues(SUPPORTED_IMAGE_EXTENSIONS)
});
var ResponsiveImageFieldInput = import_core.graphql.inputObject({
  name: "ResponsiveImageFieldInput",
  fields: {
    upload: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.Upload) })
  }
});
var inputArg = import_core.graphql.arg({ type: ResponsiveImageFieldInput });
var ResponsiveImageFieldOutput = import_core.graphql.object()({
  name: "ResponsiveImageFieldOutput",
  fields: {
    id: import_core.graphql.field({ type: import_core.graphql.nonNull(import_core.graphql.ID) }),
    filesize: import_core.graphql.field({ type: import_core.graphql.nonNull(import_core.graphql.Int) }),
    width: import_core.graphql.field({ type: import_core.graphql.nonNull(import_core.graphql.Int) }),
    height: import_core.graphql.field({ type: import_core.graphql.nonNull(import_core.graphql.Int) }),
    extension: import_core.graphql.field({ type: import_core.graphql.nonNull(ResponsiveImageExtensionEnum) }),
    url: import_core.graphql.field({
      type: import_core.graphql.nonNull(import_core.graphql.String),
      resolve(data, args, context) {
        return context.images(data.storage).getUrl(data.id, data.extension);
      }
    })
  }
});
async function inputResolver(storage, data, context) {
  if (data === null || data === void 0) {
    return { extension: data, filesize: data, height: data, id: data, width: data };
  }
  const upload = await data.upload;
  const mainImage = await context.images(storage).getDataFromStream(upload.createReadStream(), `${upload.filename}`);
  const filePath = `${__dirname}/../../public/responsive_images`;
  WEBP_IMAGE_VERSIONS.forEach(
    async (version) => (0, import_sharp.default)(`${filePath}/${upload.filename}.png`).metadata().then(
      ({ width, height }) => (0, import_sharp.default)(`${filePath}/${upload.filename}.png`).resize(width * version.resize, height * version.resize).toFile(`${filePath}/${upload.filename}@${version.suffix}.webp`)
    )
  );
  return mainImage;
}
var extensionsSet = new Set(SUPPORTED_IMAGE_EXTENSIONS);
function isValidImageExtension(extension) {
  return extensionsSet.has(extension);
}
var responsiveImage = (config2) => (meta) => {
  const storage = meta.getStorage(config2.storage);
  if (!storage) {
    throw new Error(
      `${meta.listKey}.${meta.fieldKey} has storage set to ${config2.storage}, but no storage configuration was found for that key`
    );
  }
  if ("isIndexed" in config2) {
    throw Error("isIndexed: 'unique' is not a supported option for field type image");
  }
  return (0, import_types.fieldType)({
    kind: "multi",
    fields: {
      filesize: { kind: "scalar", scalar: "Int", mode: "optional" },
      extension: { kind: "scalar", scalar: "String", mode: "optional" },
      width: { kind: "scalar", scalar: "Int", mode: "optional" },
      height: { kind: "scalar", scalar: "Int", mode: "optional" },
      id: { kind: "scalar", scalar: "String", mode: "optional" }
    }
  })({
    ...config2,
    hooks: storage.preserve ? config2.hooks : {
      ...config2.hooks,
      async beforeOperation(args) {
        await config2.hooks?.beforeOperation?.(args);
        if (args.operation === "update" || args.operation === "delete") {
          const idKey = `${meta.fieldKey}_id`;
          const id = args.item[idKey];
          const extensionKey = `${meta.fieldKey}_extension`;
          const extension = args.item[extensionKey];
          if ((args.operation === "delete" || typeof args.resolvedData[meta.fieldKey].id === "string" || args.resolvedData[meta.fieldKey].id === null) && typeof id === "string" && typeof extension === "string" && isValidImageExtension(extension)) {
            WEBP_IMAGE_VERSIONS.forEach(
              async (version) => await args.context.images(config2.storage).deleteAtSource(`${id}@${version.suffix}`, "webp")
            );
            await args.context.images(config2.storage).deleteAtSource(id, extension);
          }
        }
      }
    },
    input: {
      create: {
        arg: inputArg,
        resolve: (data, context) => inputResolver(config2.storage, data, context)
      },
      update: {
        arg: inputArg,
        resolve: (data, context) => inputResolver(config2.storage, data, context)
      }
    },
    output: import_core.graphql.field({
      type: ResponsiveImageFieldOutput,
      resolve({ value: { extension, filesize, height, id, width } }) {
        if (extension === null || !isValidImageExtension(extension) || filesize === null || height === null || width === null || id === null) {
          return null;
        }
        return {
          extension,
          filesize,
          height,
          width,
          id,
          storage: config2.storage
        };
      }
    }),
    __ksTelemetryFieldTypeName: "@keystone-6/image",
    views: "@keystone-6/core/fields/types/image/views"
  });
};

// schema.ts
var hasSession = ({ session: session2 }) => {
  return !!session2?.data.id;
};
var isAdmin = ({ session: session2 }) => session2?.data.isAdmin;
var isUser = ({ session: session2, item }) => {
  return session2?.data.id === item.id;
};
var isAdminOrUser = ({ session: session2, item }) => isAdmin({ session: session2 }) || isUser({ session: session2, item });
var lists = {
  User: (0, import_core2.list)({
    access: {
      operation: {
        query: hasSession,
        create: () => true,
        delete: hasSession,
        update: hasSession
      },
      item: {
        create: () => true,
        update: isAdminOrUser,
        delete: isAdminOrUser
      }
    },
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      isAdmin: (0, import_fields.checkbox)({}),
      submissions: (0, import_fields.relationship)({ ref: "Submission.submitter", many: true }),
      favorites: (0, import_fields.relationship)({ ref: "Favorite.user", many: true }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  }),
  Site: (0, import_core2.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      slug: (0, import_fields.text)({
        isIndexed: "unique",
        validation: { isRequired: true, match: { regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ } }
      }),
      link: (0, import_fields.text)({ validation: { isRequired: true } }),
      description: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
      portraitImage: responsiveImage({ storage: "responsive_images" }),
      landscapeImage: responsiveImage({ storage: "responsive_images" }),
      isFeatured: (0, import_fields.checkbox)({ defaultValue: false }),
      tags: (0, import_fields.relationship)({
        ref: "Tag.sites",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] }
        }
      }),
      categories: (0, import_fields.relationship)({
        ref: "Category.sites",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] }
        }
      }),
      content: (0, import_fields_document.document)({
        formatting: true,
        dividers: true,
        links: true,
        layouts: [
          [1, 1],
          [1, 1, 1]
        ]
      }),
      favorites: (0, import_fields.relationship)({ ref: "Favorite.site", many: true }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  }),
  Tag: (0, import_core2.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)(),
      slug: (0, import_fields.text)({
        isIndexed: "unique",
        validation: { isRequired: true, match: { regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ } }
      }),
      sites: (0, import_fields.relationship)({ ref: "Site.tags", many: true })
    }
  }),
  Category: (0, import_core2.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)(),
      slug: (0, import_fields.text)({
        isIndexed: "unique",
        validation: { isRequired: true, match: { regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ } }
      }),
      sites: (0, import_fields.relationship)({ ref: "Site.categories", many: true })
    }
  }),
  Submission: (0, import_core2.list)({
    access: {
      operation: {
        query: hasSession,
        create: hasSession,
        delete: hasSession,
        update: hasSession
      }
    },
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      link: (0, import_fields.text)({ validation: { isRequired: true } }),
      description: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
      status: (0, import_fields.select)({
        options: [
          { label: "Received", value: "received" },
          { label: "In Review", value: "in-review" },
          { label: "Accepted", value: "accepted" },
          { label: "Denied", value: "denied" }
        ],
        defaultValue: "received",
        validation: { isRequired: true }
      }),
      submitter: (0, import_fields.relationship)({
        ref: "User.submissions",
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          linkToItem: true,
          inlineConnect: true
        },
        many: false
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  }),
  Favorite: (0, import_core2.list)({
    access: {
      operation: {
        query: hasSession,
        create: hasSession,
        delete: hasSession,
        update: hasSession
      }
    },
    fields: {
      site: (0, import_fields.relationship)({
        ref: "Site.favorites",
        many: false
      }),
      user: (0, import_fields.relationship)({
        ref: "User.favorites",
        many: false
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  })
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "id isAdmin",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password", "isAdmin"]
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var keystone_default = withAuth(
  (0, import_core3.config)({
    server: {
      cors: { origin: ["http://127.0.0.1:5173", "fleet-button-production.up.railway.app"], credentials: true }
    },
    db: {
      provider: "postgresql",
      useMigrations: true,
      url: process.env.DATABASE_URL || `postgres://${process.env.USER}@localhost/keystone-6-example`
    },
    lists,
    session,
    ui: {
      isAccessAllowed: (context) => !!context.session?.data.isAdmin
    },
    storage: {
      local_images: {
        kind: "local",
        type: "image",
        transformName: (filename) => filename,
        generateUrl: (path) => `${process.env.BASE_URL || "http://localhost:3000"}/images${path}`,
        serverRoute: {
          path: "/images"
        },
        storagePath: "public/images"
      },
      responsive_images: {
        kind: "local",
        type: "image",
        transformName: (filename) => filename,
        generateUrl: (path) => `${process.env.BASE_URL || "http://localhost:3000"}/responsive_images${path}`,
        serverRoute: {
          path: "/responsive_images"
        },
        storagePath: "public/responsive_images"
      }
    }
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
