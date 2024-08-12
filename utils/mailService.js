import nodemailer from "nodemailer";
import envConfig from '../config/envConfig.js';
import hbs from "nodemailer-express-handlebars";
import path from "path";

await envConfig();


const dkim = {
  ...{
    keys: [
      {
        domainName: "pressend.com",
        keySelector: "2017",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg...",
      },
      {
        domainName: "pressend.com",
        keySelector: "2016",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg...",
      },
    ],
    cacheDir: false,
  },
};


const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve("./views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views"),
  extName: ".hbs",
};

const sendEmail = (to, subject, template, context) => {
  transport.sendMail(
    {
      from: `Pressend ${process.env.EMAIL_USERNAME}`,
      to,
      subject,
      template: `templates/${template}`,
      context: {
        location: `${process.env.COMPANY_LOCATION}`,
        app_name: `${process.env.APP_NAME}`,
        customer_care: `${process.env.CUSTOMER_CARE_EMAIL_USERNAME}`,
        ...context
      },
      attachments: [
        {
          filename: "logo.png",
          path: "./views/images/logo.png",
          cid: "logo",
        },
        {
          filename: "facebook.svg",
          path: "./views/images/facebook.png",
          cid: "facebook",
        },
        {
          filename: "instagram.png",
          path: "./views/images/instagram.png",
          cid: "instagram",
        },
        {
          filename: "youtube.png",
          path: "./views/images/youtube.png",
          cid: "youtube",
        },
        {
          filename: "twitter-x.png",
          path: "./views/images/twitter-x.png",
          cid: "twitter-x",
        },
      ],
    },
    (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info.messageId);
      }
    }
  );
};

transport.use("compile", hbs(handlebarOptions));

export default sendEmail;