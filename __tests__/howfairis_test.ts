import Ajv, {JSONSchemaType} from "ajv"
const ajv = new Ajv()
import  * as fs from "fs";

//use interface?

const schema: JSONSchemaType = {
  type: "object",
  properties: {
    badge: {type: "string"}, 
    checklist: {type: "bool"}, 
    citation: {type: "bool"}, 
    count: {type: "integer", minimum: 0, maximum: 5}, 
    license: {type: "bool"}, 
    registry: {type: "bool"}, 
    repository: {type: "bool"}, 
    stderr: {type: "string",nullable: true}, 
    stdout: {type: "string",nullable: true}, 
    url: {type: "string"}
  },
  required: ["badge","checklist","citation","count","license","registry","repository","stderr","stdout","url"],
  additionalProperties: false
}

// validate is a type guard for MyData - type is inferred from schema type
const validate = ajv.compile(schema)

// or, if you did not use type annotation for the schema,
// type parameter can be used to make it type guard:
// const validate = ajv.compile<MyData>(schema)

const file = fs.readFileSync("./.FairSECO/HowFairIs.JSON");
const data = JSON.parse(file)

if (validate(data)) {
  // data is MyData here
  console.log("HowFairIs test passed")
} else {
  console.log(validate.errors)
}


// source: https://ajv.js.org/guide/typescript.html
