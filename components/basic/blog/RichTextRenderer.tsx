import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface RichTextProps {
  content: any
  className?: string
}

// Lexical Text Node format bitmasks:
// 1 = bold, 2 = italic, 4 = strikethrough, 8 = underline, 16 = code, 32 = subscript, 64 = superscript
function formatText(text: string, format: number = 0): React.ReactNode {
  let element: React.ReactNode = text

  if (format & 1) element = <strong className="font-semibold text-foreground">{element}</strong>
  if (format & 2) element = <em className="italic">{element}</em>
  if (format & 8) element = <u className="underline underline-offset-2">{element}</u>
  if (format & 4) element = <s className="line-through opacity-75">{element}</s>
  if (format & 16) {
    element = (
      <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-muted text-primary border border-border">
        {element}
      </code>
    )
  }

  return element
}

function renderNode(node: any, index: number): React.ReactNode {
  if (!node) return null

  // Text Node
  if (node.type === 'text') {
    return <React.Fragment key={index}>{formatText(node.text || '', node.format)}</React.Fragment>
  }

  // Line break
  if (node.type === 'linebreak') {
    return <br key={index} />
  }

  const children = node.children?.map((child: any, i: number) => renderNode(child, i))

  switch (node.type) {
    case 'paragraph':
      // Don't render empty paragraph or render with spacing
      if (!node.children || node.children.length === 0) {
        return <p key={index} className="my-3">&nbsp;</p>
      }
      return (
        <p key={index} className="text-base sm:text-lg leading-relaxed text-muted-foreground my-4">
          {children}
        </p>
      )

    case 'heading': {
      const tag = node.tag || 'h2'
      if (tag === 'h1') {
        return (
          <h1 key={index} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-8 mb-4">
            {children}
          </h1>
        )
      }
      if (tag === 'h2') {
        return (
          <h2 key={index} className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-8 mb-4 border-b pb-2">
            {children}
          </h2>
        )
      }
      if (tag === 'h3') {
        return (
          <h3 key={index} className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mt-6 mb-3">
            {children}
          </h3>
        )
      }
      if (tag === 'h4') {
        return (
          <h4 key={index} className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mt-5 mb-2">
            {children}
          </h4>
        )
      }
      return (
        <h5 key={index} className="text-base sm:text-lg font-medium text-foreground mt-4 mb-2">
          {children}
        </h5>
      )
    }

    case 'list': {
      const listType = node.listType
      if (listType === 'number') {
        return (
          <ol key={index} className="list-decimal pl-6 space-y-2 my-4 text-muted-foreground text-base sm:text-lg">
            {children}
          </ol>
        )
      }
      return (
        <ul key={index} className="list-disc pl-6 space-y-2 my-4 text-muted-foreground text-base sm:text-lg">
          {children}
        </ul>
      )
    }

    case 'listitem':
      return (
        <li key={index} className="leading-relaxed">
          {children}
        </li>
      )

    case 'quote':
      return (
        <blockquote
          key={index}
          className="border-l-4 border-primary pl-4 py-2 my-6 italic text-foreground/90 bg-muted/30 rounded-r-md"
        >
          {children}
        </blockquote>
      )

    case 'link': {
      const url = node.fields?.url || node.url || '#'
      const newTab = node.fields?.newTab || false
      return (
        <Link
          key={index}
          href={url}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className="text-primary underline underline-offset-4 font-medium hover:opacity-80 transition-opacity"
        >
          {children}
        </Link>
      )
    }

    case 'horizontalrule':
      return <hr key={index} className="my-8 border-border" />

    case 'code':
      return (
        <div key={index} className="my-6 rounded-lg overflow-hidden border bg-muted/60">
          <pre className="p-4 text-sm font-mono text-foreground overflow-x-auto">
            <code>{children}</code>
          </pre>
        </div>
      )

    case 'upload': {
      const media = node.value
      if (!media) return null
      const src = media.cloudinary?.secure_url || media.url
      if (!src) return null
      return (
        <figure key={index} className="my-8">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border bg-muted shadow-xs">
            <Image
              src={src}
              alt={media.alt || 'Post illustration'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {media.alt && (
            <figcaption className="text-center text-xs text-muted-foreground mt-2">
              {media.alt}
            </figcaption>
          )}
        </figure>
      )
    }

    default:
      if (children && children.length > 0) {
        return <div key={index}>{children}</div>
      }
      return null
  }
}

export function RichTextRenderer({ content, className = '' }: RichTextProps) {
  if (!content) return null

  // If content is already pure HTML string (fallback)
  if (typeof content === 'string') {
    return <div className={`prose dark:prose-invert max-w-none ${className}`} dangerouslySetInnerHTML={{ __html: content }} />
  }

  const root = content.root || content
  const nodes = root?.children || []

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      {nodes.map((node: any, i: number) => renderNode(node, i))}
    </div>
  )
}

export default RichTextRenderer
