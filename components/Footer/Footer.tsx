import Image from 'next/image'
import Link from 'next/link'

import LogoFooter from '../../public/logoMDCfooter.png'

import * as CONSTANT from './Footer.constants'

export default function Footer() {
  const getdate = new Date()
  const year = getdate.getFullYear()

  return (
    <footer className="pb-6 lg:pb-0">
      <div className="mdc-ui-container flex flex-row flex-wrap justify-between mx-auto border-t-[1px] border-t-[#192641] sm:py-10 py-3">
        <div className="my-4 lg:my-0 flex justify-center lg:block lg:mt-4  w-full lg:w-1/4 justify-self-center">
          <Image alt="logo" src={LogoFooter} />
        </div>

        {CONSTANT.FooterLinks.map((footerlink, idx) => (
          <div
            key={footerlink.title + idx}
            className="flex flex-col my-4 min-w-[240px] md:min-w-[140px] "
          >
            <h1 className="font-bold text-lg mb-3"> {footerlink.title} </h1>
            <ul>
              {footerlink.links.map((link, index) => (
                <li
                  key={link.name + index}
                  className={`font-normal text-base text-brandWhite hover:text-secondary cursor-pointer ${
                    index === footerlink.links.length - 1 ? 'mb-0' : 'mb-2'
                  } `}
                >
                  <Link href={link.link}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <div className="mdc-ui-container flex justify-between mx-auto items-center md:flex-row flex-col border-t-[1px] border-t-[#192641] sm:py-10 py-3 ">
          <p className="font-normal text-center">{`Copyright @ ${year} Mexico Development Center. | Todos los derechos reservados.`}</p>
          <ul className="flex flex-row md:my-0 my-6" role="list">
            {CONSTANT.socialMedia.map(({ id, Icon, link, name }, idx) => {
              return (
                <li key={id}>
                  <a
                    className="  hover:text-accent text-secondary transition-colors duration-300"
                    href={link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="sr-only">{name}</span>
                    <Icon
                      className={`text-3xl hover:scale-105 ${
                        idx !== CONSTANT.socialMedia.length - 1 ? 'mr-6' : 'mr-0'
                      }`}
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </footer>
  )
}
