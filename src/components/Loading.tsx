export default function Loading() {
    return <div className={`fixed inset-0 flex justify-center items-center h-screen bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg z-50`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 dark:border-teal-400 bg-transparent"></div>
    </div>
}