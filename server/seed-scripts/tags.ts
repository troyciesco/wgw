import { getContext } from "@keystone-6/core/context"
import config from "../keystone"
import * as PrismaModule from ".prisma/client"

async function main() {
  const context = getContext(config, PrismaModule)

  console.log("(script.ts)", "connect")

  await config.db.onConnect?.(context)

  const tags = [
    { name: "Nice Typography", slug: "nice-typography" },
    { name: "Colorful", slug: "colorful" },
    { name: "Vintage", slug: "vintage" },
    { name: "Illustrations", slug: "illustrations" },
    { name: "Minimal", slug: "minimal" },
    { name: "Whimsical", slug: "whimsical" },
  ]

  tags.forEach(async (tag) => {
    console.log("(script.ts)", `Tag.createOne ${tag.name}`)
    await context.db.Tag.createOne({ data: { name: tag.name, slug: tag.slug } })
  })
}

main()
