const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'packages', 'studio', 'src', 'models');
const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
   const filePath = path.join(modelsDir, file);
   let content = fs.readFileSync(filePath, 'utf-8');
   
   const classNameMatch = content.match(/export class ([A-Za-z0-9_]+) extends PersistedBaseObject/);
   if (!classNameMatch) continue;
   
   const className = classNameMatch[1];
   
   // Check if class already has JSDoc
   if (!content.includes(`/**\\n * Core domain model representing a ${className}`)) {
      content = content.replace(
         new RegExp(`export class ${className} extends PersistedBaseObject {`),
         `/**\n * Core domain model representing a ${className} within the Quatrain Studio ecosystem.\n */\nexport class ${className} extends PersistedBaseObject {`
      );
   }

   // Check PROPS_DEFINITION
   if (!content.includes(`/** The schema definition dictating the properties of this model. */\n   static PROPS_DEFINITION`)) {
      content = content.replace(
         `static PROPS_DEFINITION`,
         `/** The schema definition dictating the properties of this model. */\n   static PROPS_DEFINITION`
      );
   }

   // Check COLLECTION
   if (!content.includes(`/** The underlying database collection or table name. */\n   static COLLECTION`)) {
      content = content.replace(
         `static COLLECTION`,
         `/** The underlying database collection or table name. */\n   static COLLECTION`
      );
   }

   // Check factory
   if (!content.includes(`/**\n    * Instantiates a new \`${className}\` or loads one from the database.\n`)) {
      content = content.replace(
         new RegExp(`static async factory\\(src: any = undefined\\): Promise<${className}> {`),
         `/**\n    * Instantiates a new \`${className}\` or loads one from the database.\n    * \n    * @param src - Initial data or an existing URI/ID.\n    * @returns A promise resolving to the model instance.\n    */\n   static async factory(src: any = undefined): Promise<${className}> {`
      );
   }
   
   fs.writeFileSync(filePath, content, 'utf-8');
   console.log(`Updated ${file}`);
}
