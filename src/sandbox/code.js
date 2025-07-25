import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import {editor} from "express-document-sdk";

// Get the document sandbox runtime.
const {runtime} = addOnSandboxSdk.instance;

function start() {
  // APIs to be exposed to the UI runtime
  // i.e., to the `index.html` file of this add-on.
  const sandboxApi = {
    createRectangle: () => {
      const rectangle = editor.createRectangle();

      // Define rectangle dimensions.
      rectangle.width = 240;
      rectangle.height = 180;

      // Define rectangle position.
      rectangle.translation = {x: 10, y: 10};

      // Define rectangle color.
      const color = {red: 0.32, green: 0.34, blue: 0.89, alpha: 1};

      // Fill the rectangle with the color.
      const rectangleFill = editor.makeColorFill(color);
      rectangle.fill = rectangleFill;

      // Add the rectangle to the document.
      const insertionParent = editor.context.insertionParent;
      insertionParent.children.append(rectangle);
    },
    insertImageAt: async ({url, x, y}) => {
      const image = await editor.createImage(url);
      image.translation = {x, y};
      image.width = 300;
      image.height = 300;
      editor.context.insertionParent.children.append(image);
    },
    createText: async ({text}) => {
      const insertionParent = editor.context.insertionParent;
      const content = text || "Hellooo";
      const textNode = editor.createText(content);

      textNode.setPositionInParent(
        {x: insertionParent.width / 2, y: insertionParent.height / 2},
        {x: 0, y: 0}
      );

      insertionParent.children.append(textNode);
      textNode.fullContent.applyCharacterStyles(
        {
          fontSize: 16,
          color: {red: 0, green: 0, blue: 0, alpha: 1},
          underline: false,
          letterSpacing: 2,
        },
        {
          start: 0,
          length: content.length,
        }
      );
    },
  };

  // Expose `sandboxApi` to the UI runtime.
  runtime.exposeApi(sandboxApi);
}

start();
