export default function StaffDashboard() {
  return (
    <div className="min-h-screen bg-paper-white flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-card-white p-12 rounded-3xl shadow-xl border border-gold-start/20 max-w-2xl">
        <h1 className="text-5xl font-serif font-bold text-ruby-red mb-6">Staff Dashboard</h1>
        <div className="w-24 h-1 bg-gold-start/50 mx-auto mb-8 rounded-full"></div>
        <p className="text-2xl text-text-muted font-light italic mb-8">Coming Soon...</p>
        <p className="text-gray-500">We are crafting a dedicated experience for our staff.</p>
        <div className="mt-12">
            <a href="/" className="px-8 py-3 bg-ruby-red text-white rounded-full font-bold hover:bg-ruby-red/90 transition-all shadow-lg hover:shadow-xl">
                Return Home
            </a>
        </div>
      </div>
    </div>
  );
}
