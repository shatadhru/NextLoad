import React from 'react'
import { Spinner } from '../ui/spinner'

function Loading() {
  return (
    <div>
        <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    </div>
  )
}

export default Loading
