const fs = require("fs");
const path = require("path");
const JsonSchema = require("@hyperjump/json-schema");

// Fetch from file
const schema = JsonSchema.get("file:///home/runner/work/rdm-schema/rdm-schema/rdm-schema.json");

JsonSchema.setShouldMetaValidate(true);
JsonSchema.setMetaOutputFormat(JsonSchema.VERBOSE);

async function validate(filename) {
  const output = await JsonSchema.validate(schema, filename, JsonSchema.VERBOSE);
  console.log(output);
  if (output.valid) {
    console.log("File " + filename + " is valid :-)");
  } else {
    console.log("File " + filename + " is invalid :-(");
    process.exitCode = 1
  }
}

//From https://gist.github.com/kethinov/6658166#gistcomment-2037451
function walkSync(dir) {
    if (!fs.lstatSync(dir).isDirectory()) return dir;

    return fs.readdirSync(dir).map(f => walkSync(path.join(dir, f)));
}

async function validateAllFiles(exampleDir) {
  walkSync(exampleDir)
    .filter((entry) => /\.json$/.test(entry))
    .forEach((entry) => {
      await validate(entry)
    });
}

validateAllFiles("./examples");
