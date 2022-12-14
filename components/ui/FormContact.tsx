import { useState } from "react";
import FormInput from "./FormInput";
import axios from "axios";
import { useRouter } from "next/router";
import Captcha from "./Captcha";

function FormContact({ defaultCaptchaKey }: { defaultCaptchaKey: string }) {
  const router = useRouter();
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [captchaKey, setCaptchaKey] = useState<string>(defaultCaptchaKey);
  const [captchaSolved, setCaptchaSolved] = useState<boolean>(false);
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Values>({});
  const [captchaError, setCaptchaError] = useState<boolean>(false);

  const inputs: InputProps[] = [
    {
      id: 1,
      name: "name",
      placeholder: "Escribe tu nombre",
      type: "text",
      errorMessage: "El Nombre debe tener entre 3 y 40 caracteres y no contener números o símbolos",
      label: "Nombre",
      pattern: "^[a-zA-ZÀ-ÿ\\s]{3,40}$",
      required: true,
    },
    {
      id: 2,
      name: "email",
      placeholder: "tuemail@domino.com",
      type: "email",
      errorMessage: "Debe de ser una dirección de correo válida",
      label: "Correo",
      pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$",
      required: true,
    },
    {
      id: 3,
      name: "message",
      placeholder: "Escribe tu mensaje",
      type: "textarea",
      errorMessage: " El mensaje debe tener entre 10 y 200 caracteres",
      label: "Mensaje",
      required: true,
    },
  ];
  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void => {
    setValues({ ...values, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setValues({
      name: data.get("name") as string,
      email: data.get("email") as string,
      message: data.get("message") as string,
    });
    validation(values);
  };

  const sendEmail = async (values: Values) => {
    let config = {
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}/contact`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { ...values, selectedIndexes },
    };
    try {
      const response = await axios(config);
      if (response.status === 200) {
        console.log(response.data);
        const { captchaIsOK, send } = response.data;
        if (!captchaIsOK) {
          setCaptchaKey(new Date().getTime().toString());
          setCaptchaError(true);
          console.log("The captcha is not correct");
        }
        if (send) {
          console.log("Message sent");
          /* clear message */
          setValues({
            name: "",
            email: "",
            message: "",
          });
          /* clear errors */
          setErrors({});
        }
        if (captchaIsOK) {
          setCaptchaError(false);
          setCaptchaSolved(true);

          router.replace("/gracias");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validation = (data: Values) => {
    let errors: Values = {};
    if (!data.name) {
      errors.name = "El nombre es obligatorio";
    } else if (!/^[a-zA-ZÀ-ÿ\s]{3,40}$/.test(data.name)) {
      errors.name = "El Nombre debe tener entre 10 y 40 caracteres y no contener números o símbolos";
    }
    if (!data.email) {
      errors.email = "El correo es obligatorio";
    } else if (!/[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$/.test(data.email)) {
      errors.email = "Debe de ser una dirección de correo válida";
    }
    if (!data.message) {
      errors.message = "El mensaje es obligatorio";
    } else if (data.message.length < 10 || data.message.length > 150) {
      errors.message = "El mensaje debe tener entre 10 y 150 caracteres";
    }
    if (Object.keys(errors).length === 0) {
      sendEmail(data);
    }
    /* setErrors */
    setErrors(errors);
  };

  return (
    <div className='py-5 px-7 xl:py-10 xl:px-14 bg-slate-200 rounded-3xl h-full'>
      <form onSubmit={handleSubmit} action='POST' className='group'>
        <div className='flex flex-col md:flex-row md:gap-6 justify-between'>
          <div className='md:w-1/2'>
            <div className='flex flex-col gap-4 pt-4'>
              <h1 className='text-secondary text-3xl lg:text-5xl font-bold '>Escríbenos</h1>
              <p className='text-gray-600 font-light w-5/6'>
                Ingresa tus datos de contacto así como tus dudas o comentarios y en breve uno de nuestros representantes se comunicará contigo.
              </p>
            </div>
            {inputs.map((input) => (
              <FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange} errors={errors[input.name]} />
            ))}
          </div>
          <Captcha captchaKey={captchaKey} onChange={setSelectedIndexes} />
        </div>
        <div className='flex justify-end h-4'>
          {captchaError ? <p className='text-red-600 pb-4'>The captcha is not correct, Please try Again </p> : <p className='text-red-600 pb-6'></p>}
        </div>

        <div className='flex justify-end'>
          <div className='inline-flex'>
            <button
              className='bg-secondary py-2 px-8 text-brandWhite rounded-full w-full mt-4 hover:bg-brandBlue-400 hover:scale-105 transition-all duration-150 will-change-transform disabled:bg-gray-400 disabled:text-gray-600'
              type='submit'
              disabled={selectedIndexes.length > 0 ? false : true}
            >
              Enviar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormContact;
