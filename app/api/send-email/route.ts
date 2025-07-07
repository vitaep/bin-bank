import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, company, interest, message } = await request.json();

    // Configuração do transporter (substitua com suas credenciais)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configuração do email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "placeholder",
      subject: `Novo contato de ${name} - ${company}`,
      text: `
        Nome: ${name}
        Email: ${email}
        Empresa: ${company}
        Interesse: ${interest}
        Mensagem: ${message}
      `,
      html: `
        <h1>Novo contato do site BIN Bank</h1>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${company}</p>
        <p><strong>Área de interesse:</strong> ${interest}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
      `,
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email enviado com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json(
      { message: "Erro ao enviar email" },
      { status: 500 }
    );
  }
}
