import { getContext } from "@keystone-6/core/context"
import config from "../keystone"
import * as PrismaModule from ".prisma/client"

async function main() {
  const context = getContext(config, PrismaModule)

  console.log("(script.ts)", "connect")

  await config.db.onConnect?.(context)

  const categories = [
    { name: "Agency", slug: "agency" },
    { name: "Blog", slug: "blog" },
    { name: "Food", slug: "food" },
    { name: "Ecommerce", slug: "ecommerce" },
  ]

  categories.forEach(async (category) => {
    console.log("(script.ts)", `Category.createOne ${category.name}`)
    await context.db.Category.createOne({ data: { name: category.name, slug: category.slug } })
  })
}

main()
