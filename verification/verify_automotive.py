from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to app...")
            page.goto("http://127.0.0.1:3000")

            # Wait for Intro
            print("Waiting for Intro...")
            page.wait_for_selector("text=APEX ENGINEERING")
            page.screenshot(path="verification/intro.png")
            print("Captured intro.png")

            # Click Start
            print("Starting Race...")
            page.click("text=Start Engine")

            # Wait for Race Dashboard (look for KM/H)
            print("Waiting for Dashboard...")
            page.wait_for_selector("text=KM/H")
            # Wait a bit for 3D to render (though we can't see it in headless easily without proper GPU support sometimes, UI is main goal)
            time.sleep(2)
            page.screenshot(path="verification/race.png")
            print("Captured race.png")

            # Click Box Box
            print("Clicking Box Box...")
            page.click("text=Box Box")

            # Wait for Pit Stop Modal
            print("Waiting for Pit Stop Modal...")
            page.wait_for_selector("text=Pit Stop Strategy")
            time.sleep(1)
            page.screenshot(path="verification/pitstop.png")
            print("Captured pitstop.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
