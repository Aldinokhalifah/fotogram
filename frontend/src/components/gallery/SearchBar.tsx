'use client'

import { useSearchUsers } from "@/hooks/useUser"
import { useDebounce } from "@/lib/handleDebounce"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SearchBar() {
    const [keyword, setKeyword] = useState('')
    const router = useRouter()
    const debouncedKeyword = useDebounce(keyword, 500)
    const {data: response, isPending} = useSearchUsers(debouncedKeyword)
    const users = response?.data ?? []

    const handleUserClick = (userId?: string) => {
        if (!userId) return

        setKeyword('')
        router.push(`/gallery?userId=${userId}`)
    }


    return (
        <div className="relative w-full max-w-sm">
            <label htmlFor="user-search" className="sr-only">Cari pengguna</label>
            <input
                id="user-search"
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Cari pengguna..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />

            {keyword && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    {isPending ? (
                        <p className="px-4 py-3 text-sm text-gray-500">Mencari pengguna...</p>
                    ) : users.length > 0 ? (
                        <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
                            {users.map((user) => (
                                <li key={user.id ?? user.username}>
                                    <button
                                        type="button"
                                        onClick={() => handleUserClick(user.id)}
                                        disabled={!user.id}
                                        className="flex w-full flex-col px-4 py-2.5 text-left transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                        <span className="text-xs text-gray-500">@{user.username}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="px-4 py-3 text-sm text-gray-500">Pengguna tidak ditemukan.</p>
                    )}
                </div>
            )}
        </div>
    )
}