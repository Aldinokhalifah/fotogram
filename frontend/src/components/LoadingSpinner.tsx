export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full" />
        </div>
    )
}