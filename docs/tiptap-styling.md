# Styling the Editor

Tiptap follows a headless-first approach, which means the core extensions come without any styling or UI components - just pure logic. This gives you complete control over how your editor looks and behaves.

However, we now also offer optional UI components and templates that you can use to accelerate your development.

![User interface templates for Tiptap](/docs/_next/static/media/content-templates.027lc4vwerc~0.png)

Get started with UI templates

Our UI templates include pre-built components for common editor features. Download the source code and customize to your needs.

[

Get UI components

](/docs/ui-components/getting-started/overview)

### [](#building-your-own-ui)Building your own UI

If you prefer to build your own UI or need to understand how styling works in Tiptap, here are the available methods

## [](#style-plain-html)Style plain HTML

The entire editor is rendered inside a container with the class `.tiptap`. You can use that to scope your styling to the editor content:

```
/* Scoped to the editor */
.tiptap p {
  margin: 1em 0;
}
```

### Style with CSS modules

In [CSS modules](https://github.com/css-modules/css-modules), class names are modified to enable local scoping, which may prevent styles from applying when targeting the `.tiptap` class. Use global styles or the `:global(.tiptap)` modifier to ensure styles are applied correctly.

If you're rendering the stored content elsewhere, there won't be a `.tiptap` container, so you can globally add styling to the relevant HTML tags:

```
/* Global styling */
p {
  margin: 1em 0;
}
```

## [](#add-custom-classes)Add custom classes

You can control the whole rendering, including adding classes to everything.

### [](#extensions)Extensions

Most extensions allow you to add attributes to the rendered HTML through the `HTMLAttributes` option. You can use that to add a custom class (or any other attribute). That's also very helpful when you work with [Tailwind CSS](#style-using-tailwind-css).

```
new Editor({
  extensions: [
    Document,
    Paragraph.configure({
      HTMLAttributes: {
        class: 'my-custom-paragraph',
      },
    }),
    Heading.configure({
      HTMLAttributes: {
        class: 'my-custom-heading',
      },
    }),
    Text,
  ],
})
```

The rendered HTML will look like this:

```
<h1 class="my-custom-heading">Example Text</h1>
<p class="my-custom-paragraph">Wow, that's really custom.</p>
```

If there are already classes defined by the extensions, your classes will be added.

### [](#editor)Editor

You can even pass classes to the element that contains the editor:

```
new Editor({
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
})
```

## [](#customize-html)Customize HTML

Or you can customize the markup for extensions. The following example will make a custom bold extension that doesn't render a `<strong>` tag, but a `<b>` tag:

```
import Bold from '@tiptap/extension-bold'

const CustomBold = Bold.extend({
  renderHTML({ HTMLAttributes }) {
    // Original:
    // return ['strong', HTMLAttributes, 0]
    return ['b', HTMLAttributes, 0]
  },
})

new Editor({
  extensions: [
    // …
    CustomBold,
  ],
})
```

You should place your custom extensions in separate files for better organization, but you get the idea.

## [](#style-using-tailwind-css)Style using Tailwind CSS

Since content managed in Tiptap is plain HTML which by default doesn't come with Tailwind CSS classes, you have a few approaches to style your editor:

### [](#using-a-global-css-file-and-apply)Using a global CSS file and `@apply`

Even though the Tailwind maintainers recommend not using `@apply` we think it's the best way to define styles for flexible, user written content like Tiptaps content. You can use a global CSS file and apply Tailwind styles to HTML tags inside your editor. Since nested selectors are now widely supported, you can scope your styles to the `.tiptap` class:

```
.tiptap {
  p {
    @apply my-4 first:mt-0 last:mb-0 text-base leading-relaxed;
  }

  h1 {
    @apply text-3xl font-bold mt-8 mb-4 first:mt-0 last:mb-0;
  }
}
```

### [](#adding-classes-to-your-extensions)Adding classes to your extensions

If you don't want to use a global CSS file, a more complicated approach would be to extend existing components and add Tailwind classes to the `HTMLAttributes` inside the `renderHTML` output.

```
import Paragraph from '@tiptap/extension-paragraph'

const TailwindParagraph = Paragraph.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      'p',
      {
        ...HTMLAttributes,
        class: 'my-4 first:mt-0 last:mb-0 text-base leading-relaxed',
      },
      0,
    ]
  },
})
```

This approach can work but will become more complicated with more complicated extensions or when NodeViews are used so we still would recommend using a global CSS file with `@apply` for most cases.

### [](#using-the-tailwindcsstypography-plugin)Using the `@tailwindcss/typography` plugin

The editor works fine with Tailwind CSS, too. Find an example that's styled with the `@tailwindcss/typography` plugin below.

### [](#intellisense)Intellisense

If you're using [TailwindCSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss), add this snippet to your `.vscode/settings.json` to enable intellisense support inside Tiptap objects:

```
"tailwindCSS.experimental.classRegex": [
  "class:\\s*?[\"'`]([^\"'`]*).*?,"
]
```

## [](#next-steps)Next steps

-   [Learn more about Tiptaps concepts](/docs/editor/core-concepts/introduction)
-   [Learn how to persist the editor state](/docs/editor/core-concepts/persistence)
-   [Start building your own extensions](/docs/editor/extensions/custom-extensions)