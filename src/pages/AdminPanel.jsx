import { User, FilmIcon, IdCardLanyard } from "lucide-react"

export default function AdminPanel() {

    return (
            <div className="flex w-full h-screen text-white">
                <div className="max-w-[300px] w-full h-screen bg-gray-800 justify-center items-center p-5">
                    <div className="flex flex-col justify-between">
                        <a className="flex items-center text-left mt-3 hover: cursor-pointer">
                            <FilmIcon className="inline me-2 mb-1 gap-1" />
                            <span className="">Movies</span>
                        </a>
                        <a className="flex items-center text-left mt-3 hover: cursor-pointer">
                            <FilmIcon className="inline me-2 mb-1 gap-1" />
                            <span className="">Upcoming Movies</span>
                        </a>
                        <a className="flex items-center text-left mt-3 hover: cursor-pointer">
                            <IdCardLanyard className="inline me-2 mb-1 gap-1" />
                            <span className="">Employees</span>
                        </a>
                        <a className="flex items-center text-left mt-3 hover: cursor-pointer">
                            <User className="inline me-2 mb-1 gap-1" />
                            <span className="">Customers</span>
                        </a>
                    </div>
                </div>
            </div>
    )
}