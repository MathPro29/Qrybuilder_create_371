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
        $departments = DB::table('departments')->select('dept_no', 'dept_name')->get();
         // ดึงข้อมูลจากตาราง departments
         return Inertia::render('Employee/Create', [
            'departments' => $departments, ]); // ส่งข้อมูล departments กลับไปยัง React component
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // รับข้อมูลจากฟอร์ม พร้อมตรวจสอบความถูกต้อง
        $validated = $request->validate([
            "birth_date" => "required|date",
            "first_name" => "required|string|max:255",
            "last_name"  => "required|string|max:255",
            'gender' => 'required|in:M,F',
            "hire_date"  => "required|date",
            "dept_no" => "required|exists:departments,dept_no",
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

    try {
        // ใช้ Database Transaction เพื่อความปลอดภัย
        DB::transaction(function () use ($validated, $request) {
            // 1. หาค่า emp_no ล่าสุด
            $latestEmpNo = DB::table('employees')->max('emp_no') ?? 0;
            $newEmpNo = $latestEmpNo + 1; // เพิ่มค่า emp_no ทีละ 1

          // อัปโหลดรูปภาพถ้ามีการอัปโหลด
          if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('employees', 'public');
            $validated['photo'] = $photoPath;
        }

            // 2. เพิ่มข้อมูลลงในฐานข้อมูลอย่างถูกต้อง
            DB::table("employees")->insert([
                "emp_no"     => $newEmpNo,
                "first_name" => $validated['first_name'],
                "last_name"  => $validated['last_name'],
                "gender"     => $validated['gender'],
                "birth_date" => $validated['birth_date'],
                "hire_date"  => $validated['hire_date'],
                "photo" => $validated['photo'] ?? null,
            ]);
        });

        // ส่งข้อความตอบกลับเมื่อสำเร็จ
        return redirect()->route('Employee.Index')->with([
            'success' => 'Employee created successfully.',
        ]);
    } catch (\Exception $e) {
        Log::error('Transaction failed', ['error' => $e->getMessage()]);
        // ส่งกลับไปยังหน้าเดิมพร้อมแสดง error
        return Redirect::back()->withErrors(['error' => 'An error occurred while creating employee. Please try again.'])
                            ->withInput(); // คืนค่าข้อมูลที่กรอกไว้
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
