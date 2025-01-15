export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-t-4 border-primary-300 border-solid rounded-full animate-spin"></div>
        <p className="text-white text-lg">Cargando...</p>
      </div>
    </div>
  );
}
