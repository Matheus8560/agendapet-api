import nodemailer from 'nodemailer';
import 'dotenv/config';

// Create the transporter with the required configuration for Outlook
// change the user and pass !
module.exports = {
    async enviaEmial(emailOptions) {
        let response = {
            status: false,
            mensagem: "Erro ao enviar e-mail"
        };

        var transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "06239a0860ed53",
                pass: "20c873c03d0089"
            }
        });
        
        await transport.sendMail(emailOptions, function (erro) {
            if (!erro) {
                response = {
                    status: true,
                    mensagem: "E-mail enviado com sucesso"
                }
            }
        });

        return response;
    }
}