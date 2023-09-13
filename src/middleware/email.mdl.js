const sgMail = require('@sendgrid/mail');
const config = require('../config');
import { bienvenida } from "../templates/email.tmps"

const sendEmail = async (req, res) => {
  const { ...rest } = req.body;
  let destinatario = rest.destinatario;
  let asunto = rest.asunto;
  let textEmail = bienvenida;
  let response = await emailSender(destinatario, asunto, textEmail);

  if (!response?.errorEmail) {
    res.status(200).json(response);
  } else {
    res.status(400).json(response);
  }
};

const emailSender = async (destinatario, asunto, textEmail) => {
  let responseEmail;
  sgMail.setApiKey(config.emailSendGridConfig.apiKey);
  const mensaje = {
    to: destinatario,
    from: config.emailSendGridConfig.senderName,
    subject: asunto,
    html: bienvenida,
  }

  responseEmail = sgMail
    .send(mensaje)
    .then((response) => {
      return { statusCodeEmail: response[0].statusCode, message: 'enviado' };
    })
    .catch((error) => {
      return { errorMessage: error?.message, errorBody: error?.response?.body, message: 'no enviado' };
    });

  return responseEmail;
}

export { emailSender }