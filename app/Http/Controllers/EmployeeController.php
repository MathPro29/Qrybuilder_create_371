<?php

namespace App\Http\Controllers;


use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
        public function index(Request $request)
    {
        $query = $request->input('search'); // รับค่าจาก URL
        $order = $request->input('order', 'asc'); // รับการเรียงลำดับจาก URL (ค่า default คือ 'asc')

        $employees = DB::table('employees')
            ->where('emp_no', 'like', "%{$query}%")  // ค้นหาจาก ID
            ->orWhere('first_name', 'like', "%{$query}%")  // ค้นหาจาก first_name
            ->orWhere('last_name', 'like', "%{$query}%")  // ค้นหาจาก last_name
            ->orderBy('emp_no', $order) // การเรียงลำดับตาม emp_no
            ->paginate(10);

        return Inertia::render('Employee/Index', [
            'employees' => $employees,
            'query' => $query,  // ส่ง query กลับไปยัง React component
            'order' => $order,  // ส่งการเรียงลำดับกลับไปยัง React component
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
{
    // ดึงข้อมูลจากตาราง departments เพื่อใช้ในฟอร์ม
    $departments = DB::table('departments')->select('dept_no', 'dept_name')->get();

    // ส่งข้อมูล departments ไปยัง React component Employee/Create ผ่าน Inertia.js
    return Inertia::render('Employee/Create', [
        'departments' => $departments,
    ]);
}

/**
 * Store a newly created resource in storage.
 */
public function store(Request $request)
{
    // รับข้อมูลจากฟอร์มและตรวจสอบความถูกต้องของข้อมูล
    $validated = $request->validate([
        "birth_date" => "required|date", // วันเกิดต้องเป็นวันที่และต้องกรอก
        "first_name" => "required|string|max:14", // ชื่อต้องเป็นข้อความและมีความยาวไม่เกิน 14 ตัวอักษร
        "last_name"  => "required|string|max:16", // นามสกุลต้องเป็นข้อความและมีความยาวไม่เกิน 16 ตัวอักษร
        'gender'      => 'required|in:M,F', // เพศต้องเป็น M หรือ F
        "hire_date"  => "required|date", // วันที่จ้างงานต้องเป็นวันที่และต้องกรอก
        "dept_no"    => "required|exists:departments,dept_no", // dept_no ต้องมีอยู่ในตาราง departments
        'photo'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // รูปภาพต้องเป็นไฟล์รูปและขนาดไม่เกิน 2MB
    ]);

    try {
        // ใช้ Database Transaction เพื่อป้องกันข้อมูลไม่สมบูรณ์
        DB::transaction(function () use ($validated, $request) {
            // 1. ค้นหา emp_no ล่าสุดจากตาราง employees
            $latestEmpNo = DB::table('employees')->max('emp_no') ?? 0;
            $newEmpNo = $latestEmpNo + 1; // เพิ่ม emp_no ทีละ 1

            // 2. ตรวจสอบและอัปโหลดรูปภาพถ้ามีการแนบไฟล์
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('employees', 'public'); // บันทึกไฟล์ใน disk public
                $validated['photo'] = $photoPath; // เพิ่ม path ของรูปภาพลงในข้อมูลที่ validated
            }

            // 3. เพิ่มข้อมูลพนักงานใหม่ลงในฐานข้อมูล
            DB::table("employees")->insert([
                "emp_no"     => $newEmpNo, // หมายเลขพนักงานใหม่
                "first_name" => $validated['first_name'], // ชื่อ
                "last_name"  => $validated['last_name'], // นามสกุล
                "gender"     => $validated['gender'], // เพศ
                "birth_date" => $validated['birth_date'], // วันเกิด
                "hire_date"  => $validated['hire_date'], // วันที่จ้างงาน
                "photo"      => $validated['photo'] ?? null, // รูปภาพ (ถ้ามี)
            ]);
        });

        // ส่งข้อความแจ้งความสำเร็จและเปลี่ยนเส้นทางกลับไปที่หน้ารายชื่อพนักงาน
        return redirect()->route('Employee.Index')->with([
            'success' => 'Employee created successfully.',
        ]);
    } catch (\Exception $e) {
        // บันทึกข้อผิดพลาดลงใน log
        Log::error('Transaction failed', ['error' => $e->getMessage()]);

        // ส่งกลับไปยังหน้าเดิมพร้อมแสดงข้อความผิดพลาด
        return Redirect::back()->withErrors([
            'error' => 'An error occurred while creating employee. Please try again.',
        ])->withInput(); // คืนค่าข้อมูลที่กรอกไว้กลับไปแสดงในฟอร์ม
    }
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
