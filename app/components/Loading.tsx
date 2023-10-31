export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="flex justify-center space-x-3">
        <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
        <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full animation-delay-200"></div>
        <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full animation-delay-400"></div>
      </div>
    </div>
  );
}
