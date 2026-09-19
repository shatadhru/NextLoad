import React, { ReactNode } from 'react'
import { Toaster } from "@/components/ui/toast"


function Providor({children}:{children : ReactNode}) {
  return (
    <div>
            {/* // এখানে সকল প্রোভাইডর খাকবে  */}
<Toaster />
            
{children}
            
    </div>
  )
}

export default Providor
