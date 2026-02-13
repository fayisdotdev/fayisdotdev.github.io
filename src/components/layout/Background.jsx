const Background = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
    <div
      className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "1s" }}
    ></div>
    <div
      className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "2s" }}
    ></div>
  </div>
);

export default Background;
