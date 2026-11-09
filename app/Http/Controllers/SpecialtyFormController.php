<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\SpecialtyForm;
use App\Models\SpecialtyFormField;
use App\Models\SpecialtyFormResponse;
use App\Models\Patient;

class SpecialtyFormController extends Controller
{
    public function index(): Response
    {
        $forms = SpecialtyForm::withCount('fields')->withCount('responses')->get();
        return Inertia::render('Specialties/FormBuilder', [
            'forms' => $forms,
        ]);
    }

    public function storeForm(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'specialty_code' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
        ]);

        $form = SpecialtyForm::create($validated);

        return back()->with('success', "Specialty form template '{$form->name}' created.");
    }

    public function addField(Request $request, int $formId): RedirectResponse
    {
        $form = SpecialtyForm::findOrFail($formId);

        $validated = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'field_key' => ['required', 'string', 'max:100'],
            'field_type' => ['required', 'in:text,textarea,number,date,select,checkbox,radio,measurement'],
            'is_required' => ['boolean'],
            'options' => ['nullable', 'array'],
        ]);

        $maxOrder = $form->fields()->max('order_index') ?? 0;
        $validated['order_index'] = $maxOrder + 1;
        $validated['form_id'] = $form->id;

        SpecialtyFormField::create($validated);

        return back()->with('success', "Field '{$validated['label']}' added to form template.");
    }

    public function show(int $id): Response
    {
        $form = SpecialtyForm::with('fields')->findOrFail($id);
        $patients = Patient::where('is_active', true)->select('id', 'first_name', 'last_name', 'patient_uid')->get();
        $responses = SpecialtyFormResponse::with(['patient'])->where('form_id', $id)->orderByDesc('id')->get();

        return Inertia::render('Specialties/FormShow', [
            'form' => $form,
            'patients' => $patients,
            'responses' => $responses,
        ]);
    }

    public function submitResponse(Request $request, int $id): RedirectResponse
    {
        $form = SpecialtyForm::findOrFail($id);

        $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'responses' => ['required', 'array'],
        ]);

        SpecialtyFormResponse::create([
            'form_id' => $form->id,
            'consultation_id' => 1, // Fallback demo encounter or active encounter
            'patient_id' => $request->input('patient_id'),
            'responses' => $request->input('responses'),
        ]);

        return back()->with('success', 'Specialty medical assessment saved.');
    }
}
