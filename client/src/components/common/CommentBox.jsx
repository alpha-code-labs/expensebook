export default function ({ title = 'Write your Comment', onchange, value, error}) {

    return (<div className="px-4 pt-2">
        <p className="font-cabin text-start text-sm text-neutral-900 mb-2">{title}</p>
        <div className={`w-full  mt-2 border ${error?.set? 'border-red-400' : 'border-gray-200' } rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600`}>
            <div className="px-4 py-2 bg-white rounded-lg dark:bg-gray-800">
                <label htmlFor="comment" className="sr-only">Your comment</label>
                <textarea id="comment" value={value} onChange={(e)=>onchange(e)} rows="3" className="focus-visible:outline-0 w-full px-0 text-sm text-neutral-700 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write a comment..." required >
                </textarea>
            </div>
        </div>
    </div>
    )
}