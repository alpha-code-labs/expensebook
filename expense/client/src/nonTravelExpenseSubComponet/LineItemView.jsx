import { categoryIcons } from "../assets/icon";
import Button1 from "../Components/common/Button1";
import { totalAmountKeys } from "../utils/data/keyList";
import { titleCase } from "../utils/handyFunctions";

export function LineItemView({ index, lineItem, handleEdit, handleDelete, isUploading, active }) {
    const excludedKeys = ['isMultiCurrency', 'Category Name', 'expenseLineId', 'Currency', 'billImageUrl', 'group', 'expenseLineAllocation', 'multiCurrencyDetails', 'lineItemStatus', 'lineItemId', '_id'];
  
    
    return (
      <div className="flex flex-col justify-between h-screen overflow-y-auto scrollbar-hide ">
        <div className="sticky top-0 bg-white z-20 w-full flex items-center h-12 px-4 border-dashed  border-y border-slate-300 py-4">
          <div className="flex items-center justify-center gap-2">
            <div className="bg-slate-100 p-2 rounded-full">
              <img src={categoryIcons[lineItem?.['Category Name']]} className="w-4 h-4 rounded-full" />
            </div>
            <p>{index + 1}. {lineItem?.['Category Name']}</p>
          </div>
        </div>
  
        <div className="px-4">
          {lineItem?.expenseLineAllocation?.map((allocation, i) => (
            <div key={i} className="w-full min-h-[52px]">
              <div className="text-zinc-600 text-sm font-cabin capitalize">{allocation.headerName}</div>
              <div className="w-full h-12 bg-white flex items-center border border-neutral-300 rounded-md">
                <div className="text-neutral-700 w-full h-full text-sm font-cabin px-6 py-2">{allocation.headerValue}</div>
              </div>
            </div>
          ))}
        </div>
  
        <div className="w-full flex flex-col items-start py-4 px-4 gap-y-4">
          {Object.entries(lineItem).map(([key, value]) => (
            !excludedKeys.includes(key) && (
              <div key={key} className="w-full min-h-[52px]">
                {key !== 'Currency' && <div className="text-zinc-600 text-sm font-cabin">{titleCase(key)}</div>}
                <div className="w-full h-[48px] bg-white flex items-center border border-neutral-300 rounded-md">
                  <div className="text-neutral-700 w-full h-10 text-sm font-cabin px-6 py-2">
                    {totalAmountKeys.includes(key)
                      ? `${lineItem['Currency']?.shortName} ${value}`
                      : `${key === 'group' ? value?.group : value}`}
                  </div>
                </div>
                {totalAmountKeys.includes(key) && (lineItem?.multiCurrencyDetails?.convertedAmount > (lineItem?.group?.limit || 0)) && (
                  <div className="w-[200px] text-xs text-yellow-600 font-cabin line-clamp-2">{lineItem?.group?.message}</div>
                )}
              </div>
            )
          ))}
  
          {lineItem?.multiCurrencyDetails && (
            <div className="px-4 mb-3">
              <div className="min-w-[200px] w-full h-auto flex flex-col gap-2">
                <div className="text-zinc-600 text-sm font-cabin">Converted Amount Details:</div>
                <div className="w-full h-full text-sm font-cabin border border-neutral-300 rounded-md">
                  <div className="sm:px-6 px-4 py-2 flex sm:flex-row flex-col justify-between bg-slate-100 rounded-md">
                    <div className="text-[16px] font-semibold text-neutral-600">Total Amount</div>
                    <div className="text-neutral-600">{lineItem?.multiCurrencyDetails?.defaultCurrency} {lineItem?.multiCurrencyDetails?.convertedAmount?.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
  
        <div className="sticky bottom-0 bg-white flex flex-row gap-4 items-center px-4 py-2 border-t border-t-slate-300 ">
          <Button1 text="Edit" disabled={isUploading} loading={isUploading} active={active?.edit?.id === lineItem?.lineItemId && active?.edit?.visible} onClick={() => handleEdit(lineItem?.lineItemId, lineItem?.['Category Name'])} />
          <Button1 text="Delete" disabled={isUploading} loading={isUploading} active={active?.delete?.id === lineItem?.lineItemId && active?.delete?.visible} onClick={() => handleDelete(lineItem?.lineItemId)} />
        </div>
      </div>
    );
  }