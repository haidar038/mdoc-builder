import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      setImage: (options: { src: string; alt?: string; title?: string }) => ReturnType;
    };
  }
}

export const ImageNode = Node.create({
  name: "image",
  inline: false,
  group: "block",
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "img[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes({ class: "tiptap-image" }, HTMLAttributes)];
  },
  addCommands() {
    return {
      setImage: (options) => ({ commands }) =>
        commands.insertContent([
          { type: "image", attrs: options },
          { type: "paragraph" },
        ]),
    };
  },
});