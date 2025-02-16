export default function NotAuthorized() {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold text-red-600">403 - Access Denied</h1>
        <p className="text-lg mt-4">You do not have permission to view this page.</p>
        <a href="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Go to Home
        </a>
      </div>
    );
  }
  