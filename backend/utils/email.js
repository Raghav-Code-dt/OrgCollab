const nodemailer = require('nodemailer')

//1. Create a transporter
const transporter = nodemailer.createTransport({
    service : "gamil",
    host: "sandbox.smtp.mailtrap.io",               // this is for testing
    port: 2525,
    auth: {
        user: "33bbf0fc929368",
        pass: "037178d36dac72"
    }
    // host: "smtp.gmail.com",                      // for real use
    // port: 587,
    // secure: false,
    // auth:{
    //     user: "orgcollab@gmail.com",
    //     pass: "cnhztiihqzqkndqc "
    // }
})

//2. create message
function sendMail(email,token){
    const mailOptions = {
        from : "OrgCollab draggerclaw@gmail.com",
        to : email,
        subject : 'Message for reseting the password',
        // test: `This mail is for the request of reseting the password please visit on the ${process.env.Protocol}://localhost:8000/signup/resetpassword/${token}`,
        html : `<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <title>Password Reset</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Helvetica, Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        }
                        .header {
                            text-align: center;
                            padding-bottom: 20px;
                        }
                        .content {
                            font-size: 16px;
                            line-height: 1.5;
                            color: #333333;
                        }
                        .button-container {
                            text-align: center;
                            padding: 20px 0;
                        }
                        .button {
                            display: inline-block;
                            padding: 12px 24px;
                            background-color: #007bff;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                        }
                        .footer {
                            font-size: 12px;
                            text-align: center;
                            color: #777777;
                            padding-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="content">
                            <p>Hi ${email},</p> 
                            <p>You have received this email because a password reset was requested for your account at OrgCollab.</p>
                            <p>To reset your password, please click the button below. This link is valid for a limited time 15 mins.</p>
                        </div>
                        <div class="button-container">
                            <a href="${process.env.Protocol}://localhost:8000/login/resetpassword/${token}" class="button">Reset Password</a>
                        </div>
                        <div class="content">
                            <p>If you did not request a password reset, you can safely ignore this email.</p>
                            <p>For support, please contact our team.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2026 OrgCollab. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>`

        // we can also send a html
    }

    //3. send mail using transporter
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
}

module.exports = {sendMail}


