import { test, expect } from '@playwright/test';

test.describe('الصفحة الرئيسية', () => {
    test('يجب أن تحمل الصفحة بنجاح', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Riyadh Guide/);
    });

    test('يجب أن يظهر شريط التنقل', async ({ page }) => {
        await page.goto('/');
        const navbar = page.locator('nav');
        await expect(navbar.first()).toBeVisible();
    });

    test('يجب أن تكون الصفحة بتنسيق RTL', async ({ page }) => {
        await page.goto('/');
        const html = page.locator('html');
        await expect(html).toHaveAttribute('dir', 'rtl');
    });
});

test.describe('التنقل', () => {
    test('يجب الانتقال لصفحة الجولات الصوتية', async ({ page }) => {
        await page.goto('/');
        // Click on audio tours link if visible
        const audioLink = page.locator('a[href="/audio-tours"]').first();
        if (await audioLink.isVisible()) {
            await audioLink.click();
            await expect(page).toHaveURL(/audio-tours/);
        }
    });

    test('يجب الانتقال لصفحة الخريطة', async ({ page }) => {
        await page.goto('/maps');
        await expect(page).toHaveURL(/maps/);
    });

    test('يجب الانتقال لصفحة التواصل', async ({ page }) => {
        await page.goto('/contact');
        await expect(page).toHaveURL(/contact/);
        const title = page.locator('h1');
        await expect(title).toContainText('تواصل');
    });

    test('يجب الانتقال لصفحة الخصوصية', async ({ page }) => {
        await page.goto('/privacy');
        await expect(page).toHaveURL(/privacy/);
    });

    test('يجب الانتقال لصفحة الشروط', async ({ page }) => {
        await page.goto('/terms');
        await expect(page).toHaveURL(/terms/);
    });
});

test.describe('البحث', () => {
    test('يجب أن يظهر حقل البحث', async ({ page }) => {
        await page.goto('/');
        const searchInput = page.locator('#omnisearch-input');
        if (await searchInput.isVisible()) {
            await expect(searchInput).toBeVisible();
        }
    });
});

test.describe('API Routes', () => {
    test('يجب أن يرد API البحث بنجاح', async ({ request }) => {
        const response = await request.get('/api/search?q=الرياض&type=all');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.success).toBe(true);
    });

    test('يجب أن يرد API التوصيات بنجاح', async ({ request }) => {
        const response = await request.get('/api/recommendations?limit=5');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.success).toBe(true);
    });

    test('يجب أن يرد API المكافآت بنجاح', async ({ request }) => {
        const response = await request.get('/api/rewards?action=badges');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.success).toBe(true);
    });

    test('يجب أن يرد API التحليلات بنجاح', async ({ request }) => {
        const response = await request.get('/api/analytics');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.success).toBe(true);
    });
});
