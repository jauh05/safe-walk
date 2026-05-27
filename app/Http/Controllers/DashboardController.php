<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Models\Journey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

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

        return response()->json($guardian, 201);
    }

    public function deleteGuardian(Request $request, $id)
    {
        $user = $request->user();
        $guardian = $user->guardians()->where('id', $id)->first();

        if (!$guardian) {
            return response()->json(['message' => 'Guardian not found.'], 404);
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

        return response()->json($journey, 201);
    }

    public function sendIdleAlertWhatsApp(Request $request)
    {
        $request->validate([
            'reason' => 'nullable|string|max:255',
        ]);

        $user = $request->user();
        $guardians = $user->guardians()->get();

        if ($guardians->isEmpty()) {
            return response()->json(['message' => 'No guardians to notify.'], 422);
        }

        $url = config('services.wa_gateway.url');
        $token = config('services.wa_gateway.token');
        if (!$url) {
            return response()->json(['message' => 'WA gateway URL is not configured.'], 500);
        }

        $reason = $request->input('reason') ?: 'Tidak ada respons dari pengguna selama 20 menit';
        $text = "SafeWalk Alert:\n{$user->name} tidak merespons alert perjalanan.\nAlasan: {$reason}\nMohon segera cek kondisi pengguna.";

        $results = [];
        foreach ($guardians as $guardian) {
            $payload = [
                'phone' => $guardian->phone,
                'message' => $text,
                'name' => $guardian->name,
            ];
            $http = Http::timeout(15);
            if ($token) $http = $http->withToken($token);
            $resp = $http->post($url, $payload);
            $results[] = [
                'guardian_id' => $guardian->id,
                'phone' => $guardian->phone,
                'ok' => $resp->successful(),
                'status' => $resp->status(),
            ];
        }

        return response()->json(['sent' => $results]);
    }
}
