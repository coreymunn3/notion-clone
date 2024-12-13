"use client";

const BouncingLoader = () => {
  return (
    <div className="flex items-center space-x-2">
      <span
        className="inline-block w-4 h-4 rounded-full bg-slate-500 animate-bounce"
        style={{ animationDelay: "0s" }}
      ></span>
      <span
        className="inline-block w-4 h-4 rounded-full bg-slate-500 animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></span>
      <span
        className="inline-block w-4 h-4 rounded-full bg-slate-500 animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></span>
    </div>
  );
};

export default BouncingLoader;
