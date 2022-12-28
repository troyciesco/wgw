import { getContext } from "@keystone-6/core/context"
import config from "../keystone"
import * as PrismaModule from ".prisma/client"
import fs from "fs"
import { faker } from "@faker-js/faker"

import got from "got"
// @ts-ignore
import Upload from "graphql-upload/Upload.js"
import { sites } from "./starters"

async function main() {
  const context = getContext(config, PrismaModule)

  console.log("(script.ts)", "connect")

  await config.db.onConnect?.(context)

  // const prepareToUpload = (file: any) => {
  const prepareToUpload = (slug: any, orientation?: string) => {
    const filename = `${slug}_${orientation}`
    const mimetype = "image/png"
    const encoding = "utf-8"
    const createReadStream = () =>
      fs.createReadStream(`${__dirname}/../public/starter_images/${slug}-${orientation}.png`)

    const image = {
      createReadStream,
      filename,
      mimetype,
      encoding,
    }

    const upload = new Upload()
    // @ts-ignore
    upload.resolve(image)

    return upload
  }

  // Array.from(Array(50).keys()).forEach(async (item) => {
  sites.forEach(async (item) => {
    const site = {
      // name: item.name,
      // slug: item.slug,
      // link: item.link,
      ...item,
      description: faker.random.words(30),
      isFeatured: faker.datatype.boolean(),
    }

    console.log("(script.ts)", `Site.createOne ${site.name}`)
    const tags: any[] = []
    const categories: any[] = []

    item.tags.forEach((tag) => {
      tags.push({ slug: tag })
    })

    item.categories.forEach((category) => {
      categories.push({ slug: category })
    })

    await context.query.Site.createOne({
      data: {
        name: site.name,
        slug: site.slug,
        link: site.link,
        description: site.description,
        isFeatured: site.isFeatured,
        portraitImage: { upload: prepareToUpload(item.slug, "port") },
        landscapeImage: { upload: prepareToUpload(item.slug, "land") },
        tags: { connect: tags },
        categories: { connect: categories },
      },
    })

    // stream.destroy()
  })
}

main()
