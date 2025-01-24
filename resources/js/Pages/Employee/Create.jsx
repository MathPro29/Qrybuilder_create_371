// Import dependencies
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import Swal from "sweetalert2";


// Component สำหรับสร้างพนักงานใหม่
export default function Create({ departments }) {
    // ใช้ useForm hook สำหรับจัดการ state ของฟอร์ม
    const { data, setData, post, errors } = useForm({
        birth_date: '', // วันที่เกิด
        first_name: '', // ชื่อ
        last_name: '', // นามสกุล
        gender: '', // เพศ
        hire_date: '', // วันที่จ้างงาน
        department: '', // แผนก
        photo: '', // รูปภาพ
    });

    // สถานะสำหรับแสดงข้อความสำเร็จหรือข้อผิดพลาด
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);


    // ฟังก์ชันสำหรับส่งข้อมูลฟอร์มไปยัง backend
    const handleSubmit = (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บเมื่อกด submit

            // ตรวจสอบว่าข้อมูลครบหรือไม่
    if (!data.first_name || !data.last_name || !data.gender || !data.birth_date || !data.hire_date || !data.dept_no) {
        Swal.fire({
            icon: 'warning',
            title: 'กรอกข้อมูลไม่ครบถ้วน',
            text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            confirmButtonText: 'ดำเนินการต่อ',
        });
        return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
    }

        // สร้าง FormData เพื่อส่งข้อมูลแบบ multipart/form-data
        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('gender', data.gender);
        formData.append('birth_date', data.birth_date);
        formData.append('hire_date', data.hire_date);
        formData.append('department', data.department);

        // หากมีไฟล์รูปภาพ จะเพิ่มไฟล์ลงใน FormData
        if (data.photo) {
            formData.append('photo', data.photo);
        }

        // ส่งข้อมูลไปยัง backend ผ่าน route ที่กำหนดไว้
        post(route('employees.store'), {
            data: formData, // ส่งข้อมูลที่เตรียมไว้
            headers: {
                'Content-Type': 'multipart/form-data', // กำหนด header เป็น multipart/form-data
            },
            onSuccess: () => {
                // แสดงข้อความสำเร็จด้วย SweetAlert
                Swal.fire({
                    icon: "success",
                    title: "สำเร็จ!",
                    text: "พนักงานอยู่ในรายชื่อแล้ว",
                    confirmButtonText: 'ดำเนินการต่อ',
                });
                setSuccessMessage("Employee created successfully!"); // เก็บข้อความสำเร็จใน state
            },
            onError: (err) => {
                console.error("Error response:", err); // แสดงข้อผิดพลาดใน Console เพื่อช่วย Debug
                setErrorMessage("An error occurred while creating employee. Please try again.");
                // ลบข้อความข้อผิดพลาดหลังจาก 3 วินาที
                setTimeout(() => setErrorMessage(null), 3000);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            {/* แสดงข้อความสำเร็จหรือข้อผิดพลาด */}
            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    {successMessage} {/* ข้อความสำเร็จ */}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {errorMessage} {/* ข้อความข้อผิดพลาด */}
                </div>
            )}

            {/* ฟอร์มสำหรับสร้างพนักงาน */}
            <div className="container mx-auto my-8 p-6 max-w-lg bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                    Create Employee
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ช่องกรอกชื่อ */}
                    <div>
                        <label
                            htmlFor="first_name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            First Name
                        </label>
                        <input

                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter first name"
                        />
                        {errors.first_name && (
                            <p className="text-sm text-red-500 mt-1">{errors.first_name}</p>
                        )}
                    </div>

                    {/* ช่องกรอกนามสกุล */}
                    <div>
                        <label
                            htmlFor="last_name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Last Name
                        </label>
                        <input

                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter last name"
                        />
                        {errors.last_name && (
                            <p className="text-sm text-red-500 mt-1">{errors.last_name}</p>
                        )}
                    </div>

                    {/* ช่องเลือกเพศ */}
                    <div>
                        <label
                            htmlFor="gender"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Gender
                        </label>
                        <select

                            id="gender"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>
                                Select Gender
                            </option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                        {errors.gender && (
                            <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
                        )}
                    </div>

                    {/* ช่องกรอกวันเกิด */}
                    <div>
                        <label
                            htmlFor="birth_date"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Birth Date
                        </label>
                        <input
                            type="date"
                            value={data.birth_date}
                            onChange={(e) => setData('birth_date', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.birth_date && (
                            <p className="text-sm text-red-500 mt-1">{errors.birth_date}</p>
                        )}
                    </div>

                    {/* ช่องกรอกวันเข้าทำงาน */}
                    <div>
                        <label
                            htmlFor="hire_date"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Hire Date
                        </label>
                        <input
                            type="date"
                            value={data.hire_date}
                            onChange={(e) => setData('hire_date', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.hire_date && (
                            <p className="text-sm text-red-500 mt-1">{errors.hire_date}</p>
                        )}
                    </div>

                    {/* ช่องเลือกแผนก */}
                    <div>
                        <label
                            htmlFor="dept_no"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Department
                        </label>
                        <select

                            value={data.dept_no}
                            onChange={(e) => {
                                const selectedDept = departments.find(
                                    (dept) => dept.dept_no === e.target.value
                                );
                                setData({
                                    ...data,
                                    dept_no: e.target.value,
                                    department: selectedDept ? selectedDept.dept_name : '',
                                });
                            }}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>
                                Select Department
                            </option>
                            {departments.map((dept) => (
                                <option key={dept.dept_no} value={dept.dept_no}>
                                    {dept.dept_name}
                                </option>
                            ))}
                        </select>
                        {errors.dept_no && (
                            <p className="text-sm text-red-500 mt-1">{errors.dept_no}</p>
                        )}
                    </div>

                    {/* ช่องอัปโหลดรูปภาพ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Photo
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('photo', e.target.files[0])}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.photo && (
                            <p className="text-sm text-red-500 mt-1">{errors.photo}</p>
                        )}
                    </div>

                    {/* ปุ่ม Submit */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            + Create Employee
                        </button>

                    </div>
                </form>
            </div>

        </AuthenticatedLayout>
    );
};
