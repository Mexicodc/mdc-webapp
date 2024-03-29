import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { RiCloseCircleLine } from 'react-icons/ri'
import clsx from 'clsx'

interface BtnThemeProps {
  btnTheme: 'btnRingGreen' | 'btnDark' | 'btnBlue'
}
/**
 * ModalDemoReel
 * @example
 * <ModalDemoReel btnTheme='btnRingGreen' />
 * <ModalDemoReel btnTheme='btnDark' />
 * <ModalDemoReel btnTheme='btnBlue' />
 */
export default function ModalDemoReel({ btnTheme, ...props }: BtnThemeProps) {
  let [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <button
        className={clsx('uppercase rounded-full', {
          'bg-gray-900 py-2 px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:scale-[.98] hover:contrast-150 transition-all':
            btnTheme === 'btnDark',
          'border-2 border-accent text-accent py-2 px-8': btnTheme === 'btnRingGreen',
          'bg-secondary text-brandWhite py-2 px-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:scale-[.98] hover:contrast-150 transition-all':
            btnTheme === 'btnBlue'
        })}
        name="Open dialog"
        type="button"
        {...props}
        onClick={openModal}
      >
        Ver demo reel
      </button>
      <Transition appear as={Fragment} show={isOpen}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>
          <div className="fixed inset-0 bg-black/40 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full md:w-3/4 xl:w-7/12 2xl:8/12 transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all ">
                  <div className="flex justify-end">
                    <button
                      className="inline-flex relative justify-center rounded-t-md border border-transparent bg-black/80 px-4 py-2 text-sm font-medium text-brandWhite hover:bg-gray-900/80 focus:outline-none border-none "
                      type="button"
                      onClick={closeModal}
                    >
                      <RiCloseCircleLine className="text-2xl" />
                    </button>
                  </div>
                  <div className="aspect-video relative ">
                    <iframe
                      allow="autoplay; fullscreen; picture-in-picture"
                      height="100%"
                      src="https://player.vimeo.com/video/425231198?h=1f08b35af5"
                      width="100%"
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
