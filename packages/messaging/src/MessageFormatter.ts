import Mustache from 'mustache'

export class MessageFormatter {
   static formatTitle(title: string) {
      return title.replace(/(<([^>]+)>)/gi, '')
   }

   static formatBody(body: string, data?: {}) {
      return Mustache.render(body, data)
   }
}
