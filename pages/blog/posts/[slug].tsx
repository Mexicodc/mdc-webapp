import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote'
import { MDXRemoteSerializeResult } from 'next-mdx-remote/dist/types'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/atom-one-dark.css'
import Link from 'next/link'
import { RiArrowLeftLine } from 'react-icons/ri'
import { ArticleJsonLd } from 'next-seo'
import { GetStaticProps } from 'next'

import HelperHead from '../../../lib/helpers/HelperHead'
import { DataHeadDefault } from '../../../lib/data/DataHeader'
import AuthorPostInfo from '../../../components/ArticleCard/AuthorPostInfo'
import { getSlugs, getPostBySlug } from '../../api/blogApi'
import YouTube from '../../../components/ui/YouTube'
import LinkWithPreview from '../../../components/ui/LinkWithPreview'

/**
 * @typedef {import('../../api/blogApi').PostMeta} PostMeta
 * @param {{post: {source:import('next-mdx-remote').MDXRemoteSerializeResult<Record<string, unknown>>, meta:PostMeta}}} post
 * @returns {JSX.Element}
 */
interface PostPageProps {
  post: {
    source: MDXRemoteSerializeResult<Record<string, unknown>>
    meta: PostMeta
  }
}
export default function PostPage({ post }: PostPageProps) {
  const postsHead = {
    previewImage: post.meta.imageSEO,
    previewImageAlt: post.meta.imageAltSEO,
    pageTitle: `MDC | Post | ${post.meta.title}`,
    pageDescription: post.meta.descriptionSEO,
    slug: `/${post.meta.slug}`
  }

  return (
    <>
      <HelperHead {...postsHead} />
      <ArticleJsonLd
        authorName={[
          {
            name: post.meta.authorName
          }
        ]}
        datePublished={new Date(post.meta.date).toISOString()}
        description={post.meta.descriptionSEO}
        images={[
          `${DataHeadDefault.currentURL}/socialCards/${postsHead.previewImage}, ${DataHeadDefault.currentURL}/blog/images/${post.meta.coverImageSrc}`
        ]}
        isAccessibleForFree={true}
        publisherName="Mexico development center"
        title={post.meta.title}
        url={`${DataHeadDefault.currentURL}${postsHead.slug}`}
      />

      <div className="pt-[68px] m-auto">
        <Image
          alt={post.meta.coverImageAlt}
          height={576}
          layout="responsive"
          objectFit="cover"
          src={`/blog/images/${post.meta.coverImageSrc}`}
          width={1920}
        />

        <div className="prose lg:prose-xl xl:prose-2xl py-5 xl:py-10 flex flex-col gap-4 m-4 md:m-auto">
          <nav>
            <Link href={`/blog`}>
              <div className="inline-flex gap-x-2 items-center hover:cursor-pointer group ">
                <RiArrowLeftLine className="text-2xl text-brandWhite  group-hover:animate-heartbeat group-hover:text-brandBlue-50 will-change-transform " />
                <span className="group-hover:text-brandBlue-100 text-xl transition-all duration-150">
                  Blog
                </span>
              </div>
            </Link>
          </nav>
          <AuthorPostInfo
            authorAvatar={post.meta.authorAvatar}
            authorName={post.meta.authorName}
            date={post.meta.date}
          />
          <h1 className="text-4xl xl:text-6xl text-accent font-bold ">{post.meta.title}</h1>
        </div>
        <div className="m-4 md:m-auto prose lg:prose-xl xl:prose-2xl prose-headings:text-brandBlue-50 prose-lime prose-code:text-brandBlue-50 md:py-10 md:prose-headings:text-5xl ">
          <MDXRemote {...post.source} components={{ YouTube, Image, LinkWithPreview }} />
        </div>
      </div>
    </>
  )
}
export async function getStaticPaths() {
  const paths = getSlugs().map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<PostPageProps> = async (context) => {
  if (!context.params) {
    return {
      notFound: true
    }
  }
  const { slug } = context.params
  const { content, meta } = await getPostBySlug(slug as string)
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [rehypeSlug, rehypeHighlight]
    }
  })

  return {
    props: {
      post: {
        source: mdxSource,
        meta
      }
    }
  }
}
