import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Fill 'bhycoder926@gmail.com' into the Email Address field.
        # you@university.edu email field
        elem = page.get_by_placeholder('you@university.edu', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("bhycoder926@gmail.com")
        
        # -> Fill 'bhycoder926@gmail.com' into the Email Address field.
        # Min 6 characters password field
        elem = page.get_by_placeholder('Min 6 characters', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("12345678")
        
        # -> Fill 'bhycoder926@gmail.com' into the Email Address field.
        # Sign In button
        elem = page.get_by_text('Email Address', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Sign In', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Reset All' button in the dashboard header/controls to trigger clearing all academic data, then observe the UI for a confirmation prompt.
        # Reset All button
        elem = page.get_by_role('button', name='Reset All', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify an empty academic record state is displayed
        # Assert: Cumulative GPA displays '0.00', confirming the CGPA summary is cleared.
        await expect(page.locator("xpath=/html/body/main/div/div[1]/div[1]").nth(0)).to_contain_text("0.00", timeout=15000), "Cumulative GPA displays '0.00', confirming the CGPA summary is cleared."
        # Assert: Performance Trend card shows the placeholder text indicating no subjects or grades are present.
        await expect(page.locator("xpath=/html/body/main/div/div[1]/div[2]").nth(0)).to_contain_text("Add subjects and grades to see your trend", timeout=15000), "Performance Trend card shows the placeholder text indicating no subjects or grades are present."
        # Assert: Grade Distribution card shows the placeholder text indicating no graded subjects are present.
        await expect(page.locator("xpath=/html/body/main/div/div[2]/div[2]").nth(0)).to_contain_text("Add graded subjects to see your distribut", timeout=15000), "Grade Distribution card shows the placeholder text indicating no graded subjects are present."
        # Assert: Semester area displays 'SGPA: 0.00', indicating no recorded grades.
        await expect(page.locator("xpath=/html/body/main/div/div[4]/div").nth(0)).to_contain_text("SGPA: 0.00", timeout=15000), "Semester area displays 'SGPA: 0.00', indicating no recorded grades."
        
        # --> Verify the CGPA summary is cleared
        # Assert: CGPA summary displays 0.00, confirming it is cleared.
        await expect(page.locator("xpath=/html/body/main/div/div[1]/div[1]").nth(0)).to_contain_text("0.00", timeout=15000), "CGPA summary displays 0.00, confirming it is cleared."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    