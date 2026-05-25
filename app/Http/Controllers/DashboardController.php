<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Models\Journey;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Seed default guardians if none exist
        if ($user->guardians()->count() === 0) {
            $user->guardians()->createMany([
                ['name' => 'Ibu (Mom)', 'phone' => '0812-3456-7890', 'status' => 'Online', 'avatar' => '👩'],
                ['name' => 'Bapak (Dad)', 'phone' => '0812-9876-5432', 'status' => 'Online', 'avatar' => '👨'],
                ['name' => 'Pos Satpam Kampus', 'phone' => '0811-1111-2222', 'status' => 'Online', 'avatar' => '👮'],
            ]);
        }

        // Seed default journeys if none exist
        if ($user->journeys()->count() === 0) {
            $user->journeys()->createMany([
                ['route' => 'Gedung Teknik ITS → Asrama Mahasiswa ITS', 'duration_minutes' => 12, 'status' => 'Completed', 'started_at' => now()->subDays(1)->subHours(2), 'ended_at' => now()->subDays(1)->subHours(2)->addMinutes(12)],
                ['route' => 'Perpustakaan ITS → Halte', 'duration_minutes' => 8, 'status' => 'Completed', 'started_at' => now()->subDays(2)->subHours(1), 'ended_at' => now()->subDays(2)->subHours(1)->addMinutes(8)],
                ['route' => 'Gedung Rektorat ITS → Kost Gebang Lor', 'duration_minutes' => 15, 'status' => 'SOS', 'started_at' => now()->subDays(5)->subHours(4), 'ended_at' => now()->subDays(5)->subHours(4)->addMinutes(15)],
                ['route' => 'Tunjungan Plaza → Kost Gebang Lor', 'duration_minutes' => 22, 'status' => 'Completed', 'started_at' => now()->subDays(7)->subHours(3), 'ended_at' => now()->subDays(7)->subHours(3)->addMinutes(22)],
            ]);
        }

        return response()->json([
            'guardians' => $user->guardians,
            'journeys' => $user->journeys()->orderBy('id', 'desc')->get(),
        ]);
    }

    public function addGuardian(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'avatar' => 'required|string|max:10',
        ]);

        $user = $request->user();

        $guardian = $user->guardians()->create([
            'name' => $request->name,
            'phone' => $request->phone,
            'avatar' => $request->avatar,
            'status' => 'Online',
        ]);

        return response()->json($guardian, 21);
    }

    public function deleteGuardian(Request $request, $id)
    {
        $user = $request->user();
        $guardian = $user->guardians()->where('id', $id)->first();

        if (!$guardian) {
            return response()->json(['message' => 'Guardian not found.'], 44);
        }

        $guardian->delete();

        return response()->json(['message' => 'Guardian deleted successfully.']);
    }

    public function addJourney(Request $request)
    {
        $request->validate([
            'route' => 'required|string|max:255',
            'duration_minutes' => 'required|integer',
            'status' => 'required|string|in:Completed,SOS,Cancelled',
        ]);

        $user = $request->user();

        $journey = $user->journeys()->create([
            'route' => $request->route,
            'duration_minutes' => $request->duration_minutes,
            'status' => $request->status,
            'started_at' => now()->subMinutes($request->duration_minutes),
            'ended_at' => now(),
        ]);

        return response()->json($journey, 21);
    }
}
