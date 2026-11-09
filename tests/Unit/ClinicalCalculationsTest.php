<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ClinicalCalculationsTest extends TestCase
{
    /**
     * Test BMI (Body Mass Index) formula: weight (kg) / (height (m) ^ 2).
     */
    public function test_bmi_calculation_formula(): void
    {
        $weightKg = 78.5;
        $heightCm = 178;
        $heightM = $heightCm / 100.0;

        $bmi = round($weightKg / ($heightM * $heightM), 1);

        $this->assertEquals(24.8, $bmi);
        $this->assertLessThan(25.0, $bmi); // Normal weight range: 18.5 - 24.9
    }

    /**
     * Test FDI World Dental Federation two-digit numbering validation.
     */
    public function test_fdi_two_digit_tooth_numbering_validation(): void
    {
        // Quadrant 1: 11-18, Quadrant 2: 21-28, Quadrant 3: 31-38, Quadrant 4: 41-48
        $permanentTeeth = [
            11, 12, 13, 14, 15, 16, 17, 18,
            21, 22, 23, 24, 25, 26, 27, 28,
            31, 32, 33, 34, 35, 36, 37, 38,
            41, 42, 43, 44, 45, 46, 47, 48,
        ];

        $this->assertCount(32, $permanentTeeth);

        foreach ($permanentTeeth as $tooth) {
            $quadrant = intdiv($tooth, 10);
            $position = $tooth % 10;
            $this->assertContains($quadrant, [1, 2, 3, 4]);
            $this->assertGreaterThanOrEqual(1, $position);
            $this->assertLessThanOrEqual(8, $position);
        }
    }
}
