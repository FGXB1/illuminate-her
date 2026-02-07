import time
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})

    print("Navigating to music lab...")
    try:
        page.goto("http://localhost:3001/music-lab", timeout=120000)
    except Exception as e:
        print(f"Error navigating: {e}")
        return

    print("Page loaded.")

    try:
        page.wait_for_selector("text=Music Lab", timeout=30000)
    except Exception as e:
        print(f"Timeout waiting for selector: {e}")
        return

    # Close the tutorial
    try:
        close_button = page.locator("button:has-text('Let\\'s Make a Beat!')")
        if close_button.is_visible():
            close_button.click()
            time.sleep(1) # Wait for animation
    except Exception as e:
        print(f"Could not close tutorial: {e}")

    # Interact with some elements
    try:
        page.locator("button[aria-label='Toggle kick step 1']").click()
        page.locator("button[aria-label='Toggle kick step 5']").click()
        page.locator("button[aria-label='Toggle kick step 9']").click()
        page.locator("button[aria-label='Toggle kick step 13']").click()
    except Exception as e:
        print(f"Error interacting: {e}")

    # Take screenshot of the dashboard
    page.screenshot(path="music_lab_dashboard.png", full_page=True)
    print("Screenshots saved.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
