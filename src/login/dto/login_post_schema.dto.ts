export class login_post_schema{
    cpf:{
      type: string
      writing: true
      required: true
    }
  
    password:{
      type: string
      writing: true
      required: true
    }
  }