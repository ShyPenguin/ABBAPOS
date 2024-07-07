import { useCallback, useRef, useState, useEffect } from "react";
import { downArrow, upArrow } from "../assets/icons";

function CustomDropdown({
  selectedRecord,
  setSelectedRecord,
  query,
  setQuery,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  data,
  status,
  error,
  frontendError,
  setFrontendError,
  type,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleText = (e) => {
    setQuery(e.target.value);
    setSelectedRecord(null);
  };

  const handleOptionClick = (record) => {
    setSelectedRecord(record);
    setQuery(record.name);
    toggleDropdown();
    setFrontendError("");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Click occurred outside the dropdown, so close it
      setIsOpen(false);
      if (!selectedRecord) {
        setQuery("");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const intObserver = useRef();
  const lastPostRef = useCallback(
    (entry) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (entry) intObserver.current.observe(entry);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (status === "error")
    return <p className="text-center text-abbaRed">Error: {error.message}</p>;

  const content = data?.pages.map((pg) => {
    return pg.results.map((record, i) => {
      return (
        <p
          className="text-primary z-10 pl-[15px] bg-white hover:bg-abbaGreen hover:text-white"
          onClick={() => handleOptionClick(record)}
          key={record.id}
          id={`custom-drop-down-record-${record.id}`}
          ref={pg.results.length === i + 1 ? lastPostRef : null}
        >
          {record.name}
        </p>
      );
    });
  });
  return (
    <div
      className="w-full flex z-[1000] flex-col cursor-pointer relative"
      ref={dropdownRef}
      id="custom-drop-down"
    >
      <div
        className={`input-box w-full font-golos ${
          frontendError && "border-abbaRed"
        }`}
        onClick={toggleDropdown}
      >
        <input
          className={`input-field px-[15px] ${
            selectedRecord && "placeholder-primary"
          }`}
          onChange={handleText}
          placeholder={
            selectedRecord ? selectedRecord.name : `Select a ${type}`
          }
          defaultValue={
            selectedRecord ? selectedRecord.name : `Select a ${type}`
          }
          value={query}
          id="custom-drop-down-input"
        />
        <img
          src={isOpen ? upArrow : downArrow}
          className="absolute top-[20px] right-[16px]"
        />
      </div>
      {isOpen && (
        <div className="z-10 absolute top-[48px] w-full max-h-[100px] overflow-y-auto border-solid border-black border-[1px] shadow-2xl">
          {data &&
            (data.pages[0].results.length > 0 ? (
              <div className="flex flex-col">{content}</div>
            ) : (
              <p className="z-10 pl-[15px] bg-white text-primary">
                There's no data.
              </p>
            ))}
          {isFetchingNextPage && (
            <p className="z-10 pl-[15px] bg-white text-primary">
              Loading More Data...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
