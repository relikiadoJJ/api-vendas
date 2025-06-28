import fs from 'node:fs'
import Handlebars from 'handlebars'

interface ITemplateVariable {
  [key: string]: string | number
}

export interface IParseMailTemplate {
  file: string
  variables: ITemplateVariable
}

export class handlebarsMailTemplate {
  public async parse({ file, variables }: IParseMailTemplate) {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    })
    const parseTemplate = Handlebars.compile(templateFileContent)

    return parseTemplate(variables)
  }
}
