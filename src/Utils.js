import nodemailer from 'nodemailer';
class Utils {
    coverteHora(num) {
        const hora = num / 2
        if (Number.isInteger(hora)) {
            return `${hora}:00`
        } else {
            return `${Math.trunc(hora)}:30`
        }
    }

    geraSenha(tamanho){
        let i = 0;
        let ma = 'ABCDEFGHIJKLMNOPQRSTUVYXWZ';
        let mi = 'abcdefghijklmnopqrstuvyxwz';
        let nu = '0123456789';
        let senha = '';

        do {
            senha += ma.charAt(Math.floor(Math.random() * ma.length));
            i += 1;
            senha += mi.charAt(Math.floor(Math.random() * mi.length));
            i += 1;
            senha += nu.charAt(Math.floor(Math.random() * nu.length));
            i += 1;
        } while (i < tamanho);
        return senha;
    }

    async enviaEmail(emailOptions) {
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

export default new Utils