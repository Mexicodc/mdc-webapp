import clsx from "clsx";
import Image from "next/image";
import TimelineCheckmark from "./TimelineCheckmark";
import ImgLaptop from "../../public/laptop.jpg";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Colors, SectionData } from "../../lib/data/SectionTimeLineData";

const ColorSchema = Object.freeze({
  dark: Symbol("dark"),
  light: Symbol("light"),
});
// define this color as ENUMS in typescript TropicalBlue | MintGreen | Bright Green | secondary

interface SectionTimeLineProps {
  ColorSchemaDark: boolean;
  layoutLeft: boolean;
  colorClass?: Colors; //TropicalBlue | MintGreen | Bright Green | secondary
  MainImage: { src: string; alt: string };
  link: { slug: string; text: string };
  excerpt: string;
  title: string;
  sideImage: { src: string; alt: string };
}

function SectionTimeline({
  ColorSchemaDark = false,
  layoutLeft = false,
  colorClass = Colors.secondary,
  MainImage = { src: ImgLaptop, alt: "text alt" },
  link = { slug: "#", text: "Dommy route" },
  excerpt = "Lorem ipsum dolor sit amet",
  title = "title",
  sideImage = { src: "", alt: "" },
}: SectionData): JSX.Element {
  const [isInViewport, setisInViewport] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const articleCurr = articleRef.current;
      const rect = articleCurr!.getBoundingClientRect();
      const rectY = articleCurr!.getBoundingClientRect().y;
      const condition =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth);

      setisInViewport(condition || rectY <= 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const renderlayout = layoutLeft ? (
    <section className={`py-4 md:py-8  ${ColorSchemaDark ? "" : "bg-white text-gray-900"}`}>
      <div ref={articleRef} className='mdc-ui-container flex flex-col-reverse gap-4 md:gap-8 md:flex-row '>
        <div
          className={`md:w-1/2 flex flex-col md:items-end md:justify-center py-4 lg:text-lg  ${
            isInViewport ? "animate-FadeInSlidein" : "animate-FadeOutSlideout"
          }   `}
        >
          <h2
            className={clsx("font-bold text-4xl mb-8 capitalize", {
              "text-secondary": colorClass === Colors.secondary,
              "text-tropicalBlue": colorClass === Colors.TropicalBlue,
              "text-mintGreen": colorClass === Colors.MintGreen,
              "text-brightGreen": colorClass === Colors.BrightGreen,
            })}
          >
            {title}
          </h2>
          <p className='max-w-prose md:text-right mb-8'>{excerpt}</p>
          <Link href={link.slug}>
            <a
              className={clsx(
                "place-self-start md:place-self-auto py-2 px-10 rounded-full text-bg_primary uppercase hover:scale-[.98] hover:contrast-150 transition-all",
                {
                  "hover:bg-secondary bg-secondary": colorClass === Colors.secondary,
                  "hover:bg-tropicalBlue bg-tropicalBlue": colorClass === Colors.TropicalBlue,
                  "hover:bg-mintGreen bg-mintGreen": colorClass === Colors.MintGreen,
                  "hover:bg-brightGreen bg-brightGreen": colorClass === Colors.BrightGreen,
                }
              )}
            >
              <span className={` ${ColorSchemaDark ? "text-gray-900" : "text-brandWhite"}  `}>{link.text}</span>
            </a>
          </Link>
        </div>
        <TimelineCheckmark bgColor={`bg-${colorClass}`} />
        <div className={`md:w-1/2 opacity-0 ${isInViewport ? "animDelay animate-FadeInSlidein " : " animate-FadeOutSlideout "}`}>
          <Image src={MainImage.src} alt={MainImage.alt}></Image>
        </div>
      </div>
    </section>
  ) : (
    <section className={`py-4 md:py-8 ${ColorSchemaDark ? "" : "bg-white text-gray-900"}`}>
      <div
        ref={articleRef}
        className={`mdc-ui-container flex flex-col gap-4 md:gap-8 md:flex-row lg:text-lg ${
          isInViewport ? "animate-FadeInSlidein" : "animate-FadeOutSlideout"
        } `}
      >
        <div className=' md:w-1/2 relative'>
          <Image src={MainImage.src} alt={MainImage.alt}></Image>
          {sideImage.src ? (
            <div className='absolute top-[7%] left-[15%] w-[25%]'>
              <Image src={sideImage.src} alt={sideImage.alt}></Image>
            </div>
          ) : null}
        </div>
        <TimelineCheckmark
          bgColor={clsx({
            "bg-secondary": colorClass === Colors.secondary,
            "bg-tropicalBlue": colorClass === Colors.TropicalBlue,
            "bg-mintGreen": colorClass === Colors.MintGreen,
            "bg-brightGreen": colorClass === Colors.BrightGreen,
          })}
        />
        <div className='md:w-1/2 flex flex-col md:items-start md:justify-center'>
          <h2 className={`font-bold text-4xl mb-8 capitalize text-${colorClass} `}>{title}</h2>
          <p className='max-w-prose md:text-left mb-8'>{excerpt}</p>
          <Link href={link.slug}>
            <a
              className={`place-self-start py-2 px-10 bg-${colorClass}  rounded-full text-brandWhite uppercase hover:bg-${colorClass} hover:scale-[.98] hover:contrast-150 transition-all`}
            >
              <span className={` ${ColorSchemaDark ? "text-gray-900" : "text-brandWhite"}  `}>{link.text}</span>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
  return renderlayout;
}

export default SectionTimeline;