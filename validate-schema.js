const fs = require("fs");
const path = require("path");
const JsonSchema = require("@hyperjump/json-schema");

async function validate(filename) {
  JsonSchema.setShouldMetaValidate(false);
  JsonSchema.setMetaOutputFormat(JsonSchema.VERBOSE);
  
  // Fetch from file
  await JsonSchema.get("https://json-schema.org/draft/2019-09/schema");
  const schema = await JsonSchema.get("file:///home/runner/work/rdm-schema/rdm-schema/rdm-schema.json");
  
  const output = await JsonSchema.validate(schema, "file://" + filename, JsonSchema.VERBOSE);
  console.log(output);
  if (output.valid) {
    console.log("File " + filename + " is valid :-)");
  } else {
    console.log("File " + filename + " is invalid :-(");    process.exitCode = 1
  }
}

//From https://gist.github.com/lovasoa/8691344#file-node-walk-es6
async function* walk(dir) {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

async function validateAllFiles(exampleDir) {
  for await (const file of walk(exampleDir)) {
    if (/\.json$/.test(file)) {
      await validate(file);
    }
  }
}

validateAllFiles("/home/runner/work/rdm-schema/rdm-schema/examples/");
