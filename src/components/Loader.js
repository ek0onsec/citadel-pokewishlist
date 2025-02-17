export default function Loader() {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-30 z-50">
            <img src="/logo.png" alt="Loading..." className="h-22 w-auto animate-spin" />
        </div>
    );
}
