/* eslint-disable no-unreachable */
import React from "react";
import { categoryIcons } from "../assets/icon";
import Button1 from "../components/common/Button1";
import {
  camelCaseToTitleCase,
  rearrangeKeyForLineItem,
} from "../utils/handyFunctions";
import { lineItems } from "../utils/dummyData";
import { StatusBox } from "../components/common/TinyComponent";

export function LineItemView({
  expenseHeaderStatus,
  isUploading,
  active,
  flagToOpen,
  expenseHeaderId,
  lineItem,
  index,
  newExpenseReport,
  handleEdit,
  handleDeleteLineItem,
}) {
  const excludedKeys = [
    "isMultiCurrency",
    "convertedAmountDetails",
    "isPersonalExpense",
    "Tax Amount",
    "personalExpenseAmount",
    "policyValidation",
    "Category Name",
    "expenseLineId",
    "billImageUrl",
    "group",
    "expenseLineAllocation",
    "allocations",
    "multiCurrencyDetails",
    "lineItemStatus",
    "lineItemId",
    "_id",
    "approvers",
  ];
  const includedKeys = [
    "Total Fair",
    "Total Fare",
    "personalExpenseAmount",
    "Tax Amount",
    "Total Amount",
    "Subscription Cost",
    "Cost",
    "Premium Cost",
  ];
  const totalAmountKeys = includedKeys.filter(
    (key) => key !== "personalExpenseAmount"
  );

  const arrangedItems = rearrangeKeyForLineItem(lineItem, includedKeys);
  console.log("arranged lineitem", arrangedItems);
  return (
    <div className="flex justify-between flex-col h-[600px] sm:h-screen ">
      <div className="w-full flex-row   overflow-y-auto scrollbar-hide">
        <div className="sticky top-0 bg-white z-20 w-full flex justify-between flex-row items-center h-12 px-4 border-dashed  border-y border-slate-300 py-4">
          <div className="flex items-center justify-center gap-2">
            <div className="bg-slate-100 p-2 rounded-full">
              <img
                src={categoryIcons[arrangedItems?.["Category Name"]]}
                className="w-4 h-4 rounded-full"
              />
            </div>
            <p>
              {index + 1}. {arrangedItems?.["Category Name"]}
            </p>
          </div>

          <div>
            <StatusBox status={arrangedItems?.lineItemStatus} />
          </div>
        </div>

        <div className="pb-4 px-4 flex flex-wrap items-center justify-evenly border-b border-slate-300">
          <p className="text-start w-full  px-2 py-2 text-base text-neutral-700 font-inter">
            Allocations
          </p>
          {arrangedItems?.allocations
            ? arrangedItems?.allocations?.map((allocation, index) => (
                <div key={index} className="min-w-[200px] min-h-[52px] ">
                  <div className="text-zinc-600 text-sm font-cabin capitalize py-1">
                    {allocation.headerName}
                  </div>
                  <div className="w-full h-12 bg-white items-center flex border border-neutral-300 rounded-md">
                    <div>
                      <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                        {allocation.headerValue}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : ""}
        </div>
        <div>
          {Object.entries(arrangedItems)
            .filter(
              ([key, value]) =>
                !excludedKeys.includes(key) &&
                !includedKeys.includes(key) &&
                value !== null
            ).map(([key, value]) => {
              if (key === "Currency" && value && typeof value === "object") {
                const currencyShortName = value.shortName;
                return includedKeys.map((includedKey) => {
                  if (arrangedItems[includedKey]) {
                    return (
                      <div key={includedKey} className=" w-full h-fit px-4 ">
                        <p className="capitalize text-zinc-600 truncate whitespace-nowrap text-sm font-normal font-cabin pb-1">{`${camelCaseToTitleCase(
                          includedKey
                        )}`}</p>
                        <div className="border rounded-md inline-flex justify-start items-center h-[48px] w-full border-slate-300 text-neutral-700 truncate text-sm font-normal font-cabin px-4 py-2">
                          <p>
                            {currencyShortName}{" "}
                            {String(arrangedItems[includedKey])}
                          </p>
                        </div>
                        {/* Check for 'convertedAmountDetails' and display its amount */}
                        <div>
                          {arrangedItems.convertedAmountDetails &&
                            !["Tax Amount", "personalExpenseAmount"].includes(
                              includedKey
                            ) && (
                              <p className=" text-sm text-neutral-600  pl-2 ">
                                {arrangedItems.convertedAmountDetails.amount}
                                {`Amount in ${arrangedItems.convertedAmountDetails?.defaultCurrencyName} ${arrangedItems.convertedAmountDetails?.convertedTotalAmount} | 1 ${arrangedItems.convertedAmountDetails?.convertedCurrencyName} = ${arrangedItems.convertedAmountDetails?.defaultCurrencyName} ${arrangedItems.convertedAmountDetails?.conversionRate}`}
                              </p>
                            )}
                          {arrangedItems.convertedAmountDetails &&
                            !["Tax Amount", ...totalAmountKeys].includes(
                              includedKey
                            ) && (
                              <p className=" text-sm text-neutral-600  pl-2 ">
                                {arrangedItems.convertedAmountDetails.amount}
                                {`Amount in ${arrangedItems.convertedAmountDetails?.defaultCurrencyName} ${arrangedItems.convertedAmountDetails?.convertedPersonalAmount} | 1 ${arrangedItems.convertedAmountDetails?.convertedCurrencyName} = ${arrangedItems.convertedAmountDetails?.defaultCurrencyName} ${arrangedItems.convertedAmountDetails?.conversionRate}`}
                              </p>
                            )}
                          {arrangedItems?.policyValidation[0]?.greenFlag ===
                            false &&
                            !["Tax Amount", "personalExpenseAmount"].includes(
                              includedKey
                            ) && (
                              <p className="text-xs  pl-2  text-yellow-600 ">{`Expense exceeds the allowed limit of ${arrangedItems?.policyValidation[0]?.currencyName} ${arrangedItems?.policyValidation[0]?.amountAllowed}`}</p>
                            )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                });
              }
              
              return (
                <div key={key} className="w-full h-[84px] px-4 ">
                  <p className="capitalize text-zinc-600 truncate whitespace-nowrap text-sm font-normal font-cabin pb-1">
                    {camelCaseToTitleCase(key)}
                  </p>
                  <div className="border rounded-md inline-flex justify-start items-center h-[48px] w-full border-slate-300 text-neutral-700 truncate text-sm font-normal font-cabin px-4 py-2">
                    <p>{String(value)}</p>
                  </div>
                </div>
              );
            })
            .flat()}
            
                   {lineItem?.isPersonalExpense &&
                   <div className="w-full h-[84px] px-4 ">
                   <p className="capitalize text-zinc-600 truncate whitespace-nowrap text-sm font-normal font-cabin pb-1">
                     {camelCaseToTitleCase("Net Reimbursable")}
                   </p>
                   <div className="border rounded-md inline-flex justify-start items-center h-[48px] w-full border-slate-300 text-neutral-700 truncate text-sm font-normal font-cabin px-4 py-2">
                     <p>{String(`${lineItem?.Currency?.shortName} ${lineItem?.personalExpenseAmount}`)}</p>
                     
                   </div>
                   {lineItem?.isMultiCurrency && <div className=" text-sm text-neutral-600  pl-2 "> {`Amount in ${lineItem.convertedAmountDetails?.defaultCurrencyName} ${lineItem.convertedAmountDetails?.convertedTotalAmount} | 1 ${lineItem.convertedAmountDetails?.convertedCurrencyName} = ${lineItem.convertedAmountDetails?.defaultCurrencyName} ${lineItem.convertedAmountDetails?.conversionRate}`}</div>}
                 </div>}
        </div>
      </div>

     {<div className=" bottom-0 p-2 bg-white border-y  border-slate-300">
         <div className="w-full flex sm:justify-start justify-center gap-4">
          <Button1
            disabled={!["draft", "rejected"].includes(
              expenseHeaderStatus
            )}
            text="Edit"
            onClick={() => handleEdit(lineItem)}
          />
          <Button1
            disabled={!["draft", "rejected"].includes(
              expenseHeaderStatus
            )}
            loading={false}
            text="Delete"
            onClick={() => handleDeleteLineItem()}
          />
        </div>
      </div>}
    </div>
  );
}
