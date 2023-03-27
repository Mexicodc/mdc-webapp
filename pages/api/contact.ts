import { type NextApiRequest, type NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import nodemailer from 'nodemailer'
import { z } from 'zod'

import { newCaptchaImages } from './captcha-image'

export default withIronSessionApiRoute(
  async function handler(req: NextApiRequest, res: NextApiResponse) {
    /* handle only post req */
    if (req.method !== 'POST') {
      return res.status(200).json({ message: 'Method not allowed' })
    }
    /* verify if req.body have {name & email & message}  */
    if (!req.body.FirstName || !req.body.Email || !req.body.LastName || !req.body.Phone) {
      return res.status(400).json({ message: 'Bad request' })
    }
    const { FirstName, LastName, Company, CompanySize, Email, Phone, Country, selectedIndexes } =
      req.body

    /* validade name, email, message with zod to prevent XSS  */
    const schema = z.object({
      FirstName: z.string().min(2).max(30),
      LastName: z.string().min(2).max(40),
      Company: z.string(),
      CompanySize: z.string(),
      Email: z.string().email(),
      Phone: z.string().min(10).max(20),
      Country: z.string(),
      selectedIndexes: z.array(z.number())
    })

    try {
      schema.parse({
        FirstName,
        LastName,
        Company,
        CompanySize,
        Email,
        Phone,
        Country,
        selectedIndexes
      })
      /* check wich image from the captcha are correct */
    } catch (error) {
      return res.status(400).json({ message: 'schema fail Bad request' })
    }
    if (selectedIndexes.length === 0) {
      return res.status(400).json({ message: 'Bad request' })
    }
    const correctIndexes = req.session.captchaImages
      .map((path, index) => (path.includes('smartcatch/smartphone') ? index : -1))
      .filter((index) => index !== -1)

    const captchaIsOK = correctIndexes.toString() === selectedIndexes.sort().toString()

    if (!captchaIsOK) {
      // reset captcha images
      req.session.captchaImages = newCaptchaImages()
      await req.session.save()
    }

    /* create transporter */
    const transporter = nodemailer.createTransport({
      /* get from .env data */
      service: 'gmail',
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'gerardo_alcantara_rmz@hotmail.com',
      subject: `Forma de Contacto enviada por ${FirstName as string} ${LastName as string}`,
      html: `<h1>Nombre: ${FirstName as string} ${LastName as string}</h1>
          <h2>Compañia: ${Company as string}</h2>
          <h2>Tamaño de la Compañia: ${CompanySize as string}</h2>
          <h2>Telefono: ${Phone as string}</h2>
          <h2>País: ${Country as string}</h2>
          <h2>Email: ${Email as string}</h2>`
    }

    try {
      /* Real email send */
      const send = captchaIsOK

      if (captchaIsOK) {
        await transporter.sendMail(mailOptions)

        return res.status(200).json({ message: 'Email sent successfully', captchaIsOK, send })
      }

      res.status(200).json({ message: 'Email not sent', captchaIsOK, send })
    } catch (error) {
      return res.status(500).json({ message: 'Error sending email', error })
    }
  },
  {
    cookieName: 'MDC_SESSION',
    password: process.env.SESSION_SECRET as string
  }
)
