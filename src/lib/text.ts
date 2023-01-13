const path = require("path");
const kuromoji = require("kuromoji");

export function parseText(text: string) {
  kuromoji
    .builder({
      dicPath: path.resolve(__dirname, "./node_modules/kuromoji/dict"),
    })
    .build((error, tokenizer) => {
      const parsed = tokenizer.tokenize("私の名前は中野です");
      console.log(parsed);
    });
}
