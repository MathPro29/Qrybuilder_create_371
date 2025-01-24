import { router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Index({ employees, query, order }) {
    const [search, setSearch] = useState(query || '');
    const [sortOrder, setSortOrder] = useState(order || 'asc'); // กำหนดสถานะของการเรียงลำดับ
    const [sortColumn, setSortColumn] = useState(''); // กำหนดคอลัมน์ที่เลือก
    const [sortDirection, setSortDirection] = useState('asc'); // กำหนดทิศทางการเรียงลำดับ

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/employees', { search, order: sortOrder });
    };

    const handleSort = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        router.get('/employees', { search, order: newOrder });
    };


    const resetFilters = () => {
        setSearch(''); // รีเซ็ตค่าการค้นหา
        setSortColumn(''); // รีเซ็ตคอลัมน์ที่เลือก
        setSortDirection('asc'); // ตั้งค่าการเรียงลำดับเป็นค่าเริ่มต้น
        router.get('/employees'); // โหลดข้อมูลใหม่โดยไม่มีฟิลเตอร์
    };


    const handlePagination = (url) => {
        router.get(url, { search, order: sortOrder });
    };

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <h1 className="mb-6 text-center text-2xl font-bold text-black">ค้นหาพนักงาน</h1>

                {/* ฟอร์มค้นหา */}
                <form onSubmit={handleSearch} className="mb-4 text-center">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded px-4 py-2 w-full sm:w-1/2 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="ค้นหาโดย ID ชื่อ นามสกุล หรือ วันเกิด"
                    />
                    <button
                        type="submit"
                        className="mt-2 sm:mt-0 sm:ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        ค้นหา
                    </button>

                    <button
                        onClick={resetFilters}
                        className="mt-2 sm:mt-0 sm:ml-2 border border-red-700 text-red-700 bg-transparent px-4 py-2 rounded hover:bg-red-700 hover:text-white transition duration-300 ease-in-out transform hover:scale-105"

                    >
                        ล้างข้อมูล
                    </button>
                </form>

                {/* ตารางข้อมูล */}
                {employees.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-300 shadow-md">
                                <thead className="bg-gray-400 text-white">
                                    <tr>
                                        <th
                                            className="cursor-pointer border border-gray-300 px-4 py-2"
                                            onClick={() => handleSort('emp_no')}
                                        >
                                            ID {sortColumn === 'emp_no' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="cursor-pointer border border-gray-300 px-4 py-2"
                                            onClick={() => handleSort('first_name')}
                                        >
                                            ชื่อ {sortColumn === 'first_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="cursor-pointer border border-gray-300 px-4 py-2"
                                            onClick={() => handleSort('last_name')}
                                        >
                                            นามสกุล {sortColumn === 'last_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="cursor-pointer border border-gray-300 px-4 py-2"
                                            onClick={() => handleSort('birth_date')}
                                        >
                                            วันเกิด {sortColumn === 'birth_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>

                                        <th
                                        className="cursor-pointer border border-gray-300 px-4 py-2"
                                        onClick={() => handleSort('photo')}
                                    >
                                        รูป{''}
                                        {sortColumn === 'birth_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.data.map((employee, index) => (
                                        <tr
                                            key={employee.emp_no}
                                            className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                                        >
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {employee.emp_no}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {employee.first_name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {employee.last_name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {employee.birth_date}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 flex justify-center items-center">
                                            {employee.photo ? (
                                                <img
                                                    src={`/storage/${employee.photo}`}
                                                    alt="Employee"
                                                    className="w-16 h-16 object-cover rounded-full"
                                                />
                                            ) : (
                                                'Lost Image' // แสดงข้อความเมื่อไม่มีภาพ
                                            )}
                                        </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 flex items-center justify-center space-x-2">
                            {employees.links.map((link, index) => (
                                <button
                                    key={index}
                                    className={`rounded px-4 py-2 ${link.active ? 'bg-red-500 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
                                    onClick={() => handlePagination(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                ></button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="mt-6 text-center text-lg text-red-500 font-bold italic">
                        Out of data
                    </div>
                )}
            </div>

            <div className='footer'>
                <footer>
                    hello
                </footer>
            </div>
        </AuthenticatedLayout>
    );
}
