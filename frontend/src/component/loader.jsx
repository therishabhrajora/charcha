function Loader() {
  return (
    <div className="flex justify-center items-center h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-4 
        border-light-accent dark:border-dark-accent"
      ></div>
      <span className="ml-3 text-light-accent dark:text-dark-accent font-semibold">
        Loading...
      </span>
    </div>
  );
}

export default Loader;
