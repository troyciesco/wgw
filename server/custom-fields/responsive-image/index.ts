import {
  BaseListTypeInfo,
  fieldType,
  FieldTypeFunc,
  CommonFieldConfig,
  ImageData,
  ImageExtension,
  KeystoneContext,
} from "@keystone-6/core/types"
import { graphql } from "@keystone-6/core"
import sharp from "sharp"

import { WEBP_IMAGE_VERSIONS, SUPPORTED_IMAGE_EXTENSIONS } from "./utils"

export type ResponsiveImageFieldConfig<ListTypeInfo extends BaseListTypeInfo> = {
  storage: string
} & CommonFieldConfig<ListTypeInfo>

const ResponsiveImageExtensionEnum = graphql.enum({
  name: "ResponsiveImageExtension",
  values: graphql.enumValues(SUPPORTED_IMAGE_EXTENSIONS),
})

const ResponsiveImageFieldInput = graphql.inputObject({
  name: "ResponsiveImageFieldInput",
  fields: {
    upload: graphql.arg({ type: graphql.nonNull(graphql.Upload) }),
  },
})

const inputArg = graphql.arg({ type: ResponsiveImageFieldInput })

const ResponsiveImageFieldOutput = graphql.object<ImageData & { storage: string }>()({
  name: "ResponsiveImageFieldOutput",
  fields: {
    id: graphql.field({ type: graphql.nonNull(graphql.ID) }),
    filesize: graphql.field({ type: graphql.nonNull(graphql.Int) }),
    width: graphql.field({ type: graphql.nonNull(graphql.Int) }),
    height: graphql.field({ type: graphql.nonNull(graphql.Int) }),
    extension: graphql.field({ type: graphql.nonNull(ResponsiveImageExtensionEnum) }),
    url: graphql.field({
      type: graphql.nonNull(graphql.String),
      resolve(data, args, context) {
        return context.images(data.storage).getUrl(data.id, data.extension)
      },
    }),
  },
})

async function inputResolver(
  storage: string,
  data: graphql.InferValueFromArg<typeof inputArg>,
  context: KeystoneContext
) {
  if (data === null || data === undefined) {
    return { extension: data, filesize: data, height: data, id: data, width: data }
  }
  const upload = await data.upload
  const mainImage = await context.images(storage).getDataFromStream(upload.createReadStream(), `${upload.filename}`)
  const filePath = `${__dirname}/../../public/responsive_images`
  WEBP_IMAGE_VERSIONS.forEach(
    async (version) =>
      sharp(`${filePath}/${upload.filename}.png`)
        .metadata()
        .then(({ width, height }) =>
          sharp(`${filePath}/${upload.filename}.png`)
            .resize(width! * version.resize, height! * version.resize)
            .toFile(`${filePath}/${upload.filename}@${version.suffix}.webp`)
        )
    // context.images(storage).getDataFromStream(upload.createReadStream(), `${upload.filename}_${version}`)
  )
  return mainImage
}

const extensionsSet = new Set(SUPPORTED_IMAGE_EXTENSIONS)

function isValidImageExtension(extension: string): extension is ImageExtension {
  return extensionsSet.has(extension)
}

export const responsiveImage =
  <ListTypeInfo extends BaseListTypeInfo>(
    config: ResponsiveImageFieldConfig<ListTypeInfo>
  ): FieldTypeFunc<ListTypeInfo> =>
  (meta) => {
    const storage = meta.getStorage(config.storage)

    if (!storage) {
      throw new Error(
        `${meta.listKey}.${meta.fieldKey} has storage set to ${config.storage}, but no storage configuration was found for that key`
      )
    }

    if ("isIndexed" in config) {
      throw Error("isIndexed: 'unique' is not a supported option for field type image")
    }

    return fieldType({
      kind: "multi",
      fields: {
        filesize: { kind: "scalar", scalar: "Int", mode: "optional" },
        extension: { kind: "scalar", scalar: "String", mode: "optional" },
        width: { kind: "scalar", scalar: "Int", mode: "optional" },
        height: { kind: "scalar", scalar: "Int", mode: "optional" },
        id: { kind: "scalar", scalar: "String", mode: "optional" },
      },
    })({
      ...config,
      hooks: storage.preserve
        ? config.hooks
        : {
            ...config.hooks,
            async beforeOperation(args) {
              await config.hooks?.beforeOperation?.(args)
              if (args.operation === "update" || args.operation === "delete") {
                const idKey = `${meta.fieldKey}_id`
                const id = args.item[idKey]
                const extensionKey = `${meta.fieldKey}_extension`
                const extension = args.item[extensionKey]

                // This will occur on an update where an image already existed but has been
                // changed, or on a delete, where there is no longer an item
                if (
                  (args.operation === "delete" ||
                    typeof args.resolvedData[meta.fieldKey].id === "string" ||
                    args.resolvedData[meta.fieldKey].id === null) &&
                  typeof id === "string" &&
                  typeof extension === "string" &&
                  isValidImageExtension(extension)
                ) {
                  WEBP_IMAGE_VERSIONS.forEach(
                    async (version) =>
                      await args.context.images(config.storage).deleteAtSource(`${id}@${version.suffix}`, "webp")
                  )
                  await args.context.images(config.storage).deleteAtSource(id, extension)
                }
              }
            },
          },
      input: {
        create: {
          arg: inputArg,
          resolve: (data, context) => inputResolver(config.storage, data, context),
        },
        update: {
          arg: inputArg,
          resolve: (data, context) => inputResolver(config.storage, data, context),
        },
      },
      output: graphql.field({
        type: ResponsiveImageFieldOutput,
        resolve({ value: { extension, filesize, height, id, width } }) {
          if (
            extension === null ||
            !isValidImageExtension(extension) ||
            filesize === null ||
            height === null ||
            width === null ||
            id === null
          ) {
            return null
          }
          return {
            extension,
            filesize,
            height,
            width,
            id,
            storage: config.storage,
          }
        },
      }),
      __ksTelemetryFieldTypeName: "@keystone-6/image",
      views: "@keystone-6/core/fields/types/image/views",
    })
  }
