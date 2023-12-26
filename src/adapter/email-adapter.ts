import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "shtucer343test@gmail.com", // generated ethereal user
                pass: "xanzovfydhnihwiz", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transport.sendMail({
            from: 'Moroz comparation <shtucer343test@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            // text: "Hello world?", // plain text body
            html: message // html body
        });

        return info
    }
}

//