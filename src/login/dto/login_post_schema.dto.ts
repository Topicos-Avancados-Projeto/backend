export class login_post_schema{
    cpf:{
      length: number
      type: string
      writing: true
      required: true
    }
  
    password:{
      length: number
      type: string
      writing: true
      required: true
    }
  }