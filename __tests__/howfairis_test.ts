import { runHowfairis } from '../src/resources/howfairis';
import { ReturnObject } from "../src/getdata";
import { matchers } from 'jest-json-schema';


expect.extend(matchers);


test("that output json matches the schema", async () =>{

  const schema = {
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

  // const githubtesturl = 'https://github.com/QDUNI/FairSECO/';
  const outputmodule : ReturnObject = await runHowfairis();
  expect(outputmodule).toMatchSchema(schema);
  
});
