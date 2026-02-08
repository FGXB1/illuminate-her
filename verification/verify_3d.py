from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"Browser Console: {msg.type}: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser Error: {err}"))

        print("Navigating to /music-lab...")
        try:
            page.goto("http://localhost:3000/music-lab")

            # Clear storage
            page.evaluate("localStorage.clear()")
            page.reload()
            page.wait_for_load_state("domcontentloaded")
            page.wait_for_timeout(3000)

            # Close intro modal
            print("Closing intro modal...")
            try:
                page.get_by_role("button", name="Let's Make a Beat").click()
                page.wait_for_timeout(2000)
            except Exception as e:
                print(f"Could not find intro button: {e}")

            # Activating Kick steps
            print("Activating Kick steps via JS...")

            # Use JS to click the hidden buttons
            page.evaluate("""
                const buttons = document.querySelectorAll('button[aria-label]');
                buttons.forEach(b => {
                    const label = b.getAttribute('aria-label');
                    if (label === 'Toggle kick step 1' ||
                        label === 'Toggle kick step 2' ||
                        label === 'Toggle kick step 5' ||
                        label === 'Toggle kick step 9' ||
                        label === 'Toggle kick step 13' ||
                        label === 'Toggle snare step 5') {
                        b.click();
                    }
                });
            """)

            page.wait_for_timeout(2000)

            # Screenshot the sequencer area
            sequencer = page.locator(".w-full.h-\\[600px\\]").first
            if sequencer.count() > 0:
                print("Found Sequencer container. Taking screenshot...")
                sequencer.screenshot(path="verification/sequencer_3d_active.png")

        except Exception as e:
            print(f"Script failed: {e}")
            page.screenshot(path="verification/error_active.png")

        browser.close()

if __name__ == "__main__":
    run()
