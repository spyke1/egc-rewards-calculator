const fs = require("fs");
const path = require("path");
// import { writeFile } from 'fs'; if you are using a typescript file

const environmentFile = `export const environment = {
  bscApiKey: '', // add here your variables
  production: false
};
`;

//path.resolve(process.cwd(), /# etc. #/)
// Generate environment.ts file
fs.writeFile(
  path.resolve(process.cwd(), "./src/environments/environment.ts"),
  environmentFile,
  function (err) {
    if (err) {
      throw console.error(err);
    } else {
      console.log(`Angular environment.ts file generated`);
    }
  }
);
