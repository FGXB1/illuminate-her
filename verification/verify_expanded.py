from playwright.sync_api import sync_playwright, expect
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate
        page.goto("http://localhost:3000/music-lab")

        # Clear local storage
        page.evaluate("localStorage.clear()")
        page.reload()
        page.wait_for_load_state("domcontentloaded")
        page.wait_for_timeout(5000) # Wait for Canvas/Html to settle

        # Intro
        try:
            expect(page.get_by_text("Welcome to the Lab")).to_be_visible(timeout=10000)
        except:
            print("Intro not found")
            raise

        page.get_by_role("button", name="Let's Make a Beat").click()

        # Helper for clicking hidden 3D buttons
        def click_step(track, step):
            label = f"Toggle {track} step {step}"
            # Use JS to click directly, bypassing visibility checks/overlays
            found = page.evaluate(f"""() => {{
                const btn = document.querySelector('button[aria-label="{label}"]');
                if (btn) {{
                    btn.click();
                    return true;
                }}
                return false;
            }}""")
            if not found:
                print(f"Button not found: {label}")
            else:
                # Wait a bit for React to process
                page.wait_for_timeout(100)

        # Kick
        print("Kick step...")

        # Click Kick steps
        click_step("kick", 1)
        click_step("kick", 5)
        click_step("kick", 9)
        click_step("kick", 13)

        # Check tutorial step
        try:
            expect(page.get_by_text("Step 2: The Snap")).to_be_visible(timeout=5000)
            print("Advanced to Snare!")
        except:
            # Debug state
            state = page.evaluate("localStorage.getItem('musicLabState')")
            print(f"State after kicks: {state}")
            print("Failed to advance to Snare")
            page.screenshot(path="verification/failed_snare.png")
            raise

        # 3. Snare
        print("Snare step...")
        click_step("snare", 5)
        click_step("snare", 13)
        expect(page.get_by_text("Step 3: The Drive")).to_be_visible()

        # 4. Hi-Hat
        print("Hi-Hat step...")
        click_step("hihat", 3)
        click_step("hihat", 7)
        click_step("hihat", 11)
        click_step("hihat", 15)
        expect(page.get_by_text("Step 4: The Grounding")).to_be_visible()

        # 5. Bass
        print("Bass step...")
        click_step("bass", 3)
        click_step("bass", 7)
        click_step("bass", 11)
        click_step("bass", 15)
        expect(page.get_by_text("Step 5: The Harmony")).to_be_visible()

        # 6. Synth
        print("Synth step...")
        click_step("synth", 5)
        click_step("synth", 13)
        expect(page.get_by_text("Step 6: The Vibe")).to_be_visible()

        # 7. Reverb
        print("Reverb step...")

        # Toggle Reverb ON
        page.get_by_role("button", name="Reverb").click()

        # Move Slider
        slider = page.get_by_role("slider").nth(1)
        slider.click()
        for _ in range(40):
            page.keyboard.press("ArrowRight")

        # 8. Complete
        print("Completion screen...")
        expect(page.get_by_text("You're a Producer!")).to_be_visible()

        print("Verified successfully!")
        browser.close()

if __name__ == "__main__":
    run()
