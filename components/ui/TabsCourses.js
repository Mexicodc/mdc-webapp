import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import CardsCourse from "./CardCourse";
import { data, getSubcategoryByName, getSubcategoriesNames } from "../helpers/library";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation } from "swiper";

function TabsCarousel() {
  const subcategoriesnames = getSubcategoriesNames(data);
  const allSubcategories = subcategoriesnames.map((subcategoryname) => getSubcategoryByName(subcategoryname, data));
  // all courses by subcategory
  const allCoursesBySubcategory = allSubcategories.map((subcategory) => subcategory.courses);

  return (
    <Tab.Group>
      <Tab.List className='mdc-ui-container flex flex-wrap gap-4 justify-center items-center my-12'>
        {subcategoriesnames.map((categoryName, index) => (
          <Tab as={Fragment} key={index}>
            {({ selected }) => (
              <button
                key={index}
                className={`py-1 px-6 rounded-full uppercase ${
                  selected ? "bg-brandBlue-100 text-gray-900" : "border-2 border-brandBlue-700 text-brandBlue-700"
                }`}
              >
                {categoryName}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {/* Tab.Panels in array and CardCourse in element in the array  */}
        {allCoursesBySubcategory.map((courses, index) => (
          <Tab.Panel key={index + "courses"}>
            {
              <div className='w-full flex flex-shrink-0 gap-8 justify-center p-16'>
                <Swiper
                  slidesPerView={1}
                  spaceBetween={10}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={true}
                  modules={[Pagination, Navigation]}
                  centerInsufficientSlides={true}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                    },
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 10,
                      navigation: true,
                    },
                    1280: {
                      slidesPerView: 4,
                      spaceBetween: 10,
                    },
                  }}
                  className='swiper'
                >
                  {courses.map((course, index) => (
                    <SwiperSlide key={index + course.identifier.courseNumber + course.identifier.prefix} className='swiper-slide'>
                      <CardsCourse
                        key={index + course.subcategory.skuPrefix}
                        coursename={course.title}
                        duration={course.duration}
                        //get the amount of lessons in the al the modules
                        numlessons={course.modules.reduce((acc, module) => acc + module.lessons.length, 0)}
                        numtopics={course.topics.length}
                        thumbnail={course.thumbnail.src}
                        thumbnailAlt={course.thumbnail.alt}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            }
          </Tab.Panel>
        ))}
        <Tab.Panel>
          <p>content1</p>
        </Tab.Panel>
        <Tab.Panel>
          <p>content2</p>
        </Tab.Panel>
        <Tab.Panel>
          <p>content3</p>
        </Tab.Panel>
        <Tab.Panel>
          <p>content4</p>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

export default TabsCarousel;
