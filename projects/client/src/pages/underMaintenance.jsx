export default function UnderMaintenance() {
    return (
        <main className="grid min-h-full place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8">
            <div className="text-center">
                <div className="text-6xl" aria-hidden="true">🔧</div>
                <p className="mt-6 text-base font-semibold text-indigo-600">We'll be right back</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Gamepedia is under maintenance</h1>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    We're making some improvements to serve you better. Please check back in a little while.
                </p>
            </div>
        </main>
    )
}
