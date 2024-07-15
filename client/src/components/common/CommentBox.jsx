export default function ({ title = 'Write your Comment', onchange, value, error}) {

    return (<div>
        <p className="font-cabin text-sm text-neutral-600 mb-2">{title}</p>
        <div className={`w-full mb-4 border ${error?.set? 'border-red-400' : 'border-gray-200' } rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600`}>
            <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                <label htmlFor="comment" className="sr-only">Your comment</label>
                <textarea id="comment" value={value} onChange={(e)=>onchange(e)} rows="3" className="focus-visible:outline-0 w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write a comment..." required >
                </textarea>
            </div>
        </div>
    </div>
    )
}