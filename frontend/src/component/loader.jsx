function Loader() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
      <span className="ml-3 text-green-600 dark:text-green-300 font-semibold">Loading...</span>
    </div>
  );
}

export default Loader;
