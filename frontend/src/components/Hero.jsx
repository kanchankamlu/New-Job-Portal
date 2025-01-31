import React, { useContext ,useRef} from 'react'
import { assets } from '../assets/assets'
import './Style.css'
import { AppContext } from '../context/AppContext'

const Hero = () => {

  const {setSearchFilter, setIsSearched} = useContext(AppContext)

  const titleRef = useRef(null)
  const locationRef = useRef(null)

  const onSearch = () => {
    setSearchFilter({
      title:titleRef.current.value,
      location:locationRef.current.value
    })
    setIsSearched(true)
    console.log({
      title:titleRef.current.value,
      location:locationRef.current.value
  })

  }

                  
  return (
    <div className='container 2xl:px-20 mx-auto my-10 '>
      <div className='Hero text-black py-16 text-center mx-2 rounder-xl'>
        <h2 className='text-2xl md-text-3xl lg:text-4xl font font-medium mb-4'>Your ideal job awaits, start the search</h2>
        <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5 '>Your Next Big Career Move Starts Right Here - Explore The Best Job Opportunities And Take the first Step Toword Your Future..! </p>
        <div className='flex item-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto '>
          <div className='flex items-center'>
            <img className='icon h-4 sm:h-5 ' src={assets.search_icon} alt="" />
            <input type="text" placeholder='Search for job'
              className='max-sm:text-xs p-2 rounded outline-none w-full'
              ref={titleRef} />
          </div>
          <div className='flex items-center'>
            <img className='icon h-4 sm:h-5 ' src={assets.location_icon} alt="" />
            <input type="text" placeholder='Location'
              className='max-sm:text-xs p-2 rounded outline-none w-full'
              ref={locationRef} />
            <button onClick={onSearch} className='btn-shw bg-purple-700 px-6 py-2 rounded text-white m-1'>Search</button>
          </div>
        </div>
      </div>

      <div className='border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex'>
        <div className='flex justify-center gap-10 lg:gap-16 flex-wrap '>
          <p className='font-medium'>Trusted by</p>
          <img className='h-6' src= {assets.microsoft_logo}  alt="" />
          <img className='h-6' src= {assets.walmart_logo}  alt="" />
          <img className='h-6' src= {assets.adobe_logo}  alt="" />
          <img className='h-6' src= {assets.accenture_logo}  alt="" />
          <img className='h-6' src= {assets.samsung_logo}  alt="" />
          <img className='h-6' src= {assets.amazon_logo}  alt="" />
        </div>
      </div>
    </div>
  )
}

export default Hero