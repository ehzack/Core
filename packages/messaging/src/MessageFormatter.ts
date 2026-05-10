import Mustache from 'mustache'

/**
 * Specialized utility handling string cleanup and Mustache interpolation for templates.
 */
export class MessageFormatter {
   /**
    * Cleans all HTML tags from the title string.
    * 
    * @param title - The raw subject line.
    * @returns The formatted title string.
    */
   static formatTitle(title: string) {
      return title.replace(/<[^>]*>/gi, '')
   }

   /**
    * Renders the Mustache layout with provided contextual variables.
    * 
    * @param body - The markdown/HTML layout.
    * @param data - The variables context map.
    * @returns Parsed output string.
    */
   static formatBody(body: string, data?: {}) {
      return Mustache.render(body, data)
   }
}
