export function TableLayout ({children}){ 

    return (
        <div className="overflow-x-auto mx-4 mb-4 capitalize text-neutral-700 text-base">
        <div className="min-w-max scrollbar-hide">
          <table className="min-w-full bg-white">
           {children}
          </table>
        </div>
      </div>
    )
    
  }