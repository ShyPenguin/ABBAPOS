import { searchIcon } from "../assets/icons";

function SearchBar({ q, setQ }) {
  const handleOnClick = () => {
    setQ(q);
  };

  const handleOnEnter = (e) => {
    if (e.key === "Enter") {
      // Call the handleOnClick function when Enter key is pressed
      handleOnClick();
    }
  };
  return (
    <div
      className="input-box card-gray border-none w-full h-[44px]"
      id="search-bar"
    >
      <input
        className="input-field bg-slate-50 px-[20px]"
        placeholder="Search for item or category"
        id="search-field"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={handleOnEnter}
      />
      <img
        src={searchIcon}
        alt="search"
        className="absolute top-[11px] right-[12px]"
        onClick={handleOnClick}
      />
    </div>
  );
}

export default SearchBar;
