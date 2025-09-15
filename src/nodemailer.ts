import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "mail.projetoads.com.br",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
})


/* 
Usuário preenche um formulário com o email.
Backend verifica se esse email existe no banco.
Se existir, gera um código/token temporário e salva no banco.
Envia um email para o email do usuário com esse código e instruções.
Usuário recebe o email → volta na tela do app → digita o código + nova senha.
Backend valida o código/token, atualiza a senha e invalida o token. */
