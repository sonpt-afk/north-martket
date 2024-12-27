import React from 'react'

const Spinner = () => {
  return (
    <div className='fixed inset-0 bg-black z-10 flex items-center opacity-70 justify-center'>
      <div className="w-10 h-10 border-4 border-dashed border-gray-300 border-t-transparent rounded-full animate-spin "></div>
    </div>

  )
}

export default Spinner