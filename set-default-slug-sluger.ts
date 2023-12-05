import { prisma } from "./lib/prisma"
import { slugger } from "./lib/slugger"

export const setSluggerSlugOnBoot = async () => {
    try {
        const slug = await prisma.tools.findMany({
            select: {
                slug: true
            }
        })
        const occurrences: Record<string, number> = {};
        slug.forEach(({ slug }: { slug: string }) => {
            occurrences[slug] = 1;
        });
        slugger.occurrences = occurrences
    } catch (e) {
        console.log(e)
    }
}