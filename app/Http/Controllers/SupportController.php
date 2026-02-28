<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class SupportController extends Controller
{
    public function index()
    {
        $tickets = Auth::user()->tickets()->latest()->get();
        return Inertia::render('Support/Index', [
            'tickets' => $tickets
        ]);
    }

    public function create()
    {
        return Inertia::render('Support/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:suggestion,bug,complaint,other',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'attachments.*' => 'nullable|file|max:10240' // 10MB max per file
        ]);

        $attachmentPaths = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('support/attachments', 'public');
                $attachmentPaths[] = '/storage/' . $path;
            }
        }

        Ticket::create([
            'ticket_number' => 'TCK-' . strtoupper(Str::random(8)),
            'user_id' => Auth::id(),
            'type' => $request->type,
            'subject' => $request->subject,
            'message' => $request->message,
            'attachments' => $attachmentPaths,
            'status' => 'open'
        ]);

        return redirect()->route('support.index')->with('success', 'Votre demande a été envoyée avec succès.');
    }

    public function show(Ticket $ticket)
    {
        if ($ticket->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Support/Show', [
            'ticket' => $ticket
        ]);
    }
}
