import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Create({ departments }) {
    // ใช้ useForm hook สำหรับจัดการฟอร์ม
    const { data, setData, post, errors } = useForm({
        birth_date: '',
        first_name: '',
        last_name: '',
        gender: '',
        hire_date: '',
        department: '',
        photo: '',
    });

    // สถานะสำหรับแสดงข้อความเมื่อมีการบันทึกข้อมูลสำเร็จหรือเกิดข้อผิดพลาด
    const [successMessage, setSuccessMessage] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);

    // ฟังก์ชันสำหรับการส่งข้อมูลไปยัง Backend
    const handleSubmit = (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้าเมื่อกด submit

        // สร้าง FormData เพื่อส่งข้อมูลเป็น multipart/form-data
        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('gender', data.gender);
        formData.append('hire_date', data.hire_date);
        formData.append('birth_date', data.birth_date);
        formData.append('department', data.department);

        // ถ้ามีไฟล์รูปภาพ จะส่งไฟล์นั้นไปด้วย
        if (data.photo) {
            formData.append('photo', data.photo);
        }

        // ส่งข้อมูลไปยัง route 'employees.store'
        post(route('employees.store'), {
            data: formData,  // ส่งข้อมูลฟอร์มไปยังเซิร์ฟเวอร์
            headers: {
                'Content-Type': 'multipart/form-data',  // กำหนดประเภทของข้อมูลเป็น multipart/form-data เพื่อรองรับไฟล์อัปโหลด
            },
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "สำเร็จ!",
                    text: "เพิ่มพนักงานสำเร็จ!",
                });
                setSuccessMessage("Employee created successfully!");
            },
            onError: () => {
                setErrorMessage("An error occurred while creating employee. Please try again.");
                setTimeout(() => setErrorMessage(null), 3000);  // ลบข้อความแจ้งเตือนหลังจาก 3 วินาที
            }
        });
    };

    return (
        <AuthenticatedLayout>
            {/* Success/Error Messages */}
            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    {successMessage} {/* แสดงข้อความสำเร็จ */}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {errorMessage} {/* แสดงข้อความข้อผิดพลาด */}
                </div>
            )}
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Create Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter first name"
                        />
                        {errors.first_name && (
                            <span className="text-red-500 text-sm">{errors.first_name}</span>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter last name"
                        />
                        {errors.last_name && (
                            <span className="text-red-500 text-sm">{errors.last_name}</span>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                            Gender
                        </label>
                        <select
                            id="gender"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                        {errors.gender && (
                            <span className="text-red-500 text-sm">{errors.gender}</span>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birth_date">
                            Birth Date
                        </label>
                        <input
                            type="date"
                            value={data.birth_date}
                            onChange={(e) => setData('birth_date', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.birth_date && (
                            <span className="text-red-500 text-sm">{errors.birth_date}</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hire_date">
                            Hire Date
                        </label>
                        <input
                            type="date"
                            value={data.hire_date}
                            onChange={(e) => setData('hire_date', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.hire_date && (
                            <span className="text-red-500 text-sm">{errors.hire_date}</span>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dept_no">
                            Department
                        </label>
                        <select
                            value={data.dept_no}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(e) => {
                                const selectedDept = departments.find(dept => dept.dept_no === e.target.value);
                                setData({
                                    ...data,
                                    dept_no: e.target.value, // รหัสแผนก
                                    department: selectedDept ? selectedDept.dept_name : '', // ชื่อแผนก
                                });
                            }}
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.dept_no} value={dept.dept_no}>
                                    {dept.dept_name}
                                </option>
                            ))}
                        </select>
                        {errors.dept_no && (
                            <span className="text-red-500 text-sm">{errors.dept_no}</span>
                        )}
                    </div>
                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Photo:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('photo', e.target.files[0])} // อัปเดตค่า photo
                            className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.photo && <span className="text-red-500 text-sm">{errors.photo}</span>} {/* แสดงข้อผิดพลาด */}
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Create Employee
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};
