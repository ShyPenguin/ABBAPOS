import React from "react";

function formatWithCommas(number) {
  return number.toLocaleString();
}

function Calculator({ displayContent, setDisplayContent }) {
  const handleButtonClick = (value) => {
    if (value === "X") {
      setDisplayContent((prevContent) => {
        if (prevContent === "0") {
          return "0"; // Prevent removing the last "0"
        } else {
          const strippedContent = prevContent.replace(/,/g, "");
          const newValue = strippedContent.slice(0, -1);
          return formatWithCommas(parseFloat(newValue) || 0);
        }
      });
    } else if (
      value === "." &&
      !displayContent.includes(".") &&
      displayContent.length <= 13
    ) {
      // Allow one decimal point, limit to 12 characters
      setDisplayContent((prevContent) => prevContent + value);
    } else if (value === "0" && displayContent === "0") {
      // Prevent leading zeros
      setDisplayContent("0");
    } else if (value.match(/[0-9]/) && displayContent.length < 14) {
      // Check for maximum nine digits before and two digits after the decimal point
      const parts = displayContent.split(".");
      if (parts.length === 1 && parts[0].length < 11) {
        // No decimal point, allow up to 9 digits before it
        const updatedContent = displayContent.replace(/,/g, "");
        const newValue = updatedContent + value;
        if (newValue.length <= 14) {
          setDisplayContent(formatWithCommas(parseFloat(newValue)));
        }
      } else if (parts.length === 2) {
        const integerPart = parts[0].replace(/,/g, "");
        const decimalPart = parts[1] || "";
        if (integerPart.length <= 14 && decimalPart.length < 2) {
          // Has a decimal point, allow up to 2 digits after it
          const updatedContent = displayContent.replace(/,/g, "");
          const newValue = updatedContent + value;
          if (newValue.length <= 14) {
            setDisplayContent(formatWithCommas(parseFloat(newValue)));
          }
        }
      }
    }
  };
  return (
    <div
      className="bg-gray-100 w-full h-full flex flex-col px-5 py-5 rounded-[5px] shadow-[-1px 1px 3px 1px rgba(33, 82, 115, 0.10)]"
      id="calculator"
    >
      <div className="w-full h-[87px] bg-white mb-6 border-solid border-[#215273] border- text-primary text-[50px] text-right font-semibold">
        {displayContent}
      </div>
      <div className="grid grid-cols-3 text-center border-solid">
        {Array.from("123456789.0X").map((value) => (
          <div
            key={value}
            className={`h-full border-2 border-blue-900 text-[40px] text-${
              value === "X" || value === "." ? "white" : "primary"
            } font-semibold cursor-pointer rounded-[3px] border-solid border-[1px] border-primary bg-${
              value === "X" || value === "." ? "primary" : "[#F9F8FD]"
            }`}
            onClick={() => handleButtonClick(value)}
            id={`calculator-${value}`}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calculator;
