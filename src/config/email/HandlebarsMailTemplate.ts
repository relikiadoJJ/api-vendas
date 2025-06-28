import Handlebars from 'handlebars'

interface ITemplateVariable {
  [key: string]: string | number
}

export interface IParseMailTemplate {
  template: string
  variables: ITemplateVariable
}

export class handlebarsMailTemplate {
  public async parse({ template, variables }: IParseMailTemplate) {
    const parseTemplate = Handlebars.compile(template)

    return parseTemplate(variables)
  }
}
